import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import FileInput from "../input/FileInput";
import Select from "../Select";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";
import {
  createInputHandler,
  createSelectHandler,
  createFileHandler,
} from "../../../utils/formHandler";
import { useForm } from "../../../hooks/useForm";
import { formatNumberWithDots } from "../../../utils/dotsUtils";
import { AlatKerjaData } from "../../../types/alatKerja";

const kondisi = [
  { label: "Baik", value: "Baik" },
  { label: "Rusak Ringan", value: "Rusak Ringan" },
  { label: "Rusak Berat", value: "Rusak Berat" },
];

type Props = {
  initialData?: Partial<AlatKerjaData>;
  onSuccess?: () => void;
};

export default function AlatKerjaFormInput({ initialData, onSuccess }: Props) {
  const emptyAlatKerja: AlatKerjaData = {
    id_alatkerja: 0,
    qrcode: "",
    gambar: "",
    kode_barang: "",
    nama_barang: "",
    merek: "",
    no_registrasi: "",
    no_serial: "",
    asal: "",
    tahun_pembelian: 0,
    harga_pembelian: 0,
    kondisi: "",
    pemegang: "",
    keterangan: "",
  };

  const {
    formData,
    setFormData,
    alertMessage,
    setAlertMessage,
    handleSubmit,
    isEdit,
    reset,
  } = useForm<AlatKerjaData>({
    initialData,
    endpoint: "/api/alatkerja",
    requiredFields: [
      "gambar",
      "kode_barang",
      "nama_barang",
      "merek",
      "no_registrasi",
      "no_serial",
      "asal",
      "tahun_pembelian",
      "harga_pembelian",
      "kondisi",
      "pemegang",
      "keterangan",
    ],
    idKey: "id_alatkerja",
    onSuccess,
    emptyTemplate: emptyAlatKerja,
  });

  const handleInputChange = createInputHandler(setFormData, {
    upperCaseFields: ["no_registrasi", "no_serial"],
    numberFields: ["harga_pembelian", "tahun_pembelian"],
  });

  const handleSelectChange = createSelectHandler(setFormData);
  const handleFileChange = createFileHandler(setFormData);

  return (
    <ComponentCard title="Masukkan Data Alat Kerja">
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
          <Label htmlFor="kode_barang">Kode Barang</Label>
          <Input
            id="kode_barang"
            value={formData.kode_barang}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="nama_barang">Nama Barang</Label>
          <Input
            id="nama_barang"
            value={formData.nama_barang}
            onChange={handleInputChange}
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
          <Label htmlFor="no_serial">Nomor Serial</Label>
          <Input
            id="no_serial"
            value={formData.no_serial}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="asal">Asal</Label>
          <Input id="asal" value={formData.asal} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="tahun_pembelian">Tahun Pembelian</Label>
          <Input
            type="number"
            id="tahun_pembelian"
            value={formData.tahun_pembelian?.toString() ?? ""}
            onChange={handleInputChange}
            inputMode="numeric"
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
          <Label htmlFor="kondisi">Kondisi</Label>
          <Select
            value={formData.kondisi}
            options={kondisi}
            placeholder="Kondisi alat kerja"
            onChange={(value) => handleSelectChange("kondisi", value)}
          />
        </div>
        <div>
          <Label htmlFor="pemegang">Pemegang</Label>
          <Input
            id="pemegang"
            value={formData.pemegang}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Input
            id="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
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
