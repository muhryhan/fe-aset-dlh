export interface TanamanData {
  id_tanaman: number;
  gambar: string;
  kode_barang: string;
  nama: string;
  jenis: string;
  stok: number;
  keterangan: string;
  [key: string]: unknown;
}
