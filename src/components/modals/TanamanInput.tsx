import TanamanForm from "../form/form-input/TanamanForm";
import PageMeta from "../common/PageMeta";
import { FaTimes } from "react-icons/fa";
import { TanamanData } from "../../types/tanaman";

interface TanamanInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: Partial<TanamanData>;
}

export default function TanamanInput({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}: TanamanInputModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4 ">
      <PageMeta
        title="Input Data Tanaman"
        description="Halaman Input Data Tanaman"
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
          <TanamanForm onSuccess={onSuccess} initialData={initialData}/>
        </div>
      </div>
    </div>
  );
}
