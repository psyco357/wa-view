// src/app/(auth)/login/page.tsx
import { Metadata } from 'next';
import LoginForm from '@/kiwi/auth/LoginForm';
import AppAuth from '@/components/layouts/AppAuth';

export const metadata: Metadata = {
    title: 'Login - Koperasi SUKA RESIK',
    description: 'Masuk ke akun koperasi Anda',
};

export default function LoginPage() {
    return (
        <AppAuth title="Login" subtitle="Masuk ke akun koperasi Anda">
            <LoginForm />
        </AppAuth>
    );
}