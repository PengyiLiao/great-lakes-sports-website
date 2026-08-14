/**
 * 2026 GAG Inaugural Tournament — 回复表格结构
 *
 * 做三件事：
 *   1. 确保表单已关联一张 Google 表格（没有就新建并关联）
 *   2. 在回复表右侧加委员会用的工作列（Status / 差点已核验 / 费用已收 / 分组时间 / 备注）
 *   3. 建两张新工作表：
 *        · Public  —— 只含可公开的列，公式自动跟随回复更新
 *        · Results —— 赛后成绩，列结构与将来网站上的成绩页一致
 *
 * ── 怎么用 ────────────────────────────────────────────────────────────
 * 1. 浏览器打开 https://script.google.com/home/projects/create
 * 2. 清空编辑器，粘贴本文件全部内容
 * 3. 把表单的**编辑链接**填进下面的 FORM_URL
 * 4. 函数下拉选 setupResponseSheet，点「运行 / Run」
 * 5. 运行日志里会打印表格链接
 *
 * 可以重复运行：已存在的工作表和列不会被重复创建或覆盖。
 *
 * ── 为什么 Public 用公式而不是复制粘贴 ────────────────────────────────
 * 公式让 Public 表随回复自动更新。人工复制意味着每来一个报名就要维护两处，
 * 而两处迟早会不一致——不一致的那一刻，就是把不该公开的信息公开出去的时刻。
 *
 * ── 为什么列用表头名查而不是写死 A/B/C ────────────────────────────────
 * 表单加一道题，Google 会插入一列，写死的列号会整体错位——而且是静默错位：
 * 表格看起来照常有数据，只是"差点"那一列显示的其实是手机号。用表头名查，
 * 加题不会出错；真找不到列会直接报错，不会悄悄输出错的东西。
 */

/** 表单的编辑链接，形如 https://docs.google.com/forms/d/xxxxx/edit */
const FORM_URL = '';

/** 委员会自己维护的列，加在表单列右边。 */
const COMMITTEE_COLUMNS = [
  'Status',
  'Handicap verified',
  'Fee received',
  'Tee time',
  'Notes',
];

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Waitlist', 'Withdrawn'];

function setupResponseSheet() {
  if (!FORM_URL) {
    throw new Error('请先把表单的编辑链接填进本文件顶部的 FORM_URL。');
  }

  const form = FormApp.openByUrl(FORM_URL);
  const ss = ensureSpreadsheet_(form);
  const responses = findResponseSheet_(ss);

  addCommitteeColumns_(responses);
  buildPublicSheet_(ss, responses);
  buildResultsSheet_(ss);

  Logger.log('✅ 完成。');
  Logger.log('📊 表格链接：%s', ss.getUrl());
  Logger.log('⚠️ 别忘了把表格共享设为「受限 / Restricted」——里面有未成年人的出生日期和家长联系方式。');
}

/** 没有关联表格就新建一张并关联。 */
function ensureSpreadsheet_(form) {
  let destId = null;
  try {
    destId = form.getDestinationId();
  } catch (e) {
    destId = null;
  }

  if (destId) return SpreadsheetApp.openById(destId);

  const ss = SpreadsheetApp.create('2026 GAG Inaugural Tournament — Entries');
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());

  // setDestination 之后 Forms 才写入回复表，稍等让它落地
  SpreadsheetApp.flush();
  Utilities.sleep(2000);

  return SpreadsheetApp.openById(ss.getId());
}

/** 回复表就是 A1 为 Timestamp 的那张。 */
function findResponseSheet_(ss) {
  const sheets = ss.getSheets();
  for (const sheet of sheets) {
    if (sheet.getLastColumn() < 1) continue;
    const a1 = String(sheet.getRange(1, 1).getValue()).trim().toLowerCase();
    if (a1 === 'timestamp' || a1 === '时间戳记') return sheet;
  }
  throw new Error(
    '找不到回复表。先在表单的 Responses 标签页点「关联到试算表 / Link to Sheets」，再运行本脚本。',
  );
}

/** 按表头名找列号，找不到返回 null。前缀匹配，容忍表头被截断。 */
function findColumn_(sheet, headerPrefix) {
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((h) => String(h).trim().toLowerCase());

  const target = headerPrefix.trim().toLowerCase();
  const index = headers.findIndex((h) => h.startsWith(target));
  return index === -1 ? null : index + 1;
}

/** 1 → A, 27 → AA */
function columnLetter_(n) {
  let letter = '';
  while (n > 0) {
    const remainder = (n - 1) % 26;
    letter = String.fromCharCode(65 + remainder) + letter;
    n = Math.floor((n - remainder - 1) / 26);
  }
  return letter;
}

/** 在回复表右边补上委员会列，已存在的跳过。 */
function addCommitteeColumns_(sheet) {
  COMMITTEE_COLUMNS.forEach((name) => {
    if (findColumn_(sheet, name)) return;

    const col = sheet.getLastColumn() + 1;
    sheet.getRange(1, col).setValue(name).setFontWeight('bold');

    if (name === 'Status') {
      const rule = SpreadsheetApp.newDataValidation()
        .requireValueInList(STATUS_OPTIONS, true)
        .setAllowInvalid(false)
        .build();
      sheet.getRange(2, col, sheet.getMaxRows() - 1).setDataValidation(rule);
    }
  });

  sheet.setFrozenRows(1);
}

/**
 * Public 表：只放可以对外公开的列，用 QUERY 跟随回复自动更新。
 *
 * 公开的是竞技信息——姓名、所属球会或大学、省份、差点、状态。
 * 联系方式、出生日期、紧急联系人、家长信息一律不进这张表。
 */
function buildPublicSheet_(ss, responses) {
  const name = 'Public';
  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);

  const respName = responses.getName();
  const lastCol = columnLetter_(responses.getLastColumn());

  const nameCol = requireColumn_(responses, 'Full name');
  const clubCol = requireColumn_(responses, 'Club, university');
  const hcpCol = requireColumn_(responses, 'Current handicap');
  const statusCol = requireColumn_(responses, 'Status');

  // 地点列：表单拆开后用独立的 Province 题，公开的就只有省份。
  // 若表单仍是合并的「City and province」，则整格公开——这时城市也会跟着
  // 公开，与网站上「只公开省份」的说法不一致，日志里会提示。
  let placeCol = findColumn_(responses, 'Province');
  let placeHeader = 'Province';

  if (!placeCol) {
    placeCol = requireColumn_(responses, 'City and province');
    placeHeader = 'Location';
    Logger.log(
      '⚠️ 表单里 City 和 Province 是同一道题，所以 Public 表会连城市一起公开。' +
        '若要只公开省份，把表单那道题拆成 City 和 Province 两问，再重跑本脚本。',
    );
  }

  const select = [nameCol, clubCol, placeCol, hcpCol, statusCol]
    .map(columnLetter_)
    .join(', ');

  sheet
    .getRange('A1:E1')
    .setValues([
      ['Name', 'Club / University', placeHeader, 'Handicap', 'Status'],
    ])
    .setFontWeight('bold');

  sheet
    .getRange('A2')
    .setFormula(
      `=IFERROR(QUERY('${respName}'!A2:${lastCol}, ` +
        `"select ${select} where ${columnLetter_(nameCol)} is not null", 0), "")`,
    );

  sheet.setFrozenRows(1);
  sheet.getRange('A1:E1').setBackground('#12392c').setFontColor('#ffffff');
}

/**
 * Results 表：赛后手工填写，列结构对齐将来网站上的成绩页。
 *
 * 参考客户提供的 IPSC Ontario 截图（Place / Competitor / Class / Region），
 * 换成高尔夫的等价字段。现在就定好结构，赛后不用再返工重录。
 */
function buildResultsSheet_(ss) {
  const name = 'Results';
  if (ss.getSheetByName(name)) return;

  const sheet = ss.insertSheet(name);
  const headers = [
    'Position',
    'Player',
    'Club / University',
    'Location',
    'Handicap',
    'Gross',
    'Net',
    'Notes',
  ];

  sheet
    .getRange(1, 1, 1, headers.length)
    .setValues([headers])
    .setFontWeight('bold')
    .setBackground('#12392c')
    .setFontColor('#ffffff');

  sheet.setFrozenRows(1);
}

function requireColumn_(sheet, headerPrefix) {
  const col = findColumn_(sheet, headerPrefix);
  if (!col) {
    throw new Error(
      `回复表里找不到以「${headerPrefix}」开头的列。` +
        '表单题目改过名字的话，请同步改本脚本里的查找词。',
    );
  }
  return col;
}
