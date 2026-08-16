/**
 * GAG — personalised invitations
 *
 * Sends one addressed message per row of a Google Sheet, opening with the
 * recipient's name. Not a blast, so no blind copying is involved — each
 * person only ever sees their own.
 *
 * ── How to use ────────────────────────────────────────────────────────
 * 1. Bring the Excel list into Google Sheets:
 *      Drive → New → File upload → the .xlsx
 *      → open it → File → Save as Google Sheets
 *    ⚠️ Keep sharing Restricted. The list holds dates of birth and phone
 *    numbers for people who have not opted into anything.
 *
 * 2. The header row needs a name column and an email column. Exact wording
 *    does not matter — they are found by keyword. Two columns are added at
 *    the right: Invite sent, Invite sent at.
 *
 * 3. https://script.google.com/home/projects/create, signed in as
 *    info@gag.golf. Rename it `GAG — Invitations`, paste this file, and fill
 *    in SHEET_URL below.
 *
 * 4. **Run previewInvitations first.** It prints the first few messages in
 *    full and sends nothing. Check the salutation, the copy and the
 *    unsubscribe line before going further.
 *
 * 5. Run sendInvitations to send. Rows are marked once sent, so running it
 *    again picks up only what was missed.
 *
 * ── ⚠️ Canadian anti-spam law (CASL) ──────────────────────────────────
 * A commercial message to a Canadian recipient requires three things:
 *   1. consent, express or implied
 *   2. the sender's identity and contact details in the message
 *   3. a way to unsubscribe
 * Two and three are in every message this sends. **One is the committee's to
 * establish.** Where did these addresses come from? An address the person
 * published themselves, in a message relevant to that role, can amount to
 * implied consent; a list passed along privately is a different matter. The
 * penalties are not small, so it is worth answering before sending.
 *
 * The list also includes junior players. Promotional mail to minors is more
 * sensitive again — rows whose date of birth puts them under eighteen are
 * counted in the preview so they can be handled through a parent or club
 * rather than mailed blind.
 */

/** Link to the invitation spreadsheet. */
const SHEET_URL = '';

/** Sending identity. On a Workspace account, simply its own address. */
const FROM_ALIAS = 'info@gag.golf';
const REPLY_TO = 'info@gag.golf';
const SENDER_NAME = 'GAG — Great Lakes Amateur Golf';

/** Cap per run. Workspace allows 2,000 a day; this leaves headroom. */
const MAX_PER_RUN = 120;

/** How many messages the preview prints. */
const PREVIEW_COUNT = 3;

const SUBJECT = 'An invitation — 2026 GAG Inaugural Tournament';

/**
 * The message. The recipient's name is passed in.
 *
 * The identification block and the unsubscribe line at the end are what CASL
 * requires. Do not remove them.
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
// Preview — sends nothing
// ═══════════════════════════════════════════════════════════════════════

function previewInvitations() {
  const { rows, cols } = readSheet_();
  const pending = rows.filter((r) => !r.values[cols.sent - 1] && r.email);

  Logger.log('%s to send (%s rows in the list, %s with an email address).',
    pending.length, rows.length, rows.filter((r) => r.email).length);

  const minors = rows.filter((r) => r.likelyMinor);
  if (minors.length) {
    Logger.log(
      '⚠️ %s rows appear to be under 18, judging by date of birth. ' +
        'Promotional mail to minors is more sensitive — consider reaching ' +
        'them through a parent or their club. These rows are not skipped ' +
        'automatically; that call is yours.',
      minors.length,
    );
  }

  pending.slice(0, PREVIEW_COUNT).forEach((r, i) => {
    Logger.log('──────── preview %s / to %s ────────', i + 1, r.email);
    Logger.log('Subject: %s', SUBJECT);
    Logger.log('%s', buildBody(r.name));
  });

  Logger.log('Preview only — nothing was sent. Run sendInvitations when the copy is right.');
}

// ═══════════════════════════════════════════════════════════════════════
// Send
// ═══════════════════════════════════════════════════════════════════════

/**
 * Sends row by row, one message per person. The content is personalised, so
 * it was never going to be a blast, and nobody's address is exposed to
 * anybody else.
 *
 * Sent rows are stamped with a marker and a time. Running again picks up only
 * the unmarked ones, so nobody is mailed twice — the failure that turns an
 * invitation into a complaint.
 */
function sendInvitations() {
  const { sheet, rows, cols } = readSheet_();
  const pending = rows.filter((r) => !r.values[cols.sent - 1] && r.email);

  if (!pending.length) {
    Logger.log('Nothing left to send.');
    return;
  }

  const quota = MailApp.getRemainingDailyQuota();
  const batch = pending.slice(0, Math.min(MAX_PER_RUN, quota));
  Logger.log('%s pending, sending %s now (%s left in today\'s quota).',
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
      // One bad address should not stop the batch — record it and move on
      sheet.getRange(r.rowIndex, cols.sent).setValue('Failed: ' + err.message);
    }
  });

  SpreadsheetApp.flush();
  Logger.log('✅ Sent %s. %s still pending — run again later.',
    sent, pending.length - batch.length);
}

// ═══════════════════════════════════════════════════════════════════════
// Reading the sheet
// ═══════════════════════════════════════════════════════════════════════

/**
 * Reads the list.
 *
 * Columns are found by header keyword rather than position. This sheet came
 * from a hand-maintained Excel file; a fixed column index would shift
 * silently the first time someone inserts a column, and start mailing phone
 * numbers.
 */
function readSheet_() {
  if (!SHEET_URL) throw new Error('Set SHEET_URL to the invitation spreadsheet.');

  const sheet = SpreadsheetApp.openByUrl(SHEET_URL).getSheets()[0];
  const data = sheet.getDataRange().getValues();

  // The header is not always row 1 — lists like this often open with a title.
  // Find the row containing "email".
  let headerRow = -1;
  for (let i = 0; i < Math.min(5, data.length); i++) {
    if (data[i].some((c) => String(c).toLowerCase().indexOf('email') !== -1)) {
      headerRow = i;
      break;
    }
  }
  if (headerRow === -1) throw new Error('No header row found — one column must contain "Email".');

  const headers = data[headerRow].map((h) => String(h).toLowerCase());
  const find = (kw) => {
    const i = headers.findIndex((h) => kw.some((k) => h.indexOf(k) !== -1));
    return i === -1 ? null : i + 1;
  };

  // The list's headers are bilingual but English-first — "Name 姓名",
  // "Email （邮件地址）", "DOB" — so an English keyword is enough.
  const emailCol = find(['email']);
  const nameCol = find(['name']);
  const dobCol = find(['dob', 'birth']);
  if (!emailCol) throw new Error('No email column found.');
  // No silent fallback to column 1: that column is the ranking, and every
  // message would open "Dear 5".
  if (!nameCol) throw new Error('No name column found.');

  // Status columns, added at the right if they are not there yet
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
    if (!email && !String(values[nameCol - 1] || '').trim()) continue; // blank row

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
 * The name to open with.
 *
 * Lists like this mix "Last, First" and "First Last" freely. A comma is a
 * reliable signal; without one, take the first word. Getting a salutation
 * wrong reads worse than not using one, so this stays conservative.
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
