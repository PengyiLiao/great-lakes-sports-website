/**
 * GAG Membership — 会员登记表单
 *
 * 跟赛事报名表单是两套东西，**不要合并**：
 *   · 会员 = 长期身份，免费，任何人可加入
 *   · 报名 = 单场比赛，有资格门槛（差点 <10），会员与否都能报
 * 客户明确要求把这两件事分开。
 *
 * ── 怎么用 ────────────────────────────────────────────────────────────
 * 用 info@gag.golf 登录，然后：
 *   1. https://script.google.com/home/projects/create（新建项目，别覆盖别的）
 *   2. 左上角改名 `GAG — Membership Form`
 *   3. 清空编辑器，粘贴本文件全部内容
 *   4. 函数下拉选 createMembershipForm，点「运行 / Run」，授权
 *   5. 日志会打印编辑链接和填写链接
 *   6. 打开表单 → 右上角 Publish → 分享设置里把
 *      **Responder view 改成 Anyone with the link**
 *      （Workspace 建的表单默认只允许组织内部填写，外面的人会被挡住）
 *   7. Responses → Link to Sheets → 建表格
 *   8. 回到本脚本，把表单编辑链接填进 FORM_URL，跑 installMembershipTriggers
 *      → 之后每份登记自动：分配会员号 → 通知委员会 → 给会员发确认信
 *
 * ── 字段为什么这么少 ──────────────────────────────────────────────────
 * 免费、暂无权益的会员，问得越多放弃率越高，而且每多收一个字段就多一份
 * 泄漏时的责任。这里只问身份、联系方式、大致年龄段和所在省份——足够发通知、
 * 足够将来分组，不多要一个字。差点、俱乐部这些等有比赛要打时再问。
 */

/** 表单的编辑链接。安装触发器时用得到。 */
const FORM_URL = '';

/** 委员会收新会员通知的邮箱。 */
const COMMITTEE_EMAIL = 'info@gag.golf';

/** 在 Gmail 里验证过的发件别名。Workspace 账号直接填自己的地址即可。 */
const FROM_ALIAS = 'info@gag.golf';

const SENDER_NAME = 'GAG — Great Lakes Amateur Golf';

/** 会员号前缀与起始值。GAG-00001 起。 */
const MEMBER_PREFIX = 'GAG-';
const MEMBER_START = 1;

// ═══════════════════════════════════════════════════════════════════════
// 建表单
// ═══════════════════════════════════════════════════════════════════════

function createMembershipForm() {
  const form = FormApp.create('GAG Membership — Join');

  form
    .setTitle('GAG Membership — Join')
    .setDescription(
      'GAG — Great Lakes Amateur Golf\n\n' +
        'Membership is free and open to players, coaches, university staff and ' +
        'anyone who wants to be part of building GAG.\n\n' +
        'Joining is not a tournament entry. Tournaments have their own ' +
        'eligibility and their own entry form, and are open to players whether ' +
        'or not they are members.\n\n' +
        'Your contact details are used to keep you informed and are never ' +
        'published. Membership is free and carries no benefits at this stage.',
    )
    .setProgressBar(true)
    .setAllowResponseEdits(true)
    .setConfirmationMessage(
      'Welcome to GAG.\n\n' +
        'Your membership is being registered and your GAG member number will ' +
        'follow by email.\n\n' +
        'Let’s Play GAG!',
    );

  // ── About you ─────────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('About you');

  form
    .addTextItem()
    .setTitle('Full name')
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Email address')
    .setHelpText('Not published. Used to send your member number and GAG news.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);

  // 年龄段而不是完整生日：免费名单不需要精确日期，
  // 少收一个高敏感字段就少一分泄漏时的责任。
  form
    .addMultipleChoiceItem()
    .setTitle('Age group')
    .setHelpText('Used to group members. Your exact date of birth is not collected.')
    .setChoiceValues(['Under 18', '18–22', '22–25', 'Over 25'])
    .setRequired(true);

  form
    .addListItem()
    .setTitle('Province or territory')
    .setChoiceValues([
      'Alberta',
      'British Columbia',
      'Manitoba',
      'New Brunswick',
      'Newfoundland and Labrador',
      'Northwest Territories',
      'Nova Scotia',
      'Nunavut',
      'Ontario',
      'Prince Edward Island',
      'Quebec',
      'Saskatchewan',
      'Yukon',
      'Outside Canada',
    ])
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Club, university or team')
    .setHelpText('Optional.');

  form
    .addCheckboxItem()
    .setTitle('What brings you to GAG?')
    .setHelpText('Optional. Choose any that apply.')
    .setChoiceValues([
      'Playing in tournaments',
      'University golf',
      'Coaching or player development',
      'Volunteering',
      'Partnership or sponsorship',
      'Following the results',
    ]);

  // ── Members under 18 ──────────────────────────────────────────────
  form
    .addSectionHeaderItem()
    .setTitle('Members under 18')
    .setHelpText(
      'If the member is under 18, a parent or guardian must give consent. ' +
        'Leave blank if this does not apply.',
    );

  form
    .addTextItem()
    .setTitle('Parent or guardian — full name')
    .setHelpText('Not published. Required only for members under 18.');

  form
    .addTextItem()
    .setTitle('Parent or guardian — email')
    .setHelpText('Not published. Required only for members under 18.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form
    .addCheckboxItem()
    .setTitle('Parent or guardian consent')
    .setHelpText('Required only for members under 18.')
    .setChoiceValues([
      'I am the parent or legal guardian of this member and I consent to their ' +
        'GAG membership.',
    ]);

  // ── Confirmations ─────────────────────────────────────────────────
  form.addSectionHeaderItem().setTitle('Before you join');

  form
    .addCheckboxItem()
    .setTitle('What we do with your details')
    .setChoiceValues([
      'I understand that my contact details are used to keep me informed and ' +
        'are not published, and that membership is free and carries no ' +
        'benefits at this stage.',
    ])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle('GAG news and tournament announcements')
    .setHelpText('You can unsubscribe at any time.')
    .setChoiceValues([
      'Yes, keep me informed',
      'No, register me but do not email me',
    ])
    .setRequired(true);

  Logger.log('✅ 会员表单已创建，共 %s 个题目项。', form.getItems().length);
  Logger.log('📝 编辑链接：%s', form.getEditUrl());
  Logger.log('🔗 填写链接（填进网站的 membershipUrl）：%s', form.getPublishedUrl());
  Logger.log('⚠️ 别忘了 Publish，并把 Responder view 改成 Anyone with the link。');
}

// ═══════════════════════════════════════════════════════════════════════
// 会员号
// ═══════════════════════════════════════════════════════════════════════

/**
 * 装上「有人登记 → 分配会员号 → 发确认信」的触发器。
 *
 * 三件事在**同一个触发器**里按顺序做，而不是分成两个。分开的话，发信的
 * 触发器可能在编号写入之前就跑完，确认信里就会缺会员号——而这封信最主要
 * 的内容恰恰就是那个号码。
 */
function installMembershipTriggers() {
  if (!FORM_URL) throw new Error('请先把会员表单的编辑链接填进 FORM_URL。');

  const form = FormApp.openByUrl(FORM_URL);

  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onMemberJoined')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('onMemberJoined').forForm(form).onFormSubmit().create();

  Logger.log('✅ 已安装：分配会员号 + 委员会通知 + 会员确认信。');
  Logger.log('📧 委员会通知发往：%s', COMMITTEE_EMAIL);
  Logger.log('✉️ 发件人显示为：%s', FROM_ALIAS || '脚本所有者的 Gmail');
}

function onMemberJoined(e) {
  const number = assignMemberNumber_();
  const answers = answersByTitle_(e.response);

  notifyCommittee_(answers, number);

  const email = answers['Email address'];
  if (email) welcomeMember_(email, answers, number);
}

/**
 * 给最新一行分配会员号，返回该号码。
 *
 * 号码写进表格的独立一列，而不是用公式按行号算——公式的结果会随着删行、
 * 排序而变，而会员号一旦发出去就必须永远指向同一个人。写死的值才靠得住。
 * 取「现有最大号 + 1」而不是行数，所以删过行也不会撞号。
 */
function assignMemberNumber_() {
  const form = FormApp.openByUrl(FORM_URL);
  const ss = SpreadsheetApp.openById(form.getDestinationId());

  const sheet = ss
    .getSheets()
    .find(
      (s) =>
        s.getLastColumn() > 0 &&
        String(s.getRange(1, 1).getValue()).trim().toLowerCase() === 'timestamp',
    );
  if (!sheet) return '';

  let col;
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((h) => String(h).trim().toLowerCase());
  const idx = headers.indexOf('member number');
  if (idx === -1) {
    col = sheet.getLastColumn() + 1;
    sheet.getRange(1, col).setValue('Member number').setFontWeight('bold');
  } else {
    col = idx + 1;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return '';

  const existingValue = sheet.getRange(lastRow, col).getValue();
  if (existingValue) return String(existingValue);

  const used = sheet
    .getRange(2, col, lastRow - 1, 1)
    .getValues()
    .map((r) => String(r[0]))
    .filter((v) => v.indexOf(MEMBER_PREFIX) === 0)
    .map((v) => parseInt(v.slice(MEMBER_PREFIX.length), 10))
    .filter((n) => !isNaN(n));

  const next = used.length ? Math.max.apply(null, used) + 1 : MEMBER_START;
  const number = MEMBER_PREFIX + String(next).padStart(5, '0');
  sheet.getRange(lastRow, col).setValue(number);
  SpreadsheetApp.flush();
  return number;
}

function notifyCommittee_(answers, number) {
  const name = answers['Full name'] || '(no name)';
  const ageGroup = answers['Age group'] || '—';

  const lines = [
    `Member:    ${name}`,
    `Number:    ${number || '(not assigned)'}`,
    `Age group: ${ageGroup}`,
    `Province:  ${answers['Province or territory'] || '—'}`,
    `Club:      ${answers['Club, university or team'] || '—'}`,
    '',
    'Full details are in the membership spreadsheet.',
  ];

  if (ageGroup === 'Under 18') {
    lines.unshift(
      '⚠️ UNDER 18 — check that parent or guardian consent was given.',
      '',
    );
  }

  send_({
    to: COMMITTEE_EMAIL,
    subject: `New member — ${name}${number ? ' (' + number + ')' : ''}`,
    body: lines.join('\n'),
  });
}

/**
 * 欢迎信。
 *
 * ⚠️ 无论对方在「GAG news」那题选了什么，这封信都要发。那道题问的是**将来
 * 的推广邮件**是否愿意接收；而这封是对方刚刚主动完成的动作的回执，里面装着
 * 他们的会员号——不发才是失职。加拿大 CASL 对这类交易性/关系性邮件与推广
 * 邮件的处理本来就不同。
 *
 * 群发推广时则必须只发给选了 Yes 的人，那是另一回事。
 */
function welcomeMember_(email, answers, number) {
  const name = answers['Full name'] || 'there';

  const body = [
    `Hello ${name},`,
    '',
    'Welcome to GAG.',
    '',
    number ? `Your member number is ${number}.` : '',
    number
      ? 'It stays with you as the platform grows, and it is how your record will'
      : '',
    number ? 'connect to tournaments and results.' : '',
    '',
    'Membership is free and there is nothing further to do. We will let you',
    'know when tournament entries open, and when member profiles, rankings',
    'and membership tiers arrive.',
    '',
    'Joining is not a tournament entry. Tournaments have their own entry form',
    'and their own eligibility, and are open to players whether or not they',
    'are members:',
    'https://gag.golf/register',
    '',
    'Let’s Play GAG!',
    '',
    'GAG — Great Lakes Amateur Golf',
    'Great Lakes Sports Inc. · Toronto, Ontario',
    'https://gag.golf',
  ]
    .filter((line, i, all) => !(line === '' && all[i - 1] === ''))
    .join('\n');

  send_({
    to: email,
    subject: number ? `Welcome to GAG — ${number}` : 'Welcome to GAG',
    body: body,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// 工具
// ═══════════════════════════════════════════════════════════════════════

function answersByTitle_(response) {
  const map = {};
  response.getItemResponses().forEach((item) => {
    map[item.getItem().getTitle()] = item.getResponse();
  });
  return map;
}

function send_(options) {
  const payload = {
    to: options.to,
    subject: options.subject,
    body: options.body,
    name: SENDER_NAME,
  };
  if (FROM_ALIAS) payload.from = FROM_ALIAS;
  else if (COMMITTEE_EMAIL) payload.replyTo = COMMITTEE_EMAIL;

  GmailApp.sendEmail(payload.to, payload.subject, payload.body, payload);
}
