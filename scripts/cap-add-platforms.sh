#!/bin/bash
# Add both iOS and Android platforms to the project

echo "Adding iOS platform..."
npx cap add ios

echo "Adding Android platform..."
npx cap add android

echo "Platforms added successfully!"