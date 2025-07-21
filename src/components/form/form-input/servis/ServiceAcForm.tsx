import { useState, useEffect, useMemo } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import FileInput from "../../input/FileInput";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { CalenderIcon } from "../../../../icons";

import { ServisData, OnderdilItem } from "../../../../types/service";
import { useForm } from "../../../../hooks/useForm";
import {
  createInputHandler,
  createFileHandler,
  createDateHandler,
} from "../../../../utils/formHandler";
import { formatNumberWithDots } from "../../../../utils/dotsUtils";

type Props = {
  onSuccess?: () => void;
  no_registrasi?: string;
  initialData?: Partial<ServisData>;
};

export default function ServiceAcForm({
  onSuccess,
  initialData,
  no_registrasi,
}: Props) {
  const [onderdilList, setOnderdilList] = useState<OnderdilItem[]>([]);
  const additionalPayload = useMemo(
    () => ({
      onderdil: onderdilList.map((item) => ({
        nama_onderdil: item.isBerkala
          ? item.nama_onderdil.toLowerCase().replace(/\s+/g, "_")
          : item.nama_onderdil,
        jumlah: parseInt(item.jumlah),
        harga: parseInt(item.harga),
        isBerkala: item.isBerkala ?? false,
      })),
    }),
    [onderdilList]
  );

  const {
    formData,
    setFormData,
    handleSubmit,
    alertMessage,
    setAlertMessage,
    isEdit,
    reset,
  } = useForm<ServisData>({
    initialData,
    endpoint: "/api/servis",
    requiredFields: ["tanggal", "nama_bengkel", "biaya_servis"],
    idKey: "id_servis",
    onSuccess,
    additionalPayload,
  });

  const handleInputChange = createInputHandler(setFormData, {
    numberFields: ["biaya_servis"],
  });

  const handleFileChange = createFileHandler(setFormData);
  const handleDateChange = createDateHandler(setFormData);

  useEffect(() => {
    if (initialData?.onderdil) {
      setOnderdilList(
        initialData.onderdil.map((item) => ({
          nama_onderdil: item.nama_onderdil,
          jumlah: item.jumlah.toString(),
          harga: item.harga.toString(),
          isBerkala: ["cuci"].includes(item.nama_onderdil),
        }))
      );
    } else if (no_registrasi) {
      setFormData((prev) => ({
        ...prev,
        no_registrasi,
        no_unik: no_registrasi,
      }));
    }
  }, [initialData, no_registrasi, setFormData]);

  const addOnderdilBerkala = (nama: string) => {
    if (!onderdilList.some((o) => o.nama_onderdil === nama && o.isBerkala)) {
      setOnderdilList((prev) => [
        ...prev,
        { nama_onderdil: nama, jumlah: "1", harga: "0", isBerkala: true },
      ]);
    }
  };

  const addEmptyCustomOnderdil = () => {
    setOnderdilList((prev) => [
      ...prev,
      { nama_onderdil: "", jumlah: "", harga: "" },
    ]);
  };

  const removeOnderdil = (index: number) => {
    setOnderdilList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleOnderdilChange = <
    K extends keyof Pick<OnderdilItem, "nama_onderdil" | "jumlah" | "harga">
  >(
    index: number,
    field: K,
    value: OnderdilItem[K]
  ) => {
    setOnderdilList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  return (
    <ComponentCard title="Form Input Servis Ac">
      {alertMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2 z-50">
          <Alert
            {...alertMessage}
            autoClose
            duration={2000}
            onClose={() => setAlertMessage(null)}
          />
        </div>
      )}
      <div className="space-y-6">
        <div>
          <Label htmlFor="no_unik">Nomor Registrasi</Label>
          <Input id="no_unik" value={formData.no_unik} disabled />
        </div>
        <div>
          <Label htmlFor="tanggal">Tanggal Servis</Label>
          <div className="relative">
            <Flatpickr
              value={formData.tanggal?.toString()}
              onChange={(dates) => handleDateChange(dates, "tanggal")}
              options={{ dateFormat: "Y-m-d" }}
              placeholder="Pilih tanggal"
              className="w-full rounded-lg bg-white text-gray-800 border-gray-300 dark:bg-gray-900 dark:text-white dark:border-gray-700"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              <CalenderIcon className="text-gray-500 dark:text-white size-5" />
            </span>
          </div>
        </div>
        <div>
          <Label htmlFor="nama_bengkel">Nama Bengkel</Label>
          <Input
            id="nama_bengkel"
            value={formData.nama_bengkel ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="biaya_servis">Biaya Servis</Label>
          <Input
            id="biaya_servis"
            type="text"
            value={formatNumberWithDots(
              formData.biaya_servis?.toString() ?? ""
            )}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="nota_pembayaran">Nota Pembayaran</Label>
          <FileInput id_file="nota_pembayaran" onChange={handleFileChange} />
        </div>
        <div>
          <Label htmlFor="dokumentasi">Dokumentasi</Label>
          <FileInput id_file="dokumentasi" onChange={handleFileChange} />
        </div>
        <div>
          <Label>Onderdil Servis</Label>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {["cuci"].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  className="form-checkbox"
                  checked={onderdilList.some(
                    (o) => o.nama_onderdil === item && o.isBerkala
                  )}
                  onChange={(e) =>
                    e.target.checked
                      ? addOnderdilBerkala(item)
                      : setOnderdilList((prev) =>
                          prev.filter(
                            (od) => !(od.nama_onderdil === item && od.isBerkala)
                          )
                        )
                  }
                />
                {item.replace(/_/g, " ")}
              </label>
            ))}
          </div>
        </div>
        <Button onClick={addEmptyCustomOnderdil} variant="primary">
          Tambah Onderdil Lainnya
        </Button>
        {onderdilList.map((item, index) => (
          <div
            key={index}
            className="border p-3 rounded-lg grid grid-cols-4 gap-4 items-center"
          >
            <div>
              <Label>Nama Onderdil</Label>
              <Input
                value={item.nama_onderdil}
                onChange={(e) =>
                  handleOnderdilChange(index, "nama_onderdil", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={item.jumlah}
                onChange={(e) =>
                  handleOnderdilChange(index, "jumlah", e.target.value)
                }
              />
            </div>
            <div>
              <Label>Harga</Label>
              <Input
                type="number"
                value={item.harga}
                onChange={(e) =>
                  handleOnderdilChange(index, "harga", e.target.value)
                }
              />
            </div>
            <Button onClick={() => removeOnderdil(index)} variant="danger">
              Hapus
            </Button>
          </div>
        ))}
        <div className="flex justify-end gap-4">
          <Button
            size="md"
            onClick={handleSubmit}
            variant={isEdit ? "warning" : "primary"}
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
