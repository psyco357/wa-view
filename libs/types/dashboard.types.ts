export interface ResponseApi<T> {
  success: boolean;
  data: T;
}
// data mentah yang diterima dari API
export interface DashboardData {
  total_data: number;
  data_terkirim: number;
  data_gagal: number;
  data_berhasil?: number;
  data_belum_dikirim: number;
  persentase_terkirim: number;
  total_tagihan: string;
}
// data yang sudah di transformasi untuk digunakan di frontend
export interface DashboardSumary {
  totalData: number;
  dataTerkirim: number;
  dataGagal: number;
  dataBerhasil: number;
  dataBelumDikirim: number;
  persentaseTerkirim: number;
  totalTagihan: number;
}
