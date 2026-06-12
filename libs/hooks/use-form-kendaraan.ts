
import { useState } from "react";
import { FormDataKendaraan,DEFAULT_FORM_VALUES } from "../types/kendaraan.type";
import { kendaraanService } from "../services/kendaraan.service";
import Swal from "sweetalert2";
import { ViewMode } from "../types/mode.types";

export function useFormKendaraan(onSuccess?: () => void | Promise<void>) {
    // Implementasi logika form kendaraan di sini
    const [formData, setFormData] = useState<Partial<FormDataKendaraan>>({ ...DEFAULT_FORM_VALUES });
    const [errors, setErrors] = useState<Partial<Record<keyof FormDataKendaraan, string>>>({});
    const [viewMode, setViewMode] = useState<ViewMode>("table");

    const handleChange = (field: keyof FormDataKendaraan, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const resetForm = () => {
        setFormData({ ...DEFAULT_FORM_VALUES });
        setErrors({});
    };

    const handleSubmit = async () => {
        // Validasi form sebelum submit
        const newErrors: Partial<Record<keyof FormDataKendaraan, string>> = {};
        if (!formData.nomor_polisi) {
            newErrors.nomor_polisi = "Nomor Polisi wajib diisi";
        }
        if (!formData.nama_pemilik) {
            newErrors.nama_pemilik = "Nama Pemilik wajib diisi";
        }
        if (!formData.no_telepon) {
            newErrors.no_telepon = "No Hp wajib diisi";
        }
        setErrors(newErrors);
        if (Object.keys(newErrors).length === 0) {
             Swal.fire({
            title: 'Menyimpan data...',
            text: 'Mohon tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

            try {
                await kendaraanService.saveKendaraan(formData);

                await Swal.fire({
                    icon: 'success',
                    title: 'Berhasil',
                    text: 'Data kendaraan berhasil disimpan',
                });

                resetForm(); // Reset form setelah submit sukses

                if (onSuccess) {
                    await onSuccess();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Gagal',
                    text: 'Gagal menyimpan data kendaraan',
                });
            }
        }
    };

    return {
        formData,
        handleChange,
        resetForm,
        errors,
        setErrors,
        handleSubmit,
        viewMode,
        setViewMode,
    };
}