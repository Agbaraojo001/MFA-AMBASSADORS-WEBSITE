/**
 * MFA AMBASSADORS — GOOGLE APPS SCRIPT BACKEND
 * ─────────────────────────────────────────────
 * Handles two things with ONE deployed script:
 *   1. Ambassador registrations  → saved to "Registrations" sheet
 *   2. Contact form messages     → saved to "Contact Messages" sheet
 *                                   + email sent to agbaraojoyusufabiodun@gmail.com
 *
 * HOW TO SET THIS UP (one-time, ~5 minutes):
 *
 * 1. Go to https://sheets.google.com
 *    Create a new spreadsheet. Name it "MFA Ambassador Registrations".
 *
 * 2. Click Extensions → Apps Script.
 *    Delete everything there and paste ALL of this file's code.
 *
 * 3. Click Save. Name the project "MFA Backend".
 *
 * 4. Click Deploy → New deployment.
 *      Type:             Web app
 *      Execute as:       Me
 *      Who has access:   Anyone
 *    Click Deploy. Authorise when prompted (Allow).
 *
 * 5. Copy the Web App URL  (looks like https://script.google.com/macros/s/…/exec)
 *
 * 6. Paste that SAME URL in TWO places inside the project:
 *      join.html    → var SCRIPT_URL = 'PASTE_HERE';
 *      contact.html → var SCRIPT_URL = 'PASTE_HERE';
 *
 * 7. Redeploy the website to Vercel.
 *
 * NOTE: If you update this script later, click Deploy → Manage deployments
 *       → edit the existing deployment (do NOT create a new one) so the URL
 *       stays the same.
 * ─────────────────────────────────────────────
 */

var NOTIFY_EMAIL = 'agbaraojoyusufabiodun@gmail.com';

// ── Entry point ─────────────────────────────────────────────────────────────
function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);
    if (data.type === 'contact') {
      return handleContact(data);
    } else {
      return handleRegistration(data);
    }
  } catch (err) {
    return json({ status: 'error', message: err.message });
  }
}

// ── Ambassador Registration ──────────────────────────────────────────────────
function handleRegistration(data) {
  var sheet = getOrCreateSheet('Registrations', [
    'Timestamp (Lagos)', 'Reg Code', 'Surname', 'Other Names', 'Full Name',
    'WhatsApp', 'Ward', 'Area of Residence', 'VIN No.', 'Occupation', 'Address'
  ], '#0d3980');

  sheet.appendRow([
    timestamp(),
    data.code        || '',
    data.surname     || '',
    data.otherNames  || '',
    ((data.otherNames || '') + ' ' + (data.surname || '')).trim(),
    data.whatsapp    || '',
    data.ward        || '',
    data.area        || '',
    data.vin         || 'N/A',
    data.occupation  || '',
    data.address     || ''
  ]);

  return json({ status: 'ok' });
}

// ── Contact Form ─────────────────────────────────────────────────────────────
function handleContact(data) {
  var sheet = getOrCreateSheet('Contact Messages', [
    'Timestamp (Lagos)', 'Name', 'Phone / WhatsApp', 'Community', 'Subject', 'Message'
  ], '#1a3a6e');

  sheet.appendRow([
    timestamp(),
    data.name      || '',
    data.phone     || '',
    data.community || '',
    data.subject   || '',
    data.message   || ''
  ]);

  // Send email notification
  var subject = '📬 New Message — MFA Ambassadors Website: ' + (data.subject || '(no subject)');
  var body =
    'You have a new contact message from the MFA Ambassadors website.\n\n' +
    '──────────────────────────────\n' +
    'Name:      ' + (data.name      || '') + '\n' +
    'Phone:     ' + (data.phone     || '') + '\n' +
    'Community: ' + (data.community || '') + '\n' +
    'Subject:   ' + (data.subject   || '') + '\n' +
    '──────────────────────────────\n\n' +
    (data.message || '') + '\n\n' +
    '──────────────────────────────\n' +
    'Sent from mfa-ambassadors.vercel.app\n' +
    'Time: ' + timestamp();

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);

  return json({ status: 'ok' });
}

// ── Helpers ──────────────────────────────────────────────────────────────────
function getOrCreateSheet(name, headers, headerBg) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    var r = sheet.getRange(1, 1, 1, headers.length);
    r.setFontWeight('bold');
    r.setBackground(headerBg || '#0d3980');
    r.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function timestamp() {
  return Utilities.formatDate(new Date(), 'Africa/Lagos', 'dd/MM/yyyy HH:mm:ss');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Run this manually in the Apps Script editor to verify the connection
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected: ' + ss.getName());
  Logger.log('Sheets: ' + ss.getSheets().map(function(s) { return s.getName(); }));
  Logger.log('Notify email: ' + NOTIFY_EMAIL);
}
