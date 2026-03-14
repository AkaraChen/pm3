import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import type { PM2Process } from './types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Get the path to the PM2 binary
 */
function getPM2Path(): string {
    // In development, use the local node_modules
    // In production, use the resolved pm2 path
    return join(process.cwd(), 'node_modules', '.bin', 'pm2');
}

/**
 * Run a PM2 command and return the output
 */
export function runPM2(args: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
        const pm2Path = getPM2Path();
        const child = spawn(pm2Path, args, {
            stdio: 'inherit',
        });

        child.on('close', (code) => {
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`PM2 exited with code ${code}`));
            }
        });

        child.on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Run a PM2 command and capture JSON output
 */
export function runPM2JSON<T>(args: string[]): Promise<T> {
    return new Promise((resolve, reject) => {
        const pm2Path = getPM2Path();
        const child = spawn(pm2Path, args, {
            stdio: ['pipe', 'pipe', 'pipe'],
        });

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr?.on('data', (data) => {
            stderr += data.toString();
        });

        child.on('close', (code) => {
            if (code !== 0 && stderr) {
                reject(new Error(stderr));
                return;
            }

            try {
                // PM2 sometimes outputs non-JSON lines before the JSON
                // Find the first '[' or '{' character
                const jsonStart = stdout.search(/[\[{]/);
                if (jsonStart === -1) {
                    resolve([] as T);
                    return;
                }
                const jsonStr = stdout.slice(jsonStart);
                const parsed = JSON.parse(jsonStr);
                resolve(parsed as T);
            } catch {
                reject(new Error(`Failed to parse PM2 output: ${stdout}`));
            }
        });

        child.on('error', (err) => {
            reject(err);
        });
    });
}

/**
 * Get list of running PM2 processes
 */
export async function getPM2Processes(): Promise<PM2Process[]> {
    try {
        const processes = await runPM2JSON<PM2Process[]>(['jlist']);
        return processes || [];
    } catch {
        return [];
    }
}

/**
 * Check if PM2 daemon is running
 */
export async function isPM2Running(): Promise<boolean> {
    try {
        await getPM2Processes();
        return true;
    } catch {
        return false;
    }
}
