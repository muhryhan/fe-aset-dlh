import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { usePagination } from "../../hooks/usePagination";
import { useFetch } from "../../hooks/useFetch";
import { handleExportExcel } from "../../handler/handleExportExcel";
import { handleExportPdf } from "../../handler/handleExportPdf";
import { formatDate } from "../../utils/dateUtils";
import { hakAkses } from "../../utils/aclUtils";
import { useAuthStore } from "../../stores/authStore";
import { downloadQR } from "../../handler/handleQrDownloader";

import SearchInput from "../ui/search/Search";
import {
  ServiceButton,
  EditButton,
  DeleteButton,
  AddButton,
  ExcelButton,
  PDFButton,
} from "../ui/button/ActionButton";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../ui/table";

import api from "../../services/api";
import AlatBeratInput from "../modals/AlatBeratInput";
import { AlatBeratData } from "../../types/alatBerat";

export default function AlatBeratTable() {
  const role = useAuthStore((s) => s.role);
  const { no_registrasi } = useParams<{ no_registrasi: string }>();
  const { data, setData, loading, fetchData } =
    useFetch<AlatBeratData>("/api/alatberat");

  const { search, setSearch, filtered } = useSearch(
    data,
    (item, query) =>
      item.kode_barang.toLowerCase().includes(query) ||
      item.merek.toLowerCase().includes(query) ||
      item.no_registrasi.toLowerCase().includes(query) ||
      item.warna.toLowerCase().includes(query) ||
      item.kategori.toLowerCase().includes(query) ||
      item.penggunaan.toLowerCase().includes(query) ||
      item.kondisi.toLowerCase().includes(query) ||
      item.kategori.toLowerCase().includes(query) ||
      item.tahun_pembuatan.toString().includes(query)
  );

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    getPageNumbers,
  } = usePagination(filtered);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<AlatBeratData | null>(null);

  const handleDownloadQR = (data: AlatBeratData) => {
    downloadQR({
      imageUrl: `${BASE_URL}/static/uploads/alatberat/qrcode/${data.qrcode}`,
      fileName: `QR_${data.no_registrasi}`,
      labels: [
        { label: "Kode Aset", value: data.no_registrasi },
        { label: "Nama Alat", value: data.merek },
      ],
    });
  };

  const handleEdit = async (no_registrasi: string) => {
    try {
      const res = await api.get(`/api/alatberat/${no_registrasi}`);
      setSelected(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Gagal fetch data untuk edit:", err);
    }
  };

  const handleDelete = async (id_alatberat: number) => {
    if (confirm("Yakin ingin menghapus alat berat ini?")) {
      try {
        await api.delete(`/api/alatberat/${id_alatberat}`);
        setData((prev) =>
          prev.filter((item) => item.id_alatberat !== id_alatberat)
        );
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  const columns = [
    {
      header: "QR Code",
      accessor: (d: AlatBeratData) => (
        <button
          onClick={() => handleDownloadQR(d)}
          className="bg-gray-200 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-gray-200"
        >
          Unduh QR
        </button>
      ),
    },
    {
      header: "Gambar",
      accessor: (d: AlatBeratData) => (
        <a
          href={`${BASE_URL}/static/uploads/alatBerat/${d.gambar}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-200 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-gray-200"
        >
          Lihat
        </a>
      ),
    },
    { header: "Kode Barang", accessor: (d: AlatBeratData) => d.kode_barang },
    { header: "Merek", accessor: (d: AlatBeratData) => d.merek },
    {
      header: "No. Registrasi",
      accessor: (d: AlatBeratData) => d.no_registrasi,
    },
    {
      header: "Harga Pembelian",
      accessor: (d: AlatBeratData) =>
        `Rp ${d.harga_pembelian.toLocaleString("id-ID")}`,
    },
    {
      header: "Tahun Pembuatan",
      accessor: (d: AlatBeratData) => d.tahun_pembuatan,
    },
    { header: "Kategori", accessor: (d: AlatBeratData) => d.kategori },
    {
      header: "Pajak",
      accessor: (d: AlatBeratData) => formatDate(d.pajak),
    },
    { header: "Penggunaan", accessor: (d: AlatBeratData) => d.penggunaan },
    { header: "Kondisi", accessor: (d: AlatBeratData) => d.kondisi },
  ];

  const exportColumns = [
    { header: "Kode Barang", accessor: (d: AlatBeratData) => d.kode_barang },
    { header: "Merek", accessor: (d: AlatBeratData) => d.merek },
    {
      header: "No. Registrasi",
      accessor: (d: AlatBeratData) => d.no_registrasi,
    },
    { header: "No. Mesin", accessor: (d: AlatBeratData) => d.no_mesin },
    { header: "No. Rangka", accessor: (d: AlatBeratData) => d.no_rangka },
    { header: "Warna", accessor: (d: AlatBeratData) => d.warna },
    {
      header: "Harga Pembelian",
      accessor: (d: AlatBeratData) =>
        `Rp ${d.harga_pembelian.toLocaleString("id-ID")}`,
    },
    {
      header: "Tahun Pembuatan",
      accessor: (d: AlatBeratData) => d.tahun_pembuatan,
    },
    { header: "Kategori", accessor: (d: AlatBeratData) => d.kategori },
    {
      header: "Pajak",
      accessor: (d: AlatBeratData) => formatDate(d.pajak),
    },
    { header: "Penggunaan", accessor: (d: AlatBeratData) => d.penggunaan },
    { header: "Kondisi", accessor: (d: AlatBeratData) => d.kondisi },
  ];

  const exportHeaders = exportColumns.map((col) => col.header);
  const exportRows = (search ? filtered : data).map((row) =>
    exportColumns.map((col) => col.accessor(row))
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          {role && hakAkses(role, "alatBerat", "create") && (
            <AddButton
              onClick={() => {
                setSelected(null);
                setIsModalOpen(true);
              }}
            />
          )}
        </div>
        <div className="flex gap-2 items-center">
          <SearchInput value={search} onChange={setSearch} />
          <ExcelButton
            onClick={() =>
              handleExportExcel(
                exportHeaders,
                exportRows,
                `Data Aset ${no_registrasi ?? "Alat Berat"}`
              )
            }
          />
          <PDFButton
            onClick={() =>
              handleExportPdf(
                exportHeaders,
                exportRows,
                `Data Aset ${no_registrasi ?? "Alat Berat"}`
              )
            }
          />
        </div>
      </div>

      {isModalOpen && (
        <AlatBeratInput
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
          initialData={selected ?? undefined}
        />
      )}

      {loading ? (
        <p className="p-4 text-gray-500 dark:tekt-white">Loading data...</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              {/* Table Header */}
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {columns.map((col, idx) => (
                    <TableCell
                      key={idx}
                      isHeader
                      className="px-5 py-3 font-bold text-center text-theme-sm text-gray-700 dark:text-gray-400"
                    >
                      {col.header}
                    </TableCell>
                  ))}
                  <TableCell
                    isHeader
                    className="px-5 py-3 font-bold text-center text-theme-sm text-gray-700 dark:text-gray-400"
                  >
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

              {/* Table Body */}
              <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                {paginatedData.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + 1}
                      className="text-center text-gray-400 italic py-4"
                    >
                      Tidak ada data
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedData.map((item) => (
                    <TableRow key={item.id_alatberat}>
                      {columns.map((col, idx) => (
                        <TableCell
                          key={idx}
                          className="px-5 py-3 text-center text-theme-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                          {col.accessor(item)}
                        </TableCell>
                      ))}
                      <TableCell className="px-5 py-3 text-center text-theme-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex items-center justify-center gap-2">
                          <ServiceButton
                            onClick={() =>
                              navigate(
                                `/servis/alatberat/nounik/${encodeURIComponent(
                                  item.no_registrasi
                                )}`
                              )
                            }
                          />
                          {role && hakAkses(role, "alatBerat", "update") && (
                            <EditButton
                              onClick={() => handleEdit(item.no_registrasi)}
                            />
                          )}
                          {role && hakAkses(role, "alatBerat", "delete") && (
                            <DeleteButton
                              onClick={() => handleDelete(item.id_alatberat)}
                            />
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-center mt-4 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 mr-5"
              >
                &lt;
              </button>
              <div className="flex space-x-1">
                {getPageNumbers().map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(p + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 ml-5"
              >
                &gt;
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
