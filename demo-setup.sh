#!/bin/bash

# Astra Attendance - Quick Demo Setup Script
# This script helps you quickly set up and verify the application

set -e

echo "════════════════════════════════════════════════════════"
echo "    🎯 Astra Attendance - Quick Demo Setup"
echo "════════════════════════════════════════════════════════"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if node is installed
echo -e "${BLUE}[1/6]${NC} Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js 20+ from https://nodejs.org"
    exit 1
fi
NODE_VERSION=$(node --version)
echo -e "${GREEN}✅ Node.js ${NODE_VERSION} found${NC}"
echo ""

# Check if npm is installed
echo -e "${BLUE}[2/6]${NC} Checking npm installation..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi
NPM_VERSION=$(npm --version)
echo -e "${GREEN}✅ npm ${NPM_VERSION} found${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}[3/6]${NC} Installing dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing packages (this may take a minute)..."
    npm ci
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  node_modules exists, skipping install${NC}"
    echo "   Run 'rm -rf node_modules && npm ci' to reinstall"
fi
echo ""

# Check for .env file
echo -e "${BLUE}[4/6]${NC} Checking environment configuration..."
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚠️  .env file not found${NC}"
    echo ""
    echo "Creating .env template..."
    cat > .env << 'EOF'
# Supabase Configuration
# Get these values from https://supabase.com → Your Project → Settings → API

VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Service key (for CLI tool only - keep secure!)
SUPABASE_SERVICE_KEY=your-service-key-here
EOF
    echo -e "${GREEN}✅ Created .env template${NC}"
    echo ""
    echo -e "${YELLOW}⚠️  ACTION REQUIRED:${NC}"
    echo "   1. Edit .env file with your Supabase credentials"
    echo "   2. Get credentials from: https://supabase.com → Project → Settings → API"
    echo ""
    echo "Press Enter after you've updated .env (or Ctrl+C to exit)..."
    read -r
else
    echo -e "${GREEN}✅ .env file exists${NC}"
fi
echo ""

# Run tests
echo -e "${BLUE}[5/6]${NC} Running tests..."
if npm test; then
    echo -e "${GREEN}✅ All tests passed!${NC}"
else
    echo -e "${RED}❌ Some tests failed${NC}"
    echo "Check the output above for details"
    exit 1
fi
echo ""

# Build check
echo -e "${BLUE}[6/6]${NC} Building application..."
if npm run build; then
    echo -e "${GREEN}✅ Build successful!${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    echo "Check the output above for details"
    exit 1
fi
echo ""

# Summary
echo "════════════════════════════════════════════════════════"
echo -e "    ${GREEN}✨ Setup Complete!${NC}"
echo "════════════════════════════════════════════════════════"
echo ""
echo "Next steps:"
echo ""
echo -e "  ${BLUE}1. Apply database migrations${NC}"
echo "     • Open Supabase SQL Editor"
echo "     • Run each migration from migrations/ folder in order"
echo "     • See VERIFICATION_GUIDE.md for details"
echo ""
echo -e "  ${BLUE}2. Start the development server${NC}"
echo "     $ npm run dev"
echo ""
echo -e "  ${BLUE}3. Open your browser${NC}"
echo "     http://localhost:5173"
echo ""
echo -e "  ${BLUE}4. View documentation${NC}"
echo "     • VERIFICATION_GUIDE.md - Full testing guide"
echo "     • IMPLEMENTATION.md - Feature details"
echo "     • ARCHITECTURE.md - System design"
echo ""
echo "════════════════════════════════════════════════════════"
echo ""
