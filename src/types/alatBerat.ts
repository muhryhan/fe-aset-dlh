export interface AlatBeratData {
  id_alatberat: number;
  qrcode: string;
  gambar: string;
  kode_barang: string;
  merek: string;
  no_registrasi: string;
  no_mesin: string;
  no_rangka: string;
  warna: string;
  harga_pembelian: number;
  tahun_pembuatan: number;
  kategori: string;
  pajak: string;
  penggunaan: string;
  kondisi: string;
  [key: string]: unknown;
}
