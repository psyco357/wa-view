"use client";

import { useState, useRef } from 'react';
import {
    FiUploadCloud,
    FiFileText,
    FiX,
    FiAlertCircle,
    FiCheckCircle,
    FiLoader,
    FiDownload
} from 'react-icons/fi';

import { useImport } from '@/libs/hooks/use-import.hooks';

export default function ImportKendaraanPage() {
    const {
        file,
        setFile,
        isDragging,
        setIsDragging,
        isLoading,
        setIsLoading,
        status,
        setStatus,
        message,
        setMessage,
        fileInputRef,
        formatFileSize,
        getFileExtension,
        handleFileChange,
        handleDragOver,
        handleDragLeave,
        handleDrop,
        handleRemoveFile,
        handleSubmit,
        handleDownloadTemplate,
    } = useImport();

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <FiUploadCloud className="text-blue-600" />
                    Import Data Kendaraan
                </h2>
                <p className="text-gray-500 mt-1 text-sm">
                    Unggah file CSV atau Excel untuk menambahkan atau memperbarui data kendaraan secara massal.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Area Drag & Drop */}
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${isDragging
                        ? 'border-blue-500 bg-blue-50 scale-[1.01]'
                        : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
                        }`}
                >
                    <input
                        type="file"
                        id="file"
                        name="file"
                        accept=".csv,.xlsx,.xls,text/csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                    />

                    {!file ? (
                        <div className="space-y-3">
                            <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                <FiUploadCloud className="text-2xl" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-gray-700">
                                    Klik untuk memilih atau seret file ke sini
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    Format yang didukung: .csv, .xlsx, .xls (Maksimal 5MB)
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
                            <div className="flex items-center space-x-3 overflow-hidden">
                                <FiFileText className="text-blue-600 text-2xl flex-shrink-0" />
                                <div className="text-left min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">
                                        {file.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {formatFileSize(file.size)} • {getFileExtension(file.name).toUpperCase()}
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveFile();
                                }}
                                className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors flex-shrink-0"
                                title="Hapus file"
                            >
                                <FiX className="text-xl" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Tombol Download Template */}
                <div className="flex justify-end">
                    <button
                        type="button"
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1 transition-colors"
                        onClick={handleDownloadTemplate}
                    >
                        <FiDownload className="text-base" />
                        Download Template (CSV/Excel)
                    </button>
                </div>

                {/* Pesan Status (Error / Success) */}
                {status !== 'idle' && (
                    <div className={`p-4 rounded-lg flex items-start gap-3 ${status === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                        }`}>
                        {status === 'success' ? (
                            <FiCheckCircle className="text-xl flex-shrink-0 mt-0.5" />
                        ) : (
                            <FiAlertCircle className="text-xl flex-shrink-0 mt-0.5" />
                        )}
                        <p className="text-sm font-medium">{message}</p>
                    </div>
                )}

                {/* Tombol Submit */}
                <button
                    type="submit"
                    disabled={isLoading || !file}
                    className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 ${isLoading || !file
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98] shadow-md hover:shadow-lg'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <FiLoader className="animate-spin text-xl" />
                            Memproses Import...
                        </>
                    ) : (
                        <>
                            <FiUploadCloud className="text-xl" />
                            Import Data Kendaraan
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}