import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";
import {
  kendaraanService,
  KendaraanParams,
} from "../services/kendaraan.service";
import { Kendaraan } from "../types/kendaraan.type";
import { FormMode, ViewMode } from "../types/mode.types";
import { blastWAService } from "@/libs/services/blast-wa.service";

const DEFAULT_PARAMS: KendaraanParams = {
  page: 1,
  per_page: 10,
  search: "",
  status_broadcast: "all",
  jenis_roda: "all",
};

export default function useKendaraan() {
  const [formMode, setFormMode] = useState<FormMode>("add");
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [params, setParams] = useState<KendaraanParams>(DEFAULT_PARAMS);
  const [selectedRowIds, setSelectedRowIds] = useState<number[]>([]);

  // set buka tutup form tambah/edit/detail kendaraan
  const openForm = (mode: FormMode) => {
    setFormMode(mode);
    setViewMode("form");
  };

  const closeForm = () => {
    setViewMode("table");
  };

  const serverParams = useMemo(
    () => ({
      page: params.page,
      per_page: params.per_page,
      search: params.search,
      start_date: params.start_date,
      end_date: params.end_date,
    }),
    [params.page, params.per_page, params.search, params.start_date, params.end_date],
  );

  const kendaraanQuery = useQuery({
    queryKey: ["kendaraan", serverParams],
    queryFn: () => kendaraanService.getKendaraan(serverParams),
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    setSelectedRowIds([]);
  }, [params]);

  const kendaraanData = useMemo(() => {
    const rows = kendaraanQuery.data?.data ?? [];

    return rows.filter((item) => {
      const matchesStatus =
        !params.status_broadcast ||
        params.status_broadcast === "all" ||
        item.status_broadcast === params.status_broadcast;

      const matchesJenisRoda =
        !params.jenis_roda ||
        params.jenis_roda === "all" ||
        item.jenis_roda === params.jenis_roda;

      return matchesStatus && matchesJenisRoda;
    });
  }, [
    kendaraanQuery.data?.data,
    params.jenis_roda,
    params.status_broadcast,
  ]);

  const selectedRows = useMemo(
    () => kendaraanData.filter((item) => selectedRowIds.includes(item.id)),
    [kendaraanData, selectedRowIds],
  );

  const toggleRowSelection = (id: number) => {
    setSelectedRowIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id],
    );
  };

  const toggleAllRows = (checked: boolean) => {
    setSelectedRowIds(checked ? kendaraanData.map((item) => item.id) : []);
  };

  const handleKirimBlast = async () => {
    if (selectedRows.length === 0) {
      return;
    }
    console.log("Selected Row IDs:", selectedRowIds);
    const { value: mediaTemplate } = await Swal.fire({
      title: "Pilih Tipe Media",
      input: "select",
      inputOptions: {
        text: "Text",
        image: "Gambar",
        video: "Video",
      },
      inputPlaceholder: "Pilih media",
      showCancelButton: true,
      confirmButtonText: "Kirim",
      cancelButtonText: "Batal",
      inputValidator: (value) => {
        if (!value) {
          return "Silakan pilih media terlebih dahulu";
        }
      },
    });

    if (!mediaTemplate) {
      return;
    }

    try {
      const response = await blastWAService.sendMassBlast({
        kendaraan_ids: selectedRows.map((item) => item.id),
        media_template: mediaTemplate,
      });

      if (response.success) {
        Swal.fire({
          icon: "success",
          title: "Blast berhasil dikirim",
          text: `Pesan berhasil dikirim ke ${selectedRows.length} kendaraan.`,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal mengirim blast",
          text: response.message,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Terjadi kesalahan",
        text: "Gagal mengirim blast. Silakan coba lagi.",
      });
    }
  };

  const setSearch = (search: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      search,
    }));
  };

  const setPage = (page: number) => {
    setParams((prev) => ({
      ...prev,
      page,
    }));
  };

  const setPerPage = (per_page: number) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      per_page,
    }));
  };

  const setStatusBroadcast = (status_broadcast: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      status_broadcast,
    }));
  };

  const setJenisRoda = (jenis_roda: string) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      jenis_roda,
    }));
  };

  const setDateRange = (range: DateRange | undefined) => {
    setParams((prev) => ({
      ...prev,
      page: 1,
      start_date: range?.from ? format(range.from, "yyyy-MM-dd") : undefined,
      end_date: range?.to ? format(range.to, "yyyy-MM-dd") : undefined,
    }));
  };

  // fungsi untuk Blast pesan ke kendaraan yang dipilih, update status broadcast menjadi "pending" untuk kendaraan tersebut

  return {
    formMode,
    setFormMode,
    viewMode,
    setViewMode,
    params,
    setParams,
    setSearch,
    setPage,
    setPerPage,
    setStatusBroadcast,
    setJenisRoda,
    setDateRange,
    selectedRowIds,
    selectedRows,
    selectedCount: selectedRows.length,
    toggleRowSelection,
    toggleAllRows,
    openForm,
    closeForm,
    handleKirimBlast,
    kendaraanQuery,
    kendaraanData,
    pagination: kendaraanQuery.data,
    isLoading: kendaraanQuery.isLoading,
    isFetching: kendaraanQuery.isFetching,
    isError: kendaraanQuery.isError,
    error: kendaraanQuery.error,
    refetchKendaraan: kendaraanQuery.refetch,
    isAllSelected:
      kendaraanData.length > 0 &&
      selectedRowIds.length === kendaraanData.length,
    isSomeSelected:
      selectedRowIds.length > 0 && selectedRowIds.length < kendaraanData.length,
  };
}
