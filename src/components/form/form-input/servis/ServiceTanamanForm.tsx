import { useState } from "react";
import "flatpickr/dist/themes/material_blue.css";

import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import FileInput from "../../input/FileInput";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";

import api from "../../../../services/api";

type Props = {
  onSuccess?: () => void;
};

export default function TanamanFormInput({ onSuccess }: Props) {
  // --- Alert Message State
  const [alertMessage, setAlertMessage] = useState<{
    variant: "success" | "warning" | "error" | "info";
    title?: string;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    gambar: null as File | null,
    nama: "",
    jenis: "",
    stok: "",
    keterangan: "",
  });

  // --- Input Handlers
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, gambar: file }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const resetForm = () => {
    setFormData({
      gambar: null,
      nama: "",
      jenis: "",
      stok: "",
      keterangan: "",
    });
  };

  const handleSubmit = async () => {
    setAlertMessage(null);
    const requiredFields = ["nama", "jenis", "stok", "keterangan"];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData]?.toString().trim()) {
        setAlertMessage({
          variant: "warning",
          title: "Validasi Gagal",
          message: `Field ${field.replace("_", " ")} tidak boleh kosong`,
        });
        return;
      }
    }

    if (!formData.gambar) {
      setAlertMessage({
        variant: "warning",
        title: "Validasi Gagal",
        message: "Gambar tumbuhan wajib diunggah.",
      });
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null && value !== "") {
        if (key === "gambar" && value instanceof File) {
          data.append(key, value);
        } else if (typeof value === "string") {
          data.append(key, value);
        }
      }
    });

    try {
      const response = await api.post("/api/tanaman", data);
      if (response.status !== 201) throw new Error("Gagal menyimpan data");

      setAlertMessage({
        variant: "success",
        title: "Berhasil",
        message: response.data.message || "Data berhasil disimpan.",
      });

      setTimeout(() => {
        resetForm();
        onSuccess?.();
        setAlertMessage(null);
      }, 3000);
    } catch (err) {
      console.error("Error saat submit:", err);
      setAlertMessage({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  return (
    <ComponentCard title="Masukkan Data Tumbuhan">
      <div className="space-y-6 w-full">
        {alertMessage && (
          <div className="mb-4">
            <Alert
              variant={alertMessage.variant}
              title={alertMessage.title}
              message={alertMessage.message}
              autoClose
              duration={3000}
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
          <Label htmlFor="nama">Nama</Label>
          <Input
            type="text"
            id="nama"
            value={formData.nama}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="jenis">Jenis</Label>
          <Input
            type="text"
            id="jenis"
            value={formData.jenis}
            onChange={handleInputChange}
            className="w-full"
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
            pattern="[0-9]*"
            className="w-full"
          />
        </div>

        <div>
          <Label htmlFor="keterangan">Keterangan</Label>
          <Input
            type="text"
            id="keterangan"
            value={formData.keterangan}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        <div className="flex justify-end space-x-4">
          <Button size="md" variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button size="md" variant="outline" onClick={resetForm}>
            Reset
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
