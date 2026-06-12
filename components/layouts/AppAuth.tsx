// src/app/(auth)/layout.tsx
import Image from 'next/image';
import Link from 'next/link';
import { Logo } from '@/components/partials/Logo';

export default function AuthLayout({
    title,
    children,
    subtitle,
}: {
    title: string;
    children: React.ReactNode;
    subtitle?: string;
}) {
    return (
        <div className="relative z-1 bg-white dark:bg-gray-900 lg:h-screen">
            <div className="min-h-screen w-full dark:bg-gray-900 lg:h-full">
                {/* Image Panel - Right Side */}
                <div className="max-lg:hidden bg-brand-950 overflow-hidden lg:fixed lg:inset-y-0 lg:right-0 lg:h-screen lg:w-1/2 dark:bg-white/5">
                    <Image
                        src="/images/jakarta-indonesia.jpg"
                        alt="Jakarta"
                        width={800}
                        height={600}
                        className="block h-full w-full object-cover"
                        priority
                    />
                </div>

                {/* Form Panel - Left Side */}
                <div className="relative z-10 w-full bg-white dark:bg-gray-900 lg:fixed lg:inset-y-0 lg:left-0 lg:h-screen lg:w-1/2 lg:overflow-y-auto duration-300 ease-linear no-scrollbar">
                    <div className="mx-auto w-full max-w-md pt-20 pb-10 px-6">
                        {/* Logo */}
                        <div className="flex justify-center mb-8">
                            <Link href="/" className="flex items-center space-x-3">
                                <Logo className="h-16 w-16 text-blue-500" />
                                <div className="flex flex-col">
                                    <span className="text-xs font-semibold text-blue-500 uppercase tracking-wide">
                                        WA BLAST
                                    </span>
                                    <span className="text-lg font-bold text-blue-500 -mt-0.5">
                                        Pemda Kuningan
                                    </span>
                                </div>
                            </Link>
                        </div>

                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-zinc-900 dark:text-white mb-2">
                                {title}
                            </h1>
                            {subtitle && (
                                <p className="text-zinc-600 dark:text-zinc-400">
                                    {subtitle}
                                </p>
                            )}
                        </div>

                        {/* Form Content */}
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}