import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export function handleExportExcel(
  headers: string[],
  rows: unknown[][],
  filename: string
) {
  // --- 1. Konversi rows ke string[][]
  const stringifiedRows: string[][] = rows.map((row) =>
    row.map((cell) =>
      cell === null || cell === undefined ? "-" : String(cell)
    )
  );

  // --- 2. Buat worksheet kosong
  const worksheet: XLSX.WorkSheet = {};

  // === KOP SURAT ===
  // Merge kolom A sampai kolom terakhir (sesuai jumlah headers)
  const lastCol = String.fromCharCode(65 + headers.length - 1); // contoh: kalau 5 kolom -> "E"

  worksheet["!merges"] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }, // baris 1
    { s: { r: 1, c: 0 }, e: { r: 1, c: headers.length - 1 } }, // baris 2
    { s: { r: 2, c: 0 }, e: { r: 2, c: headers.length - 1 } }, // baris 3
    { s: { r: 3, c: 0 }, e: { r: 3, c: headers.length - 1 } }, // baris 4
  ];

  // Tambahkan teks kop surat
  const kop = [
    { v: "PEMERINTAH KOTA PALU", s: { font: { sz: 12, bold: true }, alignment: { horizontal: "center" } } },
    { v: "DINAS LINGKUNGAN HIDUP", s: { font: { sz: 14, bold: true }, alignment: { horizontal: "center" } } },
    { v: "KOTA PALU", s: { font: { sz: 14, bold: true }, alignment: { horizontal: "center" } } },
    { v: "Jl. Pipit, Tanamodindi, Kec. Palu Selatan, Kota Palu, Sulawesi Tengah 94111", s: { font: { sz: 8 }, alignment: { horizontal: "center" } } },
  ];

  kop.forEach((cell, i) => {
    const ref = `A${i + 1}`; // A1, A2, dst
    worksheet[ref] = cell;
  });

  // --- 3. Header tabel (mulai row ke-6, karena row 5 kosong)
  const headerRowIndex = 5;
  headers.forEach((h, i) => {
    const ref = XLSX.utils.encode_cell({ r: headerRowIndex, c: i });
    worksheet[ref] = {
      v: h,
      s: {
        font: { bold: true },
        alignment: { horizontal: "center" },
        border: {
          top: { style: "thin", color: { rgb: "000000" } },
          bottom: { style: "thin", color: { rgb: "000000" } },
          left: { style: "thin", color: { rgb: "000000" } },
          right: { style: "thin", color: { rgb: "000000" } },
        },
      },
    };
  });

  // --- 4. Data tabel
  stringifiedRows.forEach((row, rIdx) => {
    row.forEach((val, cIdx) => {
      const ref = XLSX.utils.encode_cell({ r: headerRowIndex + 1 + rIdx, c: cIdx });
      worksheet[ref] = {
        v: val,
        s: {
          alignment: { horizontal: "center" },
          border: {
            top: { style: "thin", color: { rgb: "000000" } },
            bottom: { style: "thin", color: { rgb: "000000" } },
            left: { style: "thin", color: { rgb: "000000" } },
            right: { style: "thin", color: { rgb: "000000" } },
          },
        },
      };
    });
  });

  // --- 5. Set range worksheet
  const totalRows = headerRowIndex + 1 + stringifiedRows.length;
  worksheet["!ref"] = `A1:${lastCol}${totalRows}`;

  // --- 6. Auto width kolom
  const colWidths = headers.map((_, i) => ({
    wch: Math.max(
      headers[i].length,
      ...stringifiedRows.map((r) => (r[i] ? r[i].length : 0))
    ) + 2,
  }));
  worksheet["!cols"] = colWidths;

  // --- 7. Buat workbook dan simpan
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  saveAs(blob, `${filename}.xlsx`);
}
