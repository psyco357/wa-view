import App from "@/components/layouts/App";
import ReportPage from "@/kiwi/report/ReportPage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Scode - Laporan',
    description: 'Here you can view and generate reports based on the vehicle data.',
};


export default function Report() {
    return (
        <App title="Laporan" description="Here you can view and generate reports based on the vehicle data.">
            <ReportPage />
        </App>
    );
}