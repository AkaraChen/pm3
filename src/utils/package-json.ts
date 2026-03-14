import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { PackageJson } from '../types.js';

/**
 * Read and parse package.json from the current directory
 */
export async function readPackageJson(): Promise<PackageJson | null> {
    const packageJsonPath = join(process.cwd(), 'package.json');

    if (!existsSync(packageJsonPath)) {
        return null;
    }

    try {
        const content = await readFile(packageJsonPath, 'utf-8');
        return JSON.parse(content) as PackageJson;
    } catch {
        return null;
    }
}

/**
 * Get available scripts from package.json
 */
export async function getPackageScripts(): Promise<{ name: string; command: string }[]> {
    const pkg = await readPackageJson();

    if (!pkg?.scripts) {
        return [];
    }

    return Object.entries(pkg.scripts).map(([name, command]) => ({
        name,
        command,
    }));
}

/**
 * Check if package.json has scripts
 */
export async function hasPackageScripts(): Promise<boolean> {
    const scripts = await getPackageScripts();
    return scripts.length > 0;
}
