import React from "react";
import { useParams } from "react-router-dom";
import { useFetch } from "../../../hooks/useFetch";
import { AlatBeratData } from "../../../types/alatBerat";
import { formatDate } from "../../../utils/dateUtils";

const FormDisableAlatBerat: React.FC = () => {
  const { no_registrasi } = useParams<{ no_registrasi: string }>();
  const { data, loading } = useFetch<AlatBeratData>("/api/alatberat");

  const alatberat = data.find((d) => d.no_registrasi === no_registrasi);

  if (loading) {
    return (
      <div className="p-6 text-gray-500 dark:text-gray-300">
        Memuat data alat berat...
      </div>
    );
  }

  if (!alatberat) {
    return (
      <div className="p-6 text-red-500 dark:text-red-400">
        Data alat berat tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-6 bg-white rounded shadow dark:bg-white/[0.03]">
      <form className="flex flex-col gap-6 w-full text-theme-xs font-medium text-gray-600 dark:text-gray-300">
        <InputField label="Kode Barang" value={alatberat.kode_barang} />
        <InputField label="Merek" value={alatberat.merek} />
        <InputField label="Nomor Registrasi" value={alatberat.no_registrasi} />
        <InputField label="Nomor Mesin" value={alatberat.no_mesin} />
        <InputField label="Nomor Rangka" value={alatberat.no_rangka} />
        <InputField label="Warna" value={alatberat.warna} />
        <InputField
          label="Harga Pembelian"
          value={
            alatberat.harga_pembelian
              ? `Rp ${alatberat.harga_pembelian.toLocaleString("id-ID")}`
              : "-"
          }
        />
        <InputField
          label="Tahun Pembuatan"
          value={alatberat.tahun_pembuatan?.toString() ?? "-"}
        />
        <InputField label="Kategori" value={alatberat.kategori} />
        <InputField label="Pajak" value={formatDate(alatberat.pajak)} />
        <InputField label="Penggunaan" value={alatberat.penggunaan} />
        <InputField label="Kondisi" value={alatberat.kondisi} />
      </form>
    </div>
  );
};

export default FormDisableAlatBerat;

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
