// Paste this entire file into your Google Apps Script editor.
// Sheet tab must be named exactly: TripPlan

function doGet() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TripPlan');
  if (!sheet) return json({ error: "Sheet 'TripPlan' not found" });

  const values = sheet.getDataRange().getValues();
  if (values.length <= 1) return json([]);

  const headers = values[0];
  const rows = values.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] !== undefined ? String(row[i]) : ''; });
    return obj;
  });

  return json(rows);
}

function doPost(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('TripPlan');
  if (!sheet) return json({ error: "Sheet 'TripPlan' not found" });

  let data;
  try { data = JSON.parse(e.postData.contents); }
  catch { return json({ error: 'Invalid JSON' }); }

  sheet.clearContents();
  sheet.appendRow(['id', 'date', 'city', 'activity', 'time', 'notes', 'status']);

  data.forEach(item => {
    sheet.appendRow([
      item.id       || '',
      item.date     || '',
      item.city     || '',
      item.activity || '',
      item.time     || '',
      item.notes    || '',
      item.status   || 'idea',
    ]);
  });

  return json({ success: true });
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
