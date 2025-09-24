import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../../public/images/logo/logo-kota-palu.png";

export function handleExportPdf(
  headers: string[],
  rows: unknown[][],
  filename: string
) {
  const stringifiedRows: string[][] = rows.map((row) =>
    row.map((cell) =>
      cell === null || cell === undefined ? "-" : String(cell)
    )
  );

  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: "legal",
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 355.6 mm
  const centerX = pageWidth / 2; // 177.8 mm

  // === KOP SURAT ===
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("PEMERINTAH KOTA PALU", centerX, 14, { align: "center" });

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("DINAS LINGKUNGAN HIDUP", centerX, 20, { align: "center" });
  doc.text("KOTA PALU", centerX, 26, { align: "center" });

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.text(
    "Jl. Pipit, Tanamodindi, Kec. Palu Selatan, Kota Palu, Sulawesi Tengah 94111",
    centerX,
    30,
    { align: "center" }
  );
  doc.addImage(logo, "PNG", 15, 10, 18, 20); //img, format x, y, width, height

  // === Garis pembatas kop surat ===
  doc.setLineWidth(0.5);
  doc.line(15, 32, pageWidth - 15, 32);

  // === Tabel dimulai dari bawah garis kop surat ===
  autoTable(doc, {
    head: [headers],
    body: stringifiedRows,
    startY: 36, // mulai di bawah garis
    styles: { fontSize: 8 },
    headStyles: { fillColor: [100, 100, 255] },
  });

  doc.save(`${filename}.pdf`);
}
