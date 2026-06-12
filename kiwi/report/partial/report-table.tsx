"use client";
import { useEffect, useRef } from "react";
import React from "react";
import { getReportColumns } from "@/kiwi/report/partial/report-column";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { FaCalendarAlt } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { id } from "date-fns/locale";
import { FaChevronDown, FaTimes } from "react-icons/fa";
import { useReport } from "@/libs/hooks/use-report-filter";

export default function ReportTable() {
    
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: new Date(),
        to: new Date(),
    });
    const { data, loading, download } = useReport(
        date?.from,
        date?.to
    );
    const columns = getReportColumns(download);
  // State sementara untuk selection di popover
  const [tempDate, setTempDate] = React.useState<DateRange | undefined>(date);
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Reset tempDate ketika popover dibuka
  useEffect(() => {
    if (isOpen) {
      setTempDate(date);
    }
  }, [isOpen, date]);

  // Efek untuk menutup popover jika user klik di luar area kalender
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle selection sementara (tidak langsung menyimpan)
  const handleDateSelect = (newDate: DateRange | undefined) => {
    setTempDate(newDate);
  };

  // Handle tombol OK - menyimpan perubahan
  const handleOk = () => {
    if (tempDate?.from && tempDate?.to) {
      setDate(tempDate);
      setIsOpen(false);
    }
  };

  // Handle tombol Cancel - membatalkan perubahan
  const handleCancel = () => {
    setTempDate(date);
    setIsOpen(false);
  };

  const handleReset = () => {
    const today = { from: new Date(), to: new Date() };
    setTempDate(today);
    setDate(today);
    setIsOpen(false);
  };
  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Report Data</h2>
        </div>
        {/* Filter and search components can be added here */}
        <div className="relative" ref={popoverRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm"
          >
            <FaCalendarAlt className="text-blue-500" />
            <span>
              {date?.from && date?.to
                ? `${format(date.from, "dd MMM yyyy", { locale: id })} - ${format(date.to, "dd MMM yyyy", { locale: id })}`
                : "Pilih rentang tanggal"}
            </span>
            <FaChevronDown
              className={`ml-1 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Popover Calendar */}
          {isOpen && (
            <div
              className="absolute left-0 z-50 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200"
              style={{ minWidth: "650px" }}
            >
              <DayPicker
                mode="range"
                defaultMonth={tempDate?.from}
                selected={tempDate}
                onSelect={handleDateSelect}
                numberOfMonths={2}
                locale={id}
                className="rounded-md"
                modifiersClassNames={{
                  day_range_start: "bg-blue-500 text-white rounded-l-md",
                  day_range_end: "bg-blue-500 text-white rounded-r-md",
                  day_range_middle: "bg-blue-100 dark:bg-blue-900/30",
                  day_selected: "bg-blue-500 text-white",
                }}
              />

              {/* Informasi tanggal yang dipilih sementara */}
              {tempDate?.from && tempDate?.to && (
                <div className="mt-3 mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-xs text-center text-blue-700 dark:text-blue-300">
                    Dipilih:{" "}
                    {format(tempDate.from, "dd MMMM yyyy", { locale: id })} -{" "}
                    {format(tempDate.to, "dd MMMM yyyy", { locale: id })}
                  </p>
                </div>
              )}

              {/* Footer Action dengan Tombol OK & Cancel */}
              <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                <button
                  onClick={handleReset}
                  className="text-xs text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 flex items-center space-x-1 transition-colors"
                >
                  <FaTimes />
                  <span>Reset</span>
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-1.5 text-sm text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleOk}
                    disabled={!tempDate?.from || !tempDate?.to}
                    className={`px-4 py-1.5 text-sm text-white rounded-lg transition-colors ${
                      tempDate?.from && tempDate?.to
                        ? "bg-blue-500 hover:bg-blue-600 cursor-pointer"
                        : "bg-gray-300 dark:bg-gray-600 cursor-not-allowed"
                    }`}
                  >
                    OK
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tabel untuk menampilkan hasil filter akan ditampilkan di sini */}
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-800">
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
                {loading ? (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">  Loading...</td>
                  </tr>
                ) : data?.length ? (
                    data.map((row: any) => (
                        <tr key={row.status_broadcast}>
                        {columns.map((column) => (
                            <td
                            key={column.id}
                            className={column.cellClassName}
                            >
                            {column.cell(row)}
                            </td>
                        ))}
                        </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={columns.length} className="text-center py-4">  Tidak ada data</td>
                  </tr>
                )}

               </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
