/**
 * Prepare Capacitor Build Script
 * 
 * This script prepares your app for building with Capacitor by:
 * 1. Building the web application
 * 2. Adding Capacitor platform folders if they don't exist
 * 3. Copying web assets to the native projects
 * 4. Synchronizing dependencies
 */

import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import util from 'util';

const execAsync = util.promisify(exec);

// Configuration
const IOS_DIR = path.resolve('ios');
const ANDROID_DIR = path.resolve('android');

// Helper function to run a command and log output
async function runCommand(command, description) {
  console.log(`\n${description}...`);
  try {
    const { stdout, stderr } = await execAsync(command);
    if (stdout) console.log(stdout);
    if (stderr) console.error(stderr);
    console.log(`✓ ${description} completed`);
    return true;
  } catch (error) {
    console.error(`Error: ${description} failed`);
    console.error(error.message);
    return false;
  }
}

// Main function
async function prepareCapacitor() {
  console.log('=== CAPACITOR BUILD PREPARATION ===');
  
  // Step 1: Build the web application
  const buildSuccess = await runCommand('npm run build', 'Building web application');
  
  if (!buildSuccess) {
    console.error('Failed to build the web application. Aborting.');
    return;
  }
  
  // Step 2: Check if platforms exist and add them if needed
  if (!fs.existsSync(IOS_DIR)) {
    await runCommand('npx cap add ios', 'Adding iOS platform');
  }
  
  if (!fs.existsSync(ANDROID_DIR)) {
    await runCommand('npx cap add android', 'Adding Android platform');
  }
  
  // Step 3: Copy web assets to native projects
  await runCommand('npx cap copy', 'Copying web assets to native projects');
  
  // Step 4: Sync native dependencies
  await runCommand('npx cap sync', 'Syncing native dependencies');
  
  console.log('\n=== CAPACITOR BUILD PREPARATION COMPLETE ===');
  console.log('\nNext steps:');
  console.log('1. Open iOS project in Xcode:');
  console.log('   npx cap open ios');
  console.log('\n2. Open Android project in Android Studio:');
  console.log('   npx cap open android');
  console.log('\n3. Configure native projects (signing, capabilities, etc.)');
  console.log('\n4. Build and publish to app stores');
}

// Run the preparation
prepareCapacitor();