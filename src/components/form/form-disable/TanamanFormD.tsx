import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { TanamanData } from "../../../types/tanaman";

const FormDisableTanaman: React.FC = () => {
  const { id_tanaman } = useParams<{ id_tanaman: string }>();
  const { data, loading } = useFetch<TanamanData>("/api/tanaman");

  const tanaman = data.find((d) => d.id_tanaman === Number(id_tanaman));

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Memuat data tanaman...
      </div>
    );
  }

  if (!tanaman) {
    return (
      <div className="p-6 text-red-500 dark:text-red-400">
        Data tanaman tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow dark:bg-white/[0.03]">
      <form className="flex flex-col gap-6 w-full text-theme-xs font-medium text-gray-600 dark:text-gray-300">
        <InputField label="Kode Barang" value={tanaman.kode_barang} />
        <InputField label="Nama" value={tanaman.nama} />
        <InputField label="Jenis" value={tanaman.jenis} />
        <InputField label="Stok" value={tanaman.stok?.toString() ?? "-"} />
        <InputField label="Keterangan" value={tanaman.keterangan} />
      </form>
    </div>
  );
};

export default FormDisableTanaman;

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
