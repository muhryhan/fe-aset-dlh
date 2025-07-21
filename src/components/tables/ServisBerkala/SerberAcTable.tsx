import { useState } from "react";
import { useSearch } from "../../../hooks/useSearch";
import { usePagination } from "../../../hooks/usePagination";
import { useFetch } from "../../../hooks/useFetch";
import { formatDate } from "../../../utils/dateUtils";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../ui/table";

import { EditButton } from "../../ui/button/ActionButton";
import SearchInput from "../../ui/search/Search";
import SerberAcInput from "../../modals/service-berkala/SerberAcInput";
import api from "../../../services/api";
import { SerberAcData } from "../../../types/serberAc";

export default function SerberAcTable() {
  const { data, loading, fetchData } = useFetch<SerberAcData>(
    "/api/servisberkalaac"
  );

  const { search, setSearch, filtered } = useSearch(data, (item, query) =>
    item.no_registrasi.toLowerCase().includes(query)
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    getPageNumbers,
  } = usePagination(filtered);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<SerberAcData | null>(null);

  const handleEdit = async (no_registrasi: string) => {
    try {
      const res = await api.get(`/api/servisberkalaac/${no_registrasi}`);
      setSelected(res.data.data);
      setIsModalOpen(true);
    } catch (err) {
      console.error("Gagal fetch data untuk edit:", err);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-2 items-center">
          {isModalOpen && (
            <SerberAcInput
              isOpen={isModalOpen}
              onClose={() => {
                setIsModalOpen(false);
                setSelected(null);
              }}
              onSuccess={() => {
                setIsModalOpen(false);
                setSelected(null);
                fetchData();
              }}
              initialData={selected ?? undefined}
            />
          )}
          <SearchInput value={search} onChange={setSearch} />
        </div>
      </div>
      {loading && <p className="p-4 text-gray-500">Loading data...</p>}
      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1102px]">
          <Table>
            {/* Table Header */}
            <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
              <TableRow>
                {["No. Registrasi", "Cuci", "Aksi"].map((text) => (
                  <TableCell
                    key={text}
                    isHeader
                    className="px-5 py-3 font-bold text-center text-gray-700 text-start text-theme-md dark:text-gray-400"
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {(search ? filtered : paginatedData).map((item) => {
                const columns = [item.no_registrasi, formatDate(item.cuci)];

                return (
                  <TableRow key={item.id_serberac}>
                    {columns.map((col, idx) => (
                      <TableCell
                        key={idx}
                        className="px-5 py-3 text-center text-theme-md font-medium text-gray-800 dark:text-gray-200"
                      >
                        {col}
                      </TableCell>
                    ))}
                    <TableCell className="px-5 py-3 text-center text-theme-md font-medium text-gray-800 dark:text-gray-200">
                      <div className="flex items-center gap-2">
                        <EditButton
                          onClick={() => handleEdit(item.no_registrasi)}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4 items-center">
            {/* Tombol kiri */}
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 mr-5"
            >
              &lt;
            </button>
            {/* Nomor halaman */}
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
            {/* Tombol kanan */}
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 ml-5"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
