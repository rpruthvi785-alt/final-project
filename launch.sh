#!/usr/bin/env bash

echo ""
echo "=========================================="
echo "  Travel Trackers - Starting Dev Server"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "[ERROR] Node.js is not installed or not in your PATH."
    echo "Please download and install Node.js from: https://nodejs.org"
    echo "Or use a version manager like nvm: https://github.com/nvm-sh/nvm"
    exit 1
fi

# Show node version
echo "Node.js detected: $(node -v)"
echo "npm detected: $(npm -v)"
echo ""

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "[ERROR] npm is not installed. Please reinstall Node.js from https://nodejs.org"
    exit 1
fi

# Make this script executable (in case it's not already)
chmod +x "$0" 2>/dev/null

# Run the cross-platform dev orchestrator
node dev.js
