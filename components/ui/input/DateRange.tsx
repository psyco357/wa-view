"use client";
import { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import { FaCalendarAlt, FaChevronDown, FaTimes } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import { id } from "date-fns/locale";
import "react-day-picker/dist/style.css";

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (range: DateRange | undefined) => void;
  placeholder?: string;
  className?: string;
  buttonClassName?: string;
  minWidth?: string;
}

export default function DateRangePicker({
  value,
  onChange,
  placeholder = "Pilih rentang tanggal",
  className = "",
  buttonClassName = "",
  minWidth = "450px"
}: DateRangePickerProps) {
  const [tempDate, setTempDate] = useState<DateRange | undefined>(value);
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Reset tempDate ketika popover dibuka
  useEffect(() => {
    if (isOpen) {
      setTempDate(value);
    }
  }, [isOpen, value]);

  // Tutup popover jika klik di luar
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDateSelect = (newDate: DateRange | undefined) => {
    setTempDate(newDate);
  };

  const handleOk = () => {
    if (tempDate?.from && tempDate?.to) {
      onChange(tempDate);
      setIsOpen(false);
    }
  };

  const handleCancel = () => {
    setTempDate(value);
    setIsOpen(false);
  };

  const handleReset = () => {
    // const today = { from: new Date(), to: new Date() };
    setTempDate(undefined);
    onChange(undefined);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`} ref={popoverRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center space-x-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 text-sm font-medium text-gray-700 dark:text-gray-200 shadow-sm ${buttonClassName}`}
      >
        <FaCalendarAlt className="text-blue-500" />
        <span>
          {value?.from && value?.to
            ? `${format(value.from, "dd MMM yyyy", { locale: id })} - ${format(value.to, "dd MMM yyyy", { locale: id })}`
            : placeholder}
        </span>
        <FaChevronDown
          className={`ml-1 text-gray-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div
          className="absolute left-0 z-50 mt-2 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl animate-in fade-in zoom-in-95 duration-200"
          style={{ minWidth }}
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

          {tempDate?.from && tempDate?.to && (
            <div className="mt-3 mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-xs text-center text-blue-700 dark:text-blue-300">
                Dipilih: {format(tempDate.from, "dd MMMM yyyy", { locale: id })} -{" "}
                {format(tempDate.to, "dd MMMM yyyy", { locale: id })}
              </p>
            </div>
          )}

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
  );
}