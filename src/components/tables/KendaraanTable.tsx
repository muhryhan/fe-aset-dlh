import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { usePagination } from "../../hooks/usePagination";
import { useFetch } from "../../hooks/useFetch";
import { handleExportExcel } from "../../handler/handleExportExcel";
import { handleExportPdf } from "../../handler/handleExportPdf";
import { formatDate } from "../../utils/dateUtils";

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
import KendaraanInput from "../modals/KendaraanInput";
import { KendaraanData } from "../../types/kendaraan";
import { hakAkses } from "../../utils/aclUtils";
import { useAuthStore } from "../../stores/authStore";

export default function KendaraanTable() {
  const role = useAuthStore((s) => s.role);
  const { no_polisi } = useParams<{ no_polisi: string }>();
  const { data, setData, loading, fetchData } =
    useFetch<KendaraanData>("/api/kendaraan");

  const { search, setSearch, filtered } = useSearch(
    data,
    (item, query) =>
      item.kode_barang.toLowerCase().includes(query) ||
      item.merek.toLowerCase().includes(query) ||
      item.no_polisi.toLowerCase().includes(query) ||
      item.warna.toLowerCase().includes(query) ||
      item.tahun_pembuatan.toString().includes(query) ||
      item.kategori.toLowerCase().includes(query) ||
      item.pemegang.toLowerCase().includes(query) ||
      item.nik.toString().includes(query) ||
      item.penggunaan.toLowerCase().includes(query) ||
      item.kondisi.toLowerCase().includes(query)
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
  const [selected, setSelected] = useState<KendaraanData | null>(null);

  const handleEdit = async (no_polisi: string) => {
    try {
      const res = await api.get(`/api/kendaraan/${no_polisi}`);
      setSelected(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Gagal fetch data untuk edit:", err);
    }
  };

  const handleDelete = async (id_kendaraan: number) => {
    if (confirm("Yakin ingin menghapus kendaraan ini?")) {
      try {
        await api.delete(`/api/kendaraan/${id_kendaraan}`);
        setData((prev) =>
          prev.filter((item) => item.id_kendaraan !== id_kendaraan)
        );
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  const columns = [
    {
      header: "QR Code",
      accessor: (d: KendaraanData) => (
        <a
          href={`${BASE_URL}/static/uploads/kendaraan/qrcode/${d.qrcode}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Lihat
        </a>
      ),
    },
    {
      header: "Gambar",
      accessor: (d: KendaraanData) => (
        <a
          href={`${BASE_URL}/static/uploads/kendaraan/${d.gambar}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Lihat
        </a>
      ),
    },
    { header: "Kode Barang", accessor: (d: KendaraanData) => d.kode_barang },
    { header: "Merek", accessor: (d: KendaraanData) => d.merek },
    { header: "No. Polisi", accessor: (d: KendaraanData) => d.no_polisi },
    { header: "Warna", accessor: (d: KendaraanData) => d.warna },
    {
      header: "Harga Pembelian",
      accessor: (d: KendaraanData) =>
        `Rp ${d.harga_pembelian.toLocaleString("id-ID")}`,
    },
    {
      header: "Tahun Pembuatan",
      accessor: (d: KendaraanData) => d.tahun_pembuatan,
    },
    { header: "Kategori", accessor: (d: KendaraanData) => d.kategori },
    { header: "Pemegang", accessor: (d: KendaraanData) => d.pemegang },
    { header: "Penggunaan", accessor: (d: KendaraanData) => d.penggunaan },
    { header: "Kondisi", accessor: (d: KendaraanData) => d.kondisi },
  ];

  const exportColumns = [
    { header: "Kode Barang", accessor: (d: KendaraanData) => d.kode_barang },
    { header: "Merek", accessor: (d: KendaraanData) => d.merek },
    { header: "No. Polisi", accessor: (d: KendaraanData) => d.no_polisi },
    { header: "No. Mesin", accessor: (d: KendaraanData) => d.no_mesin },
    { header: "No. Rangka", accessor: (d: KendaraanData) => d.no_rangka },
    { header: "Warna", accessor: (d: KendaraanData) => d.warna },
    {
      header: "Harga Pembelian",
      accessor: (d: KendaraanData) =>
        `Rp ${d.harga_pembelian.toLocaleString("id-ID")}`,
    },
    {
      header: "Tahun Pembuatan",
      accessor: (d: KendaraanData) => d.tahun_pembuatan,
    },
    { header: "Kategori", accessor: (d: KendaraanData) => d.kategori },
    {
      header: "Pajak",
      accessor: (d: KendaraanData) => formatDate(d.pajak),
    },
    { header: "Pemegang", accessor: (d: KendaraanData) => d.pemegang },
    { header: "Nik", accessor: (d: KendaraanData) => d.nik },
    { header: "Penggunaan", accessor: (d: KendaraanData) => d.penggunaan },
    { header: "Kondisi", accessor: (d: KendaraanData) => d.kondisi },
  ];

  const exportHeaders = exportColumns.map((col) => col.header);
  const exportRows = (search ? filtered : data).map((row) =>
    exportColumns.map((col) => col.accessor(row))
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          <AddButton
            onClick={() => {
              setSelected(null);
              setIsModalOpen(true);
            }}
          />
        </div>
        <div className="flex gap-2 items-center flex-shrink-0">
          <SearchInput value={search} onChange={setSearch} />
          <ExcelButton
            onClick={() =>
              handleExportExcel(
                exportHeaders,
                exportRows,
                `Data Aset ${no_polisi ?? "Kendaraan"}`
              )
            }
          />

          <PDFButton
            onClick={() =>
              handleExportPdf(
                exportHeaders,
                exportRows,
                `Data Aset ${no_polisi ?? "Kendaraan"}`
              )
            }
          />
        </div>
      </div>

      {isModalOpen && (
        <KendaraanInput
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
          <Table className="min-w-[1102px]">
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
                  <TableRow key={item.id_kendaraan}>
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
                              `/servis/kendaraan/nounik/${encodeURIComponent(
                                item.no_polisi
                              )}`
                            )
                          }
                        />
                        {role && hakAkses(role, "kendaraan", "update") && (
                          <EditButton
                            onClick={() => handleEdit(item.no_polisi)}
                          />
                        )}
                        {role && hakAkses(role, "kendaraan", "delete") && (
                          <DeleteButton
                            onClick={() => handleDelete(item.id_kendaraan)}
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
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 ml-5"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
