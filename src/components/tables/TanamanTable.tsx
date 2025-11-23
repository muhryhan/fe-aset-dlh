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
  DistributionButton,
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
import TanamanInput from "../modals/TanamanInput";
import { TanamanData } from "../../types/tanaman";

export default function TanamanTable() {
  const role = useAuthStore((s) => s.role);
  const { id_tanaman } = useParams<{ id_tanaman: string }>();
  const { data, setData, loading, fetchData } =
    useFetch<TanamanData>("/api/tanaman");

  const { search, setSearch, filtered } = useSearch(
    data,
    (item, query) =>
      item.kode_barang.toLowerCase().includes(query) ||
      item.nama.toLowerCase().includes(query) ||
      item.jenis.toLowerCase().includes(query)
  );

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    getPageNumbers,
  } = usePagination(filtered);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<TanamanData | null>(null);

  const handleEdit = async (id_tanaman: number) => {
    try {
      const res = await api.get(`/api/tanaman/${id_tanaman}`);
      setSelected(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Gagal fetch data untuk edit:", err);
    }
  };

  const handleDelete = async (id_tanaman: number) => {
    if (confirm("Yakin ingin menghapus tanaman ini?")) {
      try {
        await api.delete(`/api/tanaman/${id_tanaman}`);
        setData((prev) =>
          prev.filter((item) => item.id_tanaman !== id_tanaman)
        );
      } catch (err) {
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  const columns = [
    {
      header: "Gambar",
      accessor: (d: TanamanData) => (
        <a
          href={`${BASE_URL}/static/uploads/tanaman/${d.gambar}`}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-200 text-blue-600 px-3 py-1 rounded hover:bg-blue-600 hover:text-gray-200"
        >
          Lihat
        </a>
      ),
    },
    { header: "Kode Barang", accessor: (d: TanamanData) => d.kode_barang },
    { header: "Nama", accessor: (d: TanamanData) => d.nama },
    {
      header: "Jenis",
      accessor: (d: TanamanData) => d.jenis,
    },
    {
      header: "Stok",
      accessor: (d: TanamanData) => d.stok,
    },
    { header: "Keterangan", accessor: (d: TanamanData) => d.keterangan },
  ];

  const exportColumns = [
    { header: "Kode Barang", accessor: (d: TanamanData) => d.kode_barang },
    { header: "Nama", accessor: (d: TanamanData) => d.nama },
    {
      header: "Jenis",
      accessor: (d: TanamanData) => d.jenis,
    },
    {
      header: "Stok",
      accessor: (d: TanamanData) => d.stok,
    },
    { header: "Keterangan", accessor: (d: TanamanData) => d.keterangan },
  ];

  const exportHeaders = exportColumns.map((col) => col.header);
  const exportRows = (search ? filtered : data).map((row) =>
    exportColumns.map((col) => col.accessor(row))
  );

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          {role && hakAkses(role, "tanaman", "create") && (
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
                `Data Aset ${id_tanaman ?? "Tanaman"}`
              )
            }
          />
          <PDFButton
            onClick={() =>
              handleExportPdf(
                exportHeaders,
                exportRows,
                `Data Aset ${id_tanaman ?? "Tanaman"}`
              )
            }
          />
        </div>
      </div>

      {isModalOpen && (
        <TanamanInput
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
                    <TableRow key={item.id_tanaman}>
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
                          <DistributionButton
                            onClick={() =>
                              navigate(
                                `/distribusi-tanaman/${encodeURIComponent(
                                  item.id_tanaman
                                )}`
                              )
                            }
                          />
                          {role && hakAkses(role, "tanaman", "update") && (
                            <EditButton
                              onClick={() => handleEdit(item.id_tanaman)}
                            />
                          )}
                          {role && hakAkses(role, "tanaman", "delete") && (
                            <DeleteButton
                              onClick={() => handleDelete(item.id_tanaman)}
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
