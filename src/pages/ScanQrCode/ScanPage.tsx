import { Link } from "react-router-dom";
import QrScanner from "../../components/scan/qrScanner";
import ThemeTogglerTwo from "../../components/common/ThemeTogglerTwo";

const ScanPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-200 via-blue-300 to-blue-200 dark:from-gray-800 dark:to-gray-900 flex flex-col justify-center py-8 px-4 sm:px-6 lg:px-12">
      <div
        className="absolute inset-0 bg-no-repeat bg-center"
        style={{
          backgroundImage: "url('/src/icons/tuguNol.png')",
          backgroundSize: "800px", // bisa px, %, contain, cover
          opacity: 0.1, // transparansi
        }}
      ></div>

      {/* Daun kelor di tiap sudut */}
      <img
        src="/images/logo/kelor.png"
        alt="Daun Kelor"
        className="absolute top-0 left-0 w-24 sm:w-24 md:w-64 opacity-40 pointer-events-none rotate-90"
      />
      <img
        src="/images/logo/kelor.png"
        alt="Daun Kelor"
        className="absolute top-0 right-0 w-24 sm:w-24 md:w-64 opacity-40 pointer-events-none rotate-180"
      />
      <img
        src="/images/logo/kelor.png"
        alt="Daun Kelor"
        className="absolute bottom-0 left-0 w-24 sm:w-24 md:w-64 opacity-40 pointer-events-none"
      />
      <img
        src="/images/logo/kelor.png"
        alt="Daun Kelor"
        className="absolute bottom-0 right-0 w-24 sm:w-24 md:w-64 opacity-40 pointer-events-none -rotate-90"
      />

      {/* Grid Layout: stack di HP, 2 kolom di tablet/laptop */}
      <div className="relative grid grid-cols-1 md:grid-cols-2 gap-10 items-center w-full max-w-6xl mx-auto">
        {/* Kiri: Logo + Judul */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          {/* Logo */}
          <div className="flex flex-row justify-center md:justify-start items-center gap-3 mb-6">
            <img
              className="h-8 sm:h-10 w-auto"
              src="/images/logo/logo-kota-palu.png"
              alt="Logo Kota Palu"
            />
            <img
              className="h-12 sm:h-16 w-auto"
              src="/images/logo/klhk.png"
              alt="Logo KLHK"
            />
          </div>

          {/* Judul */}
          <div className="mb-8">
            <h1 className="text-4xl sm:text-6xl lg:text-5xl font-extrabold text-green-800 dark:text-white">
              DINAS LINGKUNGAN HIDUP
            </h1>
            <h1 className="text-3xl sm:text-4xl lg:text-3xl font-bold text-gray-800 dark:text-white">
              KOTA PALU
            </h1>
            <p className="text-gray-700 dark:text-gray-300 mt-4 text-base sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0">
              Upload file atau arahkan kamera ke QR Code untuk melihat riwayat
              servis aset.
            </p>
          </div>

          {/* Tombol kembali */}
          <div className="flex justify-center md:justify-start">
            <Link
              to="/"
              className="flex items-center justify-center w-8 h-8 sm:w-8 sm:h-8 
       bg-brand-500 text-white rounded-full 
       shadow-lg hover:shadow-2xl transition-all duration-300 
       transform hover:scale-110 hover:rotate-6"
            >
              <svg
                className="fill-gray-500 group-hover:fill-gray-700 dark:group-hover:fill-gray-300"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M15.1007 19.247C14.6865 19.247 14.3507 18.9112 14.3507 18.497L14.3507 14.245H12.8507V18.497C12.8507 19.7396 13.8581 20.747 15.1007 20.747H18.5007C19.7434 20.747 20.7507 19.7396 20.7507 18.497L20.7507 5.49609C20.7507 4.25345 19.7433 3.24609 18.5007 3.24609H15.1007C13.8581 3.24609 12.8507 4.25345 12.8507 5.49609V9.74501L14.3507 9.74501V5.49609C14.3507 5.08188 14.6865 4.74609 15.1007 4.74609L18.5007 4.74609C18.9149 4.74609 19.2507 5.08188 19.2507 5.49609L19.2507 18.497C19.2507 18.9112 18.9149 19.247 18.5007 19.247H15.1007ZM3.25073 11.9984C3.25073 12.2144 3.34204 12.4091 3.48817 12.546L8.09483 17.1556C8.38763 17.4485 8.86251 17.4487 9.15549 17.1559C9.44848 16.8631 9.44863 16.3882 9.15583 16.0952L5.81116 12.7484L16.0007 12.7484C16.4149 12.7484 16.7507 12.4127 16.7507 11.9984C16.7507 11.5842 16.4149 11.2484 16.0007 11.2484L5.81528 11.2484L9.15585 7.90554C9.44864 7.61255 9.44847 7.13767 9.15547 6.84488C8.86248 6.55209 8.3876 6.55226 8.09481 6.84525L3.52309 11.4202C3.35673 11.5577 3.25073 11.7657 3.25073 11.9984Z"
                  fill="currentColor"
                />
              </svg>
            </Link>
          </div>
        </div>

        {/* Kanan: Card Scanner */}
        <div className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto rounded-xl shadow-2xl p-6">
          <QrScanner />
        </div>
      </div>

      {/* Tombol ganti tema (kanan bawah) */}
      <div className="fixed z-50 bottom-6 right-6">
        <ThemeTogglerTwo />
      </div>
    </div>
  );
};

export default ScanPage;
