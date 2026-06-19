/**
 * MFA AMBASSADORS — REGISTRATION BACKEND (Google Apps Script)
 * ─────────────────────────────────────────────────────────────
 * Handles ONLY Ambassador registrations from join.html.
 * The contact form uses a completely separate script (contact-backend.js).
 *
 * HOW TO SET THIS UP (one-time, ~5 minutes):
 *
 * 1. Go to https://sheets.google.com
 *    Create a spreadsheet named "MFA Ambassador Registrations".
 *
 * 2. Click Extensions → Apps Script.
 *    Delete everything and paste ALL of this file's code.
 *
 * 3. Click Save. Name the project "MFA Registration Handler".
 *
 * 4. Click Deploy → New deployment.
 *      Type:           Web app
 *      Execute as:     Me
 *      Who has access: Anyone
 *    Click Deploy and Authorise when prompted.
 *
 * 5. Copy the Web App URL (https://script.google.com/macros/s/…/exec)
 *
 * 6. Open join.html → find:
 *      var SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
 *    Replace with your URL. Save and redeploy to Vercel.
 * ─────────────────────────────────────────────────────────────
 */

function doPost(e) {
  try {
    var ss    = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Registrations') || ss.insertSheet('Registrations');

    if (sheet.getLastRow() === 0) {
      var headers = [
        'Timestamp (Lagos)', 'Membership ID', 'Surname', 'Other Names', 'Full Name',
        'WhatsApp', 'Ward', 'Area of Residence', 'VIN No.', 'Occupation', 'Address'
      ];
      sheet.appendRow(headers);
      var r = sheet.getRange(1, 1, 1, headers.length);
      r.setFontWeight('bold');
      r.setBackground('#0d3980');
      r.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 180);
      sheet.setColumnWidth(2, 140);
      sheet.setColumnWidth(5, 200);
      sheet.setColumnWidth(6, 130);
    }

    var data = JSON.parse(e.postData.contents);

    sheet.appendRow([
      Utilities.formatDate(new Date(), 'Africa/Lagos', 'dd/MM/yyyy HH:mm:ss'),
      data.code       || '',
      data.surname    || '',
      data.otherNames || '',
      ((data.otherNames || '') + ' ' + (data.surname || '')).trim(),
      data.whatsapp   || '',
      data.ward       || '',
      data.area       || '',
      data.vin        || 'N/A',
      data.occupation || '',
      data.address    || ''
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected: ' + ss.getName());
}
