export interface AcData {
  id_ac: number;
  qrcode: string;
  gambar: string;
  kode_barang: string;
  nama_barang: string;
  merek: string;
  no_registrasi: string;
  no_serial: string;
  ukuran: string;
  ruangan: string;
  asal: string;
  tahun_pembelian: number;
  harga_pembelian: number;
  kondisi: string;
  keterangan: string;
  [key: string]: unknown;
}
