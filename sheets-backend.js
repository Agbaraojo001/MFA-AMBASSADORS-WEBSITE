/**
 * MFA AMBASSADORS — GOOGLE APPS SCRIPT BACKEND
 * ─────────────────────────────────────────────
 * HOW TO SET THIS UP (one-time, takes ~5 minutes):
 *
 * 1. Go to: https://sheets.google.com
 *    Create a new spreadsheet. Name it "MFA Ambassador Registrations".
 *
 * 2. In that spreadsheet, click Extensions → Apps Script.
 *    Delete everything in the editor and paste ALL of this file's code.
 *
 * 3. Click Save (floppy disk icon). Name the project "MFA Reg Handler".
 *
 * 4. Click Deploy → New deployment.
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    Click Deploy. Authorise when prompted (click your Google account,
 *    then "Allow").
 *
 * 5. Copy the Web App URL that appears. It looks like:
 *    https://script.google.com/macros/s/AKfy.../exec
 *
 * 6. Open join.html in this project.
 *    Find this line near the bottom:
 *      var SCRIPT_URL = 'YOUR_SCRIPT_URL_HERE';
 *    Replace 'YOUR_SCRIPT_URL_HERE' with the URL you just copied.
 *    Save join.html and redeploy the website.
 *
 * That's it. Every registration will now appear as a new row
 * in your Google Sheet automatically.
 * ─────────────────────────────────────────────
 */

var SHEET_NAME = 'Registrations';

var HEADERS = [
  'Timestamp (Lagos)',
  'Reg Code',
  'Surname',
  'Other Names',
  'Full Name',
  'WhatsApp',
  'Ward',
  'Area of Residence',
  'VIN No.',
  'Occupation',
  'Address'
];

function doPost(e) {
  try {
    var ss   = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(SHEET_NAME);

    // Create the sheet + headers on first use
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME);
    }
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(HEADERS);
      var headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#0d3980');
      headerRange.setFontColor('#ffffff');
      sheet.setFrozenRows(1);
      sheet.setColumnWidth(1, 180);  // Timestamp
      sheet.setColumnWidth(2, 140);  // Reg Code
      sheet.setColumnWidth(5, 200);  // Full Name
      sheet.setColumnWidth(6, 130);  // WhatsApp
    }

    var data = JSON.parse(e.postData.contents);

    var timestamp = Utilities.formatDate(
      new Date(),
      'Africa/Lagos',
      'dd/MM/yyyy HH:mm:ss'
    );

    sheet.appendRow([
      timestamp,
      data.code        || '',
      data.surname     || '',
      data.otherNames  || '',
      (data.otherNames + ' ' + data.surname).trim(),
      data.whatsapp    || '',
      data.ward        || '',
      data.area        || '',
      data.vin         || 'N/A',
      data.occupation  || '',
      data.address     || ''
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

// Optional: run this manually to test the sheet setup
function testSetup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  Logger.log('Connected to: ' + ss.getName());
  Logger.log('Sheets: ' + ss.getSheets().map(function(s){ return s.getName(); }));
}
