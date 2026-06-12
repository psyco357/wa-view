import { useEffect, useState } from "react";
import { exportService } from "@/libs/services/export.service";
import { ReportItem } from "../types/export.types";
import { format } from "date-fns";

export function useReport(startDate?: Date, endDate?: Date) {
  const [data, setData] = useState<ReportItem[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReport = async () => {
    try {
      setLoading(true);

      const response = await exportService.getReport(
        startDate ? format(startDate, "yyyy-MM-dd") : undefined,
        endDate ? format(endDate, "yyyy-MM-dd") : undefined,
      );

      setData(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [startDate, endDate]);

  const handleDownload = async (status: string) => {
    try {
      setLoading(true);

      const formatDate = (date?: Date) =>
        date ? format(date, "yyyy-MM-dd") : "";

      const blob = await exportService.exportReport(
        formatDate(startDate),
        formatDate(endDate),
        status,
      );

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `report_${status}_${formatDate(new Date())}.xlsx`;

      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download report:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    data,
    loading,
    refetch: fetchReport,
    download: handleDownload,
  };
}
