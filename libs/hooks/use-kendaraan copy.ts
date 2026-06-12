import { useQuery } from "@tanstack/react-query";
import {
  kendaraanService,
  KendaraanParams,
} from "../services/kendaraan.service";

export const useKendaraan = (params: KendaraanParams) => {
  return useQuery({
    queryKey: ["kendaraan", params],
    queryFn: () => kendaraanService.getKendaraan(params),
  });
};
