import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import { usePagination } from "../../../hooks/usePagination";
import { useFetch } from "../../../hooks/useFetch";
import { handleExportExcel } from "../../../handler/handleExportExcel";
import { handleExportPdf } from "../../../handler/handleExportPdf";
import { formatDate } from "../../../utils/dateUtils";
import { hakAkses } from "../../../utils/aclUtils";
import { useAuthStore } from "../../../stores/authStore";

import SearchInput from "../../ui/search/Search";
import {
  EditButton,
  DeleteButton,
  AddButton,
  ExcelButton,
  PDFButton,
} from "../../ui/button/ActionButton";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import api from "../../../services/api";
import TanamanKeluarInput from "../../modals/dist-tanaman/TanamanKeluarInput";
import { TanamanKeluarData } from "../../../types/tanamanKeluar";

export default function TanamanKeluarTable() {
  const role = useAuthStore((s) => s.role);
  const { id_tanaman } = useParams<{ id_tanaman: string }>();
  const { data, setData, loading, fetchData } = useFetch<TanamanKeluarData>(
    `/api/tanamankeluar/tanaman/${id_tanaman}`
  );

  const { search, setSearch, filtered } = useSearch(data, (item, query) =>
    item.keterangan.toString().includes(query)
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    getPageNumbers,
  } = usePagination(filtered);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<TanamanKeluarData | null>(null);

  const handleDelete = async (id_tanamankeluar: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      try {
        await api.delete(`/api/tanamankeluar/${id_tanamankeluar}`);
        setData((prev) =>
          prev.filter((item) => item.id_tanamankeluar !== id_tanamankeluar)
        );
      } catch (err) {
        alert("Gagal menghapus data. Coba lagi nanti.");
        console.error("Gagal menghapus data:", err);
      }
    }
  };

  const columns = [
    { header: "ID", accessor: (d: TanamanKeluarData) => d.id_tanaman },
    {
      header: "Tanggal",
      accessor: (d: TanamanKeluarData) => formatDate(d.tanggal),
    },
    { header: "Jumlah", accessor: (d: TanamanKeluarData) => d.jumlah },
    { header: "Keterangan", accessor: (d: TanamanKeluarData) => d.keterangan },
  ];

  const exportHeaders = columns.map((col) => col.header);
  const exportRows = filtered.map((row) =>
    columns.map((col) => col.accessor(row))
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
                `Data Aset ${id_tanaman ?? "Tanaman Keluar"}`
              )
            }
          />
          <PDFButton
            onClick={() =>
              handleExportPdf(
                exportHeaders,
                exportRows,
                `Data Aset ${id_tanaman ?? "Tanaman Keluar"}`
              )
            }
          />
        </div>
      </div>

      {isModalOpen && (
        <TanamanKeluarInput
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          id_tanaman={id_tanaman}
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
                    <TableRow key={item.id_tanamankeluar}>
                      {columns.map((col, idx) => (
                        <TableCell
                          key={idx}
                          className="px-5 py-3 text-center text-theme-sm font-medium text-gray-600 dark:text-gray-400"
                        >
                          {col.accessor(item)}
                        </TableCell>
                      ))}
                      <TableCell className="px-5 py-3 text-center text-theme-sm font-medium text-gray-600 dark:text-gray-400">
                        <div className="flex gap-2 justify-center">
                          {role &&
                            hakAkses(role, "tanamanKeluar", "update") && (
                              <EditButton
                                onClick={() => {
                                  setSelected(item);
                                  setIsModalOpen(true);
                                }}
                              />
                            )}
                          {role &&
                            hakAkses(role, "tanamanKeluar", "delete") &&
                            item.id_tanamankeluar != null && (
                              <DeleteButton
                                onClick={() =>
                                  handleDelete(item.id_tanamankeluar!)
                                }
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
