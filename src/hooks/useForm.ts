import { useEffect, useState, useRef } from "react";
import { validateRequiredFields } from "../utils/validateUtils";
import { buildFormData, resetForm } from "../utils/formUtils";
import api from "../services/api";
import { formatDate } from "../utils/dateUtils";

type AlertState = {
  variant: "success" | "warning" | "error";
  title?: string;
  message: string;
} | null;

type UseFormOptions<T> = {
  initialData?: Partial<T>;
  endpoint: string;
  requiredFields?: (keyof T)[];
  idKey?: keyof T;
  onSuccess?: () => void;
  additionalPayload?: Record<string, unknown>;
  skipKeys?: (keyof T)[];
  emptyTemplate?: T;
};

export function useForm<T extends Record<string, unknown>>({
  initialData,
  endpoint,
  requiredFields = [],
  idKey = Object.keys(initialData ?? {}).find((key) => key.startsWith("id_")) ??
    "id",
  onSuccess,
  additionalPayload = {},
  skipKeys = [],
  emptyTemplate,
}: UseFormOptions<T>) {
  const [formData, setFormData] = useState<Partial<T>>(() => {
    if (initialData) {
      return {
        ...initialData,
        pajak: initialData.pajak ? formatDate(String(initialData.pajak)) : "",
        tanggal_sertifikat: initialData.tanggal_sertifikat
          ? formatDate(String(initialData.tanggal_sertifikat))
          : "",
        tanggal: initialData.tanggal
          ? formatDate(String(initialData.tanggal))
          : "",
      };
    }
    return {};
  });

  const [alertMessage, setAlertMessage] = useState<AlertState>(null);
  const isEdit = !!initialData?.[idKey];

  const initialRef = useRef<T>(
    (initialData as T) || (emptyTemplate as T) || ({} as T)
  );

  useEffect(() => {
    if (initialData) {
      const fullData = { ...(initialData as T) };

      // Bandingkan sebelum update
      const isDifferent =
        JSON.stringify(initialRef.current) !== JSON.stringify(fullData);
      if (isDifferent) {
        initialRef.current = fullData;
        setFormData(fullData);
      }
    } else if (emptyTemplate) {
      setFormData((prev) => {
        const isEmpty = Object.values(prev).every(
          (val) => val === "" || val === 0
        );
        return isEmpty ? emptyTemplate : prev;
      });
    }
  }, [emptyTemplate, initialData]);

  async function handleSubmit() {
    setAlertMessage(null);

    const error = validateRequiredFields(formData, requiredFields as string[]);
    if (error) {
      setAlertMessage({
        variant: "warning",
        title: "Validasi Gagal",
        message: error,
      });
      return;
    }

    try {
      const payload = buildFormData(
        { ...formData, ...additionalPayload },
        skipKeys as string[]
      );

      const url = isEdit ? `${endpoint}/${initialData?.[idKey]}` : endpoint;
      const response = isEdit
        ? await api.put(url, payload)
        : await api.post(url, payload);

      if (![200, 201].includes(response.status)) throw new Error();

      setAlertMessage({
        variant: "success",
        title: "Berhasil",
        message: response.data?.message ?? "Data berhasil disimpan.",
      });

      setTimeout(() => {
        setFormData(resetForm(initialRef.current));
        setAlertMessage(null);
        onSuccess?.();
      }, 2000);
    } catch (err) {
      console.error("Form error:", err);
      setAlertMessage({
        variant: "error",
        title: "Gagal",
        message: "Terjadi kesalahan saat menyimpan data.",
      });
    }
  }

  return {
    formData,
    setFormData,
    alertMessage,
    setAlertMessage,
    handleSubmit,
    isEdit,
    reset: () => {
      const resetData =
        isEdit && initialRef.current
          ? { ...initialRef.current }
          : { ...((emptyTemplate ?? {}) as T) };
      setFormData(resetForm(resetData));
    },
  };
}
