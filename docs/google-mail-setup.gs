/**
 * 2026 GAG Inaugural Tournament — 邮件系统
 *
 * 三件事：
 *   1. 有人报名 → 委员会邮箱收到通知
 *   2. 有人报名 → 参赛者收到确认信（写明接下来会发生什么）
 *   3. 赛事通知群发 → 只发给勾选了接收通知的人，**一律密送**
 *
 * ── 怎么用 ────────────────────────────────────────────────────────────
 * 1. 打开 https://script.google.com/home/projects/create（新建，别覆盖别的项目）
 * 2. 清空编辑器，粘贴本文件全部内容
 * 3. 填好下面的 FORM_URL / COMMITTEE_EMAIL
 * 4. 函数选 installTriggers，点「运行 / Run」，授权
 *    → 从此每有一份报名，通知信和确认信自动发出
 * 5. 要群发赛事通知时，改好 ANNOUNCEMENT 里的标题和正文，
 *    函数选 sendAnnouncement，点「运行 / Run」
 *
 * ── 关于发件人显示成谁 ────────────────────────────────────────────────
 * Apps Script 发信，发件人默认是运行脚本的那个 Google 账号。想让收件人看到
 * GAG 的地址，先在 Gmail 里把它验证成别名：
 *
 *   Gmail → 设置 ⚙️ → 查看所有设置 → 账号和导入
 *   → 「用这个地址发送邮件」→ 添加另一个电子邮件地址
 *   → 填 GAG 的邮箱 → Google 会往那个邮箱发一个验证码 → 填回去
 *
 * 验证通过后，把那个地址填进下面的 FROM_ALIAS，发件人就会显示成它。
 * 留空则用你自己的 Gmail 发，同时把回信地址设成 GAG 邮箱——能用，
 * 但发件人显示成个人邮箱，不够正式。
 *
 * 这一步现在就能做，不用等 gag.ca 域名。等域名到手后，把 FROM_ALIAS 换成
 * registration@gag.ca 即可，其余代码不用动。
 */

/** 表单的编辑链接，形如 https://docs.google.com/forms/d/xxxxx/edit */
const FORM_URL = '';

/** 委员会收报名通知的邮箱。 */
const COMMITTEE_EMAIL = '';

/**
 * 在 Gmail 里验证过的发件别名。留空则用脚本所有者的 Gmail 发送。
 * 拿到域名后换成 registration@gag.ca。
 */
const FROM_ALIAS = '';

/** 收件人看到的发件人名称。 */
const SENDER_NAME = 'GAG — Great Lakes Amateur Golf';

// ═══════════════════════════════════════════════════════════════════════
// 安装触发器
// ═══════════════════════════════════════════════════════════════════════

/** 装上「有人提交表单就跑 onEntrySubmitted」的触发器。可重复运行。 */
function installTriggers() {
  requireConfig_();
  const form = FormApp.openByUrl(FORM_URL);

  // 先清掉同名的旧触发器，避免重复运行导致一份报名发两封信
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onEntrySubmitted')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('onEntrySubmitted').forForm(form).onFormSubmit().create();

  Logger.log('✅ 触发器已安装。之后每份报名都会自动发出通知信和确认信。');
  Logger.log('📧 委员会通知发往：%s', COMMITTEE_EMAIL);
  Logger.log('✉️ 发件人显示为：%s', FROM_ALIAS || '脚本所有者的 Gmail（建议配置 FROM_ALIAS）');
}

// ═══════════════════════════════════════════════════════════════════════
// 有人报名时
// ═══════════════════════════════════════════════════════════════════════

function onEntrySubmitted(e) {
  const answers = answersByTitle_(e.response);

  notifyCommittee_(answers);

  const playerEmail = answers['Email address'];
  if (playerEmail) confirmToPlayer_(playerEmail, answers);
}

/**
 * 通知委员会。
 *
 * 只放核对资格需要的字段——姓名、省份、球会、差点、是否未成年。
 * 电话、出生日期、家长联系方式**不进邮件正文**：那些留在表格里，
 * 表格有权限控制，而邮件会被转发、被搜索、被留在各种收件箱里。
 * 邮件里给一条表格链接就够了。
 */
function notifyCommittee_(answers) {
  const name = answers['Full name'] || '(no name)';
  const under18 = answers['Will the player be under 18 on the day of the tournament?'];

  const lines = [
    `Player:     ${name}`,
    `Province:   ${answers['Province or territory'] || '—'}`,
    `Club:       ${answers['Club, university or team affiliation'] || '—'}`,
    `Handicap:   ${answers['Current handicap index'] || '—'}`,
    `Maintained: ${answers['Club or association where your handicap is maintained'] || '—'}`,
    `Under 18:   ${under18 || '—'}`,
    '',
    'Full details, including contact information, are in the entries',
    'spreadsheet. Verify the handicap, then set Status to Confirmed or',
    'Waitlist and reply to the player with payment details.',
  ];

  if (under18 === 'Yes') {
    lines.unshift(
      '⚠️ UNDER 18 — parent or guardian authorization required before confirming.',
      '',
    );
  }

  send_({
    to: COMMITTEE_EMAIL,
    subject: `New entry — ${name}${under18 === 'Yes' ? ' (under 18)' : ''}`,
    body: lines.join('\n'),
  });
}

/**
 * 给参赛者的确认信。
 *
 * 明确写出「提交不等于录取」和「暂时不用付款」。第一届赛事最容易产生的
 * 误会就是这两条：以为交了表就有位置，或者急着问往哪里打钱。
 */
function confirmToPlayer_(email, answers) {
  const name = answers['Full name'] || 'there';

  const body = [
    `Hello ${name},`,
    '',
    'Thank you for entering the 2026 GAG Inaugural Tournament.',
    '',
    'Sunday, October 11, 2026',
    'TPC Toronto at Osprey Valley — North Course',
    '',
    'What happens next',
    '',
    '1. The organizing committee will verify your handicap index.',
    '2. Once your place is confirmed, you will receive an email with your',
    '   tee time and payment details.',
    '3. No payment is required at this stage.',
    '',
    'Places are limited to a field of 72. Submitting this form does not',
    'confirm a place.',
    '',
    'If anything in your entry needs correcting, reply to this email.',
    '',
    'Let’s Play GAG!',
    '',
    'GAG — Great Lakes Amateur Golf',
    'Great Lakes Sports Inc. · Toronto, Ontario',
    'https://great-lakes-sports.pages.dev',
  ].join('\n');

  send_({
    to: email,
    subject: 'Your entry — 2026 GAG Inaugural Tournament',
    body: body,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 群发赛事通知
// ═══════════════════════════════════════════════════════════════════════

/** 要群发的内容，发之前改这里。 */
const ANNOUNCEMENT = {
  subject: 'GAG — tournament update',
  body: [
    'Hello,',
    '',
    '（在这里写正文）',
    '',
    'Let’s Play GAG!',
    '',
    'GAG — Great Lakes Amateur Golf',
    'https://great-lakes-sports.pages.dev',
  ].join('\n'),
};

/**
 * 群发给勾选了「接收赛事通知」的人。
 *
 * 🚨 全部走密送（BCC）。放进收件人栏的话，每个参赛者都会看到其他所有人的
 * 邮箱地址——这是业余赛事最常见的隐私事故，一次就能毁掉信任，而且无法撤回。
 * 所以本函数只往 bcc 里放地址，to 永远是委员会自己。
 *
 * 每封最多 50 个密送地址，超出自动分批。普通 Gmail 账号每天总收件人上限
 * 100 个，72 人的赛事一天发得完；将来人数上去了要分天发，或改用专门的
 * 邮件服务。
 */
function sendAnnouncement() {
  requireConfig_();

  const recipients = optedInEmails_();
  if (!recipients.length) {
    Logger.log('没有勾选接收通知的收件人，未发送。');
    return;
  }

  const BATCH = 50;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    send_({
      to: COMMITTEE_EMAIL, // 收件人栏放自己，真正的收件人全在密送里
      bcc: batch.join(','),
      subject: ANNOUNCEMENT.subject,
      body: ANNOUNCEMENT.body,
    });
    Logger.log('已发出第 %s 批，%s 位收件人（密送）。', i / BATCH + 1, batch.length);
  }

  Logger.log('✅ 共 %s 位收件人，全部密送。', recipients.length);
}

/** 从回复表里取出勾选了接收通知的邮箱，去重。 */
function optedInEmails_() {
  const form = FormApp.openByUrl(FORM_URL);
  const ss = SpreadsheetApp.openById(form.getDestinationId());

  const sheet = ss
    .getSheets()
    .find(
      (s) =>
        s.getLastColumn() > 0 &&
        String(s.getRange(1, 1).getValue()).trim().toLowerCase() === 'timestamp',
    );

  if (!sheet || sheet.getLastRow() < 2) return [];

  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((h) => String(h).trim().toLowerCase());

  const emailCol = headers.findIndex((h) => h.startsWith('email address'));
  const optInCol = headers.findIndex((h) => h.startsWith('tournament announcements'));

  if (emailCol === -1 || optInCol === -1) {
    throw new Error('回复表里找不到邮箱列或订阅列，请检查表单题目是否改过名字。');
  }

  const rows = sheet
    .getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn())
    .getValues();

  const seen = {};
  const emails = [];

  rows.forEach((row) => {
    const email = String(row[emailCol]).trim();
    const optIn = String(row[optInCol]).trim().toLowerCase();
    if (!email || !optIn.startsWith('yes')) return;
    const key = email.toLowerCase();
    if (seen[key]) return;
    seen[key] = true;
    emails.push(email);
  });

  return emails;
}

// ═══════════════════════════════════════════════════════════════════════
// 工具
// ═══════════════════════════════════════════════════════════════════════

/** 把 FormResponse 转成 { 题目: 答案 }。 */
function answersByTitle_(response) {
  const map = {};
  response.getItemResponses().forEach((item) => {
    map[item.getItem().getTitle()] = item.getResponse();
  });
  return map;
}

/** 统一发信入口，负责套上发件人别名与回信地址。 */
function send_(options) {
  const payload = {
    to: options.to,
    subject: options.subject,
    body: options.body,
    name: SENDER_NAME,
  };

  if (options.bcc) payload.bcc = options.bcc;

  // 别名验证过就用它当发件人；否则至少让回信落到 GAG 邮箱
  if (FROM_ALIAS) {
    payload.from = FROM_ALIAS;
  } else if (COMMITTEE_EMAIL) {
    payload.replyTo = COMMITTEE_EMAIL;
  }

  GmailApp.sendEmail(payload.to, payload.subject, payload.body, payload);
}

function requireConfig_() {
  if (!FORM_URL) throw new Error('请先填写 FORM_URL（表单的编辑链接）。');
  if (!COMMITTEE_EMAIL) throw new Error('请先填写 COMMITTEE_EMAIL（委员会收信邮箱）。');
}
