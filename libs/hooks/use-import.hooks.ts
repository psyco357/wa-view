import { importService } from "@/libs/services/import.service";
import { useState, useRef } from "react";
import { FileWithSize, StatusType } from "../types/import.types";
import Swal from "sweetalert2";

export function useImport() {
  const [file, setFile] = useState<FileWithSize | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [status, setStatus] = useState<StatusType>("idle");
  const [message, setMessage] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format ukuran file agar mudah dibaca (Bytes, KB, MB)
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Validasi file (CSV, XLSX, XLS)
  const validateFile = (selectedFile: File): boolean => {
    const validTypes = [
      "text/csv",
      "application/vnd.ms-excel", // .xls
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    ];
    const validExtensions = [".csv", ".xlsx", ".xls"];

    const isValidType = validTypes.includes(selectedFile.type);
    const isValidExtension = validExtensions.some((ext) =>
      selectedFile.name.toLowerCase().endsWith(ext),
    );

    if (!isValidType && !isValidExtension) {
      setStatus("error");
      setMessage(
        "Format file tidak valid. Harap unggah file dengan ekstensi .csv, .xlsx, atau .xls",
      );
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      // Maksimal 5MB
      setStatus("error");
      setMessage("Ukuran file terlalu besar. Maksimal 5MB.");
      return false;
    }
    return true;
  };

  // Mendapatkan ekstensi file
  const getFileExtension = (filename: string): string => {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  };

  // Handler saat file dipilih melalui dialog
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      setStatus("idle");
      setMessage("");
    }
  };

  // Handler Drag & Drop
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
      setStatus("idle");
      setMessage("");
    }
  };

  // Hapus file yang dipilih
  const handleRemoveFile = () => {
    setFile(null);
    setStatus("idle");
    setMessage("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handler Submit Form
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!file) {
      await Swal.fire({
        icon: "warning",
        title: "File belum dipilih",
        text: "Silakan pilih file CSV atau Excel terlebih dahulu.",
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await importService.importData(file);

      await Swal.fire({
        icon: "success",
        title: "Import Berhasil",
        text: result.message ?? `Berhasil mengimport "${file.name}"`,
      });

      handleRemoveFile();
    } catch (error: any) {
      await Swal.fire({
        icon: "error",
        title: "Import Gagal",
        text: error.message || "Terjadi kesalahan saat import data",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Download template berdasarkan format yang dipilih
  const handleDownloadTemplate = () => {
    importService
      .downloadTemplate()
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "template_import_kendaraan.xlsx");
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((error) => {
        setStatus("error");
        setMessage(`Gagal mendownload template: ${error.message}`);
      });
  };

  return {
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
  };
}
