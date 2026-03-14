import { writeFile, access } from 'node:fs/promises';
import { join } from 'node:path';
import { constants } from 'node:fs';

/**
 * Check if ecosystem.config.js already exists
 */
export async function ecosystemExists(): Promise<boolean> {
    try {
        await access(join(process.cwd(), 'ecosystem.config.js'), constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

/**
 * Generate minimal ecosystem.config.js content
 */
export function generateEcosystemConfig(name: string): string {
    return `module.exports = {
  apps: [{
    name: '${name}',
    script: './index.js',
    instances: 1,
    max_memory_restart: '512M'
  }]
};
`;
}

/**
 * Write ecosystem.config.js to the current directory
 */
export async function writeEcosystemConfig(name: string): Promise<void> {
    const content = generateEcosystemConfig(name);
    const filePath = join(process.cwd(), 'ecosystem.config.js');
    await writeFile(filePath, content, 'utf-8');
}

/**
 * Get the current directory name (last part of cwd)
 */
export function getCurrentDirName(): string {
    return process.cwd().split('/').pop() || 'app';
}
