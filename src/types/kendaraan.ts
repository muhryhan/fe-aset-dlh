  export interface KendaraanData {
    id_kendaraan: number;
    qrcode: string;
    gambar: string;
    kode_barang: string;
    merek: string;
    no_polisi: string;
    no_mesin: string;
    no_rangka: string;
    warna: string;
    harga_pembelian: number;
    tahun_pembuatan: number;
    kategori: string;
    pajak: string;
    pemegang: string;
    nik: number;
    penggunaan: string;
    kondisi: string;
    [key: string]: unknown;
  }
