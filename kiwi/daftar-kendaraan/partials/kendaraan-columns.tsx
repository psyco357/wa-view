import { useEffect, useRef } from "react";
import { Kendaraan } from "@/libs/types/kendaraan.type";

type SelectionColumnOptions = {
    selectedRowIds: number[];
    isAllSelected: boolean;
    isSomeSelected: boolean;
    toggleRowSelection: (id: number) => void;
    toggleAllRows: (checked: boolean) => void;
};

export type KendaraanColumn = {
    id: string;
    header: React.ReactNode;
    headerClassName?: string;
    cellClassName?: string;
    cell: (item: Kendaraan) => React.ReactNode;
};

function SelectionCheckbox({
    checked,
    indeterminate,
    onToggle,
    ariaLabel,
}: {
    checked: boolean;
    indeterminate?: boolean;
    onToggle: () => void;
    ariaLabel: string;
}) {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!inputRef.current) {
            return;
        }

        inputRef.current.indeterminate = Boolean(indeterminate && !checked);
    }, [checked, indeterminate]);

    return (
        <input
            ref={inputRef}
            type="checkbox"
            checked={checked}
            onChange={() => onToggle()}
            aria-label={ariaLabel}
            className="block h-4 w-4 shrink-0 cursor-pointer appearance-auto accent-gray-900 dark:accent-white"
        />
    );
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
});

const formatStatus = (status: string) => status.replaceAll("_", " ");

const getStatusBadgeClass = (status: string) => {
    if (status === "berhasil") {
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300";
    }

    if (status === "gagal") {
        return "bg-red-100 text-red-700 dark:bg-red-500/10 dark:text-red-300";
    }

    if (status === "pending") {
        return "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300";
    }

    return "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-300";
};

export function getKendaraanColumns({
    selectedRowIds,
    isAllSelected,
    isSomeSelected,
    toggleRowSelection,
    toggleAllRows,
}: SelectionColumnOptions): KendaraanColumn[] {
    return [
        {
            id: "select",
            headerClassName: "w-14 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-500 dark:text-gray-400",
            header: (
                <SelectionCheckbox
                    checked={isAllSelected}
                    indeterminate={isSomeSelected}
                    onToggle={() => toggleAllRows(!isAllSelected)}
                    ariaLabel="Pilih semua kendaraan"
                />
            ),
            cell: (item) => (
                <SelectionCheckbox
                    checked={selectedRowIds.includes(item.id)}
                    onToggle={() => toggleRowSelection(item.id)}
                    ariaLabel={`Pilih kendaraan ${item.nomor_polisi}`}
                />
            ),
        },
        {
            id: "nomor_polisi",
            header: "Nomor Polisi",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => (
                <span className="font-medium text-gray-800 dark:text-white/90">
                    {item.nomor_polisi}
                </span>
            ),
        },
        {
            id: "pemilik",
            header: "Pemilik",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => (
                <>
                    <div className="font-medium">{item.nama_pemilik}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{item.no_telepon}</div>
                </>
            ),
        },
        {
            id: "nomor_telepon",
            header: "Nomor Telepon",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => item.no_telepon,
        },
        {
            id: "kode_wilayah",
            header: "Kode Wilayah",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => item.kode_wilayah,
        },
        {
            id: "jenis_roda",
            header: "Jenis Roda",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => item.jenis_roda.toUpperCase(),
        },
        {
            id: "tanggal_akhir_pajak",
            header: "Akhir Pajak",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => dateFormatter.format(new Date(item.tanggal_akhir_pajak)),
        },
        {
            id: "status_broadcast",
            header: "Status Broadcast",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => (
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusBadgeClass(item.status_broadcast)}`}>
                    {formatStatus(item.status_broadcast)}
                </span>
            ),
        },
        {
            id: "jumlah_tagihan",
            header: "Jumlah Tagihan",
            headerClassName: "px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400",
            cellClassName: "px-4 py-3 text-sm text-gray-800 dark:text-gray-100",
            cell: (item) => currencyFormatter.format(Number(item.jumlah_tagihan)),
        },
    ];
}

export default getKendaraanColumns;