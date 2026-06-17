"use client";

import { useEffect, useState } from "react";
import { dashboardService } from "@/libs/services/dashboard.service";
import { DashboardSumary } from "@/libs/types/dashboard.types";
import { MdEmojiTransportation } from "react-icons/md";
import { IoMdCheckmarkCircleOutline, IoIosCloseCircleOutline } from "react-icons/io";
import { LuClockAlert } from "react-icons/lu";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { FaMoneyBillWave } from "react-icons/fa";

export default function DashboardPage() {
  const [dashboard, setDashboard] = useState<DashboardSumary | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const data = await dashboardService.getDashboardData();
        setDashboard(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90">
            <MdEmojiTransportation width="28" height="28" className="h-7 w-7" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{dashboard?.totalData}</h3>
            <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">Total Data
            </p>
          </div>
        </article>

        <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90">
            <IoMdCheckmarkCircleOutline width="28" height="28" className="h-7 w-7 text-green-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{dashboard?.dataTerkirim}</h3>
            <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">Data Terkirim
            </p>
          </div>
        </article>
        <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90">
            <IoIosCloseCircleOutline width="28" height="28" className="h-7 w-7 text-red-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{dashboard?.dataGagal}</h3>
            <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">Gagal Terkirim
            </p>
          </div>
        </article>
        <article className="flex items-center gap-5 rounded-2xl border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-white/3">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-white/90">
            <LuClockAlert width="28" height="28" className="h-7 w-7 text-yellow-500" />
          </div>
          <div>
            <h3 className="text-2xl font-semibold text-gray-800 dark:text-white/90">{dashboard?.dataBelumDikirim}</h3>
            <p className="flex items-center gap-3 text-gray-500 dark:text-gray-400">Belum Dikirim
            </p>
          </div>
        </article>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <h3 className="text-base font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
          <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" className="text-emerald-500" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 112.5L0 422.3c0 18 10.1 35 27 41.3c87 32.5 174 10.3 261-11.9c79.8-20.3 159.6-40.7 239.3-18.9c23 6.3 48.7-9.5 48.7-33.4l0-309.9c0-18-10.1-35-27-41.3C462 15.9 375 38.1 288 60.3C208.2 80.6 128.4 100.9 48.7 79.1C25.6 72.8 0 88.6 0 112.5zM288 352c-44.2 0-80-43-80-96s35.8-96 80-96s80 43 80 96s-35.8 96-80 96zM64 352c35.3 0 64 28.7 64 64l-64 0 0-64zm64-208c0 35.3-28.7 64-64 64l0-64 64 0zM512 304l0 64-64 0c0-35.3 28.7-64 64-64zM448 96l64 0 0 64c-35.3 0-64-28.7-64-64z"></path>
          </svg>
          Total Tagihan
        </h3>
        <div className="mt-6 text-3xl font-bold text-gray-800 dark:text-white/90" style={{ transform: "none" }}>Rp&nbsp;{dashboard?.totalTagihan?.toLocaleString('id-ID')}</div>
        <div className="mt-6 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Tingkat Keberhasilan</span>
              <span className="font-medium text-emerald-600 dark:text-emerald-400">{dashboard?.persentaseTerkirim}%</span>
            </div>
            <div className="relative w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 group">
              <div className="absolute left-0 top-0 h-3 bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full cursor-pointer" style={{ width: `${dashboard?.persentaseTerkirim}%` }}></div>
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs font-medium text-white drop-shadow-md">{dashboard?.dataTerkirim}/{dashboard?.totalData} data</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="text-center p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl cursor-pointer" tabIndex={0}>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400"><span>{dashboard?.dataTerkirim}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sukses</p>
            </div>
            <div className="text-center p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl cursor-pointer" tabIndex={0}>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400"><span>{dashboard?.dataGagal}</span></p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Gagal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}