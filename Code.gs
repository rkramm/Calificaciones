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
      // Para 'historicos', preservar el orden de columnas esperado por la hoja
      let headers;
      if (tableName === 'historicos') {
        headers = ['PROVINCIA','PROGRAMA','ENTIDAD','CALIFICADOR','AÑO','1.1','1.2','1.3','1.4','1.5','1.6','1.7','1.8','1.9','2.1','2.2','2.3','2.4','2.5','2.6','2.7','2.8','2.9','3.1','3.2','3.3','3.4','3.5','3.6','3.7','4.1','4.2','4.3','4.4','4.5','4.6','4.7','4.8','4.9','4.10','5.1','5.2','5.3','5.4','5.5','5.6','5.7','6.1','6.2','6.3','6.4','6.5','6.6','6.7','6.8','6.9'];
      } else {
        headers = Object.keys(dataArray[0]);
      }
      
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