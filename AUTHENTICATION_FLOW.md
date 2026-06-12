# 🔐 AUTHENTICATION & API FLOW DIAGRAM

## Complete Request Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER LOGIN                              │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. User submits login form                                    │
│     ↓                                                           │
│  2. useLoginForm hook triggers                                 │
│     ↓                                                           │
│  3. authService.login(credentials)                             │
│     ├─ POST to /v1/auth/login/sanctum (DIRECT TO BACKEND)     │
│     ├─ Credentials: { login: "...", password: "..." }         │
│     ↓                                                           │
│  4. Backend validates & returns:                               │
│     {                                                           │
│       "success": true,                                         │
│       "token_type": "Bearer",                                  │
│       "access_token": "2|xsT...",                              │
│       "user": { id, name, email, ... }                         │
│     }                                                           │
│     ↓                                                           │
│  5. authService stores token:                                  │
│     ├─ localStorage.setItem('authToken', access_token)        │
│     └─ document.cookie = 'authToken=...'                       │
│     ↓                                                           │
│  6. Router redirects to /admin/dashboard                       │
│     ↓                                                           │
│  7. Middleware checks if token exists ✓                        │
│     → Access granted to protected routes                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## API Call Flow (After Login)

```
┌──────────────────────────────────────────────────────────────────┐
│                     API REQUEST FLOW                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Component/Hook calls:                                       │
│     await proxyClient.get('v1/kendaraans', { page: 1 })        │
│                                                                  │
│     ↓                                                            │
│                                                                  │
│  2. ProxyClient builds URL:                                     │
│     URL: /api/proxy/v1/kendaraans?page=1                       │
│     Headers: {                                                  │
│       'Content-Type': 'application/json',                       │
│       'Accept': 'application/json'                             │
│     }                                                            │
│                                                                  │
│     ↓                                                            │
│                                                                  │
│  3. Request hits /api/proxy/[...path]/route.ts                 │
│     ├─ Extracts path: ['v1', 'kendaraans']                    │
│     ├─ Extracts query: ?page=1                                │
│     └─ Extracts token from request                            │
│                                                                  │
│     ↓                                                            │
│                                                                  │
│  4. Proxy handler validates token:                             │
│     ├─ From Authorization header (Bearer)                      │
│     ├─ From Cookie (authToken)                                │
│     ├─ From Custom header (x-auth-token)                      │
│     ↓                                                            │
│     Token NOT found?                                           │
│       └─ Return 401 Unauthorized                               │
│                                                                  │
│     Token found? ✓                                             │
│       ↓                                                          │
│       Forward to Backend:                                      │
│       POST http://backend/api/v1/kendaraans?page=1            │
│       Headers: {                                               │
│         'Authorization': 'Bearer <token>',                     │
│         'Content-Type': 'application/json'                    │
│       }                                                         │
│                                                                  │
│     ↓                                                            │
│                                                                  │
│  5. Backend processes & returns response                       │
│                                                                  │
│     ↓                                                            │
│                                                                  │
│  6. Proxy returns response to client                           │
│     ├─ Status OK (200-299) → return data                      │
│     ├─ Status 401 → Token expired                             │
│     └─ Status 500 → Server error                              │
│                                                                  │
│     ↓                                                            │
│                                                                  │
│  7. ProxyClient handles response:                              │
│     ├─ 401? → Remove token, redirect to /auth/login          │
│     ├─ Error? → Throw error with message                     │
│     └─ Success? → Return data to component                    │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

## Route Protection Flow

```
┌──────────────────────────────────────────────────────┐
│          PROTECTED ROUTE ACCESS                      │
├──────────────────────────────────────────────────────┤
│                                                      │
│  User tries to access: /admin/dashboard             │
│                                                      │
│  ↓                                                   │
│                                                      │
│  Middleware checks:                                 │
│    Is this a protected route?                       │
│                                                      │
│    YES ✓ (protected routes list):                   │
│      /admin/*                                       │
│      /chat                                          │
│      /dashboard                                     │
│      /daftar-kendaraan/*                            │
│      /import-kendaraan/*                            │
│      /reports/*                                     │
│                                                      │
│  ↓                                                   │
│                                                      │
│  Check token in cookie:                             │
│    request.cookies.get('authToken')                 │
│                                                      │
│    Token found? ✓                                   │
│      ↓                                              │
│      Allow access → NextResponse.next()             │
│      Page loads normally                            │
│                                                      │
│    Token NOT found?                                 │
│      ↓                                              │
│      Deny access                                    │
│      Redirect to /auth/login                        │
│                                                      │
└──────────────────────────────────────────────────────┘
```

## Token Lifecycle

```
┌───────────────────────────────────────────────────────┐
│              TOKEN LIFECYCLE                          │
├───────────────────────────────────────────────────────┤
│                                                       │
│  [1] NO TOKEN                                        │
│      User not logged in                              │
│      Can only access public pages (/auth/login)      │
│                                                       │
│      ↓ User submits login                            │
│                                                       │
│  [2] TOKEN RECEIVED                                  │
│      authService.login() success                     │
│      Token stored in localStorage and cookie         │
│                                                       │
│      ↓ Auto redirect to /admin/dashboard             │
│                                                       │
│  [3] TOKEN ACTIVE                                    │
│      User has valid token                            │
│      Can access protected routes                     │
│      API calls include Authorization header          │
│                                                       │
│      ↓ Time passes (token expires)                   │
│                                                       │
│  [4] TOKEN EXPIRED                                   │
│      Backend returns 401 Unauthorized                │
│      ProxyClient catches 401                         │
│      Token removed from localStorage                 │
│      Cookie cleared                                  │
│                                                       │
│      ↓ Auto redirect to /auth/login                  │
│                                                       │
│  [5] NO TOKEN (Back to [1])                          │
│      User must login again                           │
│                                                       │
│      ↓ User submits login (repeat from [2])          │
│                                                       │
└───────────────────────────────────────────────────────┘
```

## Files & Responsibilities

```
┌─────────────────────────────────────────────────────────┐
│  Authentication Files & Responsibilities               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  📄 libs/services/auth.service.ts                      │
│     └─ login(credentials) → access_token              │
│     └─ logout() → clear token                          │
│     └─ getToken() → read from localStorage             │
│     └─ isAuthenticated() → check token exists          │
│                                                         │
│  🎣 libs/hooks/auth/useLoginForm.tsx                   │
│     └─ Form state management                           │
│     └─ Call authService.login()                        │
│     └─ Handle errors                                   │
│     └─ Redirect on success                             │
│                                                         │
│  🚦 middleware.ts                                       │
│     └─ Protect routes (check cookie token)             │
│     └─ Redirect to /auth/login if needed               │
│                                                         │
│  🔌 app/api/proxy/[...path]/route.ts                   │
│     └─ Validate token from request                     │
│     └─ Forward to backend with Bearer token            │
│     └─ Return 401 if token missing                     │
│                                                         │
│  🌐 libs/services/proxy-client.ts                      │
│     └─ get/post/put/delete methods                     │
│     └─ Handle 401 (redirect to login)                  │
│     └─ Auto include token in all requests              │
│                                                         │
│  🎨 pages/auth/LoginForm.tsx                           │
│     └─ Use useLoginForm hook                           │
│     └─ Display form & errors                           │
│     └─ Show loading state                              │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Key Points

✅ **Login Endpoint**: `NEXT_PUBLIC_BASE_API/v1/auth/login/sanctum`
✅ **Token Field**: `access_token` (not `token`)
✅ **Token Storage**: localStorage + cookie
✅ **Protected Routes**: /admin/*, /chat, /dashboard, etc.
✅ **Middleware Check**: Cookie token
✅ **API Requests**: Via /api/proxy/ with token validation
✅ **Token Expired**: 401 → Remove token → Redirect to login
✅ **Redirect After Login**: /admin/dashboard
✅ **Redirect After Logout**: /auth/login

---

**Flow Summary**:
```
Login → Store Token → Access Protected Routes → Make API Calls with Token
  ↓
Token Expired → Proxy catches 401 → Clear Token → Redirect to Login → Repeat
```
