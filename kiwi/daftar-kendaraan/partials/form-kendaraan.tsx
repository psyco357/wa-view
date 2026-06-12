"use client";
import { motion } from "framer-motion";
import { FormMode } from "../../../libs/types/mode.types";
import { useFormKendaraan } from "@/libs/hooks/use-form-kendaraan";
import { FormDataKendaraan } from "@/libs/types/kendaraan.type";

type FormKendaraanProps = {
  formMode: FormMode;
  closeForm: () => void;
  onSuccess?: () => void | Promise<void>;
  initialData?: Partial<FormDataKendaraan>; // Untuk mode edit
};

export default function FormKendaraan({
  formMode,
  closeForm,
  onSuccess,
  initialData,
}: FormKendaraanProps) {
  const { formData, handleChange, errors, handleSubmit } = useFormKendaraan(onSuccess ?? closeForm);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {formMode === "add"
              ? "Tambah Kendaraan Baru"
              : formMode === "edit"
                ? "Edit Kendaraan"
                : "Detail Kendaraan"}
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => closeForm()}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 flex items-center gap-2"
          >
            {/* Icon untuk kembali ke daftar kendaraan */}
            <span className="h-5 w-5">🔙</span>
            Back to List
          </motion.button>
        </div>

        {/* Form untuk menambahkan atau mengedit kendaraan akan ditampilkan di sini */}
        <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Contoh input untuk nama kendaraan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Polisi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nomor_polisi}
              onChange={(e) => handleChange("nomor_polisi", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.nomor_polisi ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan Nomor Polisi"
            />
            {errors.nomor_polisi && (
              <p className="mt-1 text-sm text-red-500">{errors.nomor_polisi}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Pemilik <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.nama_pemilik}
              onChange={(e) => handleChange("nama_pemilik", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.nama_pemilik ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan Nama Pemilik"
            />
            {errors.nama_pemilik && (
              <p className="mt-1 text-sm text-red-500">{errors.nama_pemilik}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              No Hp <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.no_telepon}
              onChange={(e) => handleChange("no_telepon", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.no_telepon ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan No Hp"
            />
            {errors.no_telepon && (
              <p className="mt-1 text-sm text-red-500">{errors.no_telepon}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jumlah Tagihan <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.jumlah_tagihan}
              onChange={(e) => handleChange("jumlah_tagihan", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.jumlah_tagihan ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Masukkan Jumlah Tagihan"
            />
            {errors.jumlah_tagihan && (
              <p className="mt-1 text-sm text-red-500">
                {errors.jumlah_tagihan}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Akhir Pajak <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={formData.tanggal_akhir_pajak}
              onChange={(e) =>
                handleChange("tanggal_akhir_pajak", e.target.value)
              }
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                errors.tanggal_akhir_pajak
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Masukkan Tanggal Akhir Pajak"
            />
            {errors.tanggal_akhir_pajak && (
              <p className="mt-1 text-sm text-red-500">
                {errors.tanggal_akhir_pajak}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jenis Roda <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.jenis_roda}
              onChange={(e) => handleChange("jenis_roda", e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 ${
                  errors.jenis_roda ? "border-red-500" : "border-gray-300"
                }`}
            >
              <option value="">Pilih Jenis Roda</option>
              <option value="r2">2 Roda</option>
              <option value="r4">4 Roda</option>
            </select>
            {errors.jenis_roda && (
              <p className="mt-1 text-sm text-red-500">{errors.jenis_roda}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kode Wilayah <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.kode_wilayah}
              onChange={(e) => handleChange("kode_wilayah", e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-gray-100 ${
                errors.kode_wilayah ? "border-red-500" : "border-gray-300"
              }`}
              readOnly
              placeholder="Masukkan Kode Wilayah"
            />
            {errors.kode_wilayah && (
              <p className="mt-1 text-sm text-red-500">{errors.kode_wilayah}</p>
            )}
          </div>

          {/* Tambahkan input lainnya sesuai kebutuhan */}
          <div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              {formMode === "add"
                ? "Simpan"
                : formMode === "edit"
                  ? "Simpan Perubahan"
                  : "Kembali"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
