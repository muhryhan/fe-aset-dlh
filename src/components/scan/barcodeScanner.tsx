import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { NotFoundException } from "@zxing/library";
import { useFetch } from "../../hooks/useFetch";

const BarcodeScanner = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState<boolean>(true);

  // Pakai useFetch
  const endpoint = result ? `/api/servisberkalaqrcode/${result}` : null;
  const { data: dataServis, loading } = useFetch<any>(endpoint);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === "videoinput");
        const selectedDeviceId = videoDevices[0]?.deviceId;

        if (!selectedDeviceId) {
          setError("No video input devices found.");
          return;
        }

        if (!codeReaderRef.current) return;

        await codeReaderRef.current.decodeFromVideoDevice(
          selectedDeviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              setResult(result.getText());
              setScanning(false);
              (codeReaderRef.current as any)?.reset?.();
            }

            if (err && !(err instanceof NotFoundException)) {
              setError(err.message);
            }
          }
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error occurred.");
      }
    };

    if (scanning) {
      startScanner();
    }

    return () => {
      (codeReaderRef.current as any)?.reset?.();
    };
  }, [scanning]);

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setScanning(true);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    try {
      const result = await codeReaderRef.current?.decodeFromImageUrl(imageUrl);
      if (result) {
        setResult(result.getText());
        setScanning(false);
        URL.revokeObjectURL(imageUrl);
      } else {
        setError("No barcode found in image.");
      }
    } catch (err) {
      setError("Failed to decode image.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 space-y-4">
      {!result && (
        <video
          ref={videoRef}
          className="w-full max-w-md rounded-lg shadow-lg"
          autoPlay
          muted
          playsInline
        />
      )}

      <div className="flex flex-col items-center space-y-2">
        <label className="bg-white text-black px-4 py-2 rounded cursor-pointer hover:bg-gray-300">
          📁 Upload Gambar Barcode
          <input type="file" accept="image/*" onChange={handleFileUpload} hidden />
        </label>

        {result ? (
          <div className="text-center space-y-2">
            <p className="text-green-400 font-semibold text-lg">Nomor Aset: {result}</p>

            {dataServis ? (
  <div className="text-sm text-left text-white bg-gray-800 p-4 rounded shadow-lg w-full max-w-md space-y-1">
    {dataServis.no_polisi && (
      <>
        <p><strong>No Polisi:</strong> {dataServis.no_polisi}</p>
        <p><strong>Oli Mesin:</strong> {new Date(dataServis.oli_mesin).toLocaleDateString("id-ID")}</p>
        <p><strong>Filter Oli Mesin:</strong> {new Date(dataServis.filter_oli_mesin).toLocaleDateString("id-ID")}</p>
        <p><strong>Oli Gardan:</strong> {new Date(dataServis.oli_gardan).toLocaleDateString("id-ID")}</p>
        <p><strong>Oli Transmisi:</strong> {new Date(dataServis.oli_transmisi).toLocaleDateString("id-ID")}</p>
        <p><strong>Ban:</strong> {new Date(dataServis.ban).toLocaleDateString("id-ID")}</p>
      </>
    )}

    {dataServis.cuci && dataServis.no_registrasi && (
      <>
        <p><strong>No Registrasi:</strong> {dataServis.no_registrasi}</p>
        <p><strong>Cuci AC:</strong> {new Date(dataServis.cuci).toLocaleDateString("id-ID")}</p>
      </>
    )}

    {dataServis.filter_oli_mesin && dataServis.oli_mesin && !dataServis.oli_gardan && (
      <>
        <p><strong>No Registrasi:</strong> {dataServis.no_registrasi}</p>
        <p><strong>Oli Mesin:</strong> {new Date(dataServis.oli_mesin).toLocaleDateString("id-ID")}</p>
        <p><strong>Filter Oli Mesin:</strong> {new Date(dataServis.filter_oli_mesin).toLocaleDateString("id-ID")}</p>
      </>
    )}

    {dataServis.oli_mesin && !dataServis.filter_oli_mesin && (
      <>
        <p><strong>No Registrasi:</strong> {dataServis.no_registrasi}</p>
        <p><strong>Oli Mesin:</strong> {new Date(dataServis.oli_mesin).toLocaleDateString("id-ID")}</p>
      </>
    )}
  </div>
) : (
  <p className="text-red-400">❌ Data servis tidak ditemukan.</p>
)}


            <button
              onClick={resetScanner}
              className="mt-3 bg-white text-black px-4 py-2 rounded hover:bg-gray-200"
            >
              Scan Lagi
            </button>
          </div>
        ) : (
          <p className="text-gray-400 text-center">📷 Arahkan kamera ke barcode atau upload gambar</p>
        )}

        {error && (
          <p className="text-red-400 text-sm text-center">⚠️ {error}</p>
        )}
      </div>
    </div>
  );
};

export default BarcodeScanner;
