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

// Specifically check for and copy the main index.js file
const serverIndexJs = join(serverDir, 'index.js');
const apiIndexJs = join(apiDir, 'index.js');

if (existsSync(serverIndexJs)) {
  console.log('Found server/index.js, copying to api/index.js...');
  copyFileSync(serverIndexJs, apiIndexJs);
} else {
  console.log('WARNING: server/index.js not found!');
  
  // Check if TypeScript compiled it to a different location
  const compiledIndexLocations = [
    join(apiDir, 'index.js'), // Maybe already in api
    join(apiDir, 'server', 'index.js'), // Maybe nested
    join(serverDir, 'dist', 'index.js'), // Maybe in dist
  ];
  
  for (const location of compiledIndexLocations) {
    if (existsSync(location) && location !== apiIndexJs) {
      console.log(`Found index.js at ${location}, copying to api/index.js...`);
      copyFileSync(location, apiIndexJs);
      break;
    }
  }
}

// Final check
if (!existsSync(apiIndexJs)) {
  console.error('ERROR: api/index.js was not created!');
  console.log('Checking api directory contents:');
  const apiContents = readdirSync(apiDir);
  console.log(apiContents);
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