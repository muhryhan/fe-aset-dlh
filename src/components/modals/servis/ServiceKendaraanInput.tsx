import ServiceKendaraanForm from "../../form/form-input/servis/ServiceKendaraanForm";
import PageMeta from "../../common/PageMeta";
import { FaTimes } from "react-icons/fa";
import { ServisData } from "../../../types/service";

interface ServisKendaraanInputModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  no_polisi?: string;
  initialData?: Partial<ServisData>;
}

export default function ServiceKendaraanInput({
  isOpen,
  onClose,
  onSuccess,
  initialData,
  no_polisi,
}: ServisKendaraanInputModalProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/60 p-4">
      <PageMeta
        title="Input Data Servis Kendaraan"
        description="Halaman Input Data Servis Kendaraan"
      />

      {/* Modal box */}
      <div className="relative bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col px-6 pb-6">
        <div className="flex justify-end p-3 bg-white dark:bg-gray-800">
          <button onClick={onClose} aria-label="Tutup Modal">
            <FaTimes className="w-5 h-5 text-gray-700 dark:text-gray-200" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-6 pb-6 bg-white dark:bg-gray-800">
          <ServiceKendaraanForm
            no_polisi={no_polisi}
            onSuccess={onSuccess}
            initialData={initialData}
          />
        </div>
      </div>
    </div>
  );
}
