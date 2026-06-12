// src/components/ui/Input.tsx
interface InputProps {
    id: string;
    label: string;
    type?: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    placeholder?: string;
    required?: boolean;
}

export function Input({
    id, label, type = 'text', value, onChange, error, placeholder, required
}: InputProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                {label}
            </label>
            <input
                type={type}
                id={id}
                value={value}
                onChange={onChange}
                required={required}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    );
}