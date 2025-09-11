import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { TanahData } from "../../../types/tanah";
import { formatDate } from "../../../utils/dateUtils";

const FormDisableTanah: React.FC = () => {
  const { id_tanah } = useParams<{ id_tanah: string }>();
  const { data, loading } = useFetch<TanahData>("/api/tanah");

  const tanah = data.find((d) => d.id_tanah === Number(id_tanah));

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Memuat data tanah...
      </div>
    );
  }

  if (!tanah) {
    return (
      <div className="p-6 text-red-500 dark:text-red-400">
        Data tanah tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow dark:bg-white/[0.03]">
      <form className="flex flex-col gap-6 w-full text-theme-xs font-medium text-gray-600 dark:text-gray-300">
        <InputField label="Kode Barang" value={tanah.kode_barang} />
        <InputField label="Nama Barang" value={tanah.nama_barang} />
        <InputField label="Peruntukan" value={tanah.peruntukan} />
        <InputField label="Alamat" value={tanah.alamat} />
        <InputField label="Luas" value={tanah.luas?.toString() ?? "-"} />
        <InputField
          label="Tahun Pengadaan"
          value={tanah.tahun_pengadaan?.toString() ?? "-"}
        />
        <InputField label="Hak" value={tanah.hak} />
        <InputField
          label="Tanggal Sertifikat"
          value={formatDate(tanah.tanggal_sertifikat)}
        />
        <InputField label="Nomor Sertifikat" value={tanah.nomor_sertifikat} />
        <InputField label="Status Sertifikat" value={tanah.status_sertifikat} />
        <InputField label="Asal" value={tanah.asal} />
        <InputField label="Harga" value={tanah.harga?.toString() ?? "-"} />
      </form>
    </div>
  );
};

export default FormDisableTanah;

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
