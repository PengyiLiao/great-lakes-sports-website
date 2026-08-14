/**
 * GAG — 定制化邀请邮件
 *
 * 从一张 Google 表格逐行发送个性化邀请：每封信独立发出、开头是收件人的名字。
 * 不是群发，所以不涉及密送——每个人只看得到自己那封。
 *
 * ── 怎么用 ────────────────────────────────────────────────────────────
 * 1. 把 Excel 邀请名单导入 Google 表格：
 *      Google Drive → 新建 → 文件上传 → 选那个 .xlsx
 *      → 打开后 文件 → 另存为 Google 表格
 *    ⚠️ 表格共享必须是 Restricted，里面有出生日期和电话。
 *
 * 2. 确认表头行有这几列（名字可以不完全一致，脚本按关键词匹配）：
 *      Name / 姓名        —— 用于称呼
 *      Email / 邮件地址   —— 收件地址
 *    脚本会自动在最右边加两列：Invite sent / Invite sent at
 *
 * 3. https://script.google.com/home/projects/create（用 info@gag.golf 登录）
 *    改名 `GAG — Invitations`，粘贴本文件，填好下面的 SHEET_URL
 *
 * 4. **先跑 previewInvitations** —— 只打印前几封的完整内容，一封都不发。
 *    确认称呼、正文、退订说明都对了，再往下走。
 *
 * 5. 跑 sendInvitations —— 真正发送，每行发一封，发过的行会被标记，
 *    重复运行不会重发。
 *
 * ── ⚠️ 加拿大反垃圾邮件法（CASL）──────────────────────────────────────
 * 向加拿大收件人发送商业电子邮件，法律要求：
 *   1. 有同意（明示或默示）
 *   2. 邮件中标明发件方身份与联系方式
 *   3. 提供退订方式
 * 第 2、3 条本脚本已经写进每封信。**第 1 条要委员会自己确认**——这些邮箱
 * 从哪里来的？如果是本人公开发布的、且与其身份相关，可能构成默示同意；
 * 如果是私下转来的名单，风险就高。罚则不轻，值得先问清楚再发。
 *
 * 另外名单里有青少年球员。**给未成年人发推广邮件更敏感**，脚本会把疑似
 * 未成年的行单独标出来，建议改发给家长或先取得同意。
 */

/** 邀请名单表格的链接。 */
const SHEET_URL = '';

/** 发件设置。Workspace 账号直接填自己的地址。 */
const FROM_ALIAS = 'info@gag.golf';
const REPLY_TO = 'info@gag.golf';
const SENDER_NAME = 'GAG — Great Lakes Amateur Golf';

/** 一次运行最多发多少封。Workspace 每天上限 2000，这里留个保险。 */
const MAX_PER_RUN = 120;

/** 预览时打印几封。 */
const PREVIEW_COUNT = 3;

const SUBJECT = 'An invitation — 2026 GAG Inaugural Tournament';

/**
 * 邮件正文。{{name}} 会被替换成收件人的名字。
 *
 * 结尾的身份说明和退订说明是 CASL 要求的，**不要删**。
 */
function buildBody(name) {
  return [
    `Dear ${name},`,
    '',
    'You are invited to the inaugural GAG tournament.',
    '',
    'Sunday, October 11, 2026',
    'TPC Toronto at Osprey Valley — North Course',
    'A field of 72 · Handicap index under 10',
    '',
    'GAG — Great Lakes Amateur Golf — is a new amateur platform built around',
    'competitive golf and the players coming up through it. This is our first',
    'tournament, and we are inviting players we think belong in the field.',
    '',
    'Entries are reviewed by the organizing committee, and places are limited.',
    'There is no payment at this stage: we confirm your handicap first, then',
    'send your tee time and payment details.',
    '',
    'Enter here:',
    'https://gag.golf/register',
    '',
    'More about GAG:',
    'https://gag.golf',
    '',
    'We hope to see you in October.',
    '',
    'Let’s Play GAG!',
    '',
    '—',
    'GAG — Great Lakes Amateur Golf',
    'Great Lakes Sports Inc.',
    'Toronto, Ontario, Canada',
    'info@gag.golf · https://gag.golf',
    '',
    'You received this because you were identified as a competitive amateur',
    'golfer in Ontario. If you would rather not hear from us, reply with',
    '"unsubscribe" and we will remove you from our list.',
  ].join('\n');
}

// ═══════════════════════════════════════════════════════════════════════
// 预览（不发信）
// ═══════════════════════════════════════════════════════════════════════

function previewInvitations() {
  const { rows, cols } = readSheet_();
  const pending = rows.filter((r) => !r.values[cols.sent - 1] && r.email);

  Logger.log('待发送 %s 封（名单共 %s 行，其中 %s 行有邮箱）。',
    pending.length, rows.length, rows.filter((r) => r.email).length);

  const minors = rows.filter((r) => r.likelyMinor);
  if (minors.length) {
    Logger.log('⚠️ 疑似未成年 %s 行（按出生日期推算）。给未成年人发推广邮件更敏感，' +
      '建议改发家长或先取得同意——本脚本不会自动跳过，请自行决定。', minors.length);
  }

  pending.slice(0, PREVIEW_COUNT).forEach((r, i) => {
    Logger.log('──────── 预览 %s / 收件人 %s ────────', i + 1, r.email);
    Logger.log('主题：%s', SUBJECT);
    Logger.log('%s', buildBody(r.name));
  });

  Logger.log('以上仅为预览，一封都没有发出。确认无误后运行 sendInvitations。');
}

// ═══════════════════════════════════════════════════════════════════════
// 发送
// ═══════════════════════════════════════════════════════════════════════

/**
 * 逐行发送。每封信单独发给一个人——因为内容是定制的，本来就不该群发，
 * 也就不存在把彼此邮箱暴露给对方的问题。
 *
 * 发过的行会写上标记和时间。重复运行只补发没标记的行，**不会重复打扰同一个人**。
 */
function sendInvitations() {
  const { sheet, rows, cols } = readSheet_();
  const pending = rows.filter((r) => !r.values[cols.sent - 1] && r.email);

  if (!pending.length) {
    Logger.log('没有待发送的行。');
    return;
  }

  const quota = MailApp.getRemainingDailyQuota();
  const batch = pending.slice(0, Math.min(MAX_PER_RUN, quota));
  Logger.log('待发 %s 封，本次发 %s 封（今日剩余额度 %s）。',
    pending.length, batch.length, quota);

  let sent = 0;
  batch.forEach((r) => {
    try {
      GmailApp.sendEmail(r.email, SUBJECT, buildBody(r.name), {
        name: SENDER_NAME,
        from: FROM_ALIAS || undefined,
        replyTo: REPLY_TO,
      });
      sheet.getRange(r.rowIndex, cols.sent).setValue('Yes');
      sheet.getRange(r.rowIndex, cols.sentAt).setValue(new Date());
      sent++;
    } catch (err) {
      // 单个地址失败不该中断整批——记下来，跑完再看
      sheet.getRange(r.rowIndex, cols.sent).setValue('Failed: ' + err.message);
    }
  });

  SpreadsheetApp.flush();
  Logger.log('✅ 已发送 %s 封。剩余未发 %s 封，可稍后再跑一次。',
    sent, pending.length - batch.length);
}

// ═══════════════════════════════════════════════════════════════════════
// 读表
// ═══════════════════════════════════════════════════════════════════════

/**
 * 读取名单。
 *
 * 表头按关键词匹配而不是写死列号——这张表是人手维护的 Excel 转过来的，
 * 列顺序随时可能变，写死列号会静默错位（把电话当成邮箱之类）。
 */
function readSheet_() {
  if (!SHEET_URL) throw new Error('请先把邀请名单表格的链接填进 SHEET_URL。');

  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheets()[0];
  const data = sheet.getDataRange().getValues();

  // 表头未必在第 1 行——这类名单常有一行标题。找含 "email" 的那一行。
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, data.length); i++) {
    if (data[i].some((c) => String(c).toLowerCase().indexOf('email') !== -1)) {
      headerRow = i;
      break;
    }
  }
  if (headerRow === -1) throw new Error('找不到表头行（需要有一列含 "Email"）。');

  const headers = data[headerRow].map((h) => String(h).toLowerCase());
  const find = (kw) => {
    const i = headers.findIndex((h) => kw.some((k) => h.indexOf(k) !== -1));
    return i === -1 ? null : i + 1;
  };

  const emailCol = find(['email', '邮件']);
  const nameCol = find(['name', '姓名']) || 1;
  const dobCol = find(['dob', 'birth', '出生']);
  if (!emailCol) throw new Error('找不到邮箱列。');

  // 状态列：没有就在最右边建两列
  let sentCol = find(['invite sent']);
  let sentAtCol = find(['invite sent at']);
  if (!sentCol) {
    sentCol = sheet.getLastColumn() + 1;
    sheet.getRange(headerRow + 1, sentCol).setValue('Invite sent').setFontWeight('bold');
  }
  if (!sentAtCol) {
    sentAtCol = sheet.getLastColumn() + 1;
    sheet.getRange(headerRow + 1, sentAtCol).setValue('Invite sent at').setFontWeight('bold');
  }

  const cutoff = new Date();
  cutoff.setFullYear(cutoff.getFullYear() - 18);

  const rows = [];
  for (let i = headerRow + 1; i < data.length; i++) {
    const values = data[i];
    const email = String(values[emailCol - 1] || '').trim();
    if (!email && !String(values[nameCol - 1] || '').trim()) continue; // 空行

    let likelyMinor = false;
    if (dobCol) {
      const dob = values[dobCol - 1];
      if (dob instanceof Date) likelyMinor = dob > cutoff;
    }

    rows.push({
      rowIndex: i + 1,
      values: values,
      email: email.indexOf('@') !== -1 ? email : '',
      name: firstName_(String(values[nameCol - 1] || '')),
      likelyMinor: likelyMinor,
    });
  }

  return { sheet, rows, cols: { sent: sentCol, sentAt: sentAtCol } };
}

/**
 * 取称呼用的名字。
 *
 * 名单里常见 "Last, First" 和 "First Last" 两种写法混在一起。逗号是可靠的
 * 分隔信号；没有逗号就取第一个词。称呼错了比不称呼更失礼，所以宁可保守。
 */
function firstName_(full) {
  const s = full.trim();
  if (!s) return 'there';
  if (s.indexOf(',') !== -1) {
    const after = s.split(',')[1].trim();
    if (after) return after.split(/\s+/)[0];
  }
  return s.split(/\s+/)[0];
}
