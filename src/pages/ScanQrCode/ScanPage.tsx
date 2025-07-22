import QrScanner from "../../components/scan/qrScanner";

const ScanPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-start py-10 px-4">
      <h1 className="text-2xl font-semibold text-white mb-6">Scan QR</h1>
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-6">
        <QrScanner />
      </div>
    </div>
  );
};

export default ScanPage;