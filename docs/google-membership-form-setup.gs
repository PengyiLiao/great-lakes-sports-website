/**
 * GAG Membership — join form
 *
 * A separate thing from tournament entry, and it should stay separate:
 *   · Membership is a standing identity. Free, open to anyone.
 *   · Entry is one competition. Screened on handicap, open to members and
 *     non-members alike.
 * The client asked for the two to be distinct, which is also how every
 * established sporting body works.
 *
 * ── How to use ────────────────────────────────────────────────────────
 * Signed in as info@gag.golf:
 *   1. https://script.google.com/home/projects/create (a new project)
 *   2. Rename it `GAG — Membership Form`
 *   3. Clear the editor and paste this file
 *   4. Choose createMembershipForm, Run, authorize
 *   5. The log prints the edit link and the responder link
 *   6. Open the form → Publish → in Share, set
 *      **Responder view to Anyone with the link**
 *      (a Workspace form defaults to the organization only, which quietly
 *      turns away everyone outside it)
 *   7. Responses → Link to Sheets
 *   8. Put the form's edit link in FORM_URL below and run
 *      installMembershipTriggers → every join then gets a member number,
 *      notifies the committee, and sends a welcome
 *
 * ── Why so few questions ──────────────────────────────────────────────
 * Membership is free and carries no benefits yet. Every extra field costs
 * completions and adds to what there is to lose if the sheet ever leaks. This
 * asks who you are, how to reach you, roughly how old you are and where you
 * live — enough to keep people informed and to group them later, and nothing
 * more. Handicap and club can wait until there is a tournament to enter.
 */

/** The form's edit link. Needed by installMembershipTriggers. */
const FORM_URL = '';

/** Where the committee receives join notifications. */
const COMMITTEE_EMAIL = 'info@gag.golf';

/** The sending address. On a Workspace account, simply its own address. */
const FROM_ALIAS = 'info@gag.golf';

const SENDER_NAME = 'GAG — Great Lakes Amateur Golf';

/** Member numbers run from GAG-00001. */
const MEMBER_PREFIX = 'GAG-';
const MEMBER_START = 1;

// ═══════════════════════════════════════════════════════════════════════
// Build the form
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

  form.addTextItem().setTitle('Full name').setRequired(true);

  form
    .addTextItem()
    .setTitle('Email address')
    .setHelpText('Not published. Used to send your member number and GAG news.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build())
    .setRequired(true);

  // A date rather than an age band. The band is worked out in the sheet, so
  // there is one source for it and it stays right as years pass — a member
  // who ticked "18–22" in 2026 is still filed under it in 2030 otherwise.
  form
    .addDateItem()
    .setTitle('Date of birth')
    .setHelpText(
      'Not published. Used to group members by age, and to apply the right ' +
        'consent requirements for members under 18.',
    )
    .setIncludesYear(true)
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
      'Complete this section only if the member is under 18. Otherwise leave ' +
        'it blank.',
    );

  form
    .addTextItem()
    .setTitle('Parent or guardian — full name')
    .setHelpText('Not published. Under-18 members only.');

  form
    .addTextItem()
    .setTitle('Parent or guardian — email')
    .setHelpText('Not published. Under-18 members only.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form
    .addCheckboxItem()
    .setTitle('Parent or guardian consent')
    .setHelpText('Under-18 members only.')
    .setChoiceValues([
      'I am the parent or legal guardian of this member and I consent to their ' +
        'GAG membership.',
    ]);

  // ── Before you join ───────────────────────────────────────────────
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

  Logger.log('✅ Membership form created with %s items.', form.getItems().length);
  Logger.log('📝 Edit link: %s', form.getEditUrl());
  Logger.log('🔗 Responder link (put this in membershipUrl): %s', form.getPublishedUrl());
  Logger.log('⚠️ Publish it, and set Responder view to Anyone with the link.');
}

// ═══════════════════════════════════════════════════════════════════════
// Member numbers, notifications and the welcome
// ═══════════════════════════════════════════════════════════════════════

/**
 * Installs the on-join trigger and the age columns.
 *
 * Numbering and mail run in one trigger rather than two. Split across two,
 * the mail could fire before the number was written and send a welcome
 * missing the one thing it exists to deliver.
 */
function installMembershipTriggers() {
  if (!FORM_URL) throw new Error('Set FORM_URL to the membership form’s edit link.');

  const form = FormApp.openByUrl(FORM_URL);

  ScriptApp.getProjectTriggers()
    .filter((t) => t.getHandlerFunction() === 'onMemberJoined')
    .forEach((t) => ScriptApp.deleteTrigger(t));

  ScriptApp.newTrigger('onMemberJoined').forForm(form).onFormSubmit().create();
  addAgeColumns_();

  Logger.log('✅ Installed: member numbers, committee notification, welcome email.');
  Logger.log('📧 Committee notifications go to: %s', COMMITTEE_EMAIL);
  Logger.log('✉️ Sending as: %s', FROM_ALIAS || "the script owner's mailbox");
}

function onMemberJoined(e) {
  const number = assignMemberNumber_();
  const answers = answersByTitle_(e.response);

  notifyCommittee_(answers, number);

  const email = answers['Email address'];
  if (email) welcomeMember_(email, answers, number);
}

/**
 * Adds Age and Age group, calculated from the date of birth.
 *
 * Age here is age now, unlike the tournament sheet where it is age on
 * tournament day — a membership register has no single date to measure
 * against, so it measures against today and moves with it.
 *
 * One array formula anchored at row 2, not a formula per row: Forms appends
 * rows, and a per-row formula would need dragging down after every join.
 */
function addAgeColumns_() {
  const form = FormApp.openByUrl(FORM_URL);
  const ss = SpreadsheetApp.openById(form.getDestinationId());
  const sheet = responseSheet_(ss);
  if (!sheet) return;

  const dobCol = findColumn_(sheet, 'date of birth');
  if (!dobCol) {
    Logger.log('⚠️ No "Date of birth" column — skipping age calculation.');
    return;
  }

  const dob = columnLetter_(dobCol);

  if (!findColumn_(sheet, 'age')) {
    const col = sheet.getLastColumn() + 1;
    sheet.getRange(1, col).setValue('Age').setFontWeight('bold');
    sheet
      .getRange(2, col)
      .setFormula(
        `=ARRAYFORMULA(IF($${dob}2:$${dob}="","",` +
          `YEAR(TODAY())-YEAR($${dob}2:$${dob})-` +
          `IF(TODAY()<DATE(YEAR(TODAY()),MONTH($${dob}2:$${dob}),DAY($${dob}2:$${dob})),1,0)))`,
      );
  }

  const ageCol = findColumn_(sheet, 'age');
  if (ageCol && !findColumn_(sheet, 'age group')) {
    const age = columnLetter_(ageCol);
    const col = sheet.getLastColumn() + 1;
    sheet.getRange(1, col).setValue('Age group').setFontWeight('bold');
    sheet
      .getRange(2, col)
      .setFormula(
        `=ARRAYFORMULA(IF($${age}2:$${age}="","",` +
          `IF($${age}2:$${age}<18,"Under 18",` +
          `IF($${age}2:$${age}<=22,"18-22",` +
          `IF($${age}2:$${age}<=25,"22-25","Over 25")))))`,
      );
  }
}

/**
 * Assigns a member number to the newest row and returns it.
 *
 * Written as a value in its own column, not derived by formula from the row
 * number: a formula's result shifts when rows are deleted or sorted, and a
 * member number, once issued, has to keep pointing at the same person. Taking
 * the highest existing number plus one rather than counting rows means a
 * deleted row cannot cause a collision either.
 */
function assignMemberNumber_() {
  const form = FormApp.openByUrl(FORM_URL);
  const ss = SpreadsheetApp.openById(form.getDestinationId());
  const sheet = responseSheet_(ss);
  if (!sheet) return '';

  let col = findColumn_(sheet, 'member number');
  if (!col) {
    col = sheet.getLastColumn() + 1;
    sheet.getRange(1, col).setValue('Member number').setFontWeight('bold');
  }

  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return '';

  const existing = sheet.getRange(lastRow, col).getValue();
  if (existing) return String(existing);

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
  const minor = isMinorToday_(answers['Date of birth']);

  const lines = [
    `Member:   ${name}`,
    `Number:   ${number || '(not assigned)'}`,
    `Province: ${answers['Province or territory'] || '—'}`,
    `Club:     ${answers['Club, university or team'] || '—'}`,
    `Under 18: ${minor === null ? '—' : minor ? 'Yes' : 'No'}`,
    '',
    'Full details are in the membership spreadsheet.',
  ];

  if (minor === true) {
    lines.unshift('⚠️ UNDER 18 — check that parent or guardian consent was given.', '');
  }

  send_({
    to: COMMITTEE_EMAIL,
    subject: `New member — ${name}${number ? ' (' + number + ')' : ''}`,
    body: lines.join('\n'),
  });
}

/**
 * The welcome.
 *
 * ⚠️ Sent whatever the answer to the news question. That question asks about
 * future promotional mail; this is a receipt for something the person just
 * did, carrying their member number. Canadian anti-spam law treats the two
 * differently, and so should we. Bulk announcements go only to those who
 * opted in.
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
    'are members. If you enter one, quoting your member number lets us match',
    'the entry to your record:',
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
// Helpers
// ═══════════════════════════════════════════════════════════════════════

function responseSheet_(ss) {
  return ss
    .getSheets()
    .find(
      (s) =>
        s.getLastColumn() > 0 &&
        String(s.getRange(1, 1).getValue()).trim().toLowerCase() === 'timestamp',
    );
}

/** Finds a column by header prefix; null when absent. */
function findColumn_(sheet, headerPrefix) {
  const headers = sheet
    .getRange(1, 1, 1, sheet.getLastColumn())
    .getValues()[0]
    .map((h) => String(h).trim().toLowerCase());
  const index = headers.findIndex((h) => h.indexOf(headerPrefix.toLowerCase()) === 0);
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

/** Whether the member is under 18 today. Null when there is no usable date. */
function isMinorToday_(dob) {
  const born = dob instanceof Date ? dob : new Date(dob);
  if (isNaN(born.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - born.getFullYear();
  const beforeBirthday =
    today.getMonth() < born.getMonth() ||
    (today.getMonth() === born.getMonth() && today.getDate() < born.getDate());
  if (beforeBirthday) age--;

  return age < 18;
}

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
