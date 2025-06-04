import { existsSync, copyFileSync, mkdirSync, readdirSync, lstatSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';

console.log('Starting build process (scripts/build.mjs)...');

const serverDistDir = 'server/dist';
const apiDir = 'api';
const frontendDistDir = 'dist/public';
const publicDir = 'public';

// Ensure the API directory exists
if (!existsSync(apiDir)) {
  mkdirSync(apiDir);
  console.log(`Created ${apiDir} directory`);
}

// Ensure the public directory exists for Vercel
if (!existsSync(publicDir)) {
  mkdirSync(publicDir, { recursive: true });
  console.log(`Created ${publicDir} directory`);
}

// Function to copy frontend build files
function copyFrontendFiles(srcDir, destDir) {
  if (!existsSync(srcDir)) {
    console.warn(`Warning: Frontend source directory ${srcDir} does not exist.`);
    return;
  }

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }

  const items = readdirSync(srcDir);
  for (const item of items) {
    const srcPath = join(srcDir, item);
    const destPath = join(destDir, item);
    const stat = lstatSync(srcPath);
    
    if (stat.isDirectory()) {
      copyFrontendFiles(srcPath, destPath);
    } else {
      copyFileSync(srcPath, destPath);
      console.log(`Copied frontend file: ${item}`);
    }
  }
}

// Copy frontend build files to public directory
console.log('Copying frontend build files to public directory...');
copyFrontendFiles(frontendDistDir, publicDir);

// Attempt to delete api/env.js first to ensure a clean write
const apiEnvJsPath = join(apiDir, 'env.js');
if (existsSync(apiEnvJsPath)) {
  try {
    unlinkSync(apiEnvJsPath);
    console.log(`Successfully deleted existing ${apiEnvJsPath}`);
  } catch (err) {
    console.error(`Error deleting existing ${apiEnvJsPath}:`, err);
  }
}

// Explicitly create api/env.js for Vercel deployment
const envJsContent = `import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Export a flag to indicate env setup is complete
export const envSetupCompleted = true;

// Log that env has been loaded (useful for debugging)
console.log('[env.js] Environment variables loaded via dotenv');

// Export commonly used env variables for convenience
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const DATABASE_URL = process.env.DATABASE_URL;
export const POSTGRES_URL = process.env.POSTGRES_URL;
export const VERCEL = process.env.VERCEL;
export const PORT = process.env.PORT || 3000;`;

try {
  writeFileSync(apiEnvJsPath, envJsContent);
  console.log(`Successfully wrote ${apiEnvJsPath} with proper dotenv config.`);
} catch (err) {
  console.error(`Error writing ${apiEnvJsPath}:`, err);
}

// Function to clean TS files in API directory
function cleanTsFilesInApi(dir) {
  if (!existsSync(dir)) return;
  const items = readdirSync(dir);
  for (const item of items) {
    const fullPath = join(dir, item);
    if (lstatSync(fullPath).isDirectory()) {
      cleanTsFilesInApi(fullPath);
    } else if (extname(fullPath) === '.ts') {
      console.log(`Removing TypeScript file: ${fullPath}`);
      unlinkSync(fullPath);
    }
  }
}
cleanTsFilesInApi(apiDir);
console.log('Cleaned TypeScript files from API directory (if any found).');

// Function to copy compiled files from server/dist to api
function copyCompiledFiles(srcDir, destDir, relativePath = '') {
  const currentSrcDir = join(srcDir, relativePath);
  const currentDestDir = join(destDir, relativePath);
  
  if (!existsSync(currentSrcDir)) {
    if (srcDir.endsWith('server/dist') && relativePath === '') {
        console.warn(`Warning: Source directory ${currentSrcDir} does not exist. TypeScript compilation might have failed or produced no output.`);
    }
    return;
  }
  
  if (!existsSync(currentDestDir)) {
    mkdirSync(currentDestDir, { recursive: true });
  }
  
  const items = readdirSync(currentSrcDir);
  for (const item of items) {
    const srcPath = join(currentSrcDir, item);
    const stat = lstatSync(srcPath);
    const destPath = join(currentDestDir, item);
    
    if (stat.isDirectory()) {
      copyCompiledFiles(srcDir, destDir, join(relativePath, item));
    } else if (extname(item) === '.js') {
      // Avoid re-copying env.js if we explicitly wrote it.
      if (item === 'env.js' && relativePath === '') {
          console.log(`Skipping copy of ${srcPath} over explicitly written api/env.js as it was handled at the start of this script.`);
          continue;
      }
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${join(relativePath, item)} from ${srcDir} to ${destDir}`);
    }
  }
}

console.log('Copying compiled files from server/dist to api (api/env.js handled separately)...');
copyCompiledFiles(serverDistDir, apiDir);

const serverIndexJs = join(serverDistDir, 'index.js'); 
const apiIndexJs = join(apiDir, 'index.js');

if (existsSync(serverIndexJs) && !existsSync(apiIndexJs)) {
  console.log(`Found ${serverIndexJs}, copying to ${apiIndexJs}.`);
  copyFileSync(serverIndexJs, apiIndexJs);
} else if (existsSync(serverIndexJs) && existsSync(apiIndexJs)){
  console.log(`${apiIndexJs} already exists.`);
} else if (!existsSync(serverIndexJs)) {
  console.warn(`WARNING: Main server entry point ${serverIndexJs} not found in ${serverDistDir}.`);
}

if (!existsSync(apiIndexJs)) {
  console.error('ERROR: api/index.js was not created! The API will not start.');
}

// Final verification for api/env.js
if (existsSync(apiEnvJsPath)) {
  const finalEnvContent = readFileSync(apiEnvJsPath, 'utf-8');
  if (finalEnvContent.includes('export const envSetupCompleted = true;')) {
    console.log(`${apiEnvJsPath} successfully created and contains the correct export.`);
  } else {
    console.error(`ERROR: ${apiEnvJsPath} exists but does NOT contain the correct export. Content: ${finalEnvContent}`);
  }
} else {
  console.error(`ERROR: ${apiEnvJsPath} was NOT found after all build steps in build.mjs.`);
}

// Verify frontend files are in public directory
const publicIndexHtml = join(publicDir, 'index.html');
if (existsSync(publicIndexHtml)) {
  console.log('✅ Frontend files successfully copied to public directory');
} else {
  console.error('❌ Frontend index.html not found in public directory');
}

console.log('Build script (scripts/build.mjs) completed successfully.'); 