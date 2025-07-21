import { useState, useEffect } from "react";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import ComponentCard from "../../../common/ComponentCard";
import Label from "../../Label";
import Input from "../../input/InputField";
import Button from "../../../ui/button/Button";
import Alert from "../../../ui/alert/Alert";
import { CalenderIcon } from "../../../../icons";
import { SerberAcData } from "../../../../types/serberAc";
import api from "../../../../services/api";
import { createDateHandler } from "../../../../utils/formHandler";
import { formatDate } from "../../../../utils/dateUtils";

type Props = {
  onSuccess?: () => void;
  no_registrasi?: string;
  initialData?: Partial<SerberAcData>;
};

export default function SerberAcForm({
  onSuccess,
  initialData,
  no_registrasi,
}: Props) {
  const [alertMessage, setAlertMessage] = useState<{
    variant: "success" | "warning" | "error" | "info";
    title?: string;
    message: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    no_registrasi: no_registrasi ?? "",
    cuci: "",
  });

  const handleDateChange = createDateHandler(setFormData);

  useEffect(() => {
    if (initialData) {
      setFormData({
        no_registrasi: initialData.no_registrasi ?? "",
        cuci: formatDate(initialData.cuci) ?? "",
      });
    }
  }, [initialData]);

  const handleSubmit = async () => {
    setAlertMessage(null);

    if (!formData.no_registrasi) {
      setAlertMessage({
        variant: "warning",
        title: "Validasi Gagal",
        message: "Nomor registrasi tidak boleh kosong",
      });
      return;
    }

    try {
      const response = await api.put(
        `/api/servisberkalaac/${initialData?.id_serberac}`,
        formData
      );

      if (response.status === 200 || response.status === 201) {
        setAlertMessage({
          variant: "success",
          title: "Berhasil",
          message: "Data berhasil disimpan.",
        });
        setTimeout(() => {
          onSuccess?.();
        }, 2000);
      } else {
        setAlertMessage({
          variant: "error",
          title: "Gagal",
          message: "Terjadi kesalahan saat menyimpan data.",
        });
      }
    } catch (error) {
      console.error("Gagal submit:", error);
      setAlertMessage({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  };

  const renderDatePicker = (label: string, field: keyof typeof formData) => (
    <div>
      <Label htmlFor={field}>{label}</Label>
      <div className="relative w-full">
        <Flatpickr
          value={formData[field]}
          onChange={(date) => handleDateChange(date, field)}
          options={{ dateFormat: "Y-m-d" }}
          placeholder="Pilih tanggal"
          className="h-11 w-full rounded-lg border px-4 py-2.5 text-sm shadow-theme-xs bg-white text-gray-800 placeholder:text-gray-400 border-gray-300 focus:border-brand-300 focus:ring-brand-500/20 dark:bg-gray-900 dark:text-white dark:placeholder:text-white/40 dark:border-gray-700 dark:focus:border-brand-800"
        />
        <span className="absolute text-gray-500 -translate-y-1/2 pointer-events-none right-3 top-1/2 dark:text-white">
          <CalenderIcon className="size-6" />
        </span>
      </div>
    </div>
  );

  return (
    <ComponentCard title="Form Servis Berkala Kendaraan">
      {alertMessage && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-1/2 z-50">
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
      <div className="space-y-6 w-full">
        <div>
          <Label htmlFor="no_registrasi">Nomor Registrasi</Label>
          <Input
            id="no_registrasi"
            value={formData.no_registrasi}
            className="w-full"
            disabled
          />
        </div>

        {/* Date Pickers */}
        {renderDatePicker("Cuci", "cuci")}

        <div className="flex justify-end space-x-4 pt-6">
          <Button size="md" variant="warning" onClick={handleSubmit}>
            Update
          </Button>
        </div>
      </div>
    </ComponentCard>
  );
}
