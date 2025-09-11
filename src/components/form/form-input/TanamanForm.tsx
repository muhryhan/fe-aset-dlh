import ComponentCard from "../../common/ComponentCard";
import Label from "../Label";
import Input from "../input/InputField";
import FileInput from "../input/FileInput";
import Button from "../../ui/button/Button";
import Alert from "../../ui/alert/Alert";
import {
  createInputHandler,
  createFileHandler,
} from "../../../utils/formHandler";
import { useForm } from "../../../hooks/useForm";
import { TanamanData } from "../../../types/tanaman";

type Props = {
  initialData?: Partial<TanamanData>;
  onSuccess?: () => void;
};

export default function TanamanFormInput({ initialData, onSuccess }: Props) {
  const emptyTanaman: TanamanData = {
    id_tanaman: 0,
    gambar: "",
    kode_barang: "",
    nama: "",
    jenis: "",
    stok: 0,
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
  } = useForm<TanamanData>({
    initialData,
    endpoint: "/api/tanaman",
    requiredFields: [
      "gambar",
      "kode_barang",
      "nama",
      "jenis",
      "stok",
      "keterangan",
    ],
    idKey: "id_tanaman",
    onSuccess,
    emptyTemplate: emptyTanaman,
  });

  const handleInputChange = createInputHandler(setFormData, {
    numberFields: ["stok"],
  });
  const handleFileChange = createFileHandler(setFormData);

  return (
    <ComponentCard title="Masukkan Data Tanaman">
      <div className="space-y-6 w-full">
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
          <Label htmlFor="nama">Nama</Label>
          <Input id="nama" value={formData.nama} onChange={handleInputChange} />
        </div>
        <div>
          <Label htmlFor="jenis">Jenis</Label>
          <Input
            id="jenis"
            value={formData.jenis}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="stok">Stok</Label>
          <Input
            type="number"
            id="stok"
            value={formData.stok}
            onChange={handleInputChange}
            inputMode="numeric"
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
        <div className="flex justify-end space-x-4">
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
