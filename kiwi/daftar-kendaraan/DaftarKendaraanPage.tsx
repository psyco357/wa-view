"use client";
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useKendaraan from '../../libs/hooks/use-kendaraan';
import FormKendaraan from './partials/form-kendaraan';
import TableKendaraan from './partials/table-kendaraan';
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