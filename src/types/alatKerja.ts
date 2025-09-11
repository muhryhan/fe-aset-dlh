export interface AlatKerjaData {
  id_alatkerja: number;
  qrcode: string;
  gambar: string;
  kode_barang: string;
  nama_barang: string;
  merek: string;
  no_registrasi: string;
  no_serial: string;
  asal: string;
  tahun_pembelian: number;
  harga_pembelian: number;
  kondisi: string;
  pemegang: string;
  keterangan: string;
  [key: string]: unknown;
}
