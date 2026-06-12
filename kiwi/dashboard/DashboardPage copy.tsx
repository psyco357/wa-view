"use client";
import React, { useEffect, useState, useCallback } from "react";
import {
  FaUserGroup, FaClock,
  FaMoneyBillWave, FaChartLine, FaDownload,
  FaEye
} from "react-icons/fa6";
import { FaCheckCircle, FaTimesCircle, FaSearch, FaSync, FaExclamationTriangle } from "react-icons/fa";

import { FiBox, FiAlertCircle, FiX, FiChevronDown, FiFilter } from "react-icons/fi";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend, BarChart, Bar
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";

// ============ TYPES ============
interface DashboardStats {
  total_data: number;
  data_terkirim: number;
  data_gagal: number;
  data_pending: number;
  total_tagihan: string;
  persentase_terkirim: number;
  chart_data?: Array<{ date: string; value: number; status: string }>;
}

interface ApiResponse {
  success: boolean;
  data: DashboardStats;
}

interface FilterState {
  dateRange: "today" | "week" | "month" | "year";
  status: "all" | "sent" | "pending" | "failed";
}

interface Toast {
  id: string;
  message: string;
  type: "success" | "error" | "info";
}

// ============ UTILITIES ============
const formatRupiah = (value: string | number) => {
  const num = typeof value === "string" ? parseFloat(value) : value;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(num);
};

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric"
  }).format(date);
};

// Generate mock chart data (replace with API response)
const generateChartData = (days: number, stats: DashboardStats) => {
  const data = [];
  const today = new Date();
  const statuses = ["terkirim", "pending", "gagal"];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const randomValue = Math.floor(Math.random() * stats.total_data);

    data.push({
      date: formatDate(date),
      fullDate: date.toISOString(),
      value: randomValue,
      terkirim: Math.floor(randomValue * 0.7),
      pending: Math.floor(randomValue * 0.2),
      gagal: Math.floor(randomValue * 0.1),
    });
  }
  return data;
};

// ============ ANIMATED NUMBER COMPONENT ============
const AnimatedNumber: React.FC<{ value: number; duration?: number }> = ({
  value,
  duration = 1000
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setDisplayValue(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <span>{displayValue.toLocaleString("id-ID")}</span>;
};

// ============ TOAST NOTIFICATION ============
const ToastContainer: React.FC<{
  toasts: Toast[];
  onRemove: (id: string) => void
}> = ({ toasts, onRemove }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${toast.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-200"
              : toast.type === "error"
                ? "bg-rose-50 border-rose-200 text-rose-800 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-200"
                : "bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200"
              }`}
          >
            {toast.type === "success" && <FaCheckCircle className="size-5" />}
            {toast.type === "error" && <FaTimesCircle className="size-5" />}
            {toast.type === "info" && <FaExclamationTriangle className="size-5" />}
            <span className="text-sm font-medium">{toast.message}</span>
            <button
              onClick={() => onRemove(toast.id)}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <FiX className="size-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// ============ MODAL COMPONENT ============
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">{title}</h3>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/[0.03] rounded-lg transition-colors"
              >
                <FiX className="size-5 text-gray-500" />
              </button>
            </div>
            <div className="p-4 md:p-6 max-h-[70vh] overflow-y-auto">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ============ METRIC CARD WITH INTERACTION ============
interface MetricCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  subtitle?: string;
  color: "blue" | "green" | "red" | "yellow" | "purple";
  onClick?: () => void;
  trend?: { value: number; isPositive: boolean };
}

const MetricCard: React.FC<MetricCardProps> = ({
  title, value, icon, subtitle, color, onClick, trend
}) => {
  const colorClasses = {
    blue: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
    red: "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400",
    yellow: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
    purple: "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400",
  };

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.1)" }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 cursor-pointer transition-all ${onClick ? "hover:border-blue-400 dark:hover:border-blue-600" : ""}`}
    >
      <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${colorClasses[color]}`}>
        {React.cloneElement(icon as React.ReactElement, { className: "size-6" } as any)}
      </div>

      <div className="flex items-end justify-between mt-5">
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">{title}</span>
          <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
            <AnimatedNumber value={value} />
          </h4>
          {subtitle && (
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>

        {trend && (
          <motion.span
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex items-center text-xs font-medium ${trend.isPositive ? "text-emerald-600" : "text-rose-600"
              }`}
          >
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </motion.span>
        )}
      </div>

      {onClick && (
        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
          <span className="text-xs text-blue-600 dark:text-blue-400 font-medium flex items-center gap-1">
            Lihat detail <FaEye className="size-3" />
          </span>
        </div>
      )}
    </motion.div>
  );
};

// ============ SKELETON LOADER ============
const MetricCardSkeleton = () => (
  <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6 animate-pulse">
    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl" />
    <div className="mt-5 space-y-3">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
    </div>
  </div>
);

// ============ MAIN DASHBOARD COMPONENT ============
export default function DashboardPageCopy() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    dateRange: "week",
    status: "all"
  });
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [selectedMetric, setSelectedMetric] = useState<string | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Toast helper
  const addToast = useCallback((message: string, type: Toast["type"]) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch data
  const fetchData = async (showToast = false) => {
    try {
      setIsRefreshing(true);
      const response = await fetch("http://localhost:8000/api/v1/dashboard/stats", {
        headers: { "Content-Type": "application/json" },
        // Cache busting untuk real-time feel
        cache: "no-store"
      });

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      const result: ApiResponse = await response.json();

      if (result.success) {
        setStats(result.data);
        setChartData(generateChartData(
          filters.dateRange === "today" ? 1 :
            filters.dateRange === "week" ? 7 :
              filters.dateRange === "month" ? 30 : 365,
          result.data
        ));
        setLastUpdated(new Date());
        if (showToast) addToast("Data berhasil diperbarui!", "success");
      } else {
        throw new Error("Gagal memuat data");
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Gagal memuat data dashboard");
      addToast("Gagal memperbarui data", "error");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Auto-refresh setiap 30 detik (optional)
    const interval = setInterval(() => fetchData(), 30000);
    return () => clearInterval(interval);
  }, []);

  // Re-fetch when filters change
  useEffect(() => {
    if (stats) {
      setChartData(generateChartData(
        filters.dateRange === "today" ? 1 :
          filters.dateRange === "week" ? 7 :
            filters.dateRange === "month" ? 30 : 365,
        stats
      ));
    }
  }, [filters.dateRange, stats]);

  // Export functionality
  const handleExport = (format: "csv" | "pdf") => {
    addToast(`Mengekspor data sebagai ${format.toUpperCase()}...`, "info");
    setTimeout(() => {
      addToast(`Export ${format.toUpperCase()} berhasil!`, "success");
    }, 1500);
  };

  // Pie chart data
  const pieData = stats ? [
    { name: "Terkirim", value: stats.data_terkirim, color: "#10b981" },
    { name: "Pending", value: stats.data_pending, color: "#f59e0b" },
    { name: "Gagal", value: stats.data_gagal, color: "#ef4444" },
  ].filter(d => d.value > 0) : [];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}: {entry.value.toLocaleString("id-ID")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6">
      {/* ========== TOASTS ========== */}
      <ToastContainer toasts={toasts} onRemove={removeToast} />

      {/* ========== HEADER ========== */}
      <div className="col-span-12 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800 dark:text-white/90"
          >
            📊 Dashboard Interaktif
          </motion.h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Pantau kinerja sistem secara real-time
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Filter */}
          <div className="relative">
            <select
              value={filters.dateRange}
              onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200"
            >
              <option value="today">Hari Ini</option>
              <option value="week">7 Hari</option>
              <option value="month">30 Hari</option>
              <option value="year">1 Tahun</option>
            </select>
            <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="appearance-none pl-3 pr-8 py-2 text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200"
            >
              <option value="all">Semua Status</option>
              <option value="sent">Terkirim</option>
              <option value="pending">Pending</option>
              <option value="failed">Gagal</option>
            </select>
            <FiFilter className="absolute right-2 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
          </div>

          {/* Export Dropdown */}
          <div className="relative group">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-white/[0.03] dark:text-gray-300 dark:border-gray-700 dark:hover:bg-white/[0.06] transition-colors">
              <FaDownload className="size-4" />
              Export
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-30">
              <button
                onClick={() => handleExport("csv")}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-t-xl"
              >
                Export CSV
              </button>
              <button
                onClick={() => handleExport("pdf")}
                className="w-full px-4 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/[0.03] rounded-b-xl"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Refresh Button */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => fetchData(true)}
            disabled={isRefreshing}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 ${isRefreshing ? "cursor-wait" : ""}`}
          >
            <FaSync className={`size-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Memuat..." : "Refresh"}
          </motion.button>
        </div>
      </div>

      {/* Last Updated Indicator */}
      <div className="col-span-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500"
        >
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Terakhir diperbarui: {lastUpdated.toLocaleTimeString("id-ID")}
          {isRefreshing && <span className="text-blue-600">• Memperbarui...</span>}
        </motion.div>
      </div>

      {/* ========== ERROR STATE ========== */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="col-span-12"
        >
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-900/20">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="text-rose-600 dark:text-rose-400 size-5" />
              <div>
                <p className="text-sm font-medium text-rose-700 dark:text-rose-300">{error}</p>
                <button
                  onClick={() => fetchData()}
                  className="text-xs text-rose-600 dark:text-rose-400 underline hover:no-underline mt-1"
                >
                  Coba lagi
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========== METRICS GRID ========== */}
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
          {loading ? (
            Array(4).fill(0).map((_, i) => <MetricCardSkeleton key={i} />)
          ) : stats ? (
            <>
              <MetricCard
                title="Total Kendaraan"
                value={stats.total_data}
                icon={<FaUserGroup />}
                color="blue"
                onClick={() => setSelectedMetric("total")}
              />
              <MetricCard
                title="Data Terkirim"
                value={stats.data_terkirim}
                icon={<FiBox />}
                subtitle={`${stats.persentase_terkirim}% success rate`}
                color="green"
                trend={{ value: 12.5, isPositive: true }}
                onClick={() => setSelectedMetric("sent")}
              />
              <MetricCard
                title="Data Pending"
                value={stats.data_pending}
                icon={<FaClock />}
                color="yellow"
                onClick={() => setSelectedMetric("pending")}
              />
              <MetricCard
                title="Data Gagal"
                value={stats.data_gagal}
                icon={<FaTimesCircle />}
                color="red"
                trend={{ value: 3.2, isPositive: false }}
                onClick={() => setSelectedMetric("failed")}
              />
            </>
          ) : null}
        </div>

        {/* Welcome Card with Search */}
        <div className="col-span-12 xl:col-span-5">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-2xl border border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 dark:border-gray-800 dark:from-white/[0.03] dark:to-white/[0.02] md:p-6"
          >
            <h2 className="text-lg font-bold text-gray-800 dark:text-white/90">
              👋 Selamat Datang!
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Dashboard ini membantu Anda memantau kinerja kendaraan dan data secara real-time.
            </p>

            {/* Interactive Search */}
            <div className="mt-4 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <input
                type="text"
                placeholder="Cari kendaraan atau data..."
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-white dark:bg-white/[0.03] border border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-200 placeholder-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addToast(`Mencari: "${(e.target as HTMLInputElement).value}"`, "info");
                  }
                }}
              />
            </div>

            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-500">
              <FaChartLine className="size-3" />
              <span>Update otomatis setiap 30 detik</span>
            </div>
          </motion.div>
        </div>

        {/* ========== CHARTS SECTION ========== */}
        <div className="col-span-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-800 dark:text-white/90">
                📈 Trend Data Harian
              </h3>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" /> Terkirim
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-amber-500" /> Pending
                </span>
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <span className="w-3 h-3 rounded-full bg-rose-500" /> Gagal
                </span>
              </div>
            </div>

            <div className="h-72">
              {loading ? (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
                    <XAxis
                      dataKey="date"
                      fontSize={11}
                      tick={{ fill: "currentColor" }}
                      className="text-gray-500 dark:text-gray-400"
                    />
                    <YAxis fontSize={11} tick={{ fill: "currentColor" }} className="text-gray-500 dark:text-gray-400" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend fontSize={12} />
                    <Bar dataKey="terkirim" name="Terkirim" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="pending" name="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="gagal" name="Gagal" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ========== RIGHT SIDEBAR ========== */}
      <div className="col-span-12 xl:col-span-5 space-y-6">
        {/* Financial Summary */}
        {loading ? (
          <MetricCardSkeleton />
        ) : stats && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
          >
            <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
              <FaMoneyBillWave className="text-emerald-500" />
              Ringkasan Keuangan
            </h3>

            <motion.div
              className="mt-6 text-3xl font-bold text-gray-800 dark:text-white/90"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {formatRupiah(stats.total_tagihan)}
            </motion.div>

            <div className="mt-6 space-y-4">
              {/* Progress with Tooltip */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Tingkat Keberhasilan</span>
                  <motion.span
                    className="font-medium text-emerald-600 dark:text-emerald-400"
                    whileHover={{ scale: 1.05 }}
                  >
                    {stats.persentase_terkirim}%
                  </motion.span>
                </div>
                <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 group">
                  <motion.div
                    className="absolute left-0 top-0 h-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full cursor-pointer"
                    initial={{ width: 0 }}
                    animate={{ width: `${stats.persentase_terkirim}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    whileHover={{ boxShadow: "0 0 20px rgba(16, 185, 129, 0.5)" }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-medium text-white drop-shadow-md">
                      {stats.data_terkirim}/{stats.total_data} data
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                {[
                  { label: "Sukses", value: stats.data_terkirim, color: "emerald" },
                  { label: "Gagal", value: stats.data_gagal, color: "rose" },
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`text-center p-4 bg-${item.color}-50 dark:bg-${item.color}-900/20 rounded-xl cursor-pointer`}
                  >
                    <p className={`text-2xl font-bold text-${item.color}-600 dark:text-${item.color}-400`}>
                      <AnimatedNumber value={item.value} duration={800} />
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Pie Chart - Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6"
        >
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 mb-4">
            🥧 Distribusi Status Data
          </h3>

          <div className="h-56">
            {loading || pieData.length === 0 ? (
              <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="none"
                        onMouseEnter={(e) => {
                          (e.target as SVGElement).style.filter = "brightness(1.1)";
                        }}
                        onMouseLeave={(e) => {
                          (e.target as SVGElement).style.filter = "brightness(1)";
                        }}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-sm">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-gray-600 dark:text-gray-400">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-2xl border border-gray-200 bg-gradient-to-br from-violet-50 to-purple-50 p-5 dark:border-gray-800 dark:from-white/[0.03] dark:to-white/[0.02] md:p-6"
        >
          <h3 className="text-base font-semibold text-gray-800 dark:text-white/90">
            ⚡ Aksi Cepat
          </h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {[
              { label: "Laporan Harian", icon: "📄", action: () => addToast("Membuka laporan...", "info") },
              { label: "Export Data", icon: "📤", action: () => handleExport("csv") },
              { label: "Notifikasi", icon: "🔔", action: () => addToast("Cek notifikasi...", "info") },
              { label: "Pengaturan", icon: "⚙️", action: () => addToast("Buka pengaturan...", "info") },
            ].map((item, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                onClick={item.action}
                className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-white/[0.03] rounded-xl border border-gray-200 dark:border-gray-700 hover:border-violet-400 dark:hover:border-violet-600 transition-colors"
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* ========== MODAL FOR METRIC DETAILS ========== */}
      <Modal
        isOpen={!!selectedMetric}
        onClose={() => setSelectedMetric(null)}
        title={`Detail: ${selectedMetric === "total" ? "Total Kendaraan" :
          selectedMetric === "sent" ? "Data Terkirim" :
            selectedMetric === "pending" ? "Data Pending" :
              selectedMetric === "failed" ? "Data Gagal" : ""
          }`}
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Berikut adalah rincian data untuk kategori yang dipilih:
          </p>

          {stats && (
            <div className="space-y-3">
              {[
                { label: "Total Data", value: stats.total_data },
                { label: "Terkirim", value: stats.data_terkirim, highlight: true },
                { label: "Pending", value: stats.data_pending },
                { label: "Gagal", value: stats.data_gagal },
                { label: "Success Rate", value: `${stats.persentase_terkirim}%` },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className={`flex justify-between items-center p-3 rounded-lg ${item.highlight
                    ? "bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
                    : "bg-gray-50 dark:bg-white/[0.02]"
                    }`}
                >
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.label}</span>
                  <span className={`font-semibold ${item.highlight ? "text-emerald-600 dark:text-emerald-400" : "text-gray-800 dark:text-white/90"}`}>
                    {typeof item.value === "number" ? item.value.toLocaleString("id-ID") : item.value}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
            <button
              onClick={() => {
                setSelectedMetric(null);
                addToast("Detail ditutup", "info");
              }}
              className="w-full py-2.5 text-sm font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}