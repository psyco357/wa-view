export interface Kendaraan {
  id: number;
  kode_wilayah: string;
  jenis_roda: string;
  nomor_polisi: string;
  nama_pemilik: string;
  tanggal_akhir_pajak: string;
  no_telepon: string;
  jumlah_tagihan: string;
  status_broadcast: string;
  pesan_blast: string | null;
  tanggal_kirim: string | null;
  keterangan_gagal: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaginationResponse<T> {
  current_page: number;
  data: T[];
  from: number | null;
  to: number | null;
  per_page: number;
  total: number;
  last_page: number;
  prev_page_url: string | null;
  next_page_url: string | null;
  path: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface FormDataKendaraan {
  kode_wilayah: string;
  jenis_roda: string;
  nomor_polisi: string;
  nama_pemilik: string;
  tanggal_akhir_pajak: string;
  no_telepon: string;
  jumlah_tagihan: string;
}

export const DEFAULT_FORM_VALUES: FormDataKendaraan = {
  kode_wilayah: "1817",
  jenis_roda: "",
  nomor_polisi: "",
  nama_pemilik: "",
  tanggal_akhir_pajak: "",
  no_telepon: "",
  jumlah_tagihan: "",
}
