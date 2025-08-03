import ServiceAcForm from "../../form/form-input/servis/ServisAcForm";
import PageMeta from "../../common/PageMeta";
import { FaTimes } from "react-icons/fa";
import { ServisData } from "../../../types/service";

interface ServisAcInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  no_registrasi?: string;
  initialData?: Partial<ServisData>;
}

export default function ServiceAcInput({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  no_registrasi,
}: ServisAcInputModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4">
      <PageMeta
        title="Input Data Servis Ac"
        description="Halaman Input Data Servis Ac"
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
          <ServiceAcForm
            no_registrasi={no_registrasi}
            onSuccess={onSuccess}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
