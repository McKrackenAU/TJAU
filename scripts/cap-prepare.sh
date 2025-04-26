#!/bin/bash

# Exit on error
set -e

echo "-------------------------------------"
echo "Preparing Capacitor for App Store Deployment"
echo "-------------------------------------"

# Run the prepare-capacitor.mjs script
node scripts/prepare-capacitor.mjs

echo "-------------------------------------"
echo "Capacitor preparation completed!"
echo "-------------------------------------"