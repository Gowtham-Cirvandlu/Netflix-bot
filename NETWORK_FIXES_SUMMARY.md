# Network Error Fixes Summary

This document summarizes the fixes applied to resolve network errors during user registration.

## Changes Made

### 1. Vite Proxy Configuration (vite.config.ts)
Added proxy configuration to route API calls from frontend to backend:
```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
    }
  }
}
```

### 2. Enhanced Error Handling (src/context/AuthContext.tsx)
Improved error messages to distinguish between:
- Server not running: "Unable to connect to server. Please make sure the backend server is running on port 5000."
- Network failures: "Network error. Please check your connection and try again."
- Actual API errors: Preserved original error messages from the API

Added `checkHealth()` function to verify backend availability before making requests.

### 3. Updated Scripts (package.json)
Added convenient scripts for running the application:
- `npm start` - Runs both frontend and backend concurrently
- `npm run server` - Runs only the backend server
- `npm run dev` - Runs only the frontend dev server

### 4. Enhanced CORS Configuration (server/index.ts)
Updated CORS to allow multiple origins:
```typescript
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:5000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### 5. Environment Configuration (.env)
Created `.env` file with proper API URL configuration:
```
VITE_API_URL=/api
```
This uses the relative path to work with the Vite proxy.

## How to Run the Application

### Option 1: Run both frontend and backend together
```bash
npm start
```

### Option 2: Run separately (for development)
Terminal 1 - Backend:
```bash
npm run server
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## Testing

1. Start the application using one of the methods above
2. Open http://localhost:5173 in your browser
3. Try to register a new user
4. If you encounter errors, the error messages will now be more specific:
   - If the backend is not running, you'll see: "Unable to connect to server. Please make sure the backend server is running on port 5000."
   - If there's a network issue, you'll see: "Network error. Please check your connection and try again."

## Health Check

You can now verify the backend is running by calling:
```typescript
const { checkHealth } = useAuth();
const health = await checkHealth();
if (!health.success) {
  console.error(health.error);
}
```

## Troubleshooting

### "Unable to connect to server" error
This means the backend server is not running. Start it with:
```bash
npm run server
```

### CORS errors
Ensure the backend server is running and CORS is configured correctly. The current configuration allows:
- http://localhost:5173
- http://127.0.0.1:5173
- http://localhost:5000

### Port already in use
If port 5000 is already in use, you can change it in the `.env` file:
```
PORT=5001
```

Then update the proxy target in `vite.config.ts` accordingly.
