# WA View

Frontend dashboard untuk pengelolaan data kendaraan, broadcast WhatsApp, chat, import/export, dan laporan.

## Teknologi

- Next.js 16 (Turbopack)
- React 19
- TypeScript
- Tailwind CSS
- React Query

## Prasyarat

- Node.js 20+ (disarankan LTS terbaru)
- npm 10+

## Instalasi

1. Clone repository.
2. Masuk ke folder project.
3. Install dependency.

```bash
npm install
```

## Konfigurasi Environment

Buat file `.env.local` lalu isi variabel berikut:

```env
NEXT_PUBLIC_BASE_API=http://103.6.54.230:3502/api
NEXT_PUBLIC_WS_URL=http://103.6.54.230:3502
```

Catatan:
- `NEXT_PUBLIC_BASE_API` dipakai untuk request API utama.
- `NEXT_PUBLIC_WS_URL` dipakai untuk koneksi WebSocket/real-time update.

## Menjalankan Aplikasi

### Mode Development

```bash
npm run dev
```

Lalu buka:

http://localhost:3000

### Build Production

```bash
npm run build
```

### Jalankan Hasil Build

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Penggunaan Aplikasi

1. Akses halaman login.
2. Login menggunakan akun yang valid dari backend.
3. Setelah login, user akan diarahkan ke dashboard admin.
4. Gunakan menu utama untuk:
	- Dashboard ringkasan data
	- Daftar kendaraan (filter, pilih data, kirim blast)
	- Import kendaraan
	- Chat
	- Reports

## Struktur Folder Utama

- `app/` route App Router (termasuk layout dan page utama)
- `pages/` komponen halaman legacy/internal modules
- `components/` komponen UI dan context
- `libs/services/` layer API service
- `libs/hooks/` custom hook aplikasi
- `libs/types/` type/interface TypeScript

## Catatan Tambahan

- Project menggunakan proteksi route berbasis `proxy.ts`.
- Token autentikasi disimpan saat login, lalu otomatis digunakan untuk request API yang membutuhkan otorisasi.
