export function getReportColumns(handleDownload: (status: string) => void) {
  return [
    {
      id: "status_broadcast",
      header: "Status Delivery",
      headerClassName:
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
      cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
      cell: (row: any) => {
        const labels: Record<string, string> = {
          belum_dikirim: "Belum Dikirim",
          antrian: "Antrian",
          sedang_dikirim: "Sedang Dikirim",
          terkirim: "Terkirim",
          dibaca: "Dibaca",
          gagal: "Gagal",
          semua_status: "Semua Status",
        };

        return (
          <span className="font-medium">
            {labels[row.status_broadcast] ?? row.status_broadcast}
          </span>
        );
      },
    },
    {
      id: "total",
      header: "Jumlah Pesan",
      headerClassName:
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
      cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
     cell: (row: any) => (
        <span className="font-semibold">{row.total}</span>
      ),
    },
    {
      id: "action",
      header: "Aksi",
      headerClassName:
        "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
      cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
      cell: (row: any) => (
        <button
          className="px-3 py-1 text-sm text-white bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors"
          onClick={() => handleDownload(row.status_broadcast)}
        >
          Download
        </button>
      ),
    },
  ];
}

export default getReportColumns;
