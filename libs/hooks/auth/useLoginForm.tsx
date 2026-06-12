import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/libs/services/auth.service';

export function useLoginForm() {
    const router = useRouter();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState<Record<string, string[]>>({});
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.id]: e.target.value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});
        try {
            // Use auth service to login
            await authService.login(formData);
            // Redirect to dashboard after successful login
            router.push('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            const errorMessage = error instanceof Error ? error.message : 'An error occurred. Please try again.';
            setErrors({ general: [errorMessage] });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        formData, errors, isLoading, handleChange, handleSubmit
    }
}