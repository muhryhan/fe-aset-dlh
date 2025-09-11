import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { AcData } from "../../../types/ac";

const FormDisableAc: React.FC = () => {
  const { no_registrasi } = useParams<{ no_registrasi: string }>();
  const { data, loading } = useFetch<AcData>("/api/ac");

  const ac = data.find((d) => d.no_registrasi === no_registrasi);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Memuat data ac...
      </div>
    );
  }

  if (!ac) {
    return (
      <div className="p-6 text-red-500 dark:text-red-400">
        Data ac tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow dark:bg-white/[0.03]">
      <form className="flex flex-col gap-6 w-full text-theme-xs font-medium text-gray-600 dark:text-gray-300">
        <InputField label="Kode Barang" value={ac.kode_barang} />
        <InputField label="Nama Barang" value={ac.nama_barang} />
        <InputField label="Merek" value={ac.merek} />
        <InputField label="Nomor Registrasi" value={ac.no_registrasi} />
        <InputField label="Nomor Serial" value={ac.no_serial} />
        <InputField label="Ukuran" value={ac.ukuran} />
        <InputField label="Ruangan" value={ac.ruangan} />
        <InputField label="Asal" value={ac.asal} />
        <InputField
          label="Tahun Pembelian"
          value={ac.tahun_pembelian?.toString() ?? "-"}
        />
        <InputField
          label="Harga Pembelian"
          value={
            ac.harga_pembelian
              ? `Rp ${ac.harga_pembelian.toLocaleString("id-ID")}`
              : "-"
          }
        />
        <InputField label="Kondisi" value={ac.kondisi} />
        <InputField label="Keterangan" value={ac.keterangan} />
      </form>
    </div>
  );
};

export default FormDisableAc;

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
