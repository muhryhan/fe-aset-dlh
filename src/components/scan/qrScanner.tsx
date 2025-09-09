import { useRef, useState, useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import { Result } from "@zxing/library";
import { ScanData } from "../../types/scanQr";
import api from "../../services/api";

const QrScanner = () => {
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dataSerber, setDataSerber] = useState<ScanData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [scanning, setScanning] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();

    return () => {
      stopCamera(); // berhenti saat komponen unmount
    };
  }, []);

  const stopCamera = () => {
    setScanning(false);
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const startCameraScan = async () => {
    setScanning(true);
    setError(null);

    try {
      const constraints = {
        video: {
          facingMode: "environment", // kamera belakang (untuk HP)
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }

      await codeReaderRef.current?.decodeFromVideoDevice(
        undefined,
        videoRef.current!,
        (result: Result | undefined) => {
          if (result) {
            setResult(result.getText());
            stopCamera(); // berhenti setelah dapat hasil
          }
        }
      );
    } catch (e) {
      setError("Gagal mengakses kamera.");
      console.error(e);
      stopCamera();
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!result) return;

      setLoading(true);
      setError(null);
      setDataSerber(null);

      try {
        const res = await api.get(`/api/servisberkalaqrcode/${result}`);
        const data = res.data?.data;

        if (!data) throw new Error("Data tidak ditemukan");

        setDataSerber(data);
      } catch (e) {
        console.error(e);
        setError("❌ Gagal mengambil data servis.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [result]);

  const resetScanner = () => {
    setResult(null);
    setError(null);
    setDataSerber(null);
    setScanning(false);
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    try {
      const result = await codeReaderRef.current?.decodeFromImageUrl(imageUrl);
      if (result) {
        setResult(result.getText());
      } else {
        setError("QR Code tidak ditemukan dalam gambar.");
      }
    } catch {
      setError("Gagal membaca QR Code dari gambar.");
    } finally {
      URL.revokeObjectURL(imageUrl);
    }
  };

  const renderTanggal = (tanggal?: string) =>
    tanggal ? new Date(tanggal).toLocaleDateString("id-ID") : "-";

  return (
    <div className="flex flex-col items-center justify-center p-4 sm:p-6 space-y-6 w-full">
      {!result && (
        <>
          {/* Tombol Scan Kamera */}
          <button
            onClick={startCameraScan}
            className="w-full sm:max-w-sm flex items-center justify-center gap-3 
                     bg-gradient-to-r from-brand-500 to-brand-900 
                     text-white font-semibold 
                     px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg 
                     hover:scale-105 hover:shadow-2xl hover:brightness-110 
                     transition-all duration-300 text-base sm:text-lg"
          >
            <span className="text-xl sm:text-2xl">📷</span> Scan dari Kamera
          </button>

          {/* Tombol Upload Gambar */}
          <label
            className="w-full sm:max-w-sm flex items-center justify-center gap-3 
                     bg-gradient-to-r from-green-900 to-green-500 
                     text-white font-semibold 
                     px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg cursor-pointer 
                     hover:scale-105 hover:shadow-2xl hover:brightness-110 
                     transition-all duration-300 text-base sm:text-lg"
          >
            <span className="text-xl sm:text-2xl">📁</span> Upload Gambar QR
            Code
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              hidden
            />
          </label>

          {/* Kamera aktif */}
          {scanning && (
            <video
              ref={videoRef}
              className="w-full sm:max-w-sm rounded-2xl shadow-xl border-2 
                       border-indigo-300 dark:border-gray-600"
              autoPlay
              muted
              playsInline
            />
          )}
        </>
      )}

      {/* Hasil Scan */}
      {result && (
        <div className="text-center space-y-6 w-full">
          {/* Nomor Aset */}
          <p
            className="text-green-800 dark:text-green-500 font-bold 
                     text-xl sm:text-2xl tracking-wide"
          >
            Nomor Aset:{" "}
            <span className="text-gray-900 dark:text-white break-words">
              {result}
            </span>
          </p>

          {/* Loading & Error */}
          {loading && (
            <p className="text-white animate-pulse font-medium text-base sm:text-lg">
              ⏳ Memuat data servis...
            </p>
          )}
          {error && (
            <p className="text-red-500 font-semibold text-sm sm:text-base">
              {error}
            </p>
          )}

          {/* Data Service */}
          {!loading && !error && dataSerber && (
            <div
              className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-2xl shadow-lg 
                       w-full max-w-md text-sm sm:text-lg 
                       text-gray-800 dark:text-gray-200 
                       space-y-3 border border-gray-200 dark:border-gray-700 
                       mx-auto"
            >
              {dataSerber.no_polisi && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">No Polisi:</span>
                  <span>{dataSerber.no_polisi}</span>
                </div>
              )}
              {dataSerber.no_registrasi && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">No Registrasi:</span>
                  <span>{dataSerber.no_registrasi}</span>
                </div>
              )}
              {dataSerber.oli_mesin && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">Oli Mesin:</span>
                  <span>{renderTanggal(dataSerber.oli_mesin)}</span>
                </div>
              )}
              {dataSerber.filter_oli_mesin && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">Filter Oli Mesin:</span>
                  <span>{renderTanggal(dataSerber.filter_oli_mesin)}</span>
                </div>
              )}
              {dataSerber.oli_gardan && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">Oli Gardan:</span>
                  <span>{renderTanggal(dataSerber.oli_gardan)}</span>
                </div>
              )}
              {dataSerber.oli_transmisi && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">Oli Transmisi:</span>
                  <span>{renderTanggal(dataSerber.oli_transmisi)}</span>
                </div>
              )}
              {dataSerber.ban && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">Ban:</span>
                  <span>{renderTanggal(dataSerber.ban)}</span>
                </div>
              )}
              {dataSerber.cuci && (
                <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0 px-2 sm:px-10">
                  <span className="font-semibold">Cuci AC:</span>
                  <span>{renderTanggal(dataSerber.cuci)}</span>
                </div>
              )}
            </div>
          )}

          {/* Tombol Reset */}
          <button
            onClick={resetScanner}
            className="mt-4 w-full sm:max-w-md flex items-center justify-center gap-2
                     bg-gradient-to-r from-brand-500 to-brand-900 
                     text-white font-semibold 
                     px-4 sm:px-6 py-3 sm:py-4 rounded-2xl shadow-lg 
                     hover:scale-105 hover:shadow-2xl hover:brightness-110
                     transition-all duration-300 text-base sm:text-lg"
          >
            🔄 Scan Lagi
          </button>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
