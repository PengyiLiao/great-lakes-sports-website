/**
 * 2026 GAG Inaugural Tournament — Entry Form
 * Builds the whole form in one run.
 *
 * ── How to use ────────────────────────────────────────────────────────
 * Signed in as info@gag.golf:
 *   1. https://script.google.com/home/projects/create
 *   2. Clear the editor, paste this file
 *   3. Put the form's EDIT link in FORM_URL below
 *      (https://docs.google.com/forms/d/xxxxx/edit)
 *   4. Choose buildEntryForm from the function menu and Run
 *   5. Authorize on first run — see the note below
 *
 * If step 4 fails with "No item with the given ID could be found", the
 * script project and the form are usually under different Google accounts,
 * which is easy to do with more than one account signed in. Use
 * createEntryForm instead: it makes its own form, so there is no ID to copy
 * and no accounts to line up, and it logs both links when it finishes.
 *
 * A bound script works too: open Apps Script from the form's ⋮ menu, leave
 * FORM_URL empty, and run buildEntryForm.
 *
 * ── About the authorization warning ───────────────────────────────────
 * Google shows "this app isn't verified" the first time. Choose Advanced,
 * then "Go to … (unsafe)", then Allow. That warning is meant for scripts a
 * stranger published; this one you pasted into your own account and it only
 * touches your own form.
 *
 * ⚠️ buildEntryForm empties the target form. Only run it on a form with no
 * responses.
 *
 * ── Deliberately not collected ────────────────────────────────────────
 * · Entry fee and payment — entry and payment are two steps. The field is
 *   capped at 72 and screened on handicap, so taking money up front would
 *   mean refunding anyone ineligible or over the limit. Payment details go
 *   out with the confirmation instead.
 * · Google account email — collecting it automatically would force entrants
 *   to sign in to Google, an unnecessary barrier for an outside entrant, so
 *   the address is a validated text field.
 * · Whether the player is under 18 — that is calculated from the date of
 *   birth in the spreadsheet. Asking a question whose answer we already hold
 *   invites a contradiction between the two.
 */

/** The form's edit link. Needed for buildEntryForm; leave empty when bound. */
const FORM_URL = '';

/** Tournament date, used to work out each entrant's age on the day. */
const TOURNAMENT_DATE = '2026-10-11';

/** Entry point that makes a new form. */
function createEntryForm() {
  const form = FormApp.create('2026 GAG Inaugural Tournament — Entry Form');
  populate(form);

  Logger.log('✅ Form created with %s items.', form.getItems().length);
  Logger.log('📝 Edit link: %s', form.getEditUrl());
  Logger.log('🔗 Responder link (put this in registrationUrl): %s', form.getPublishedUrl());
}

/** Entry point that rebuilds an existing form. Clears it first. */
function buildEntryForm() {
  const form = FORM_URL ? FormApp.openByUrl(FORM_URL) : FormApp.getActiveForm();

  if (!form) {
    throw new Error(
      'No form found. Use createEntryForm to make one, or put the form’s ' +
        'edit link in FORM_URL at the top of this file.',
    );
  }

  clearForm_(form);
  populate(form);

  Logger.log('✅ Done — %s items.', form.getItems().length);
  Logger.log('🔗 Responder link: %s', form.getPublishedUrl());
}

/**
 * Empties the form.
 *
 * Not a straight delete. Choices and page breaks can carry navigation, and
 * items are removed last to first, so a page would go before the question
 * that points at it and Forms rejects the whole operation with "Invalid data
 * updating form". Navigation is reset to "continue" first. An empty form
 * cannot hit this, so it only appears on the second run.
 */
function clearForm_(form) {
  form.getItems().forEach((item) => {
    const type = item.getType();

    if (type === FormApp.ItemType.MULTIPLE_CHOICE) {
      const mc = item.asMultipleChoiceItem();
      const values = mc.getChoices().map((choice) => choice.getValue());
      if (values.length) mc.setChoiceValues(values);
    } else if (type === FormApp.ItemType.LIST) {
      const list = item.asListItem();
      const values = list.getChoices().map((choice) => choice.getValue());
      if (values.length) list.setChoiceValues(values);
    } else if (type === FormApp.ItemType.PAGE_BREAK) {
      item.asPageBreakItem().setGoToPage(FormApp.PageNavigationType.CONTINUE);
    }
  });

  const items = form.getItems();
  for (let i = items.length - 1; i >= 0; i--) {
    form.deleteItem(items[i]);
  }
}

/** Writes every section and question. Shared by both entry points. */
function populate(form) {
  form
    .setTitle('2026 GAG Inaugural Tournament — Entry Form')
    .setDescription(
      'Sunday, October 11, 2026 · TPC Toronto at Osprey Valley, North Course\n' +
        'Field of 72 · Handicap index under 10\n\n' +
        'Open to all eligible players. GAG membership is not required to enter.\n\n' +
        'Entries are reviewed by the organizing committee. Submitting this form ' +
        'does not confirm a place. You will be contacted once your handicap has ' +
        'been verified and your entry confirmed.\n\n' +
        'Your contact details, date of birth and emergency contact are used only ' +
        'to run the competition and are never published. Draw sheets and results ' +
        'show name, club or university, province, handicap and scores.',
    )
    .setProgressBar(true)
    .setAllowResponseEdits(true)
    .setConfirmationMessage(
      'Thank you. Your entry has been received.\n\n' +
        'The organizing committee will verify your handicap and confirm your ' +
        'place by email, along with payment details and tee time.\n\n' +
        'Let’s Play GAG!',
    );

  // ── Player Information ────────────────────────────────────────────
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
    .setHelpText(
      'Not published. Used to confirm age category and for insurance. Players ' +
        'under 18 on tournament day need a parent or guardian to authorize the ' +
        'entry — see the section further down.',
    )
    .setIncludesYear(true)
    .setRequired(true);

  form
    .addMultipleChoiceItem()
    .setTitle('Gender')
    .setHelpText('The field is made up of 52 male and 20 female places.')
    .setChoiceValues(['Male', 'Female'])
    .setRequired(true);

  // City and province are two questions, not one. Combined, the published
  // column would carry both, while the site promises only the province — and
  // on a platform publishing players from sixteen, name plus school plus city
  // identifies a person a good deal more precisely than name plus province.
  form
    .addTextItem()
    .setTitle('City')
    .setHelpText('Not published.')
    .setRequired(true);

  form
    .addListItem()
    .setTitle('Province or territory')
    .setHelpText('Published alongside your name on draw sheets and results.')
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

  // Optional on purpose. Entry is open to everyone; the number simply lets the
  // committee match an entry to an existing member record without anybody
  // having to search by name and guess at spellings.
  form
    .addTextItem()
    .setTitle('GAG member number')
    .setHelpText(
      'Optional — for example GAG-00001. Leave blank if you are not a member. ' +
        'Membership is free but is not required to enter: https://gag.golf/membership',
    );

  // ── Golf Credentials ──────────────────────────────────────────────
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

  // ── Tournament Logistics ──────────────────────────────────────────
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
    .setHelpText(
      'First tee 8:05 a.m., last tee 11:59 a.m. We will do our best, but times ' +
        'are assigned by the committee.',
    )
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

  // ── Players Under 18 ──────────────────────────────────────────────
  // Always shown rather than reached by a branch. The branch used to hang off
  // a "are you under 18?" question, and that question is gone: the answer is
  // already in the date of birth, and asking twice invites the two to
  // disagree. Forms cannot branch on a date, so the section is visible to
  // everyone and its fields are optional, with the heading saying who it is
  // for. The spreadsheet flags entries that need it.
  form
    .addPageBreakItem()
    .setTitle('Players Under 18')
    .setHelpText(
      'Complete this section only if the player will be under 18 on ' +
        'October 11, 2026. Otherwise continue to the next section.\n\n' +
        'Entries for players under 18 are not confirmed until a parent or ' +
        'guardian has authorized them.',
    );

  form
    .addTextItem()
    .setTitle('Parent or guardian — full name')
    .setHelpText('Not published. Under-18 entries only.');

  form
    .addTextItem()
    .setTitle('Parent or guardian — email')
    .setHelpText('Not published. Under-18 entries only.')
    .setValidation(FormApp.createTextValidation().requireTextIsEmail().build());

  form
    .addTextItem()
    .setTitle('Parent or guardian — phone')
    .setHelpText('Not published. Under-18 entries only.');

  form
    .addCheckboxItem()
    .setTitle('Parent or guardian authorization')
    .setHelpText('Under-18 entries only.')
    .setChoiceValues([
      'I am the parent or legal guardian of this player. I authorize this entry ' +
        'and the publication of the player’s competitive information: name, club ' +
        'or university, province, handicap and results.',
    ]);

  // ── Confirmations ─────────────────────────────────────────────────
  form.addPageBreakItem().setTitle('Confirmations');

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
      'I understand that my name, club or university, province, handicap and ' +
        'results will be published, and that my contact details, city, date of ' +
        'birth and emergency contact will not.',
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
}
