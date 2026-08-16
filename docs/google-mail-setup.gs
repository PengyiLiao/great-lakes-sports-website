/**
 * 2026 GAG Inaugural Tournament — mail
 *
 * Three jobs:
 *   1. An entry arrives → the committee is notified
 *   2. An entry arrives → the player gets a confirmation saying what happens next
 *   3. Announcements → sent only to those who opted in, always blind copied
 *
 * ── How to use ────────────────────────────────────────────────────────
 * 1. https://script.google.com/home/projects/create (a new project, not one
 *    of the others)
 * 2. Clear the editor and paste this file
 * 3. Fill in FORM_URL and COMMITTEE_EMAIL below
 * 4. Choose installTriggers from the function menu and Run, then authorize
 *    → from then on every entry sends both messages by itself
 * 5. To send an announcement, edit ANNOUNCEMENT below, choose
 *    sendAnnouncement and Run
 *
 * ── Who the message appears to come from ──────────────────────────────
 * Apps Script sends as the Google account running it. On a Workspace account
 * such as info@gag.golf, put that address in FROM_ALIAS and it is used
 * directly — nothing else to configure.
 *
 * On a personal Gmail, verify the address as an alias first:
 *   Gmail → Settings → See all settings → Accounts and Import
 *   → "Send mail as" → Add another email address
 *
 * Left empty, mail goes out from the script owner's own address with replies
 * directed to COMMITTEE_EMAIL. That works, but the sender reads as a personal
 * mailbox.
 */

/** The form's edit link, e.g. https://docs.google.com/forms/d/xxxxx/edit */
const FORM_URL = '';

/** Where the committee receives entry notifications. */
const COMMITTEE_EMAIL = '';

/**
 * The sending address. On a Workspace account, simply its own address.
 * Leave empty to send from the script owner's mailbox instead.
 */
const FROM_ALIAS = '';

/** The name recipients see. */
const SENDER_NAME = 'GAG — Great Lakes Amateur Golf';

// ═══════════════════════════════════════════════════════════════════════
// Triggers
// ═══════════════════════════════════════════════════════════════════════

/** Installs the on-submit trigger. Safe to run again. */
function installTriggers() {
  requireConfig_();
  const form = FormApp.openByUrl(FORM_URL);

  // Remove any existing trigger with the same handler first, or one entry
  // would send two of each message.
  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onEntrySubmitted')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('onEntrySubmitted').forForm(form).onFormSubmit().create();

  Logger.log('✅ Installed. Every entry now sends a notification and a confirmation.');
  Logger.log('📧 Committee notifications go to: %s', COMMITTEE_EMAIL);
  Logger.log('✉️ Sending as: %s', FROM_ALIAS || "the script owner's mailbox — set FROM_ALIAS");
}

// ═══════════════════════════════════════════════════════════════════════
// On entry
// ═══════════════════════════════════════════════════════════════════════

function onEntrySubmitted(e) {
  const answers = answersByTitle_(e.response);

  notifyCommittee_(answers);

  const playerEmail = answers['Email address'];
  if (playerEmail) confirmToPlayer_(playerEmail, answers);
}

/**
 * Notifies the committee.
 *
 * Carries only what is needed to judge eligibility — name, province, club,
 * handicap, and whether the player is a minor. Phone numbers, dates of birth
 * and parents' contact details stay in the spreadsheet, which has access
 * controls; mail gets forwarded, searched and left sitting in inboxes. A link
 * to the sheet is enough.
 *
 * Minor status is worked out from the date of birth rather than asked. The
 * form used to ask outright, and a form that asks something it already knows
 * eventually collects two answers that disagree.
 */
function notifyCommittee_(answers) {
  const name = answers['Full name'] || '(no name)';
  const minor = isMinorOnTournamentDay_(answers['Date of birth']);
  const under18 = minor === null ? '—' : minor ? 'Yes' : 'No';

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

  if (minor === true) {
    lines.unshift(
      '⚠️ UNDER 18 — parent or guardian authorization required before confirming.',
      '',
    );
  }

  send_({
    to: COMMITTEE_EMAIL,
    subject: `New entry — ${name}${minor === true ? ' (under 18)' : ''}`,
    body: lines.join('\n'),
  });
}

/**
 * The player's confirmation.
 *
 * Says outright that submitting is not a place and that no payment is due
 * yet. Those are the two things a first tournament gets asked about most:
 * people assume the form secured them a spot, or start asking where to send
 * money.
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
    'https://gag.golf',
  ].join('\n');

  send_({
    to: email,
    subject: 'Your entry — 2026 GAG Inaugural Tournament',
    body: body,
  });
}

// ═══════════════════════════════════════════════════════════════════════
// Announcements
// ═══════════════════════════════════════════════════════════════════════

/** Edit this before sending. */
const ANNOUNCEMENT = {
  subject: 'GAG — tournament update',
  body: [
    'Hello,',
    '',
    '(write the message here)',
    '',
    'Let’s Play GAG!',
    '',
    'GAG — Great Lakes Amateur Golf',
    'https://gag.golf',
  ].join('\n'),
};

/**
 * Sends to everyone who opted in.
 *
 * 🚨 Always blind copied. Put the addresses in the To field and every entrant
 * sees everyone else's — the commonest privacy accident in amateur sport, and
 * one that cannot be taken back. Recipients only ever go in bcc here; To is
 * always the committee itself.
 *
 * Batched at 50 per message. A Workspace account allows 2,000 recipients a
 * day, so a field of 72 is comfortable; a much larger list would need
 * spreading across days or a dedicated mail service.
 */
function sendAnnouncement() {
  requireConfig_();

  const recipients = optedInEmails_();
  if (!recipients.length) {
    Logger.log('Nobody has opted in. Nothing sent.');
    return;
  }

  const BATCH = 50;
  for (let i = 0; i < recipients.length; i += BATCH) {
    const batch = recipients.slice(i, i + BATCH);
    send_({
      to: COMMITTEE_EMAIL, // To is us; the real recipients are all in bcc
      bcc: batch.join(','),
      subject: ANNOUNCEMENT.subject,
      body: ANNOUNCEMENT.body,
    });
    Logger.log('Batch %s sent — %s recipients, blind copied.', i / BATCH + 1, batch.length);
  }

  Logger.log('✅ %s recipients, all blind copied.', recipients.length);
}

/** Opted-in addresses from the response sheet, de-duplicated. */
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
    throw new Error('No email or opt-in column in the response sheet — check whether a form question was renamed.');
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
// Helpers
// ═══════════════════════════════════════════════════════════════════════

/** Turns a FormResponse into { question: answer }. */
function answersByTitle_(response) {
  const map = {};
  response.getItemResponses().forEach((item) => {
    map[item.getItem().getTitle()] = item.getResponse();
  });
  return map;
}

/** Single place that sends, applying the sender alias and reply-to. */
function send_(options) {
  const payload = {
    to: options.to,
    subject: options.subject,
    body: options.body,
    name: SENDER_NAME,
  };

  if (options.bcc) payload.bcc = options.bcc;

  // Use the alias as the sender when there is one; otherwise at least send
  // replies to the committee rather than to whoever ran the script.
  if (FROM_ALIAS) {
    payload.from = FROM_ALIAS;
  } else if (COMMITTEE_EMAIL) {
    payload.replyTo = COMMITTEE_EMAIL;
  }

  GmailApp.sendEmail(payload.to, payload.subject, payload.body, payload);
}

function requireConfig_() {
  if (!FORM_URL) throw new Error('Set FORM_URL to the form’s edit link.');
  if (!COMMITTEE_EMAIL) throw new Error('Set COMMITTEE_EMAIL.');
}

/**
 * Whether the player is under 18 on tournament day.
 *
 * Tournament day, not today: that is the date deciding whether a parent's
 * authorization is needed. A player turning 18 the week after is still a
 * minor for this event. Returns null when there is no usable date.
 */
function isMinorOnTournamentDay_(dob) {
  const born = dob instanceof Date ? dob : new Date(dob);
  if (isNaN(born.getTime())) return null;

  const day = new Date(2026, 9, 11); // October is month 9
  let age = day.getFullYear() - born.getFullYear();
  const beforeBirthday =
    day.getMonth() < born.getMonth() ||
    (day.getMonth() === born.getMonth() && day.getDate() < born.getDate());
  if (beforeBirthday) age--;

  return age < 18;
}
