import React from "react";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Kiri: Children (form login, register, dll) */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white dark:bg-gray-900">
        <div className="w-full max-w-md">{children}</div>
      </div>

      {/* Kanan: Background dekoratif */}
      <div className="relative hidden lg:flex flex-1 flex-col items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-200 via-blue-300 to-blue-200 dark:from-gray-800 dark:to-gray-900"></div>

        {/* Background gambar tugu */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center"
          style={{
            backgroundImage: "url('/src/icons/tuguNol.png')",
            backgroundSize: "800px",
            opacity: 0.1,
          }}
        ></div>

        {/* Daun kelor di tiap sudut */}
        <img
          src="/src/icons/kelor.png"
          alt="Daun Kelor"
          className="absolute top-0 left-0 w-32 opacity-40 pointer-events-none rotate-90"
        />
        <img
          src="/src/icons/kelor.png"
          alt="Daun Kelor"
          className="absolute top-0 right-0 w-32 opacity-40 pointer-events-none rotate-180"
        />
        <img
          src="/src/icons/kelor.png"
          alt="Daun Kelor"
          className="absolute bottom-0 left-0 w-32 opacity-40 pointer-events-none"
        />
        <img
          src="/src/icons/kelor.png"
          alt="Daun Kelor"
          className="absolute bottom-0 right-0 w-32 opacity-40 pointer-events-none -rotate-90"
        />

        {/* Konten logo & judul */}
        <div className="relative z-10 flex flex-col items-center text-center px-6">
          <div className="flex flex-row items-center justify-center gap-4 mb-6">
            <img
              className="h-12 sm:h-16 w-auto"
              src="/src/icons/logo-kota-palu.png"
              alt="Logo Kota Palu"
            />
            <img
              className="h-16 sm:h-20 w-auto"
              src="/src/icons/klhk.png"
              alt="Logo KLHK"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 dark:text-white">
            DINAS LINGKUNGAN HIDUP
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mt-2">
            KOTA PALU
          </h2>
        </div>
      </div>

      {/* Tombol ganti tema (kanan bawah) */}
      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
}
