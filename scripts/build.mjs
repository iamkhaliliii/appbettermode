import { existsSync, copyFileSync, mkdirSync, readdirSync, lstatSync, unlinkSync, writeFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';

console.log('Starting build process...');

// Source and destination paths
const serverDir = 'server/dist';
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

// Function to copy compiled files from server/dist to api
function copyCompiledFiles(srcDir, destDir, relativePath = '') {
  const currentSrcDir = join(srcDir, relativePath);
  const currentDestDir = join(destDir, relativePath);
  
  if (!existsSync(currentSrcDir)) {
    // If the source is server/dist and it doesn't exist, it's a problem from tsc
    if (srcDir.endsWith('server/dist') && relativePath === '') {
        console.warn(`Warning: Source directory ${currentSrcDir} does not exist. TypeScript compilation might have failed or produced no output.`);
    }
    return;
  }
  
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
      console.log(`Copied: ${join(relativePath, item)} from ${srcDir} to ${destDir}`);
    }
  }
}

// Copy all compiled JavaScript files from server/dist to api
console.log('Copying compiled files from server/dist to api...');
copyCompiledFiles(serverDir, apiDir);

// Specifically check for and copy the main index.js file if it was handled by tsc
// This logic might need adjustment if index.ts is not directly in the root of serverDir (now server/dist)
const serverIndexJs = join(serverDir, 'index.js'); 
const apiIndexJs = join(apiDir, 'index.js');

// If api/index.js was already created by the above general copy, this is fine.
// If server/dist/index.js exists and api/index.js wasn't created (e.g. if apiDir root wasn't processed by copyCompiledFiles correctly)
// then copy it.
if (existsSync(serverIndexJs) && !existsSync(apiIndexJs)) {
  console.log(`Found ${serverIndexJs}, copying to ${apiIndexJs} as it wasn't copied by the general process.`);
  copyFileSync(serverIndexJs, apiIndexJs);
} else if (existsSync(serverIndexJs) && existsSync(apiIndexJs)){
  console.log(`${apiIndexJs} already exists (presumably copied correctly from ${serverIndexJs}).`);
} else if (!existsSync(serverIndexJs)) {
  console.warn(`WARNING: Main server entry point ${serverIndexJs} not found in tsc output directory.`);
}

// Final check
if (!existsSync(apiIndexJs)) {
  console.error('ERROR: api/index.js was not created! The API will not start.');
  console.log('Checking api directory contents:');
  if(existsSync(apiDir)) {
    const apiContents = readdirSync(apiDir);
    console.log(apiContents);
  } else {
    console.log('api directory does not exist.');
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

// Explicitly create api/env.js for Vercel deployment
const apiEnvJsPath = join(apiDir, 'env.js');
// Using \n for newline character in the string literal
const envJsContent = "export const envSetupCompleted = true;\nconsole.log('[env.js] Dummy env module loaded for Vercel.');";
try {
  writeFileSync(apiEnvJsPath, envJsContent);
  console.log(`Successfully created/overwrote ${apiEnvJsPath} with dummy export.`);
} catch (err) {
  console.error(`Error writing ${apiEnvJsPath}:`, err);
}

console.log('Build script completed successfully.'); 