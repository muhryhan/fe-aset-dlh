import { useState } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";

import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { CalenderIcon } from "../../../../icons";

import api from "../../../../services/api";
import { TanamanMasukData } from "../../../../types/tanamanMasuk";
import { formatDate } from "../../../../utils/dateUtils";
import {
  createInputHandler,
  createDateHandler,
} from "../../../../utils/formHandler";

type Props = {
  onSuccess?: () => void;
  id_tanaman?: string;
  initialData?: Partial<TanamanMasukData>;
};

export default function TanamanMasukForm({
  onSuccess,
  initialData,
  id_tanaman,
}: Props) {
  const [alertMessage, setAlertMessage] = useState<{
    variant: "success" | "warning" | "error" | "info";
    title?: string;
    message: string;
  } | null>(null);

  const isEdit = !!initialData?.id_tanamanmasuk;

  const [formData, setFormData] = useState<Partial<TanamanMasukData>>({
    id_tanaman:
      initialData?.id_tanaman ??
      (id_tanaman ? parseInt(id_tanaman) : undefined),
    tanggal: formatDate(initialData?.tanggal) ?? "",
    jumlah: initialData?.jumlah ?? 0,
    keterangan: initialData?.keterangan ?? "",
  });

  const handleInputChange = createInputHandler(setFormData, {
    numberFields: ["jumlah"],
  });

  const handleDateChange = createDateHandler(setFormData);

  const requiredFields = ["tanggal", "jumlah", "keterangan"];

  const handleSubmit = async () => {
    setAlertMessage(null);

    // Validasi manual
    for (const field of requiredFields) {
      const val = formData[field as keyof TanamanMasukData];
      if (!val || val === "") {
        setAlertMessage({
          variant: "warning",
          title: "Validasi Gagal",
          message: `Field '${field}' wajib diisi.`,
        });
        return;
      }
    }

    try {
      const payload = {
        ...formData,
        id_tanaman:
          formData.id_tanaman ??
          (id_tanaman ? parseInt(id_tanaman) : undefined),
        jumlah:
          typeof formData.jumlah === "string"
            ? parseInt(formData.jumlah)
            : formData.jumlah,
      };

      const endpoint = "/api/tanamanmasuk";
      const response = isEdit
        ? await api.put(`${endpoint}/${initialData?.id_tanamanmasuk}`, payload)
        : await api.post(endpoint, payload);

      if (![200, 201].includes(response.status)) throw new Error();

      setAlertMessage({
        variant: "success",
        title: "Berhasil",
        message: response.data?.message ?? "Data berhasil disimpan.",
      });

      setTimeout(() => {
        reset();
        onSuccess?.();
      }, 2000);
    } catch (error) {
      console.error("Gagal submit:", error);
      setAlertMessage({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  const reset = () => {
    setFormData({
      id_tanaman: id_tanaman ? parseInt(id_tanaman) : undefined,
      tanggal: "",
      jumlah: 0,
      keterangan: "",
    });
    setAlertMessage(null);
  };

  return (
    <ComponentCard title="Form Input Tanaman Masuk">
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
          <Label htmlFor="id_tanaman">Id</Label>
          <Input
            id="id_tanaman"
            value={formData.id_tanaman?.toString() ?? ""}
            disabled
          />
        </div>
        <div>
          <Label htmlFor="tanggal">Tanggal Masuk</Label>
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
          <Label htmlFor="jumlah">Jumlah</Label>
          <Input
            type="number"
            id="jumlah"
            value={formData.jumlah?.toString() ?? ""}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Input
            id="keterangan"
            value={formData.keterangan ?? ""}
            onChange={handleInputChange}
          />
        </div>
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
