/**
 * 2026 GAG Inaugural Tournament — Entry Form
 * 一次性生成整张 Google 表单。
 *
 * ── 怎么用 ────────────────────────────────────────────────────────────
 * 1. 打开你的表单，右上角 ⋮ →「脚本编辑器 / Script editor」
 * 2. 把编辑器里原有内容全部删掉，粘贴本文件全部内容
 * 3. 顶部函数下拉选 buildEntryForm，点「运行 / Run」
 * 4. 首次运行会要求授权（Google 会警告"未验证的应用"，
 *    点「高级」→「转至…（不安全）」即可——这是你自己写给自己表单的脚本）
 * 5. 回到表单标签页刷新，26 个问题全部就位
 *
 * ⚠️ 脚本开头会清空表单里已有的题目，所以只在空表单上跑一次。
 *    跑第二次会把手工改过的内容也一起清掉。
 *
 * ── 刻意不包含的 ──────────────────────────────────────────────────────
 * · 报名费与付款方式 —— 报名和收款分两步：先核验差点与名额，
 *   确认后再在邮件里告知付款方式。避免不合资格或超额时退款。
 * · 自动收集 Google 账号邮箱 —— 那会强制参赛者登录 Google，
 *   对外部报名是不必要的门槛，所以改用手填邮箱并做格式校验。
 */

function buildEntryForm() {
  const form = FormApp.getActiveForm();

  // 清空已有题目（含新建表单时默认的那道 Untitled Question）
  const existing = form.getItems();
  for (let i = existing.length - 1; i >= 0; i--) {
    form.deleteItem(existing[i]);
  }

  form
    .setTitle('2026 GAG Inaugural Tournament — Entry Form')
    .setDescription(
      'Sunday, October 11, 2026 · TPC Toronto at Osprey Valley, North Course\n' +
        'Field of 72 · Handicap index under 10\n\n' +
        'Entries are reviewed by the organizing committee. Submitting this form ' +
        'does not confirm a place. You will be contacted once your handicap has ' +
        'been verified and your entry confirmed.\n\n' +
        'Your contact details, date of birth and emergency contact are used only ' +
        'to run the competition and are never published. Draw sheets and results ' +
        'show name, club or university, handicap and scores.',
    )
    .setProgressBar(true)
    .setAllowResponseEdits(true)
    .setConfirmationMessage(
      'Thank you. Your entry has been received.\n\n' +
        'The organizing committee will verify your handicap and confirm your ' +
        'place by email, along with payment details and tee time.\n\n' +
        'Let’s Play GAG!',
    );

  // ── 第 1 节 — Player Information ──────────────────────────────────
  form.addSectionHeaderItem().setTitle('Player Information');

  form
    .addTextItem()
    .setTitle('Full name')
    .setHelpText('As it should appear on draw sheets and results.')
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Email address')
    .setHelpText('Not published. Used for entry confirmation and tournament updates.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Mobile phone')
    .setHelpText('Not published. Used on tournament day only.')
    .setRequired(true);

  form
    .addDateItem()
    .setTitle('Date of birth')
    .setHelpText('Not published. Used to confirm age category and insurance.')
    .setIncludesYear(true)
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle('Gender')
    .setHelpText('The field is made up of 52 male and 20 female places.')
    .setChoiceValues(['Male', 'Female'])
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('City and province')
    .setHelpText('Only the province is published.')
    .setRequired(true);

  // ── 第 2 节 — Golf Credentials ────────────────────────────────────
  form
    .addPageBreakItem()
    .setTitle('Golf Credentials')
    .setHelpText('Entry is limited to players with a handicap index under 10.');

  form
    .addTextItem()
    .setTitle('Current handicap index')
    .setHelpText('For example 4.6, or +1.2 if you play to a plus handicap.')
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Club or association where your handicap is maintained')
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Golf Canada or Golf Ontario membership number')
    .setHelpText('Optional. Helps us verify your handicap more quickly.');

  form
    .addTextItem()
    .setTitle('Club, university or team affiliation')
    .setHelpText('Optional. Published alongside your name on draw sheets and results.');

  form
    .addParagraphTextItem()
    .setTitle('Recent competitive experience')
    .setHelpText('Optional. Used only if entries exceed the field of 72.');

  // ── 第 3 节 — Tournament Logistics ────────────────────────────────
  form.addPageBreakItem().setTitle('Tournament Logistics');

  form
    .addMultipleChoiceItem()
    .setTitle('Shirt size')
    .setHelpText('For the player package.')
    .setChoiceValues(['S', 'M', 'L', 'XL', 'XXL'])
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Dietary requirements or allergies')
    .setHelpText('Optional. Catering is provided on the day.');

  form
    .addMultipleChoiceItem()
    .setTitle('Preferred tee time window')
    .setHelpText('First tee 8:05 a.m., last tee 11:59 a.m. We will do our best, but times are assigned by the committee.')
    .setChoiceValues([
      '8:05 – 9:30 a.m.',
      '9:30 – 11:00 a.m.',
      '11:00 – 11:59 a.m.',
      'No preference',
    ]);

  form
    .addTextItem()
    .setTitle('Emergency contact — full name')
    .setHelpText('Not published.')
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Emergency contact — phone')
    .setHelpText('Not published.')
    .setRequired(true);

  // 这道题决定是否进入未成年人分节，选项稍后绑定跳转
  const underEighteen = form
    .addMultipleChoiceItem()
    .setTitle('Will the player be under 18 on the day of the tournament?')
    .setRequired(true);

  // ── 第 4 节 — Players Under 18 ────────────────────────────────────
  const minorsPage = form
    .addPageBreakItem()
    .setTitle('Players Under 18')
    .setHelpText(
      'A parent or guardian must authorize this entry. Entries for players ' +
        'under 18 are not confirmed until that authorization is received.',
    );

  form
    .addTextItem()
    .setTitle('Parent or guardian — full name')
    .setHelpText('Not published.')
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Parent or guardian — email')
    .setHelpText('Not published.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('Parent or guardian — phone')
    .setHelpText('Not published.')
    .setRequired(true);

  form
    .addCheckboxItem()
    .setTitle('Parent or guardian authorization')
    .setChoiceValues([
      'I am the parent or legal guardian of this player. I authorize this entry ' +
        'and the publication of the player’s competitive information: name, club ' +
        'or university, handicap and results.',
    ])
    .setRequired(true);

  // ── 第 5 节 — Confirmations ───────────────────────────────────────
  const confirmationsPage = form.addPageBreakItem().setTitle('Confirmations');

  form
    .addCheckboxItem()
    .setTitle('Rules of play')
    .setChoiceValues([
      'I agree to abide by the Rules of Golf and the tournament regulations.',
    ])
    .setRequired(true);

  form
    .addCheckboxItem()
    .setTitle('What is published')
    .setChoiceValues([
      'I understand that my name, club or university, handicap and results will ' +
        'be published, and that my contact details, date of birth and emergency ' +
        'contact will not.',
    ])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle('Photography and video')
    .setHelpText(
      'Events are photographed. You may decline without affecting your entry. ' +
        'For players under 18 this is answered by the parent or guardian.',
    )
    .setChoiceValues([
      'I consent to photographs and video of me being used by GAG',
      'I do not consent',
    ])
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle('Tournament announcements')
    .setHelpText('You can unsubscribe at any time.')
    .setChoiceValues([
      'Yes, email me about future GAG events',
      'No, only contact me about this entry',
    ])
    .setRequired(true);

  form
    .addTextItem()
    .setTitle('How did you hear about GAG?')
    .setHelpText('Optional.');

  // ── 条件跳转 ──────────────────────────────────────────────────────
  // 只有回答 Yes 的人才看到未成年人分节；回答 No 的直接跳到确认页。
  // 分节页必须先创建，才能作为跳转目标绑定，所以这一步放在最后。
  underEighteen.setChoices([
    underEighteen.createChoice('Yes', minorsPage),
    underEighteen.createChoice('No', confirmationsPage),
  ]);

  Logger.log('完成：共 %s 个题目项。', form.getItems().length);
}
