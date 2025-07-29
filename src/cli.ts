#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';

function main() {
  const args = process.argv.slice(2);
  
  if (args.length !== 3 || args[0] !== 'version') {
    console.error('Usage: aloha version <package.json> <manifest.json>');
    console.error('Example: aloha version package.json dist/manifest.json');
    process.exit(1);
  }

  const [, packageJsonPath, manifestPath] = args;

  try {
    // Read package.json
    const packageJsonContent = readFileSync(packageJsonPath, 'utf-8');
    const packageJson = JSON.parse(packageJsonContent);
    
    if (!packageJson.version) {
      console.error(`Error: No "version" field found in ${packageJsonPath}`);
      process.exit(1);
    }

    const version = packageJson.version;
    console.log(`Found version: ${version}`);

    // Read existing manifest or create new one
    let manifest: any = {};
    try {
      const manifestContent = readFileSync(manifestPath, 'utf-8');
      manifest = JSON.parse(manifestContent);
    } catch (error) {
      console.log(`Creating new manifest file: ${manifestPath}`);
    }

    // Update version in manifest
    manifest.version = version;

    // Write updated manifest
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    
    console.log(`Successfully updated ${manifestPath} with version ${version}`);
  } catch (error) {
    console.error('Error:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

// Run the CLI when this module is executed directly
main(); 