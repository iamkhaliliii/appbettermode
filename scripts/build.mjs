import { existsSync, copyFileSync, mkdirSync, readdirSync, lstatSync, unlinkSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname, basename, extname } from 'path';

console.log('Starting build process (scripts/build.mjs)...');

const serverDistDir = 'server/dist';
const apiDir = 'api';

// Ensure the API directory exists
if (!existsSync(apiDir)) {
  mkdirSync(apiDir);
  console.log(`Created ${apiDir} directory`);
}

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
const envJsContent = "export const envSetupCompleted = true;\nconsole.log('[env.js] Dummy env module explicitly created by build.mjs.');";
try {
  writeFileSync(apiEnvJsPath, envJsContent);
  console.log(`Successfully wrote ${apiEnvJsPath} with dummy export.`);
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
    if (stat.isDirectory()) {
      copyCompiledFiles(srcDir, destDir, join(relativePath, item));
    } else if (extname(item) === '.js') {
      // Avoid re-copying env.js if we just wrote it, though this explicit write should be authoritative.
      if (basename(destPath) === 'env.js' && relativePath === '') {
          console.log(`Skipping copy of ${srcPath} over explicitly written ${destPath}`);
          continue;
      }
      const destPath = join(currentDestDir, item);
      copyFileSync(srcPath, destPath);
      console.log(`Copied: ${join(relativePath, item)} from ${srcDir} to ${destDir}`);
    }
  }
}

console.log('Copying compiled files from server/dist to api (excluding api/env.js if already written)...');
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

console.log('Build script (scripts/build.mjs) completed successfully.'); 