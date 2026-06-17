import { FiPlus } from "react-icons/fi";
import { motion } from "framer-motion";
import { KendaraanParams } from "../../../libs/services/kendaraan.service";
import { Kendaraan, PaginationResponse } from "../../../libs/types/kendaraan.type";
import { FormMode } from "../../../libs/types/mode.types";
import { getKendaraanColumns } from "./kendaraan-columns";
import { DateRange } from "react-day-picker";
import DateRangePicker from "@/components/ui/input/DateRange";
import React from "react";
import { parseISO } from "date-fns";

const loadingRows = Array.from({ length: 5 }, (_, index) => index);
const perPageOptions = [5, 10, 15, 25, 50];

type TableKendaraanProps = {
    openForm: (mode: FormMode) => void;
    kendaraanData: Kendaraan[];
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    params: KendaraanParams;
    setSearch: (search: string) => void;
    setPage: (page: number) => void;
    setPerPage: (perPage: number) => void;
    setStatusBroadcast: (status: string) => void;
    setJenisRoda: (jenisRoda: string) => void;
    setDateRange: (range: DateRange | undefined) => void;
    pagination?: PaginationResponse<Kendaraan>;
    isFetching: boolean;
    selectedRowIds: number[];
    selectedCount: number;
    toggleRowSelection: (id: number) => void;
    toggleAllRows: (checked: boolean) => void;
    handleKirimBlast: () => void;
    isAllSelected: boolean;
    isSomeSelected: boolean;
};

export default function TableKendaraan({
    openForm,
    kendaraanData,
    isLoading,
    isError,
    error,
    params,
    setSearch,
    setPage,
    setPerPage,
    setStatusBroadcast,
    setJenisRoda,
    setDateRange,
    pagination,
    isFetching,
    selectedRowIds,
    selectedCount,
    toggleRowSelection,
    toggleAllRows,
    handleKirimBlast,
    isAllSelected,
    isSomeSelected,
}: TableKendaraanProps) {
    const columns = getKendaraanColumns({
        selectedRowIds,
        isAllSelected,
        isSomeSelected,
        toggleRowSelection,
        toggleAllRows,
    });

    const dateRange = React.useMemo<DateRange | undefined>(() => {
        if (!params.start_date && !params.end_date) {
            return undefined;
        }

        return {
            from: params.start_date ? parseISO(params.start_date) : undefined,
            to: params.end_date ? parseISO(params.end_date) : undefined,
        };
    }, [params.start_date, params.end_date]);

    return (
        <div className="space-y-4">
            <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Data Tagihan Kendaraan</h2>
                    {/* Tombol untuk menambahkan kendaraan baru */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => openForm('add')}
                        className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 flex items-center gap-2"
                    >
                        <FiPlus className="h-5 w-5" />
                        Tambah Kendaraan Baru
                    </motion.button>
                </div>

                {/* filter data kendaraan akan ditambahkan di sini */}
                <div className="flex flex-col gap-4 xl:flex-row xl:items-end bg-white dark:bg-gray-800 p-4 transition-all duration-300">
                    <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                        Cari kendaraan
                        <input
                            type="text"
                            value={params.search ?? ""}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Nomor polisi, nama, telepon"
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        />
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                        Status broadcast
                        <select
                            value={params.status_broadcast ?? "all"}
                            onChange={(e) => setStatusBroadcast(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                            <option value="all">Semua status</option>
                            <option value="belum_dikirim">Belum dikirim</option>
                            <option value="sedang_dikirim">Pending</option>
                            <option value="gagal">Gagal</option>
                            <option value="terkirim">Berhasil</option>
                            <option value="dibaca">Dibaca</option>
                        </select>
                    </label>
                    <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                        Jenis roda
                        <select
                            value={params.jenis_roda ?? "all"}
                            onChange={(e) => setJenisRoda(e.target.value)}
                            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-800 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                        >
                            <option value="all">Semua jenis</option>
                            <option value="r2">R2</option>
                            <option value="r4">R4</option>
                        </select>
                    </label>
                    
                    <label className="flex flex-col gap-1 text-sm text-gray-600 dark:text-gray-300">
                       {/* Gunakan komponen DateRangePicker */}
                        <DateRangePicker 
                        value={dateRange}
                        onChange={setDateRange}
                        placeholder="Pilih rentang tanggal laporan"
                        />
                        
                    </label>

                    <div className="flex flex-col gap-2 md:flex-row md:items-center">
                        <button
                            type="button"
                            onClick={handleKirimBlast}
                            disabled={selectedCount === 0}
                            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            Kirim Blast{selectedCount > 0 ? ` (${selectedCount})` : ""}
                        </button>
                    </div>

                </div>

                <div className="flex items-center justify-between px-4 pt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>
                        {selectedCount > 0
                            ? `${selectedCount} kendaraan terpilih.`
                            : "Pilih kendaraan dengan checkbox untuk kirim blast."}
                    </span>
                    {isFetching && !isLoading ? <span>Memuat ulang data...</span> : null}
                </div>

                {/* Tabel untuk menampilkan daftar kendaraan akan ditampilkan di sini */}
                <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
                    <div className="flex flex-col gap-3 border-b border-gray-200 px-4 py-3 text-sm text-gray-500 dark:border-gray-800 dark:text-gray-400 md:flex-row md:items-center md:justify-between">
                        <div>
                            {isLoading
                                ? "Menyiapkan data kendaraan..."
                                : isFetching
                                    ? "Memuat pembaruan data..."
                                    : `Menampilkan ${pagination?.from ?? 0}-${pagination?.to ?? kendaraanData.length} dari ${pagination?.total ?? kendaraanData.length} data`}
                        </div>
                        <label className="flex items-center gap-2 whitespace-nowrap">
                            <span>Per halaman</span>
                            <select
                                value={params.per_page ?? pagination?.per_page ?? 10}
                                onChange={(e) => setPerPage(Number(e.target.value))}
                                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-700 outline-none transition focus:border-gray-400 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                            >
                                {perPageOptions.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </label>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
                            <thead className="bg-gray-50 dark:bg-gray-900/40">
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column.id} className={column.headerClassName}>
                                            {column.header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-transparent">
                                {isLoading && (
                                    <>
                                        {loadingRows.map((rowIndex) => (
                                            <tr key={`loading-${rowIndex}`} className="animate-pulse">
                                                <td className="px-4 py-4">
                                                    <div className="h-4 w-4 rounded bg-gray-200 dark:bg-gray-700" />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="h-4 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="space-y-2">
                                                        <div className="h-4 w-36 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                        <div className="h-3 w-24 rounded-full bg-gray-100 dark:bg-gray-800" />
                                                    </div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="h-4 w-16 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="h-4 w-12 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="h-4 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="h-6 w-24 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                </td>
                                                <td className="px-4 py-4">
                                                    <div className="h-4 w-28 rounded-full bg-gray-200 dark:bg-gray-700" />
                                                </td>
                                            </tr>
                                        ))}
                                    </>
                                )}

                                {!isLoading && isError && (
                                    <tr>
                                        <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-red-500">
                                            {error?.message ?? "Gagal mengambil data kendaraan"}
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && !isError && kendaraanData.length === 0 && (
                                    <tr>
                                        <td colSpan={columns.length} className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                                            Belum ada data kendaraan.
                                        </td>
                                    </tr>
                                )}

                                {!isLoading && !isError && kendaraanData.map((item) => (
                                    <tr key={item.id}>
                                        {columns.map((column) => (
                                            <td key={`${item.id}-${column.id}`} className={column.cellClassName}>
                                                {column.cell(item)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && !isError && pagination && pagination.last_page > 1 && (
                        <div className="flex flex-col gap-3 border-t border-gray-200 px-4 py-3 dark:border-gray-800 md:flex-row md:items-center md:justify-between">
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                Halaman {pagination.current_page} dari {pagination.last_page}
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setPage((pagination.current_page ?? 1) - 1)}
                                    disabled={!pagination.prev_page_url || isFetching}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Sebelumnya
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: pagination.last_page }, (_, index) => index + 1).map((pageNumber) => (
                                        <button
                                            key={pageNumber}
                                            type="button"
                                            onClick={() => setPage(pageNumber)}
                                            disabled={isFetching}
                                            className={`min-w-10 rounded-lg px-3 py-2 text-sm font-medium transition ${pagination.current_page === pageNumber
                                                ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                                                : "border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"}`}
                                        >
                                            {pageNumber}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setPage((pagination.current_page ?? 1) + 1)}
                                    disabled={!pagination.next_page_url || isFetching}
                                    className="rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
                                >
                                    Berikutnya
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}