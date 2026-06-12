// src/components/auth/LoginForm.tsx (versi pendek)
'use client';

import Link from 'next/link';
import { Input } from '@/components/ui/form/Input';
import { useLoginForm } from '@/libs/hooks/auth/useLoginForm';
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function LoginForm() {
    const { formData, errors, isLoading, handleChange, handleSubmit } = useLoginForm();
    const [showPassword, setShowPassword] = useState(false);
    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <Input
                id="email"
                label="Email"
                value={formData.email || ''}
                onChange={handleChange}
                error={errors.email?.[0] as string | undefined}
                placeholder="Masukkan email"
                required
            />
            <div className="relative">
                <Input
                    id="password"
                    label="Password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    error={errors.password?.[0]}
                    placeholder="Masukkan password"
                    required
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-[42px] text-zinc-500"
                >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all duration-200 disabled:opacity-70"
            >
                {isLoading ? 'Memproses...' : 'Log in'}
            </button>

            {/* <div className="flex flex-col space-y-2 pt-2 text-sm text-center">
                <p className="text-zinc-600">
                    Belum terdaftar?
                    <Link href="/register" className="text-blue-600 hover:underline ml-1">
                        Daftar Disini
                    </Link>
                </p>
                <Link href="/forgot-password" className="text-blue-600 hover:underline">
                    Lupa password?
                </Link>
            </div> */}
        </form>
    );
}

export default LoginForm;