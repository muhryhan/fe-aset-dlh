export interface TanahData {
  id_tanah: number;
  gambar: string;
  nama_barang: string;
  peruntukan: string;
  alamat: string;
  luas: number;
  tahun_pengadaan: number;
  hak: string;
  tanggal_sertifikat: string;
  nomor_sertifikat: string;
  status_sertifikat: string;
  asal: string;
  harga: number;
  [key: string]: unknown;
}
