#!/bin/bash

# Portfolio Setup Script
echo "🚀 Setting up your Portfolio project..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first:"
    echo "   Visit: https://nodejs.org/ and download the LTS version"
    echo "   Or use a package manager:"
    echo "   - Ubuntu/Debian: sudo apt update && sudo apt install nodejs npm"
    echo "   - Fedora: sudo dnf install nodejs npm"
    echo "   - Arch: sudo pacman -S nodejs npm"
    echo "   - macOS: brew install node"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"
echo "✅ npm found: $(npm --version)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Check if installation was successful
if [ $? -eq 0 ]; then
    echo "✅ Dependencies installed successfully!"
    echo ""
    echo "🎉 Setup complete! You can now run your portfolio:"
    echo "   npm run dev    - Start development server"
    echo "   npm run build  - Build for production"
    echo "   npm start      - Start production server"
    echo ""
    echo "🌐 The development server will be available at: http://localhost:3000"
else
    echo "❌ Failed to install dependencies. Please check the error messages above."
    exit 1
fi
