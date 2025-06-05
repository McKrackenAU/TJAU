#!/bin/bash

# Quick Mobile Sync - Apply Production Fixes to Mobile Apps
# This script quickly syncs your production fixes to mobile projects

set -e

echo "=== QUICK MOBILE SYNC FOR PRODUCTION FIXES ==="
echo ""

# Step 1: Build production version
echo "1. Building production version..."
npm run build
echo "✓ Production build complete"
echo ""

# Step 2: Sync with mobile projects
echo "2. Syncing with mobile projects..."
npx cap sync
echo "✓ Mobile projects synced"
echo ""

# Step 3: Show next steps
echo "=== SYNC COMPLETE ==="
echo ""
echo "Your mobile apps are now configured for production deployment:"
echo "• Server URL: https://www.tarotjourney.au"
echo "• Voice service: Josie (ElevenLabs production)"
echo "• All latest features included"
echo ""
echo "Next steps:"
echo "1. iOS: npx cap open ios"
echo "2. Android: npx cap open android"
echo "3. Update version numbers in native projects"
echo "4. Build and deploy to app stores"
echo ""
echo "This will fix:"
echo "• Josie voice not working (Adam → Josie)"
echo "• Spread meditation errors"
echo "• Slow meditation loading"
echo "• Missing latest features"