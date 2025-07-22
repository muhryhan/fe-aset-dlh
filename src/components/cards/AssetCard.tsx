import { useEffect, useState } from "react";
import api from "../../services/api";
import {
  MotorIcon,
  CarIcon,
  TruckIcon,
  ExcaIcon,
  LawnIcon,
  AcIcon,
  PlantIcon,
  ParkIcon,
  BurialIcon,
  TriCycleIcon,
} from "../../icons";

import { CardData } from "../../types/cardAsset";

const cardConfig: {
  key: keyof CardData
  label: string;
  icon: React.FC<{ className?: string }>;
  fixedValue?: number;
}[] = [
  { key: "R2", label: "Roda 2", icon: MotorIcon },
  { key: "R3", label: "Roda 3", icon: TriCycleIcon },
  { key: "R4", label: "Roda 4", icon: CarIcon },
  { key: "R6", label: "Roda 6", icon: TruckIcon },
  { key: "AlatBerat", label: "Alat Berat", icon: ExcaIcon },
  { key: "AlatKerja", label: "Alat Kerja", icon: LawnIcon },
  { key: "Ac", label: "Ac", icon: AcIcon },
  { key: "Tanaman", label: "Tanaman", icon: PlantIcon },
  { key: "Taman", label: "Taman Kota", icon: ParkIcon },
  { key: "TPU", label: "Tempat Pemakaman Umum", icon: BurialIcon },
];

export default function AssetCard() {
  const [data, setData] = useState<CardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsset = async () => {
      try {
        const response = await api.get("/api/dashboard");
        setData(response.data.data);
      } catch (err) {
        console.error("Gagal mengambil data dashboard:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAsset();
  }, []);

  if (loading || !data) return <div>Loading...</div>;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-6">
      {cardConfig.map(({ key, label, icon: Icon, fixedValue }) => {
        const value =
          fixedValue !== undefined
            ? fixedValue
            : key in data
            ? data[key as keyof CardData]
            : 0;

        return (
          <div
            key={key}
            className="relative rounded-2xl border border-gray-200 bg-white px-6 py-8 shadow-sm dark:border-gray-800 dark:bg-white/[0.03]"
          >
            <div className="absolute top-4 left-4 w-12 h-12 flex items-center justify-center bg-gray-100 rounded-xl dark:bg-gray-800">
              <Icon className="text-gray-800 size-6 dark:text-white/90" />
            </div>

            <div className="flex flex-col items-center justify-center mt-4">
              <h2 className="text-5xl font-extrabold text-gray-800 dark:text-white/90 mb-4">
                {value}
              </h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {label}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
