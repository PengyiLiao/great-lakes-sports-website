/**
 * 2026 GAG Inaugural Tournament — response spreadsheet structure
 *
 * Does four things:
 *   1. Links a spreadsheet to the form if it has none
 *   2. Adds the committee's working columns to the right of the form's own
 *   3. Adds Age and Age group, calculated from the date of birth
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
 * Adds Age and Age group, worked out from the date of birth.
 *
 * The form no longer asks whether the player is under 18. It already collects
 * the date of birth, and a form that asks the same thing twice eventually
 * gets two different answers — at which point nobody knows which to trust.
 * Calculating it here gives one source.
 *
 * Age is taken as of tournament day rather than today, because that is the
 * date that decides whether a parent's authorization is needed. A player who
 * turns 18 the week after the tournament is a minor for this event.
 *
 * Both formulas are anchored in row 1 as ={"Header";ARRAYFORMULA(...)} rather
 * than placed in row 2. An array formula in row 2 works exactly once: Forms
 * copies the preceding row into each new response row, the copy lands in row
 * 3, and the array can no longer expand into an occupied cell — leaving #REF!
 * in both. Nothing is ever written to row 1, so anchoring there keeps the
 * column below free to spill into.
 *
 * Safe to run again: each column is cleared below row 1 and rewritten, which
 * also repairs a sheet already stuck in the #REF! state.
 */
function addAgeColumns_(sheet) {
  const dobCol = findColumn_(sheet, 'date of birth');
  if (!dobCol) {
    Logger.log('⚠️ No "Date of birth" column found — skipping age calculation.');
    return;
  }

  const dob = columnLetter_(dobCol);
  const day = `DATE(${TOURNAMENT_DATE.year},${TOURNAMENT_DATE.month},${TOURNAMENT_DATE.day})`;

  const ageCol = findColumn_(sheet, 'age') || sheet.getLastColumn() + 1;
  const age = columnLetter_(ageCol);

  setSpillFormula_(
    sheet,
    ageCol,
    `={"Age";ARRAYFORMULA(IF($${dob}2:$${dob}="","",` +
      `YEAR(${day})-YEAR($${dob}2:$${dob})-` +
      `IF(${day}<DATE(YEAR(${day}),MONTH($${dob}2:$${dob}),DAY($${dob}2:$${dob})),1,0)))}`,
  );

  const groupCol = findColumn_(sheet, 'age group') || sheet.getLastColumn() + 1;

  setSpillFormula_(
    sheet,
    groupCol,
    `={"Age group";ARRAYFORMULA(IF($${age}2:$${age}="","",` +
      `IF($${age}2:$${age}<18,"Under 18",` +
      `IF($${age}2:$${age}<=22,"18-22",` +
      `IF($${age}2:$${age}<=25,"22-25","Over 25")))))}`,
  );
}

/**
 * Writes a header-and-array formula into row 1 and clears the rest of the
 * column, so the array has somewhere to spill.
 */
function setSpillFormula_(sheet, col, formula) {
  const rows = sheet.getMaxRows();
  if (rows > 1) sheet.getRange(2, col, rows - 1, 1).clearContent();
  sheet.getRange(1, col).setFormula(formula).setFontWeight('bold');
  // Flush before returning: the next lookup in this same run reads the header
  // row and the column count, and both are stale until the write lands.
  SpreadsheetApp.flush();
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
