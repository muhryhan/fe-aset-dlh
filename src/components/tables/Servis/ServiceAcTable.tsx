import { useState } from "react";
import { useParams } from "react-router-dom";
import { useSearch } from "../../../hooks/useSearch";
import { usePagination } from "../../../hooks/usePagination";
import { useFetch } from "../../../hooks/useFetch";
import { handleExportExcel } from "../../../handler/handleExportExcel";
import { handleExportPdf } from "../../../handler/handleExportPdf";
import { formatDate } from "../../../utils/dateUtils";

import SearchInput from "../../ui/search/Search";
import {
  AddButton,
  EditButton,
  DeleteButton,
  ExcelButton,
  PDFButton,
} from "../../ui/button/ActionButton";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
} from "../../ui/table";

import ServiceAcInput from "../../modals/service/ServiceAcInput";
import api from "../../../services/api";
import { ServisData } from "../../../types/service";

export default function ServiceAcTable() {
  const { no_registrasi } = useParams<{ no_registrasi: string }>();
  const { data, setData, loading, fetchData } = useFetch<ServisData>(
    no_registrasi ? `/api/servis/nounik/${no_registrasi}` : null
  );

  const { search, setSearch, filtered } = useSearch(
    data,
    (item, q) =>
      item.nama_bengkel.toLowerCase().includes(q) ||
      item.tanggal.toLowerCase().includes(q)
  );

  const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedData,
    getPageNumbers,
  } = usePagination(filtered);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<ServisData | null>(null);

  const handleDelete = async (id_servis: number) => {
    if (confirm("Yakin ingin menghapus servis ini?")) {
      try {
        await api.delete(`/api/servis/${id_servis}`);
        setData((prev) => prev.filter((d) => d.id_servis !== id_servis));
      } catch (err) {
        alert("Gagal menghapus data. Coba lagi nanti.");
        console.error("Gagal menghapus servis:", err);
      }
    }
  };

  const cellClass =
    "px-5 py-3 text-center text-theme-sm align-top font-medium text-gray-600 dark:text-white";
  const headerClass =
    "px-5 py-3 font-bold text-center text-theme-sm text-gray-700 dark:text-gray-400";

  const columns = [
    { header: "Nomor Registrasi", accessor: (d: ServisData) => d.no_unik },
    { header: "Tanggal", accessor: (d: ServisData) => d.tanggal },
    { header: "Nama Bengkel", accessor: (d: ServisData) => d.nama_bengkel },
    { header: "Biaya Servis", accessor: (d: ServisData) => d.biaya_servis },
    {
      header: "Nota Pembayaran",
      accessor: (d: ServisData) => d.nota_pembayaran,
    },
    { header: "Dokumentasi", accessor: (d: ServisData) => d.dokumentasi },
    {
      header: "Onderdil",
      accessor: (d: ServisData) =>
        d.onderdil.map((o) => `${o.nama_onderdil} x${o.jumlah}`).join(", "),
    },
    {
      header: "Jumlah",
      accessor: (d: ServisData) => d.onderdil.reduce((s, o) => s + o.jumlah, 0),
    },
    {
      header: "Harga",
      accessor: (d: ServisData) => d.onderdil.reduce((s, o) => s + o.harga, 0),
    },
    {
      header: "Total Harga",
      accessor: (d: ServisData) =>
        d.biaya_servis +
        d.onderdil.reduce((sum, o) => sum + o.harga * o.jumlah, 0),
    },
  ];

  const exportHeaders = columns.map((col) => col.header);

  const exportRows = filtered.flatMap((item) => {
    const totalHarga =
      item.biaya_servis +
      item.onderdil.reduce((sum, o) => sum + o.harga * o.jumlah, 0);

    if (item.onderdil.length === 0) {
      return [
        [
          item.no_unik,
          item.tanggal,
          item.nama_bengkel,
          item.biaya_servis,
          item.nota_pembayaran,
          item.dokumentasi,
          "-",
          "-",
          "-",
          totalHarga,
        ],
      ];
    }

    return item.onderdil.map((od, idx) => [
      idx === 0 ? item.no_unik : "",
      idx === 0 ? item.tanggal : "",
      idx === 0 ? item.nama_bengkel : "",
      idx === 0 ? item.biaya_servis : "",
      idx === 0 ? item.nota_pembayaran : "",
      idx === 0 ? item.dokumentasi : "",
      od.nama_onderdil,
      od.jumlah,
      od.harga,
      idx === 0 ? totalHarga : "",
    ]);
  });

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
      <div className="p-4 flex flex-wrap gap-2 items-center justify-between">
        <AddButton
          onClick={() => {
            setSelected(null);
            setIsModalOpen(true);
          }}
        />
        <div className="flex gap-2 items-center">
          <SearchInput value={search} onChange={setSearch} />
          <ExcelButton
            onClick={() =>
              handleExportExcel(exportRows, `servis-${no_registrasi ?? "umum"}`)
            }
          />
          <PDFButton
            onClick={() =>
              handleExportPdf(
                exportHeaders,
                exportRows,
                `servis-${no_registrasi ?? "umum"}`
              )
            }
          />
        </div>
      </div>

      {isModalOpen && (
        <ServiceAcInput
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
          no_registrasi={no_registrasi}
          initialData={selected ?? undefined}
        />
      )}

      {loading ? (
        <p className="p-4 text-gray-500 dark:text-white">Loading data...</p>
      ) : (
        <div className="max-w-full overflow-x-auto">
          <div className="min-w-[1102px]">
            <Table>
              <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                <TableRow>
                  {columns.map((col, i) => (
                    <TableCell key={i} isHeader className={headerClass}>
                      {col.header}
                    </TableCell>
                  ))}
                  <TableCell isHeader className={headerClass}>
                    Aksi
                  </TableCell>
                </TableRow>
              </TableHeader>

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
                  paginatedData.map((item) => {
                    const totalHarga =
                      item.biaya_servis +
                      item.onderdil.reduce(
                        (sum, o) => sum + o.harga * o.jumlah,
                        0
                      );
                    const rowSpan = item.onderdil.length || 1;

                    if (item.onderdil.length > 0) {
                      return item.onderdil.map((od, idx) => (
                        <TableRow
                          key={`${item.id_servis}-${od.id_onderdil ?? idx}`}
                        >
                          {idx === 0 && (
                            <>
                              <TableCell
                                rowSpan={rowSpan}
                                className={cellClass}
                              >
                                {item.no_unik}
                              </TableCell>
                              <TableCell
                                rowSpan={rowSpan}
                                className={cellClass}
                              >
                                {formatDate(item.tanggal)}
                              </TableCell>
                              <TableCell
                                rowSpan={rowSpan}
                                className={cellClass}
                              >
                                {item.nama_bengkel}
                              </TableCell>
                              <TableCell
                                rowSpan={rowSpan}
                                className={cellClass}
                              >
                                Rp {item.biaya_servis.toLocaleString("id-ID")}
                              </TableCell>
                              <TableCell
                                rowSpan={rowSpan}
                                className={cellClass}
                              >
                                <a
                                  href={`${BASE_URL}/static/uploads/servis/nota/${item.nota_pembayaran}`}
                                  target="_blank"
                                  className="text-blue-500 underline"
                                >
                                  Lihat
                                </a>
                              </TableCell>
                              <TableCell
                                rowSpan={rowSpan}
                                className={cellClass}
                              >
                                <a
                                  href={`${BASE_URL}/static/uploads/servis/dokumentasi/${item.dokumentasi}`}
                                  target="_blank"
                                  className="text-blue-500 underline"
                                >
                                  Lihat
                                </a>
                              </TableCell>
                            </>
                          )}
                          <TableCell className={cellClass}>
                            {od.nama_onderdil}
                          </TableCell>
                          <TableCell className={cellClass}>
                            {od.jumlah}
                          </TableCell>
                          <TableCell className={cellClass}>
                            Rp {od.harga.toLocaleString("id-ID")}
                          </TableCell>
                          {idx === 0 && (
                            <>
                              <TableCell
                                rowSpan={rowSpan}
                                className="px-5 py-3 text-theme-sm font-medium text-gray-600 dark:text-white"
                              >
                                Rp {totalHarga.toLocaleString("id-ID")}
                              </TableCell>
                              <TableCell
                                rowSpan={rowSpan}
                                className="px-5 py-3 text-theme-sm font-medium text-gray-600 dark:text-white"
                              >
                                <div className="flex gap-2 justify-center">
                                  <EditButton
                                    onClick={() => {
                                      setSelected(item);
                                      setIsModalOpen(true);
                                    }}
                                  />
                                  {item.id_servis != null && (
                                    <DeleteButton
                                      onClick={() =>
                                        handleDelete(item.id_servis!)
                                      }
                                    />
                                  )}
                                </div>
                              </TableCell>
                            </>
                          )}
                        </TableRow>
                      ));
                    }

                    return (
                      <TableRow key={item.id_servis}>
                        <TableCell className={cellClass}>
                          {item.no_unik}
                        </TableCell>
                        <TableCell className={cellClass}>
                          {formatDate(item.tanggal)}
                        </TableCell>
                        <TableCell className={cellClass}>
                          {item.nama_bengkel}
                        </TableCell>
                        <TableCell className={cellClass}>
                          Rp {item.biaya_servis.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className={cellClass}>
                          <a
                            href={`${BASE_URL}/static/uploads/servis/nota/${item.nota_pembayaran}`}
                            target="_blank"
                            className="text-blue-500 underline"
                          >
                            Lihat
                          </a>
                        </TableCell>
                        <TableCell className={cellClass}>
                          <a
                            href={`${BASE_URL}/static/uploads/servis/dokumentasi/${item.dokumentasi}`}
                            target="_blank"
                            className="text-blue-500 underline"
                          >
                            Lihat
                          </a>
                        </TableCell>
                        <TableCell
                          colSpan={3}
                          className="text-center text-gray-400 italic"
                        >
                          Tidak ada onderdil
                        </TableCell>
                        <TableCell className={cellClass}>
                          Rp {item.biaya_servis.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell className={cellClass}>
                          <div className="flex gap-2 justify-center">
                            <EditButton
                              onClick={() => {
                                setSelected(item);
                                setIsModalOpen(true);
                              }}
                            />
                            {item.id_servis != null && (
                              <DeleteButton
                                onClick={() => handleDelete(item.id_servis!)}
                              />
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>

            <div className="flex justify-center mt-4 items-center">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="px-2 py-1 rounded bg-gray-200 text-gray-700 disabled:opacity-50 mr-5"
              >
                &lt;
              </button>
              {getPageNumbers().map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded ${
                    page === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {page}
                </button>
              ))}
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