#!/bin/bash

# ZIWANI Smart Waste Management - Quick Start Guide

echo "🚀 Starting ZIWANI Smart Waste Management System"
echo "=================================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 Node.js version:${NC}"
node --version
echo ""

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${YELLOW}⚠️  npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${BLUE}📦 npm version:${NC}"
npm --version
echo ""

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
    echo -e "${BLUE}📥 Installing frontend dependencies...${NC}"
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
    echo ""
fi

if [ ! -d "server/node_modules" ]; then
    echo -e "${BLUE}📥 Installing backend dependencies...${NC}"
    cd server && npm install && cd ..
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
    echo ""
fi

# Display connection information
echo -e "${GREEN}✅ Everything is ready!${NC}"
echo ""
echo -e "${BLUE}📍 Connection Details:${NC}"
echo "  Frontend: http://localhost:3000"
echo "  Backend API: http://localhost:5000/api"
echo "  Health Check: http://localhost:5000/health"
echo ""

echo -e "${BLUE}👤 Demo Credentials:${NC}"
echo "  Username: eco_hero"
echo "  Password: password123"
echo "  OR"
echo "  Username: green_guardian"
echo "  Password: demo2024"
echo ""

echo -e "${BLUE}🚀 Starting servers...${NC}"
echo ""
echo -e "${YELLOW}⏳ Backend starting on port 5000...${NC}"
echo -e "${YELLOW}⏳ Frontend starting on port 3000...${NC}"
echo ""

# Start both servers
npm run dev

echo ""
echo -e "${GREEN}✅ System started successfully!${NC}"
