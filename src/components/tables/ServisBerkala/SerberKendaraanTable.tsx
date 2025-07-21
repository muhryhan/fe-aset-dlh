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
import SerberKendaraanInput from "../../modals/service-berkala/SerberKendaraanInput";
import api from "../../../services/api";
import { SerberKendaraanData } from "../../../types/serberKendaraan";

export default function SerberKendaraanTable() {
  const { data, loading, fetchData } = useFetch<SerberKendaraanData>(
    "/api/servisberkalakendaraan"
  );

  const { search, setSearch, filtered } = useSearch(data, (item, query) =>
    item.no_polisi.toLowerCase().includes(query)
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    getPageNumbers,
  } = usePagination(filtered);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<SerberKendaraanData | null>(null);

  const handleEdit = async (no_polisi: string) => {
    try {
      const res = await api.get(`/api/servisberkalakendaraan/${no_polisi}`);
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
            <SerberKendaraanInput
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
                {[
                  "No. Polisi",
                  "Oli Mesin",
                  "Filter Oli Mesin",
                  "Oli Gardan",
                  "Oli Transmisi",
                  "Ban",
                  "Aksi",
                ].map((text) => (
                  <TableCell
                    key={text}
                    isHeader
                    className="px-5 py-3 text-center font-bold text-gray-700 text-theme-md dark:text-gray-400"
                  >
                    {text}
                  </TableCell>
                ))}
              </TableRow>
            </TableHeader>

            {/* Table Body */}
            <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
              {(search ? filtered : paginatedData).map((item) => {
                const columns = [
                  item.no_polisi,
                  formatDate(item.oli_mesin),
                  formatDate(item.filter_oli_mesin),
                  formatDate(item.oli_gardan),
                  formatDate(item.oli_transmisi),
                  formatDate(item.ban),
                ];

                return (
                  <TableRow key={item.id_serberkendaraan}>
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
                          onClick={() => handleEdit(item.no_polisi)}
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
