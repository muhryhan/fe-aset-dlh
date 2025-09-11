import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import FileInput from "../input/FileInput";
import Select from "../../form/Select";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";
import { CalenderIcon } from "../../../icons";
import {
  createInputHandler,
  createSelectHandler,
  createFileHandler,
  createDateHandler,
} from "../../../utils/formHandler";
import { formatNumberWithDots } from "../../../utils/dotsUtils";
import { useForm } from "../../../hooks/useForm";
import { TanahData } from "../../../types/tanah";

const catBarang = [
  { label: "Tanah TPU", value: "Tanah TPU" },
  { label: "Tanah Bangunan Kantor", value: "Tanah Bangunan Kantor" },
  { label: "Tanah Taman", value: "Tanah Taman" },
  {
    label: "Tanah Bangunan Laboratorium",
    value: "Tanah Bangunan Laboratorium",
  },
  { label: "Tanah Kosong", value: "Tanah Kosong" },
  { label: "Tanah TPA", value: "Tanah TPA" },
];

const status = [
  { label: "Sudah", value: "Sudah" },
  { label: "Belum", value: "Belum" },
];

type Props = {
  initialData?: Partial<TanahData>;
  onSuccess?: () => void;
};

export default function TanahFormInput({ initialData, onSuccess }: Props) {
  const emptyTanah: TanahData = {
    id_tanah: 0,
    gambar: "",
    kode_barang:"",
    nama_barang: "",
    peruntukan: "",
    alamat: "",
    luas: 0,
    tahun_pengadaan: 0,
    hak: "",
    tanggal_sertifikat: "",
    nomor_sertifikat: "",
    status_sertifikat: "",
    asal: "",
    harga: 0,
  };

  const {
    formData,
    setFormData,
    alertMessage,
    setAlertMessage,
    handleSubmit,
    isEdit,
    reset,
  } = useForm<TanahData>({
    initialData,
    endpoint: "/api/tanah",
    requiredFields: [
      "gambar",
      "kode_barang",
      "nama_barang",
      "peruntukan",
      "alamat",
      "luas",
      "tahun_pengadaan",
      "hak",
      "tanggal_sertifikat",
      "nomor_sertifikat",
      "status_sertifikat",
      "asal",
      "harga",
    ],
    idKey: "id_tanah",
    onSuccess,
    emptyTemplate: emptyTanah,
  });

  const handleInputChange = createInputHandler(setFormData, {
    numberFields: ["luas", "tahun_pengadaan", "harga"],
  });
  const handleDateChange = createDateHandler(setFormData);
  const handleFileChange = createFileHandler(setFormData);
  const handleSelectChange = createSelectHandler(setFormData);

  return (
    <ComponentCard title="Masukkan Data Tanah">
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
          <Label htmlFor="gambar">Upload File</Label>
          <FileInput
            id_file="gambar"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>
        <div>
          <Label htmlFor="kode_barang">Kode Barang</Label>
          <Input
            id="kode_barang"
            value={formData.kode_barang}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="nama_barang">Nama Barang</Label>
          <Select
            value={formData.nama_barang}
            options={catBarang}
            placeholder="Nama barang"
            onChange={(value) => handleSelectChange("nama_barang", value)}
            className="w-full dark:bg-dark-900"
          />
        </div>
        <div>
          <Label htmlFor="peruntukan">Peruntukan</Label>
          <Input
            id="peruntukan"
            value={formData.peruntukan}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="alamat">Alamat</Label>
          <Input
            id="alamat"
            value={formData.alamat}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="luas">Luas (m²)</Label>
          <Input
            type="number"
            id="luas"
            value={formData.luas}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="tahun_pengadaan">Tahun Pengadaan</Label>
          <Input
            type="number"
            id="tahun_pengadaan"
            value={formData.tahun_pengadaan}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="hak">Hak</Label>
          <Input id="hak" value={formData.hak} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="tanggal_sertifikat">Tanggal Sertifikat</Label>
          <div className="relative w-full flatpickr-wrapper">
            <Flatpickr
              value={formData.tanggal_sertifikat}
              onChange={(dates) =>
                handleDateChange(dates, "tanggal_sertifikat")
              }
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
          <Label htmlFor="nomor_sertifikat">Nomor Sertifikat</Label>
          <Input
            id="nomor_sertifikat"
            value={formData.nomor_sertifikat}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="status_sertifikat">Status Sertifikat</Label>
          <Select
            value={formData.status_sertifikat}
            options={status}
            placeholder="Status Sertifikat"
            onChange={(value) => handleSelectChange("status_sertifikat", value)}
            className="w-full dark:bg-dark-900"
          />
        </div>
        <div>
          <Label htmlFor="asal">Asal</Label>
          <Input id="asal" value={formData.asal} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="harga">Harga</Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-white bg-transparent z-10">
              Rp
            </span>
            <Input
              type="text"
              id="harga"
              value={formatNumberWithDots(formData.harga?.toString() ?? "")}
              onChange={handleInputChange}
              inputMode="numeric"
              pattern="[0-9]*"
              className="pl-10 w-full"
            />
          </div>
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
