import { existsSync, copyFileSync, mkdirSync, readdirSync, lstatSync, unlinkSync } from 'fs';
import { join, dirname, basename, extname } from 'path';

console.log('Starting build process...');

// Source and destination paths
const serverDir = 'server';
const apiDir = 'api';

// Ensure the API directory exists
if (!existsSync(apiDir)) {
  mkdirSync(apiDir);
  console.log(`Created ${apiDir} directory`);
}

// Function to clean TS files in API directory
function cleanTsFilesInApi(dir) {
  if (!existsSync(dir)) return;
  
  const items = readdirSync(dir);
  
  for (const item of items) {
    const fullPath = join(dir, item);
    
    if (lstatSync(fullPath).isDirectory()) {
      // Recursively clean subdirectories
      cleanTsFilesInApi(fullPath);
    } else if (extname(fullPath) === '.ts') {
      // Remove .ts files in api directory (should only have .js)
      console.log(`Removing TypeScript file: ${fullPath}`);
      unlinkSync(fullPath);
    }
  }
}

// First clean any .ts files in api directory
cleanTsFilesInApi(apiDir);
console.log('Cleaned TypeScript files from API directory');

// Function to check for conflict before copying
function hasDuplicateExtension(targetDir, filename) {
  const baseFilename = basename(filename, extname(filename));
  const extensions = ['.js', '.ts', '.mjs', '.cjs'];
  
  for (const ext of extensions) {
    const testFile = join(targetDir, `${baseFilename}${ext}`);
    if (filename !== testFile && existsSync(testFile)) {
      console.log(`Found duplicate: ${testFile} conflicts with ${filename}`);
      return true;
    }
  }
  
  return false;
}

console.log('Build script completed successfully.'); 