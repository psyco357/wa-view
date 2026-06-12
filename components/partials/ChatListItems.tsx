"use client";

import { useChat } from "../context/ChatContext";
import { Contact } from "@/libs/types/chat.types";

interface ChatListItemProps {
    contact: Contact;
    isCollapsed?: boolean;
    isSelected?: boolean;
    onClick?: () => void;
}

export default function ChatListItem({ contact, isCollapsed = false, isSelected = false, onClick }: ChatListItemProps) {
    const { markAsRead } = useChat();

    const handleClick = () => {
        onClick?.();
        if (contact.unread > 0) {
            markAsRead(contact.id);
        }
    };

    // Tampilan collapsed (sidebar mini) - hanya avatar
    if (isCollapsed) {
        return (
            <button
                onClick={handleClick}
                className={`relative flex items-center justify-center w-full py-3 transition-colors ${isSelected ? "bg-blue-50 dark:bg-blue-900/20" : "hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                title={contact.name}
            >
                <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                        {contact.avatar}
                    </div>
                    {contact.online && (
                        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                    )}
                </div>
                {contact.unread > 0 && (
                    <span className="absolute top-2 right-4 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-red-500 rounded-full">
                        {contact.unread}
                    </span>
                )}
            </button>
        );
    }

    // Tampilan normal (sidebar lebar)
    return (
        <button
            onClick={handleClick}
            className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors text-left ${isSelected
                    ? "bg-blue-50 dark:bg-blue-900/20"
                    : "hover:bg-gray-100 dark:hover:bg-gray-800"
                }`}
        >
            <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {contact.avatar}
                </div>
                {contact.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full" />
                )}
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                    <h4 className={`font-medium truncate ${isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-900 dark:text-white"}`}>
                        {contact.name}
                    </h4>
                    <span className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0 ml-2">
                        {contact.time}
                    </span>
                </div>
                <div className="flex items-center justify-between mt-0.5">
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                        {contact.lastMessage}
                    </p>
                    {contact.unread > 0 && (
                        <span className="ml-2 flex-shrink-0 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold text-white bg-blue-600 rounded-full">
                            {contact.unread}
                        </span>
                    )}
                </div>
            </div>
        </button>
    );
}