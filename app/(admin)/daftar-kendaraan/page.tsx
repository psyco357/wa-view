import App from "@/components/layouts/App";
import DaftarKendaraanPage from "@/kiwi/daftar-kendaraan/DaftarKendaraanPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Scode - Daftar Kendaraan',
    description: 'Welcome to the dashboard! Here you can manage users, view analytics, and configure settings.',
};



export default function DaftarKendaraan() {
    return (
        <App title="Daftar Kendaraan" description="Here you can manage the list of vehicles.">
            <DaftarKendaraanPage />
        </App>
    );
}