// import ExcelJS from "exceljs";
// import { saveAs } from "file-saver";
// import logo from "../icons/logo-kota-palu.png";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function handleExportExcel<T>(data: T[], filename: string) {
  // 1. Membuat data kop surat (dalam array of arrays)
  const headerRows = [
    ["", "", "PEMERINTAH KOTA PALU"],
    ["", "", "DINAS LINGKUNGAN HIDUP"],
    ["", "", "KOTA PALU"],
    [
      "",
      "",
      "Jl. Pipit, Tanamodindi, Kec. Palu Selatan, Kota Palu, Sulawesi Tengah 94111",
    ],
    [], // baris kosong sebagai pemisah
  ];

  // 2. Ubah data ke dalam format array of arrays (seperti PDF)
  const keys = Object.keys(data[0] || {});
  const tableHeader = keys;
  const tableRows = data.map((item) =>
    keys.map((key) => {
      const value = (item as Record<string, unknown>)[key];
      return value === null || value === undefined ? "-" : String(value);
    })
  );

  const fullData = [...headerRows, tableHeader, ...tableRows];

  // 3. Buat worksheet dari array of arrays
  const worksheet = XLSX.utils.aoa_to_sheet(fullData);

  // 4. Tambah workbook dan simpan
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, filename);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${filename}.xlsx`);
}
