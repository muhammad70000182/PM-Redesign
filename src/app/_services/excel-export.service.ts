
// ../../services/excel-export.service.ts

import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelExportService {

  constructor() { }

  exportToExcel(data: any[], fileName: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
  exportToExcelColumns(data: any[], fileName: string, columns: string[]): void {
    // Filter data to include only specified columns
    const filteredData = data.map(row => {
      let filteredRow: { [key: string]: any } = {};
      columns.forEach(column => {
        filteredRow[column] = row[column];
      });
      return filteredRow;
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(filteredData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    XLSX.writeFile(wb, `${fileName}.xlsx`);
  }
}
