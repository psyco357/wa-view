"use client";

import { useSidebar } from "@/components/context/SidebarContext";
// import AppHeader from "@/layouts/AppHeader";
import AppSidebar from "@/components/layouts/AppSidebar";
// import Backdrop from "@/layouts/Backdrop";
import BreadCrumb from "@/components/common/PageBreadCrumb";
import AppHeader from "@/components/layouts/AppHeader";

import React from "react";
// import AppHeader from "./AppHeader";

export default function App({
    title,
    children,
    description,
}: {
    title?: string;
    children: React.ReactNode;
    description?: string;
}) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    // Dynamic class for main content margin based on sidebar state
    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
            ? "lg:ml-[290px]"
            : "lg:ml-[90px]";

    return (
        <div className="min-h-screen xl:flex">
            {/* Sidebar and Backdrop */}
            <AppSidebar />
            {/* <Backdrop /> */}
            {/* Main Content Area */}
            <div
                className={`flex-1 transition-all  duration-300 ease-in-out ${mainContentMargin}`}
            >
                {/* Header */}
                <AppHeader />
                {/* Page Content */}
                <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                    <BreadCrumb pageTitle={title ?? ""} />
                    {children}
                </div>
            </div>
        </div>
    );
}
