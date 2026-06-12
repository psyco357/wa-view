import App from "@/components/layouts/App";
// import DashboardPage from "@/pages/admin/dashboard";
import DashboardPage from "@/kiwi/dashboard/DashboardPage";
import DashboardPageCopy from "@/kiwi/dashboard/DashboardPage copy";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Scode - Dashboard',
    description: 'Welcome to the dashboard! Here you can manage users, view analytics, and configure settings.',
};



export default function Dashboard() {
    return (
        <App description="Welcome to the admin dashboard! Here you can manage users, view analytics, and configure settings.">
            <DashboardPage />
            {/* <DashboardPageCopy /> */}
            {/* <h1>Dashboard Content Here</h1> */}
        </App>
    );
}