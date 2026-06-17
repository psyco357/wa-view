"use client";
import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import useKendaraan from "../../libs/hooks/use-kendaraan";
import FormKendaraan from "./partials/form-kendaraan";
import TableKendaraan from "./partials/table-kendaraan";
// import { useWebSocketKendaraan } from '@/libs/hooks/useWebSocketKendaraan';

export default function DaftarKendaraanPage() {
  const {
    formMode,
    viewMode,
    openForm,
    closeForm,
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
    refetchKendaraan,
  } = useKendaraan();

  const getPaginationPages = (currentPage: number, lastPage: number) => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Jumlah halaman yang ditampilkan
    const halfVisible = Math.floor(maxVisible / 2);

    if (lastPage <= maxVisible) {
      for (let i = 1; i <= lastPage; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - halfVisible);
      let endPage = Math.min(lastPage - 1, currentPage + halfVisible);

      if (currentPage - halfVisible <= 2) {
        endPage = maxVisible - 1;
      }

      if (currentPage + halfVisible >= lastPage - 1) {
        startPage = lastPage - maxVisible + 2;
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < lastPage - 1) {
        pages.push("...");
      }

      pages.push(lastPage);
    }

    return pages;
  };

  return (
    <AnimatePresence mode="wait">
      {viewMode === "table" && (
        <motion.div
          key="daftar-kendaraan-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <TableKendaraan
            openForm={openForm}
            kendaraanData={kendaraanData}
            isLoading={isLoading}
            isError={isError}
            error={error}
            params={params}
            setSearch={setSearch}
            setPage={setPage}
            setPerPage={setPerPage}
            setStatusBroadcast={setStatusBroadcast}
            setJenisRoda={setJenisRoda}
            setDateRange={setDateRange}
            pagination={pagination}
            isFetching={isFetching}
            selectedRowIds={selectedRowIds}
            selectedCount={selectedCount}
            toggleRowSelection={toggleRowSelection}
            toggleAllRows={toggleAllRows}
            handleKirimBlast={handleKirimBlast}
            isAllSelected={isAllSelected}
            isSomeSelected={isSomeSelected}
            getPaginationPages={getPaginationPages}
          />
        </motion.div>
      )}
      {viewMode === "form" && (
        <motion.div
          key="form-kendaraan-page"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <FormKendaraan
            formMode={formMode}
            closeForm={closeForm}
            onSuccess={async () => {
              await refetchKendaraan();
              closeForm();
            }}
          />

          {/* Komponen untuk form tambah/edit/detail kendaraan akan ditambahkan di sini */}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
