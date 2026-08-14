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
 *   8. 回到本脚本，把表单编辑链接填进 FORM_URL，跑 installMemberNumbers
 *      → 之后每份登记自动分配会员号
 *
 * ── 字段为什么这么少 ──────────────────────────────────────────────────
 * 免费、暂无权益的会员，问得越多放弃率越高，而且每多收一个字段就多一份
 * 泄漏时的责任。这里只问身份、联系方式、大致年龄段和所在省份——足够发通知、
 * 足够将来分组，不多要一个字。差点、俱乐部这些等有比赛要打时再问。
 */

/** 表单的编辑链接。只有 installMemberNumbers 用得到。 */
const FORM_URL = '';

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
 * 装上「有人登记就分配会员号」的触发器。
 *
 * 会员号写进表格的独立一列，而不是用公式按行号算——公式的结果会随着
 * 删行、排序而变，而会员号一旦发出去就必须永远指向同一个人。写死的值才靠得住。
 */
function installMemberNumbers() {
  if (!FORM_URL) throw new Error('请先把会员表单的编辑链接填进 FORM_URL。');

  const form = FormApp.openByUrl(FORM_URL);

  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onMemberJoined')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('onMemberJoined').forForm(form).onFormSubmit().create();

  Logger.log('✅ 会员号触发器已安装。下一位登记者会拿到 %s%s 之后的号码。',
    MEMBER_PREFIX, String(MEMBER_START).padStart(5, '0'));
}

function onMemberJoined() {
  const form = FormApp.openByUrl(FORM_URL);
  const ss = SpreadsheetApp.openById(form.getDestinationId());

  const sheet = ss
    .getSheets()
    .find(
      (s) =>
        s.getLastColumn() > 0 &&
        String(s.getRange(1, 1).getValue()).trim().toLowerCase() === 'timestamp',
    );
  if (!sheet) return;

  // 会员号列：没有就建一列
  let col = null;
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
  if (lastRow < 2) return;
  if (sheet.getRange(lastRow, col).getValue()) return; // 已经有号，不重复分配

  // 取现有的最大号 + 1，而不是用行数——删过行也不会撞号
  const existing = sheet
    .getRange(2, col, lastRow - 1, 1)
    .getValues()
    .map((r) => String(r[0]))
    .filter((v) => v.indexOf(MEMBER_PREFIX) === 0)
    .map((v) => parseInt(v.slice(MEMBER_PREFIX.length), 10))
    .filter((n) => !isNaN(n));

  const next = existing.length ? Math.max.apply(null, existing) + 1 : MEMBER_START;
  sheet.getRange(lastRow, col).setValue(MEMBER_PREFIX + String(next).padStart(5, '0'));
}
