import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import FileInput from "../input/FileInput";
import Select from "../Select";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";
import { CalenderIcon } from "../../../icons";
import {
  createInputHandler,
  createSelectHandler,
  createFileHandler,
  createDateHandler,
} from "../../../utils/formHandler";
import { useForm } from "../../../hooks/useForm";
import { formatNumberWithDots } from "../../../utils/dotsUtils";
import { AlatBeratData } from "../../../types/alatBerat";

const kondisi = [
  { label: "Baik", value: "Baik" },
  { label: "Rusak Ringan", value: "Rusak Ringan" },
  { label: "Rusak Berat", value: "Rusak Berat" },
];

type Props = {
  initialData?: Partial<AlatBeratData>;
  onSuccess?: () => void;
};

export default function AlatBeratFormInput({ initialData, onSuccess }: Props) {
  const emptyAlatBerat: AlatBeratData = {
    id_alatberat: 0,
    qrcode: "",
    gambar: "",
    merek: "",
    no_registrasi: "",
    no_mesin: "",
    no_rangka: "",
    warna: "",
    harga_pembelian: 0,
    tahun_pembuatan: 0,
    kategori: "",
    pajak: "",
    penggunaan: "",
    kondisi: "",
  };

  const {
    formData,
    setFormData,
    alertMessage,
    setAlertMessage,
    handleSubmit,
    isEdit,
    reset,
  } = useForm<AlatBeratData>({
    initialData,
    endpoint: "/api/alatberat",
    requiredFields: [
      "gambar",
      "merek",
      "no_registrasi",
      "no_mesin",
      "no_rangka",
      "warna",
      "harga_pembelian",
      "tahun_pembuatan",
      "kategori",
      "pajak",
      "penggunaan",
      "kondisi",
    ],
    idKey: "id_alatberat",
    onSuccess,
    emptyTemplate: emptyAlatBerat,
  });

  const handleInputChange = createInputHandler(setFormData, {
    upperCaseFields: ["no_registrasi", "no_mesin", "no_rangka"],
    numberFields: ["harga_pembelian", "tahun_pembuatan"],
  });

  const handleSelectChange = createSelectHandler(setFormData);
  const handleDateChange = createDateHandler(setFormData);
  const handleFileChange = createFileHandler(setFormData);

  return (
    <ComponentCard title="Masukkan Data Alat Berat">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 w-full">
        {alertMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2 z-99">
            <Alert
              variant={alertMessage.variant}
              title={alertMessage.title}
              message={alertMessage.message}
              autoClose
              duration={2000}
              onClose={() => setAlertMessage(null)}
            />
          </div>
        )}
        <div>
          <Label htmlFor="gambar">Upload file</Label>
          <FileInput
            id_file="gambar"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="merek">Merek</Label>
          <Input
            id="merek"
            value={formData.merek}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="no_registrasi">Nomor Registrasi</Label>
          <Input
            id="no_registrasi"
            value={formData.no_registrasi}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="no_mesin">Nomor Mesin</Label>
          <Input
            id="no_mesin"
            value={formData.no_mesin}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="no_rangka">Nomor Rangka</Label>
          <Input
            id="no_rangka"
            value={formData.no_rangka}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="warna">Warna</Label>
          <Input
            id="warna"
            value={formData.warna}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="harga_pembelian">Harga Pembelian</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white bg-transparent z-10">
              Rp
            </span>
            <Input
              type="text"
              id="harga_pembelian"
              value={formatNumberWithDots(
                formData.harga_pembelian?.toString() ?? ""
              )}
              onChange={handleInputChange}
              inputMode="numeric"
              pattern="[0-9]*"
              className="pl-10 w-full"
            />
          </div>
        </div>
        <div>
          <Label htmlFor="tahun_pembuatan">Tahun Pembuatan</Label>
          <Input
            type="number"
            id="tahun_pembuatan"
            value={formData.tahun_pembuatan?.toString() ?? ""}
            onChange={handleInputChange}
            inputMode="numeric"
          />
        </div>
        <div>
          <Label htmlFor="kategori">Kategori</Label>
          <Input
            type="text"
            id="kategori"
            value={formData.kategori}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="pajak">Pajak</Label>
          <div className="relative w-full flatpickr-wrapper">
            <Flatpickr
              value={formData.pajak}
              onChange={(dates) => handleDateChange(dates, "pajak")}
              options={{ dateFormat: "Y-m-d" }}
              className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs
                bg-white text-gray-800 placeholder:text-gray-400 border-gray-300
                focus:border-brand-300 focus:ring-brand-500/20
                dark:bg-gray-900 dark:text-white dark:placeholder:text-white/40
                dark:border-gray-700 dark:focus:border-brand-800"
              placeholder="Pilih tanggal"
            />
            <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-white">
              <CalenderIcon className="size-6" />
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="penggunaan">Penggunaan</Label>
          <Input
            id="penggunaan"
            value={formData.penggunaan}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="kondisi">Kondisi</Label>
          <Select
            value={formData.kondisi}
            options={kondisi}
            placeholder="Kondisi alat berat"
            onChange={(value) => handleSelectChange("kondisi", value)}
          />
        </div>
        <div className="col-span-full flex justify-end space-x-4">
          <Button
            size="md"
            variant={isEdit ? "warning" : "primary"}
            onClick={handleSubmit}
          >
            {isEdit ? "Update" : "Submit"}
          </Button>
          <Button size="md" variant="outline" onClick={reset}>
            Reset
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
