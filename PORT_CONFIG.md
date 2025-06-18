# MediLink 2.0 Port Configuration

## Current Port Setup

### Backend Server
- **Port**: 5000
- **URL**: http://localhost:5000
- **API Base**: http://localhost:5000/api

### Frontend Server
- **Port**: 3002 (changed from 3000 due to conflicts)
- **URL**: http://localhost:3002
- **Fallback**: If 3002 is busy, Next.js will try 3003, 3004, etc.

## How to Start Servers

### Option 1: Using the Batch Script
```bash
# Run the start script
start-servers.bat
```

### Option 2: Manual Start
```bash
# Start Backend
cd backend
npm run dev

# Start Frontend (in new terminal)
cd web
npm run dev:3002
```

### Option 3: Default Next.js Start
```bash
cd web
npm run dev
# Next.js will automatically find an available port
```

## Port Conflict Resolution

If you encounter port conflicts:

1. **Kill all Node processes**:
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Check what's using the ports**:
   ```bash
   netstat -ano | findstr :3000
   netstat -ano | findstr :3002
   netstat -ano | findstr :5000
   ```

3. **Start servers in this order**:
   - Backend first (port 5000)
   - Frontend second (port 3002)

## CORS Configuration

The backend is configured to accept requests from:
- http://localhost:3002 (primary)
- http://localhost:3000 (fallback)
- http://localhost:3001 (fallback)

## Testing Connection

Visit: http://localhost:3002/test-connection

This page will show:
- Frontend port information
- Backend connection status
- API test results 