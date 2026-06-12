/**
 * CONTOH PENGGUNAAN PROXY CLIENT
 * File ini hanya untuk referensi - bisa dihapus setelah paham
 */

// ==================== EXAMPLE 1: GET DATA ====================
// Di component atau hook
import { proxyClient } from "@/libs/services/proxy-client";
import { PaginationResponse, Kendaraan } from "@/libs/types/kendaraan.type";

async function getKendaraanData(page = 1) {
  try {
    // Request dikirim ke /api/proxy/v1/kendaraans?page=1
    // Proxy akan validasi token dan forward ke backend
    const response = await proxyClient.get<PaginationResponse<Kendaraan>>(
      'v1/kendaraans',
      { page, per_page: 10 }
    );
    console.log('Kendaraan:', response);
  } catch (error) {
    console.error('Error:', error);
    // Jika 401, auto redirect ke login
  }
}

// ==================== EXAMPLE 2: POST DATA ====================
async function createKendaraan(data: Partial<Kendaraan>) {
  try {
    // Request dikirim ke /api/proxy/v1/kendaraans
    // Headers: { Content-Type: application/json }
    const response = await proxyClient.post<Kendaraan>(
      'v1/kendaraans',
      data
    );
    console.log('Created:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ==================== EXAMPLE 3: UPLOAD FILE ====================
async function uploadImportFile(file: File) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    // Request dikirim ke /api/proxy/v1/import/excel
    // Content-Type akan otomatis multipart/form-data dari browser
    const response = await proxyClient.postFormData(
      'v1/import/excel',
      formData
    );
    console.log('Upload success:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ==================== EXAMPLE 4: UPDATE DATA ====================
async function updateKendaraan(id: number, data: Partial<Kendaraan>) {
  try {
    // Request dikirim ke /api/proxy/v1/kendaraans/1
    const response = await proxyClient.put(
      `v1/kendaraans/${id}`,
      data
    );
    console.log('Updated:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

// ==================== EXAMPLE 5: DELETE DATA ====================
async function deleteKendaraan(id: number) {
  try {
    // Request dikirim ke /api/proxy/v1/kendaraans/1
    await proxyClient.delete(`v1/kendaraans/${id}`);
    console.log('Deleted');
  } catch (error) {
    console.error('Error:', error);
  }
}

// ==================== FLOW DIAGRAM ====================
/*
CLIENT SIDE:
1. User login dengan username & password
2. Backend return token
3. Token disimpan di localStorage dengan key 'authToken'
4. Setiap request hanya hit `/api/proxy/...` tanpa perlu manual tambah token

REQUEST FLOW:
┌─────────────────────┐
│  React Component    │
│  proxyClient.get()  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────────────┐
│   /api/proxy/[...path]/route.ts     │
│   - Cek token dari localStorage     │
│   - Validasi token                  │
│   - Forward request ke backend      │
└──────────┬──────────────────────────┘
           │
           ▼
┌─────────────────────────┐
│  Backend API            │
│  http://103.6.54.230... │
└─────────────────────────┘

TOKEN VALIDATION:
- Jika token tidak ada → return 401
- Client auto redirect ke /auth/login
- Token removed dari localStorage
- User harus login lagi

PROTECTED ROUTES (middleware.ts):
- /admin/*
- /chat
- /dashboard
- /daftar-kendaraan/*
- /import-kendaraan/*
- /reports/*
Jika user tidak punya token di cookie, redirect ke login
*/
