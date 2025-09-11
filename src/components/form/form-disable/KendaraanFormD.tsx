import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { KendaraanData } from "../../../types/kendaraan";
import { formatDate } from "../../../utils/dateUtils";

const FormDisableKendaraan: React.FC = () => {
  const { no_polisi } = useParams<{ no_polisi: string }>();
  const { data, loading } = useFetch<KendaraanData>("/api/kendaraan");

  const kendaraan = data.find((d) => d.no_polisi === no_polisi);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Memuat data kendaraan...
      </div>
    );
  }

  if (!kendaraan) {
    return (
      <div className="p-6 text-red-500 dark:text-red-400">
        Data kendaraan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow dark:bg-white/[0.03]">
      <form className="flex flex-col gap-6 w-full text-theme-xs font-medium text-gray-600 dark:text-gray-300">
        <InputField label="Kode Barang" value={kendaraan.kode_barang} />
        <InputField label="Merek" value={kendaraan.merek} />
        <InputField label="Nomor Polisi" value={kendaraan.no_polisi} />
        <InputField label="Nomor Mesin" value={kendaraan.no_mesin} />
        <InputField label="Nomor Rangka" value={kendaraan.no_rangka} />
        <InputField label="Warna" value={kendaraan.warna} />
        <InputField
          label="Harga Pembelian"
          value={
            kendaraan.harga_pembelian
              ? `Rp ${kendaraan.harga_pembelian.toLocaleString("id-ID")}`
              : "-"
          }
        />
        <InputField
          label="Tahun Pembuatan"
          value={kendaraan.tahun_pembuatan?.toString() ?? "-"}
        />
        <InputField label="Kategori" value={kendaraan.kategori} />
        <InputField label="Pajak" value={formatDate(kendaraan.pajak)} />
        <InputField label="Pemegang" value={kendaraan.pemegang} />
        <InputField label="NIK" value={kendaraan.nik?.toString() ?? "-"} />
        <InputField label="Penggunaan" value={kendaraan.penggunaan} />
        <InputField label="Kondisi" value={kendaraan.kondisi} />
      </form>
    </div>
  );
};

export default FormDisableKendaraan;

// Komponen input field
type InputFieldProps = {
  label: string;
  value?: string;
};

const InputField: React.FC<InputFieldProps> = ({ label, value }) => (
  <div className="w-full">
    <label className="block text-sm font-medium text-gray-700 dark:text-white mb-1">
      {label}
    </label>
    <input
      type="text"
      value={value || "-"}
      disabled
      readOnly
      className="w-full border border-gray-300 rounded-md shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-3 py-2 cursor-not-allowed"
    />
  </div>
);
