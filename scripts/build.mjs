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

// Function to copy compiled files from server to api
function copyCompiledFiles(srcDir, destDir, relativePath = '') {
  const currentSrcDir = join(srcDir, relativePath);
  const currentDestDir = join(destDir, relativePath);
  
  if (!existsSync(currentSrcDir)) return;
  
  // Create destination directory if it doesn't exist
  if (!existsSync(currentDestDir)) {
    mkdirSync(currentDestDir, { recursive: true });
  }
  
  const items = readdirSync(currentSrcDir);
  
  for (const item of items) {
    const srcPath = join(currentSrcDir, item);
    const stat = lstatSync(srcPath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other unnecessary directories
      if (item !== 'node_modules' && item !== '.git' && item !== 'public') {
        copyCompiledFiles(srcDir, destDir, join(relativePath, item));
      }
    } else if (extname(item) === '.js') {
      // Copy JavaScript files
      const destPath = join(currentDestDir, item);
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${join(relativePath, item)}`);
    }
  }
}

// Copy all compiled JavaScript files from server to api
console.log('Copying compiled files...');
copyCompiledFiles(serverDir, apiDir);

// Ensure the main server file exists
const mainServerFile = join(apiDir, 'index.js');
if (!existsSync(mainServerFile)) {
  // Try to find it in different locations
  const possibleLocations = [
    join(serverDir, 'index.js'),
    join(apiDir, 'server.js'),
    join(apiDir, 'app.js')
  ];
  
  for (const location of possibleLocations) {
    if (existsSync(location)) {
      copyFileSync(location, mainServerFile);
      console.log(`Copied main server file from ${location} to ${mainServerFile}`);
      break;
    }
  }
}

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