"use client";

import { useChat } from "../context/ChatContext";
import { useSidebar } from "../context/SidebarContext";
import ChatListItem from "../partials/ChatListItems";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MdArrowBack } from "react-icons/md";

export default function ChatSidebar() {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
    const { contacts, setSelectedContact, selectedContact } = useChat();
    const [searchQuery, setSearchQuery] = useState("");

    // Filter kontak berdasarkan pencarian
    const filteredContacts = contacts.filter((contact) =>
        contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const isWide = isExpanded || isHovered || isMobileOpen;

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
            ${isWide ? "w-[290px]" : "w-[90px]"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
            lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className={`py-8 flex ${!isWide ? "lg:justify-center" : "justify-start"}`}>
                <Link href="/dashboard" className="flex items-center text-sm font-semibold text-gray-500 hover:text-gray-700 dark:text-gray-400">
                    <MdArrowBack className="w-4 h-4 mr-2" />
                    Kembali ke beranda
                </Link>
            </div>
            {/* Logo */}
            <div className={`flex ${!isWide ? "lg:justify-center" : "lg:justify-start px-3 hidden lg:flex "}`}>
                <Link href="/">
                    {isWide ? (
                        <>
                            <Image className="dark:hidden" src="/images/ftf.jpg" alt="Logo" width={80} height={40} />
                            <Image className="hidden dark:block" src="/images/ftf.jpg" alt="Logo" width={150} height={40} />
                        </>
                    ) : (
                        <Image src="/images/ftf-icon.jpg" alt="Logo" width={32} height={32} />
                    )}
                </Link>
            </div>

            {/* Search - hanya tampil saat sidebar lebar */}
            {isWide && (
                <div className="px-2 pb-3">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            placeholder="Cari chat..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full h-10 pl-10 pr-4 rounded-lg bg-gray-100 dark:bg-gray-800 border-0 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:text-white placeholder-gray-500"
                            type="text"
                        />
                    </div>
                </div>
            )}

            {/* Daftar Kontak */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar flex-1">
                {filteredContacts.length > 0 ? (
                    filteredContacts.map((contact) => (
                        <ChatListItem
                            key={contact.id}
                            contact={contact}
                            isCollapsed={!isWide}
                            isSelected={selectedContact?.id === contact.id}
                            onClick={() => setSelectedContact(contact)}
                        />
                    ))
                ) : (
                    <div className="px-4 py-8 text-center text-sm text-gray-500">
                        Tidak ada kontak
                    </div>
                )}
            </div>
        </aside>
    );
}