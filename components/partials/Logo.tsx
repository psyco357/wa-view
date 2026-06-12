// src/components/ui/Logo.tsx
'use client';
import { PiChats } from "react-icons/pi";
interface LogoProps {
    className?: string;
}

export function Logo({ className = "h-10 w-10" }: LogoProps) {
    return (
        <svg
            className={`flex-shrink-0 text-blue-500 ${className}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <PiChats className="text-blue-500" size={25} />
        </svg>
    );
}