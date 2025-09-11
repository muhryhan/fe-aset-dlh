import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch";
import { usePagination } from "../../hooks/usePagination";
import { useFetch } from "../../hooks/useFetch";
import { handleExportExcel } from "../../handler/handleExportExcel";
import { handleExportPdf } from "../../handler/handleExportPdf";
import { hakAkses } from "../../utils/aclUtils";
import { useAuthStore } from "../../stores/authStore";

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
import AcInput from "../modals/AcInput";
import { AcData } from "../../types/ac";

export default function AcTable() {
  const role = useAuthStore((s) => s.role);
  const { no_registrasi } = useParams<{ no_registrasi: string }>();
  const { data, setData, loading, fetchData } = useFetch<AcData>("/api/ac");

  const { search, setSearch, filtered } = useSearch(
    data,
    (item, query) =>
      item.kode_barang.toLowerCase().includes(query) ||
      item.nama_barang.toLowerCase().includes(query) ||
      item.merek.toLowerCase().includes(query) ||
      item.no_registrasi.toLowerCase().includes(query) ||
      item.no_serial.toLowerCase().includes(query) ||
      item.ukuran.toLowerCase().includes(query) ||
      item.ruangan.toLowerCase().includes(query) ||
      item.kondisi.toLowerCase().includes(query) ||
      item.tahun_pembelian.toString().includes(query)
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
  const [selected, setSelected] = useState<AcData | null>(null);

  const handleEdit = async (no_registrasi: string) => {
    try {
      const res = await api.get(`/api/ac/${no_registrasi}`);
      setSelected(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Gagal fetch data untuk edit:", err);
    }
  };

  const handleDelete = async (id_ac: number) => {
    if (confirm("Yakin ingin menghapus ac ini?")) {
      try {
        await api.delete(`/api/ac/${id_ac}`);
        setData((prev) => prev.filter((item) => item.id_ac !== id_ac));
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  const columns = [
    {
      header: "QR Code",
      accessor: (d: AcData) => (
        <a
          href={`${BASE_URL}/static/uploads/ac/qrcode/${d.qrcode}`}
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
      accessor: (d: AcData) => (
        <a
          href={`${BASE_URL}/static/uploads/ac/${d.gambar}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 underline"
        >
          Lihat
        </a>
      ),
    },
    { header: "Kode Barang", accessor: (d: AcData) => d.kode_barang },
    { header: "Merek", accessor: (d: AcData) => d.merek },
    {
      header: "No. Registrasi",
      accessor: (d: AcData) => d.no_registrasi,
    },
    { header: "No. Serial", accessor: (d: AcData) => d.no_serial },
    { header: "Ruangan", accessor: (d: AcData) => d.ruangan },
    { header: "Asal", accessor: (d: AcData) => d.asal },
    {
      header: "Tahun Pembelian",
      accessor: (d: AcData) => d.tahun_pembelian,
    },
    {
      header: "Harga Pembelian",
      accessor: (d: AcData) =>
        `Rp ${d.harga_pembelian.toLocaleString("id-ID")}`,
    },
    { header: "Kondisi", accessor: (d: AcData) => d.kondisi },
  ];

  const exportColumns = [
    { header: "Kode Barang", accessor: (d: AcData) => d.kode_barang },
    { header: "Nama Barang", accessor: (d: AcData) => d.nama_barang },
    { header: "Merek", accessor: (d: AcData) => d.merek },
    {
      header: "No. Registrasi",
      accessor: (d: AcData) => d.no_registrasi,
    },
    { header: "No. Serial", accessor: (d: AcData) => d.no_serial },
    { header: "Ukuran", accessor: (d: AcData) => d.ukuran },
    { header: "Ruangan", accessor: (d: AcData) => d.ruangan },
    { header: "Asal", accessor: (d: AcData) => d.asal },
    {
      header: "Tahun Pembelian",
      accessor: (d: AcData) => d.tahun_pembelian,
    },
    {
      header: "Harga Pembelian",
      accessor: (d: AcData) =>
        `Rp ${d.harga_pembelian.toLocaleString("id-ID")}`,
    },
    { header: "Kondisi", accessor: (d: AcData) => d.kondisi },
    { header: "Keterangan", accessor: (d: AcData) => d.keterangan },
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
        <div className="flex gap-2 items-center">
          <SearchInput value={search} onChange={setSearch} />
          <ExcelButton
            onClick={() =>
              handleExportExcel(
                exportHeaders,
                exportRows,
                `Data Aset ${no_registrasi ?? "Ac"}`
              )
            }
          />
          <PDFButton
            onClick={() =>
              handleExportPdf(
                exportHeaders,
                exportRows,
                `Data Aset ${no_registrasi ?? "Ac"}`
              )
            }
          />
        </div>
      </div>

      {isModalOpen && (
        <AcInput
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
                    <TableRow key={item.id_ac}>
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
                                `/servis/ac/nounik/${encodeURIComponent(
                                  item.no_registrasi
                                )}`
                              )
                            }
                          />
                          {role && hakAkses(role, "ac", "update") && (
                            <EditButton
                              onClick={() => handleEdit(item.no_registrasi)}
                            />
                          )}
                          {role && hakAkses(role, "ac", "delete") && (
                            <DeleteButton
                              onClick={() => handleDelete(item.id_ac)}
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
