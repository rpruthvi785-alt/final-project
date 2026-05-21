const { spawn, execSync, exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const net = require('net');

const RESET  = '\x1b[0m';
const BOLD   = '\x1b[1m';
const GREEN  = '\x1b[32m';
const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m';
const GRAY   = '\x1b[90m';

const SERVICES = [
  { name: 'Backend', dir: 'server',          port: 5001, color: '\x1b[35m' },
  { name: 'Client',  dir: 'client',           port: 5173, color: '\x1b[36m' },
  { name: 'Admin',   dir: 'admin-dashboard',  port: 5174, color: '\x1b[33m' },
];

const activeProcesses = [];

// ── 1. Node version check ─────────────────────────────────────
function checkNodeVersion() {
  const major = parseInt(process.version.slice(1), 10);
  if (major < 18) {
    console.error(`${RED}${BOLD}[System] ERROR: Node.js v18+ required. You have ${process.version}.${RESET}`);
    console.error(`${YELLOW}         Download LTS from: https://nodejs.org${RESET}\n`);
    process.exit(1);
  }
}

// ── 2. Auto-create server/.env from .env.example ─────────────
function checkEnvFile() {
  const envPath     = path.join(__dirname, 'server', '.env');
  const examplePath = path.join(__dirname, 'server', '.env.example');
  if (fs.existsSync(envPath)) return;
  if (fs.existsSync(examplePath)) {
    fs.copyFileSync(examplePath, envPath);
    console.log(`${YELLOW}${BOLD}[System] server/.env created from .env.example.${RESET}`);
    console.log(`${YELLOW}         ➜  Edit server/.env to add your MongoDB URI and credentials.${RESET}\n`);
  } else {
    console.warn(`${YELLOW}[System] WARNING: server/.env is missing — backend may fail.${RESET}\n`);
  }
}

// ── 3. Kill nodemon FIRST (the parent that restarts crashed apps)
//      This is the root cause of EADDRINUSE: nodemon survives port
//      kills and races to restart the child before our new backend. ─
function killAllNodemon() {
  if (process.platform === 'win32') {
    // npm on Windows runs nodemon as nodemon.cmd
    ['nodemon.cmd', 'nodemon.exe', 'nodemon'].forEach(name => {
      try { execSync(`taskkill /F /T /IM ${name}`, { stdio: 'ignore' }); } catch (_) {}
    });
  } else {
    try { execSync('pkill -f nodemon', { stdio: 'ignore' }); } catch (_) {}
  }
}

// ── 4. Poll until a TCP port is genuinely free ────────────────
//      Probes 0.0.0.0 (all interfaces), matching how the backend
//      binds, so there's no false-positive from a 127.0.0.1 probe. ──
function waitForPortFree(port, maxMs = 6000) {
  return new Promise((resolve) => {
    const deadline = Date.now() + maxMs;
    const check = () => {
      const probe = net.createServer();
      probe.once('error', () => {
        if (Date.now() < deadline) {
          setTimeout(check, 200);
        } else {
          console.warn(`${YELLOW}[System] Port ${port} still busy after ${maxMs}ms — proceeding.${RESET}`);
          resolve();
        }
      });
      probe.once('listening', () => probe.close(resolve));
      probe.listen(port); // bind to 0.0.0.0 — same as the real server
    };
    check();
  });
}

// ── 5. Kill every process (by port) and wait for OS release ──
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      exec('netstat -ano', (err, stdout) => {
        if (err || !stdout) { waitForPortFree(port).then(resolve); return; }

        const pids = new Set();
        for (const line of stdout.split('\n')) {
          if (line.includes(`:${port}`) &&
              (line.includes('LISTENING') || line.includes('ESTABLISHED'))) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0' && pid !== String(process.pid)) pids.add(pid);
          }
        }

        for (const pid of pids) {
          try {
            execSync(`taskkill /F /T /PID ${pid}`, { stdio: 'ignore' });
            console.log(`${GRAY}[System] Freed port ${port} (killed PID tree: ${pid})${RESET}`);
          } catch (_) { /* already dead */ }
        }

        waitForPortFree(port).then(resolve);
      });
    } else {
      exec(`lsof -t -i:${port}`, (err, stdout) => {
        if (!err && stdout) {
          for (const pid of stdout.trim().split('\n')) {
            if (pid && pid !== String(process.pid)) {
              try {
                execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
                console.log(`${GRAY}[System] Freed port ${port} (killed PID: ${pid})${RESET}`);
              } catch (_) {}
            }
          }
        }
        waitForPortFree(port).then(resolve);
      });
    }
  });
}

// ── 6. Graceful shutdown of all spawned children ──────────────
function killProcesses() {
  console.log(`\n${BOLD}${GRAY}[System] Stopping all services...${RESET}`);
  for (const { child, service } of activeProcesses) {
    if (!child || child.killed) continue;
    console.log(`${GRAY}[System] Stopping ${service.name} (PID ${child.pid})...${RESET}`);
    try {
      if (process.platform === 'win32') {
        execSync(`taskkill /F /T /PID ${child.pid}`, { stdio: 'ignore' });
      } else {
        process.kill(-child.pid, 'SIGTERM');
      }
    } catch (_) {
      try { child.kill('SIGKILL'); } catch (__) {}
    }
  }
  console.log(`${GREEN}[System] All services stopped.${RESET}\n`);
  process.exit(0);
}

process.on('SIGINT',  killProcesses);
process.on('SIGTERM', killProcesses);
if (process.platform === 'win32') {
  const readline = require('readline');
  readline.createInterface({ input: process.stdin }).on('SIGINT', () => process.emit('SIGINT'));
}

// ── 7. Smart dependency install (detects stale / copied installs)
function checkAndInstall(service) {
  return new Promise((resolve, reject) => {
    const dir           = path.join(__dirname, service.dir);
    const modules       = path.join(dir, 'node_modules');
    const pkgJson       = path.join(dir, 'package.json');
    const internalLock  = path.join(modules, '.package-lock.json'); // written by npm on success

    const missing    = !fs.existsSync(modules);
    const incomplete = !missing && !fs.existsSync(internalLock);
    const stale      = !missing && !incomplete &&
                       fs.existsSync(pkgJson) &&
                       fs.statSync(pkgJson).mtimeMs > fs.statSync(internalLock).mtimeMs;

    if (!missing && !incomplete && !stale) { resolve(); return; }

    const reason = missing ? 'node_modules not found'
                 : incomplete ? 'incomplete install (folder may have been copied from another PC)'
                 : 'package.json updated since last install';

    console.log(`${BOLD}${service.color}[${service.name}] ${reason} — installing...${RESET}`);

    const child = spawn('npm', ['install', '--legacy-peer-deps'], {
      cwd: dir, shell: true, stdio: 'inherit',
    });
    child.on('close', code => {
      if (code === 0) {
        console.log(`${GREEN}[${service.name}] Dependencies installed.${RESET}\n`);
        resolve();
      } else {
        reject(new Error(`npm install failed for ${service.name} (exit ${code})`));
      }
    });
    child.on('error', err => reject(new Error(`npm install error: ${err.message}`)));
  });
}

// ── 8. Start a service and stream its output ──────────────────
function startService(service) {
  console.log(`${BOLD}${service.color}[${service.name}] Starting on port ${service.port}...${RESET}`);

  const child = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, service.dir),
    shell: true,
    ...(process.platform !== 'win32' ? { detached: true } : {}),
  });

  activeProcesses.push({ child, service });

  const pipe = (stream, isErr) => {
    let buf = '';
    stream.on('data', chunk => {
      buf += chunk.toString();
      const lines = buf.split('\n');
      buf = lines.pop();
      for (const line of lines) {
        if (!line.trim()) continue;
        const isInfo = line.includes('VITE') || line.includes('Local:') ||
                       line.includes('Network:') || line.includes('ready in') ||
                       line.includes('nodemon');
        if (isErr && !isInfo) {
          console.error(`${RED}[${service.name} ERR]${RESET} ${line}`);
        } else {
          console.log(`${service.color}[${service.name}]${RESET} ${line}`);
        }
      }
    });
  };

  pipe(child.stdout, false);
  pipe(child.stderr, true);

  child.on('close', code => {
    if (code !== 0 && code !== null)
      console.error(`${RED}[${service.name}] exited with code ${code}${RESET}`);
  });
  child.on('error', err =>
    console.error(`${RED}[${service.name}] failed to start: ${err.message}${RESET}`)
  );
}

// ── Poll backend health until it responds ─────────────────────
function waitForBackend(url, maxMs = 30000) {
  return new Promise((resolve) => {
    const http     = require('http');
    const deadline = Date.now() + maxMs;
    let dots       = 0;

    const check = () => {
      const req = http.get(url, (res) => {
        res.resume(); // drain the response
        console.log(`${GREEN}[System] Backend is ready ✓${RESET}`);
        resolve(true);
      });
      req.on('error', () => {
        if (Date.now() >= deadline) {
          console.warn(`${YELLOW}[System] Backend not responding after ${maxMs / 1000}s — starting frontends anyway.${RESET}`);
          resolve(false);
          return;
        }
        process.stdout.write(`\r${GRAY}[System] Waiting for backend${'.'.repeat((dots++ % 3) + 1)}   ${RESET}`);
        setTimeout(check, 500);
      });
      req.setTimeout(1000, () => { req.destroy(); });
    };

    check();
  });
}

// ── Main ──────────────────────────────────────────────────────
async function main() {
  checkNodeVersion();
  checkEnvFile();

  console.log(`${BOLD}${GREEN}╔═══════════════════════════════════════╗`);
  console.log(`║   🌍 Travel Trackers Dev Server 🌍    ║`);
  console.log(`╚═══════════════════════════════════════╝${RESET}\n`);

  try {
    console.log(`${BOLD}${GRAY}[System] Stopping any previous servers...${RESET}`);

    // Step A: Kill nodemon parents FIRST so they can't restart crashed children
    killAllNodemon();

    // Step B: Kill any remaining processes on each port, then wait for OS release
    for (const svc of SERVICES) {
      await killProcessOnPort(svc.port);
    }

    console.log(`${BOLD}${GREEN}[System] All ports clear — ready to start.${RESET}\n`);

    // Step C: Install / update dependencies
    for (const svc of SERVICES) {
      await checkAndInstall(svc);
    }

    // Step D: Start BACKEND first, wait until it's healthy
    console.log(`${BOLD}${GREEN}[System] Starting backend...${RESET}\n`);
    startService(SERVICES[0]); // Backend
    await waitForBackend('http://127.0.0.1:5001/api/events');

    // Step E: Now start Client and Admin (backend is guaranteed ready)
    console.log(`\n${BOLD}${GREEN}[System] Starting frontend services...${RESET}\n`);
    startService(SERVICES[1]); // Client
    startService(SERVICES[2]); // Admin

    setTimeout(() => {
      console.log(`\n${BOLD}${GREEN}╔═══════════════════════════════════════════╗`);
      console.log(`║         ✅ All Services Running!          ║`);
      console.log(`╠═══════════════════════════════════════════╣`);
      console.log(`║  Backend:    http://localhost:5001         ║`);
      console.log(`║  Client:     http://localhost:5173         ║`);
      console.log(`║  Admin:      http://localhost:5174/admin-dashboard/  ║`);
      console.log(`╚═══════════════════════════════════════════╝${RESET}`);
      console.log(`${GRAY}  Press Ctrl+C to stop all servers.\n${RESET}`);
    }, 1500);

  } catch (err) {
    console.error(`\n${RED}${BOLD}[System] Startup failed: ${err.message}${RESET}`);
    console.error(`${YELLOW}Run:  npm run install:all  — then try again.${RESET}\n`);
    process.exit(1);
  }
}

main();
