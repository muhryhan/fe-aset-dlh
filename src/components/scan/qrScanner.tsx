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
    stopCamera();
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6 space-y-6">
      {!result && (
        <>
          <button
            onClick={startCameraScan}
            className="bg-white text-black px-6 py-3 rounded hover:bg-gray-300 transition"
          >
            📷 Scan dari Kamera
          </button>

          <label className="bg-white text-black px-6 py-3 rounded cursor-pointer hover:bg-gray-300 transition">
            📁 Upload Gambar QR Code
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              hidden
            />
          </label>

          {scanning && (
            <video
              ref={videoRef}
              className="w-full max-w-sm rounded shadow"
              autoPlay
              muted
              playsInline
            />
          )}

          {!scanning && (
            <p className="text-gray-400 text-center">
              📷 Gunakan kamera atau upload gambar QR Code untuk memulai
            </p>
          )}
        </>
      )}

      {result && (
        <div className="text-center space-y-4">
          <p className="text-green-400 font-semibold text-lg">
            Nomor Aset: {result}
          </p>

          {loading && (
            <p className="text-yellow-400">⏳ Memuat data servis...</p>
          )}
          {error && <p className="text-red-400">{error}</p>}

          {!loading && !error && dataSerber && (
            <div className="bg-gray-800 p-4 rounded shadow-md w-full max-w-md text-sm text-left space-y-1">
              {dataSerber.no_polisi && (
                <p>
                  <strong>No Polisi:</strong> {dataSerber.no_polisi}
                </p>
              )}
              {dataSerber.no_registrasi && (
                <p>
                  <strong>No Registrasi:</strong> {dataSerber.no_registrasi}
                </p>
              )}
              {dataSerber.oli_mesin && (
                <p>
                  <strong>Oli Mesin:</strong>{" "}
                  {renderTanggal(dataSerber.oli_mesin)}
                </p>
              )}
              {dataSerber.filter_oli_mesin && (
                <p>
                  <strong>Filter Oli Mesin:</strong>{" "}
                  {renderTanggal(dataSerber.filter_oli_mesin)}
                </p>
              )}
              {dataSerber.oli_gardan && (
                <p>
                  <strong>Oli Gardan:</strong>{" "}
                  {renderTanggal(dataSerber.oli_gardan)}
                </p>
              )}
              {dataSerber.oli_transmisi && (
                <p>
                  <strong>Oli Transmisi:</strong>{" "}
                  {renderTanggal(dataSerber.oli_transmisi)}
                </p>
              )}
              {dataSerber.ban && (
                <p>
                  <strong>Ban:</strong> {renderTanggal(dataSerber.ban)}
                </p>
              )}
              {dataSerber.cuci && (
                <p>
                  <strong>Cuci AC:</strong> {renderTanggal(dataSerber.cuci)}
                </p>
              )}
            </div>
          )}

          <button
            onClick={resetScanner}
            className="mt-3 bg-white text-black px-4 py-2 rounded hover:bg-gray-200 transition"
          >
            Scan Lagi
          </button>
        </div>
      )}
    </div>
  );
};

export default QrScanner;
