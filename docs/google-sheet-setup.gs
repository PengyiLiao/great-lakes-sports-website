/**
 * 2026 GAG Inaugural Tournament — response spreadsheet structure
 *
 * Does four things:
 *   1. Links a spreadsheet to the form if it has none
 *   2. Adds the committee's working columns to the right of the form's own
 *   3. Adds Age and Age group, derived from the date of birth and kept
 *      filled by a trigger
 *   4. Creates two sheets — Public, holding only what the site may show, and
 *      Results, whose columns match what the site will publish afterwards
 *
 * ── How to use ────────────────────────────────────────────────────────
 * 1. https://script.google.com/home/projects/create
 * 2. Clear the editor, paste this file
 * 3. Put the form's EDIT link in FORM_URL below
 * 4. Choose setupResponseSheet from the function menu and Run
 * 5. The log prints the spreadsheet link
 *
 * Safe to run again: existing sheets and columns are not recreated or
 * overwritten.
 *
 * ── Why Public is a formula rather than a copy ────────────────────────
 * A formula keeps Public in step with the responses on its own. Copying rows
 * by hand would mean maintaining the same entry in two places, and the moment
 * those two drift apart is the moment something private appears in the public
 * one.
 *
 * ── Why columns are found by header rather than by letter ─────────────
 * Adding a question to the form inserts a column, and a hard-coded letter
 * would shift silently — the sheet would still look populated, with the
 * handicap column showing phone numbers. Looking headers up fails loudly
 * instead, which is the failure worth having.
 */

/** The form's edit link, e.g. https://docs.google.com/forms/d/xxxxx/edit */
const FORM_URL = '';

/** Tournament date. Age is worked out as of this day, not as of today. */
const TOURNAMENT_DATE = { year: 2026, month: 10, day: 11 };

/** Columns the committee maintains, added to the right of the form's own. */
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
    throw new Error('Put the form’s edit link in FORM_URL at the top of this file.');
  }

  const form = FormApp.openByUrl(FORM_URL);
  const ss = ensureSpreadsheet_(form);
  const responses = findResponseSheet_(ss);

  addAgeColumns_(responses);
  addCommitteeColumns_(responses);
  installAgeTrigger_(form);
  backfillAges();
  buildPublicSheet_(ss, responses);
  buildResultsSheet_(ss);

  Logger.log('✅ Done.');
  Logger.log('📊 Spreadsheet: %s', ss.getUrl());
  Logger.log(
    '⚠️ Keep sharing set to Restricted — this holds dates of birth and ' +
      'parents’ contact details for players as young as sixteen.',
  );
}

/** Creates and links a spreadsheet if the form has none. */
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

  // Forms writes the response sheet after setDestination returns; give it a
  // moment to land before anything reads it.
  SpreadsheetApp.flush();
  Utilities.sleep(2000);

  return SpreadsheetApp.openById(ss.getId());
}

/** The response sheet is the one whose A1 reads Timestamp. */
function findResponseSheet_(ss) {
  const sheets = ss.getSheets();
  for (const sheet of sheets) {
    if (sheet.getLastColumn() < 1) continue;
    const a1 = String(sheet.getRange(1, 1).getValue()).trim().toLowerCase();
    if (a1 === 'timestamp') return sheet;
  }
  throw new Error(
    'No response sheet found. Link the form to a spreadsheet first: ' +
      'Responses → Link to Sheets.',
  );
}

/**
 * Finds a column by header; null when absent.
 *
 * Exact match wins over a prefix match, because "Age" is a prefix of
 * "Age group" and looking for the first would otherwise be able to return
 * the second.
 */
function findColumn_(sheet, headerPrefix) {
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((h) => String(h).trim().toLowerCase());

  const target = headerPrefix.trim().toLowerCase();

  const exact = headers.indexOf(target);
  if (exact !== -1) return exact + 1;

  const index = headers.findIndex((h) => h.indexOf(target) === 0);
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

/**
 * Adds Age and Age group as plain columns, and keeps them filled.
 *
 * The form no longer asks whether the player is under 18. It already collects
 * the date of birth, and a form that asks the same thing twice eventually
 * gets two different answers — at which point nobody knows which to trust.
 * Deriving it gives one source.
 *
 * Age is taken as of tournament day rather than today, because that is the
 * date deciding whether a parent's authorization is needed. A player who
 * turns 18 the week after the tournament is a minor for this event.
 *
 * Written as values by a trigger rather than as spreadsheet formulas. Two
 * attempts at formulas failed for different reasons and both are worth
 * recording: an array formula in row 2 survives exactly one response, because
 * Forms copies the preceding row into each new one and the copy blocks the
 * array from expanding; and moving it to row 1 is rejected outright, because
 * Sheets now formats response sheets as tables and a table header cannot hold
 * a formula. Values sidestep both, and a stored number cannot silently become
 * #REF! the way a formula can.
 */
function addAgeColumns_(sheet) {
  if (!findColumn_(sheet, 'date of birth')) {
    Logger.log('⚠️ No "Date of birth" column found — skipping age calculation.');
    return;
  }

  ['Age', 'Age group'].forEach((header) => {
    if (findColumn_(sheet, header)) return;
    const col = sheet.getLastColumn() + 1;
    sheet.getRange(1, col).setValue(header).setFontWeight('bold');
    SpreadsheetApp.flush();
  });
}

/**
 * Installs the trigger that fills Age and Age group as entries arrive.
 *
 * Separate from the mail script's trigger on purpose: this one owns the shape
 * of the sheet, that one owns what gets sent. Both can run on the same
 * submission without knowing about each other.
 */
function installAgeTrigger_(form) {
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onEntryRecorded')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('onEntryRecorded').forForm(form).onFormSubmit().create();
}

/** Fills Age and Age group for the row just added. */
function onEntryRecorded() {
  backfillAges();
}

/**
 * Fills Age and Age group for every row that does not have them.
 *
 * Run on its own to repair a sheet, and called after each entry. Rows already
 * holding a real value are left alone, so re-running costs nothing and cannot
 * overwrite a figure someone corrected by hand.
 *
 * A cell left over from the earlier formula attempts reads back as the string
 * "#REF!", which is neither empty nor a number. Treating that as a value would
 * skip the row and then write the error back as literal text, so anything
 * beginning with # counts as empty and gets replaced.
 */
function backfillAges() {
  if (!FORM_URL) throw new Error('Put the form’s edit link in FORM_URL.');

  const form = FormApp.openByUrl(FORM_URL);
  const sheet = findResponseSheet_(SpreadsheetApp.openById(form.getDestinationId()));

  const dobCol = findColumn_(sheet, 'date of birth');
  const ageCol = findColumn_(sheet, 'age');
  const groupCol = findColumn_(sheet, 'age group');
  if (!dobCol || !ageCol || !groupCol) {
    Logger.log('⚠️ Missing a date of birth, Age or Age group column.');
    return;
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return;

  const dobs = sheet.getRange(2, dobCol, lastRow - 1, 1).getValues();
  const ages = sheet.getRange(2, ageCol, lastRow - 1, 1).getValues();
  const groups = sheet.getRange(2, groupCol, lastRow - 1, 1).getValues();

  let filled = 0;
  let cleared = 0;
  for (let i = 0; i < dobs.length; i++) {
    if (!needsFilling_(ages[i][0]) && !needsFilling_(groups[i][0])) continue;

    const age = ageOnTournamentDay_(dobs[i][0]);

    if (age === null) {
      // No usable date. Blank the cells rather than leaving an error sitting
      // in them — an empty cell reads as "not known", "#REF!" reads as broken.
      if (needsFilling_(ages[i][0])) { ages[i][0] = ''; cleared++; }
      if (needsFilling_(groups[i][0])) groups[i][0] = '';
      continue;
    }

    ages[i][0] = age;
    groups[i][0] = ageGroupFor_(age);
    filled++;
  }

  sheet.getRange(2, ageCol, ages.length, 1).setValues(ages);
  sheet.getRange(2, groupCol, groups.length, 1).setValues(groups);
  SpreadsheetApp.flush();

  Logger.log('✅ Age filled in for %s row(s).', filled);
  if (cleared) Logger.log('   %s row(s) had no usable date of birth and were left blank.', cleared);
}

/**
 * Whether a cell should be (re)calculated.
 *
 * Empty counts, and so does anything starting with # — the residue of a
 * formula that failed. Both mean "no usable value here".
 */
function needsFilling_(value) {
  if (value === null || value === undefined) return true;
  const text = String(value).trim();
  return text === '' || text.charAt(0) === '#';
}

/** Age on tournament day. Null when the date is unusable. */
function ageOnTournamentDay_(dob) {
  const born = dob instanceof Date ? dob : new Date(dob);
  if (isNaN(born.getTime())) return null;

  const day = new Date(
    TOURNAMENT_DATE.year,
    TOURNAMENT_DATE.month - 1,
    TOURNAMENT_DATE.day,
  );

  let age = day.getFullYear() - born.getFullYear();
  const beforeBirthday =
    day.getMonth() < born.getMonth() ||
    (day.getMonth() === born.getMonth() && day.getDate() < born.getDate());
  if (beforeBirthday) age--;

  return age;
}

function ageGroupFor_(age) {
  if (age < 18) return 'Under 18';
  if (age <= 22) return '18-22';
  if (age <= 25) return '22-25';
  return 'Over 25';
}

/** Adds the committee's working columns, skipping any that already exist. */
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
 * Public: only the columns the site may show, kept in step by a QUERY.
 *
 * Published are competitive facts — name, club or university, province,
 * handicap, status. Contact details, city, date of birth, emergency contact
 * and anything about a parent never reach this sheet.
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

  // Province only. If the form still asks for city and province together, the
  // whole cell would be published, which contradicts what the site promises.
  let placeCol = findColumn_(responses, 'Province');
  let placeHeader = 'Province';

  if (!placeCol) {
    placeCol = requireColumn_(responses, 'City and province');
    placeHeader = 'Location';
    Logger.log(
      '⚠️ City and province are one question on the form, so Public will ' +
        'publish the city too. Split them into two questions and run this again.',
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
 * Results: filled in after the tournament, with the columns the site will
 * publish.
 *
 * Modelled on the IPSC Ontario screens the client supplied — place,
 * competitor, class, region — translated into their golf equivalents. Fixing
 * the shape now means scores are entered once rather than re-keyed later.
 */
function buildResultsSheet_(ss) {
  const name = 'Results';
  if (ss.getSheetByName(name)) return;

  const sheet = ss.insertSheet(name);
  const headers = [
    'Position',
    'Player',
    'Club / University',
    'Province',
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
      `No column starting with "${headerPrefix}" in the response sheet. ` +
        'If a question was renamed on the form, update the search term here too.',
    );
  }
  return col;
}
