# 🔐 PROXY AUTHENTICATION SYSTEM - SETUP GUIDE

## ✅ Yang Sudah Dibuat

### 1. **Proxy Route Handler** (`app/api/proxy/[...path]/route.ts`)
- Menangkap semua API requests ke `/api/proxy/*`
- Validasi bearer token sebelum forward ke backend
- Support GET, POST, PUT, DELETE methods
- Support FormData untuk file uploads
- Return 401 jika token tidak ditemukan/expired

### 2. **Middleware** (`middleware.ts`)
- Proteksi routes yang memerlukan login:
  - `/admin/*`
  - `/chat`
  - `/dashboard`
  - `/daftar-kendaraan/*`
  - `/import-kendaraan/*`
  - `/reports/*`
- Redirect ke `/auth/login` jika token tidak ada di cookie

### 3. **Proxy Client** (`libs/services/proxy-client.ts`)
- Simple client untuk communicate via proxy
- Methods: `get()`, `post()`, `put()`, `delete()`, `postFormData()`
- Auto handle 401 errors (redirect to login)
- Remove token dari localStorage jika expired

### 4. **Documentation** 
- `PROXY_USAGE_EXAMPLE.ts` - Contoh penggunaan
- Memory updated dengan setup info

---

## 🚀 NEXT STEPS

### Step 1: Update Existing Services (Optional)
Anda punya 2 pilihan:

#### Option A: Keep Using BaseService (Direct to Backend)
- Services tetap langsung hit backend
- Token dikirim di header dari client
- Cocok jika token sudah di setup

#### Option B: Migrate to ProxyClient (Recommended)
- Services hit `/api/proxy/` instead
- Token divalidasi di server side dulu
- Lebih secure (token tidak di-expose di client)

**Untuk migrate, update service seperti ini:**
```typescript
import { proxyClient } from "@/libs/services/proxy-client";

class KendaraanService {
  async getKendaraan(params: KendaraanParams) {
    const data = await proxyClient.get('v1/kendaraans', params);
    return data.data; // Sesuaikan dengan response format
  }
}
```

---

## 🔄 AUTHENTICATION FLOW

### Login Process
```
1. User buka /auth/login
2. Submit username + password
3. API return token
4. Hook simpan token: localStorage.setItem('authToken', token)
5. Redirect ke /admin atau /dashboard
```

### Protected Route Access
```
1. User akses /admin
2. Middleware check: ada token di cookie?
3. Ada → proceed
4. Tidak → redirect ke /auth/login
```

### API Request Process
```
1. Component call proxyClient.get('v1/kendaraans')
2. Request hit /api/proxy/v1/kendaraans
3. Proxy handler:
   - Ambil token dari request (header/cookie/custom)
   - Jika tidak ada → return 401
   - Jika ada → forward ke backend dengan Bearer token
4. Backend process request
5. Return response ke proxy
6. Proxy return ke client
```

---

## 🔧 CONFIGURATION

### Environment Variables (.env)
```
NEXT_PUBLIC_BASE_API=http://103.6.54.230:3502/api
NEXT_PUBLIC_WS_URL=http://103.6.54.230:3502
```

### Token Storage
- Key: `authToken`
- Location: `localStorage` (browser only)
- Set after login: `localStorage.setItem('authToken', token)`
- Clear on logout: `localStorage.removeItem('authToken')`

### Cookie (Optional)
Untuk better security, token juga bisa disimpan di cookie:
```typescript
// Set di login response dari server
// In Next.js API route:
res.setHeader('Set-Cookie', 'authToken=...;HttpOnly;Secure;SameSite=Strict')
```

---

## 🛡️ SECURITY FEATURES

✅ **Token Validation**
- Token required untuk akses protected routes
- Token validated sebelum forward ke backend
- 401 response jika token invalid/expired

✅ **Route Protection**
- Middleware block access ke admin routes tanpa login
- Redirect ke login page

✅ **Token Cleanup**
- Auto remove token dari localStorage on 401
- User redirect ke login untuk re-authenticate

✅ **Request Validation**
- Token cek dari multiple sources:
  1. Authorization header (Bearer)
  2. Cookie (authToken)
  3. Custom header (x-auth-token)

---

## 📝 QUICK START

### 1. User Login
```typescript
// Di useLoginForm hook
const res = await fetch('/api/auth/login', {
  method: 'POST',
  body: JSON.stringify({ login, password })
});
const data = await res.json();
localStorage.setItem('authToken', data.token);
// Redirect to /admin
```

### 2. Access Protected Routes
```typescript
// User sudah punya token di localStorage
// Akses /admin → middleware check token
// Redirect to /auth/login jika tidak ada token
```

### 3. Make API Calls
```typescript
import { proxyClient } from "@/libs/services/proxy-client";

// GET
const data = await proxyClient.get('v1/kendaraans', { page: 1 });

// POST
const result = await proxyClient.post('v1/kendaraans', { name: 'Test' });

// FormData
const fd = new FormData();
fd.append('file', file);
await proxyClient.postFormData('v1/import/excel', fd);
```

---

## ⚠️ TROUBLESHOOTING

### "Unauthorized - Token tidak ditemukan"
- Token tidak ada di localStorage
- Token tidak dikirim dalam request header
- **Fix:** Login dulu atau check localStorage

### "Session expired - redirecting to login"
- Backend return 401 (token expired)
- ProxyClient auto remove token
- **Fix:** User harus login ulang

### Middleware tidak redirect ke login
- Cookie tidak di-set di server
- Check: apakah backend set cookie?
- **Fix:** Bisa pakai localStorage juga (browser sudah check localStorage)

### FormData upload gagal
- Jangan set Content-Type manual untuk FormData
- Browser otomatis set multipart/form-data dengan boundary
- **Fix:** Gunakan `postFormData()` method, jangan `post()`

---

## 🎯 SUMMARY

| Aspek | Detail |
|-------|--------|
| **Authentication** | Bearer token di localStorage |
| **Authorization** | Middleware protect routes |
| **API Gateway** | `/api/proxy/[...path]` |
| **Token Validation** | Sebelum forward ke backend |
| **Error Handling** | 401 auto redirect to login |
| **Supported Methods** | GET, POST, PUT, DELETE, FormData |
| **Token Sources** | Header (Bearer), Cookie, Custom |

---

Semuanya sudah siap! 🎉 Sekarang hanya perlu:
1. Update login hook untuk simpan token
2. Set cookie atau pakai localStorage
3. Test protected routes
4. Test API calls via proxy
