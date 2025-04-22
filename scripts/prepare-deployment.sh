#!/bin/bash

# Make all deployment scripts executable
echo "Setting permissions for deployment scripts..."
chmod +x scripts/build-native-apps.sh
chmod +x scripts/cap-add-platforms.sh
chmod +x scripts/cap-sync.sh
chmod +x scripts/generate-icons.sh
chmod +x scripts/open-ios.sh
chmod +x scripts/open-android.sh

echo "Checking for required tools..."

# Check for Node.js and npm
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo "✓ Node.js found: $NODE_VERSION"
else
    echo "✗ Node.js not found. Please install Node.js 14 or later."
    exit 1
fi

if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm -v)
    echo "✓ npm found: $NPM_VERSION"
else
    echo "✗ npm not found. Please install npm."
    exit 1
fi

# Check for Capacitor CLI
if npx cap --version &> /dev/null; then
    CAP_VERSION=$(npx cap --version)
    echo "✓ Capacitor CLI found: $CAP_VERSION"
else
    echo "✗ Capacitor CLI not found. Installing @capacitor/cli..."
    npm install @capacitor/cli
fi

# Check for Android Studio (platform-specific)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v android-studio &> /dev/null || [ -d "/Applications/Android Studio.app" ]; then
        echo "✓ Android Studio found"
    else
        echo "⚠ Android Studio not detected. You'll need it for Android app development."
    fi
fi

# Check for Xcode (macOS only)
if [[ "$OSTYPE" == "darwin"* ]]; then
    if command -v xcodebuild &> /dev/null; then
        XCODE_VERSION=$(xcodebuild -version | head -n 1)
        echo "✓ Xcode found: $XCODE_VERSION"
    else
        echo "⚠ Xcode not found. You'll need it for iOS app development."
    fi
else
    echo "ℹ Xcode check skipped (not on macOS)"
fi

echo ""
echo "Deployment preparation complete!"
echo ""
echo "Next steps:"
echo "1. Run ./scripts/build-native-apps.sh to build the app"
echo "2. Follow the instructions in docs/DEPLOY-TO-APP-STORES.md"
echo ""