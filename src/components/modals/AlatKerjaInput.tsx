import AlatKerjaForm from "../form/form-input/AlatKerjaForm";
import PageMeta from "../common/PageMeta";
import { FaTimes } from "react-icons/fa";
import { AlatKerjaData } from "../../types/alatKerja";

interface AlatKerjaInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<AlatKerjaData>;
}

export default function AlatKerjaInput({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: AlatKerjaInputModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 ">
      <PageMeta
        title="Input Data Alat Kerja"
        description="Halaman Input Data Alat Kerja"
      />

      {/* Modal box */}
      <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl w-full max-w-screen-lg h-[95vh] flex flex-col px-6 pb-6">
        <div className="flex justify-end p-3 bg-white dark:bg-gray-800">
          <button onClick={onClose} aria-label="Tutup Modal">
            <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-800">
          <AlatKerjaForm onSuccess={onSuccess} initialData={initialData} />
        </div>
      </div>
    </div>
  );
}
