const SPREADSHEET_ID = '1apPfP7Y3ancW166QGEvh07kESYjuV8sP-Wd14cnQjjo';

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    const tableName = payload.table;
    const dataArray = payload.data;
    
    // Conecta con el archivo usando el ID
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tableName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify({ success: false, error: "La pestaña " + tableName + " no existe." })).setMimeType(ContentService.MimeType.JSON);
    }
    
    // Borrar contenido antiguo (Como hacemos Sincronización Masiva, reemplaza todo)
    sheet.clearContents();
    
    if (dataArray && dataArray.length > 0) {
      const headers = Object.keys(dataArray[0]);
      
      // Armar matriz de datos asegurando el mismo orden de columnas
      const rows = dataArray.map(obj => headers.map(h => obj[h] !== undefined ? obj[h] : ""));
      
      // Escribir cabeceras en la fila 1
      sheet.appendRow(headers);
      
      // Escribir datos a partir de la fila 2
      sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    const tableName = e.parameter.table;
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(tableName);
    
    if (!sheet) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    // getDisplayValues trae el texto tal cual se ve en el Excel, previniendo errores de zonas horarias
    const values = sheet.getDataRange().getDisplayValues(); 
    if (values.length <= 1) {
      return ContentService.createTextOutput(JSON.stringify([])).setMimeType(ContentService.MimeType.JSON);
    }
    
    const headers = values[0];
    const data = [];
    
    for (let i = 1; i < values.length; i++) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = values[i][j];
      }
      data.push(obj);
    }
    
    return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
    
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: error.message })).setMimeType(ContentService.MimeType.JSON);
  }
}