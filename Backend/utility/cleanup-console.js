#!/usr/bin/env node

/**
 * Production Console Cleanup Script
 * Removes unnecessary console.log statements for production deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Patterns to remove (debug/development logs)
const REMOVE_PATTERNS = [
    /console\.log\(\s*["'`]Posts state:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Debug.*?["'`].*?\);?/g,
    /console\.log\(\s*["'`]Post ID type:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Delete post called with ID:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Edit post clicked for postId:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Attempting to delete post with ID:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Found and set post:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Post not found with ID:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Sending data:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Added file to form data:["'`].*?\);?/g,
    /console\.log\(\s*["'`]Update response:["'`].*?\);?/g,
    /console\.log\(\s*posts\s*\);?/g,
    /console\.log\(\s*users\s*\);?/g,
    /console\.log\(\s*onlineUsers\s*\);?/g,
    /console\.log\(\s*authUser\s*\);?/g,
    /console\.log\(\s*id\s*\);?/g,
    /console\.log\(\s*gender\s*\);?/g,
    /console\.log\(\s*response\s*\);?/g,
    /\/\* Debug log \*\//g,
    /\/\/ Debug log/g,
];

// Patterns to keep (important logs)
const KEEP_PATTERNS = [
    /logger\.(error|warn|info|debug|audit|security)/,
    /console\.error.*Email.*fail/,
    /console\.error.*Error/,
    /console\.warn/,
];

// Files to exclude
const EXCLUDE_FILES = [
    'node_modules',
    '.git',
    '.history',
    'README.md',
    'package.json',
    'logger.js'
];

function shouldExcludeFile(filePath) {
    return EXCLUDE_FILES.some(exclude => filePath.includes(exclude));
}

function shouldKeepLine(line) {
    return KEEP_PATTERNS.some(pattern => pattern.test(line));
}

function cleanFile(filePath) {
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        let modifications = 0;

        // Remove debug console logs
        REMOVE_PATTERNS.forEach(pattern => {
            const matches = content.match(pattern);
            if (matches) {
                matches.forEach(match => {
                    if (!shouldKeepLine(match)) {
                        content = content.replace(match, '');
                        modifications++;
                    }
                });
            }
        });

        // Remove standalone debug console.log statements
        const lines = content.split('\n');
        const cleanedLines = lines.filter(line => {
            const trimmed = line.trim();
            
            // Keep empty lines and non-console lines
            if (!trimmed || !trimmed.includes('console.log')) {
                return true;
            }
            
            // Keep important console statements
            if (shouldKeepLine(trimmed)) {
                return true;
            }
            
            // Remove debug/development console.logs
            if (trimmed.startsWith('console.log(') && !trimmed.includes('error') && !trimmed.includes('Error')) {
                modifications++;
                return false;
            }
            
            return true;
        });

        content = cleanedLines.join('\n');

        // Clean up multiple empty lines
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

        if (modifications > 0) {
            fs.writeFileSync(filePath, content);
        }

    } catch (error) {
        console.error(`❌ Error cleaning ${filePath}:`, error.message);
    }
}

function walkDirectory(dir) {
    let fileCount = 0;
    
    function walk(currentPath) {
        const items = fs.readdirSync(currentPath);
        
        items.forEach(item => {
            const fullPath = path.join(currentPath, item);
            const stat = fs.statSync(fullPath);
            
            if (shouldExcludeFile(fullPath)) {
                return;
            }
            
            if (stat.isDirectory()) {
                walk(fullPath);
            } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.jsx'))) {
                cleanFile(fullPath);
                fileCount++;
            }
        });
    }
    
    walk(dir);
    return fileCount;
}

// Main execution

const projectRoot = path.join(__dirname, '..');
const fileCount = walkDirectory(projectRoot);

