/**
 * MFA AMBASSADORS — CONTACT FORM BACKEND (Google Apps Script)
 * ─────────────────────────────────────────────────────────────
 * Handles ONLY contact form submissions from contact.html.
 * Saves to Google Sheets AND emails agbaraojoyusufabiodun@gmail.com.
 * This script is COMPLETELY SEPARATE from the registration backend.
 *
 * HOW TO SET THIS UP (one-time, ~5 minutes):
 *
 * 1. Go to https://sheets.google.com
 *    Create a NEW spreadsheet named "MFA Website Contact Messages".
 *
 * 2. Click Extensions → Apps Script.
 *    Delete everything and paste ALL of this file's code.
 *
 * 3. Click Save. Name the project "MFA Contact Handler".
 *
 * 4. Click Deploy → New deployment.
 *      Type:           Web app
 *      Execute as:     Me
 *      Who has access: Anyone
 *    Click Deploy and Authorise when prompted.
 *    (Gmail permission will be requested — you must Allow it.)
 *
 * 5. Copy the Web App URL (https://script.google.com/macros/s/…/exec)
 *
 * 6. Open contact.html → find:
 *      var CONTACT_SCRIPT_URL = 'YOUR_CONTACT_SCRIPT_URL_HERE';
 *    Replace with your URL. Save and redeploy to Vercel.
 * ─────────────────────────────────────────────────────────────
 */

var NOTIFY_EMAIL = 'agbaraojoyusufabiodun@gmail.com';

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents);

    saveToSheet(data);
    sendEmailNotification(data);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function saveToSheet(data) {
  var ss    = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('Contact Messages') || ss.insertSheet('Contact Messages');

  if (sheet.getLastRow() === 0) {
    var headers = ['Timestamp (Lagos)', 'Name', 'WhatsApp', 'Community/Ward', 'Subject', 'Message'];
    sheet.appendRow(headers);
    var r = sheet.getRange(1, 1, 1, headers.length);
    r.setFontWeight('bold');
    r.setBackground('#cc2222');
    r.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 180);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 130);
    sheet.setColumnWidth(4, 160);
    sheet.setColumnWidth(5, 200);
    sheet.setColumnWidth(6, 350);
  }

  sheet.appendRow([
    Utilities.formatDate(new Date(), 'Africa/Lagos', 'dd/MM/yyyy HH:mm:ss'),
    data.name      || '',
    data.phone     || '',
    data.community || '',
    data.subject   || '',
    data.message   || ''
  ]);
}

function sendEmailNotification(data) {
  var subject = 'New Message via MFA Website — ' + (data.subject || 'No Subject');

  var body =
    'You have received a new message from the MFA Ambassadors website.\n\n' +
    '──────────────────────────────\n' +
    'Name:           ' + (data.name      || 'N/A') + '\n' +
    'WhatsApp:       ' + (data.phone     || 'N/A') + '\n' +
    'Community/Ward: ' + (data.community || 'N/A') + '\n' +
    'Subject:        ' + (data.subject   || 'N/A') + '\n' +
    '──────────────────────────────\n\n' +
    'MESSAGE:\n' + (data.message || '') + '\n\n' +
    '──────────────────────────────\n' +
    'Sent: ' + Utilities.formatDate(new Date(), 'Africa/Lagos', 'dd MMMM yyyy, HH:mm') + ' (Lagos time)\n' +
    'MFA Ambassadors Website — Ibeju-Lekki Constituency I';

  GmailApp.sendEmail(NOTIFY_EMAIL, subject, body);
}

function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected: ' + ss.getName());
  Logger.log('Email will be sent to: ' + NOTIFY_EMAIL);
}
