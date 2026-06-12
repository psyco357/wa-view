import App from "@/components/layouts/App";
import ImportKendaraanPage from "@/kiwi/import-kendaraan/ImportKendaraanPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Scode - Import Kendaraan',
    description: 'Here you can import vehicle data from a CSV file.',
};

export default function ImportKendaraan() {
    return (
        <App title="Import Kendaraan" description="Here you can import vehicle data.">
            <ImportKendaraanPage />
        </App>

    );
}