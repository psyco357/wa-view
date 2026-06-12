"use client";

import ChatSidebar from "@/components/layouts/ChatSidebar";
import AppHeader from "@/components/layouts/AppHeader";
import { useSidebar } from "../context/SidebarContext";
import { ChatProvider } from "../context/ChatContext";

export default function AppChat({
    title,
    children,
}: {
    title?: string;
    children: React.ReactNode;
}) {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    const mainContentMargin = isMobileOpen
        ? "ml-0"
        : isExpanded || isHovered
            ? "lg:ml-[290px]"
            : "lg:ml-[90px]";

    return (
        <ChatProvider>
            <div className="min-h-screen xl:flex">
                <ChatSidebar />
                <div className={`flex-1 transition-all duration-300 ease-in-out ${mainContentMargin}`}>
                    <AppHeader />

                    {/* ⭐ PENTING: Tambahkan flex flex-col h-[calc(100vh-64px)] */}
                    {/* 64px = tinggi AppHeader (sesuaikan dengan tinggi header Anda) */}
                    <div className="flex flex-col h-[calc(100vh-64px)] p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
                        {children}
                    </div>
                </div>
            </div>
        </ChatProvider>
    );
}