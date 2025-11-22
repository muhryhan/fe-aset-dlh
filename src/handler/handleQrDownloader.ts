export interface QRLabel {
  label: string;
  value: string;
}

export interface QROptions {
  imageUrl: string; // URL ke gambar QR
  fileName?: string; // Nama file download
  labels?: QRLabel[]; // Label dan nilai teks
  width?: number;
  height?: number;
  qrSize?: number;
}

export const downloadQR = async (options: QROptions) => {
  const {
    imageUrl,
    fileName = "qr_code",
    labels = [],
    width = 500,
    height = 200,
    qrSize = 180,
  } = options;

  try {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      canvas.width = width;
      canvas.height = height;

      // Latar belakang putih
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, width, height);

      // Gambar QR di sisi kiri
      ctx.drawImage(img, 20, 10, qrSize, qrSize);

      // Tambahkan label
      ctx.fillStyle = "#000";
      let yPos = 60; // posisi awal teks
      labels.forEach(({ label, value }) => {
        ctx.font = "bold 20px Arial";
        ctx.fillText(`${label}:`, 230, yPos);
        ctx.font = "18px Arial";
        ctx.fillText(value || "-", 230, yPos + 25);
        yPos += 60; // jarak antar label
      });

      // Konversi ke file gambar dan unduh
      const link = document.createElement("a");
      link.download = `${fileName}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
  } catch (err) {
    console.error("Gagal membuat template QR:", err);
  }
};
