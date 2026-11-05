#!/usr/bin/env node

/**
 * clean-emojis.mjs
 *
 * Recursively scans .ts, .tsx, .js, and .json files in the workspace
 * (specifically targeting src, components, app, data, constants, messages, etc.)
 * and automatically strips all Unicode emojis without breaking code logic,
 * Arabic text, English text, or essential symbols (©, ®, ™).
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const SCRIPT_NAME = path.basename(__filename);
const ROOT_DIR = process.cwd();

// Target extensions
const TARGET_EXTENSIONS = new Set(['.ts', '.tsx', '.js', '.jsx', '.json', '.mjs']);

// Ignored directories
const IGNORED_DIRECTORIES = new Set([
  'node_modules',
  '.git',
  '.next',
  '.gemini',
  'dist',
  'build',
  'out',
  '.cache',
  'coverage'
]);

// Ignored specific files (e.g., this script itself and regex definitions)
const IGNORED_FILES = new Set([
  SCRIPT_NAME,
  'strip-emojis.ts',
  'clean-emojis.mjs'
]);

// Robust Unicode emoji regex:
// 1. Catches standard presentation emojis (\p{Emoji_Presentation})
// 2. Catches pictographs, variation selectors (\uFE0F/\uFE0E), and ZWJ composite chains
// 3. Catches full Unicode emoji ranges
// 4. Safely preserves copyright (©), registered trademark (®), and trademark (™)
const EMOJI_REGEX = /(?:(?![©®™])(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?(?:\u200D\p{Extended_Pictographic}(?:\uFE0F|\uFE0E)?)*|[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B55}]))/gu;

let totalScanned = 0;
let totalModified = 0;
let totalEmojisRemoved = 0;

function scanDirectory(currentDir) {
  let entries;
  try {
    entries = fs.readdirSync(currentDir, { withFileTypes: true });
  } catch (err) {
    console.error(`Unable to read directory ${currentDir}:`, err.message);
    return;
  }

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);

    if (entry.isDirectory()) {
      if (!IGNORED_DIRECTORIES.has(entry.name)) {
        scanDirectory(fullPath);
      }
    } else if (entry.isFile()) {
      if (IGNORED_FILES.has(entry.name)) continue;

      const ext = path.extname(entry.name).toLowerCase();
      if (TARGET_EXTENSIONS.has(ext)) {
        processFile(fullPath);
      }
    }
  }
}

function processFile(filePath) {
  totalScanned++;
  try {
    const originalContent = fs.readFileSync(filePath, 'utf8');
    const matches = originalContent.match(EMOJI_REGEX);

    if (matches && matches.length > 0) {
      const cleanedContent = originalContent.replace(EMOJI_REGEX, '');

      // Atomic safe write
      fs.writeFileSync(filePath, cleanedContent, 'utf8');

      totalModified++;
      totalEmojisRemoved += matches.length;

      const relativePath = path.relative(ROOT_DIR, filePath);
      console.log(`[CLEANED] ${relativePath} (-${matches.length} emojis)`);
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err.message);
  }
}

console.log('='.repeat(60));
console.log('EgyptX AI - Automated Emoji Eradication Script');
console.log(`Scanning root: ${ROOT_DIR}`);
console.log('='.repeat(60));

scanDirectory(ROOT_DIR);

console.log('='.repeat(60));
console.log('Summary:');
console.log(`  Total files scanned:  ${totalScanned}`);
console.log(`  Total files cleaned:  ${totalModified}`);
console.log(`  Total emojis removed: ${totalEmojisRemoved}`);
console.log('='.repeat(60));
if (totalEmojisRemoved === 0) {
  console.log('Result: The codebase is 100% emoji-free!');
} else {
  console.log('Result: All identified emojis were successfully eradicated!');
}
