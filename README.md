# 🌍 Travel Trackers — Full Stack App

A full-stack travel tracking web application with a **React client**, **React admin dashboard**, and a **Node.js/Express backend** connected to MongoDB.

---

## 📋 Table of Contents

- [Requirements](#-requirements)
- [Quick Start (Any PC / Laptop)](#-quick-start-any-pc--laptop)
- [Running in VS Code](#-running-in-vs-code)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Ports & URLs](#-ports--urls)
- [Troubleshooting](#-troubleshooting)

---

## ✅ Requirements

Before running this project on **any PC or laptop**, make sure the following are installed:

| Tool | Minimum Version | Download |
|------|----------------|----------|
| **Node.js** | v18.0.0 or higher | [nodejs.org](https://nodejs.org) ← Download **LTS** version |
| **npm** | v9.0.0 or higher | Comes with Node.js |
| **Git** *(optional)* | Any | [git-scm.com](https://git-scm.com) |

> ⚠️ **Windows users**: After installing Node.js, **restart your PC** before continuing.

### Check your versions

Open a terminal (PowerShell, CMD, or Terminal) and run:

```bash
node -v    # Should print v18.x.x or higher
npm -v     # Should print 9.x.x or higher
```

---

## 🚀 Quick Start (Any PC / Laptop)

### Step 1 — Open the project folder

Open this folder in **VS Code** (drag and drop, or `File → Open Folder`).

### Step 2 — Install dependencies (one-time setup)

Open the **VS Code Terminal** (`Ctrl+`` ` or `View → Terminal`) and run:

```bash
npm run install:all
```

This installs all packages for the **backend**, **client**, and **admin dashboard** automatically.

### Step 3 — Start all servers

```bash
npm run dev
```

That's it! All three servers start automatically. 🎉

---

### Alternative: Double-click to launch

- **Windows**: Double-click `launch.bat`
- **Mac / Linux**: Run `./launch.sh` in terminal
  ```bash
  chmod +x launch.sh   # First time only
  ./launch.sh
  ```

---

## 💻 Running in VS Code

### Method 1 — Terminal (Recommended)

1. Open VS Code Terminal: `Ctrl+`` ` (backtick)
2. Run: `npm run dev`

### Method 2 — VS Code Tasks (Ctrl+Shift+B)

Press `Ctrl+Shift+B` → Select **"🚀 Start All Services"**

Or go to `Terminal → Run Task...` and choose:
- `🚀 Start All Services` — starts everything at once
- `🟢 Start Backend Only (port 5001)` — backend only
- `🔵 Start Client Only (port 5173)` — frontend only
- `🟡 Start Admin Dashboard Only (port 5174)` — admin only
- `📦 Install All Dependencies` — runs `npm install` for all folders

### Method 3 — VS Code Debugger (F5)

Press `F5` or go to the **Run & Debug panel** (`Ctrl+Shift+D`) and select:
- `🚀 Start All Services (dev.js)` — launches everything
- `🟢 Debug Backend Server` — Node.js debugger with breakpoints
- `🔵 Debug Client App (Chrome)` — Chrome debugger for React client
- `🟡 Debug Admin Dashboard (Chrome)` — Chrome debugger for admin panel
- `🌐 Full Stack Debug (All Services)` — launches all debuggers together

---

## 📁 Project Structure

```
travel-trackers/
├── 📂 server/              ← Node.js / Express backend (port 5001)
│   ├── config/             ← Database & Cloudinary config
│   ├── controllers/        ← Route controllers
│   ├── middleware/         ← Auth & other middleware
│   ├── models/             ← Mongoose models
│   ├── routes/             ← API routes
│   ├── socket/             ← Socket.io handlers
│   ├── utils/              ← Utilities & seed scripts
│   ├── .env                ← Environment variables (NOT in git)
│   ├── .env.example        ← Template for .env
│   └── index.js            ← Server entry point
│
├── 📂 client/              ← React frontend (port 5173)
│   ├── src/                ← React source code
│   ├── public/             ← Static assets
│   └── vite.config.js      ← Vite config (proxies API to backend)
│
├── 📂 admin-dashboard/     ← React admin panel (port 5174)
│   ├── src/                ← Admin source code
│   └── vite.config.js      ← Vite config (base: /admin-dashboard/)
│
├── 📂 .vscode/             ← VS Code config (tasks, debugger, settings)
├── dev.js                  ← Cross-platform dev orchestrator
├── launch.bat              ← Windows quick-launch script
├── launch.sh               ← Mac/Linux quick-launch script
└── package.json            ← Root scripts
```

---

## 🔑 Environment Variables

The backend requires a `server/.env` file. This file is **created automatically** from `server/.env.example` on first run.

Edit `server/.env` to set your real values:

```env
PORT=5001
MONGO_URI=mongodb+srv://...   # Your MongoDB connection string
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret

CLIENT_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

> 💡 **No MongoDB?** The backend automatically falls back to an **in-memory database** if MongoDB is unreachable. Data won't persist between restarts, but the app still works for testing.

---

## 📜 Available Scripts

Run these from the **root folder** of the project:

| Command | Description |
|---------|-------------|
| `npm run dev` | Start all 3 services (backend + client + admin) |
| `npm run install:all` | Install npm packages for all 3 projects |
| `npm run dev:server` | Start backend only |
| `npm run dev:client` | Start client only |
| `npm run dev:admin` | Start admin dashboard only |
| `npm run build:client` | Build client for production |
| `npm run build:admin` | Build admin for production |
| `npm run build:all` | Build both client and admin for production |
| `npm run start` | Start backend in production mode |

---

## 🌐 Ports & URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Backend API** | http://localhost:5001 | Express REST API |
| **Client App** | http://localhost:5173 | React user-facing app |
| **Admin Dashboard** | http://localhost:5174 | React admin panel |

---

## 🔧 Troubleshooting

### ❌ `node` or `npm` not found

Install Node.js from [nodejs.org](https://nodejs.org). Choose the **LTS** version.
After installing, restart your terminal (or your PC on Windows).

### ❌ Port already in use

Another app is using port 5001, 5173, or 5174. Either:
- Stop the other app
- Or change the port in `server/.env` (for backend) or in `vite.config.js` (for frontend)

### ❌ MongoDB connection failed

- Check your `MONGO_URI` in `server/.env`
- If using MongoDB Atlas, make sure your IP is whitelisted: [Atlas IP Access](https://cloud.mongodb.com)
- The app will use **in-memory MongoDB** as a fallback (data resets on restart)

### ❌ Windows — `mongodb-memory-server` fails

Install the **Microsoft Visual C++ Redistributable**:
👉 https://aka.ms/vs/17/release/vc_redist.x64.exe

Restart your PC after installing, then try again.

### ❌ `EACCES` permission error on Mac/Linux

```bash
sudo chown -R $USER ~/.npm
```

### ❌ Modules not found errors

Re-run the full install:
```bash
npm run install:all
```

Or install each manually:
```bash
npm install --prefix server --legacy-peer-deps
npm install --prefix client --legacy-peer-deps
npm install --prefix admin-dashboard --legacy-peer-deps
```

### ❌ Admin dashboard shows 404

Make sure to access it at: **http://localhost:5174/admin-dashboard/**
(not http://localhost:5174/ — note the `/admin-dashboard/` path)

---

## 📌 VS Code Extensions (Recommended)

Open VS Code, press `Ctrl+Shift+P`, type **"Show Recommended Extensions"** to install all recommended extensions for this project in one click.

Key extensions:
- **ESLint** — JavaScript linting
- **Prettier** — Code formatting
- **Tailwind CSS IntelliSense** — Tailwind autocomplete
- **Path IntelliSense** — File path autocomplete

---

## 🙌 Done!

After setup, open your browser and go to:

- 👤 **User App**: http://localhost:5173
- 🔐 **Admin Panel**: http://localhost:5174/admin-dashboard/
- ⚙️ **API**: http://localhost:5001/api
