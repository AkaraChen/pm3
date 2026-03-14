import { getPM2Processes } from '../pm2.js';
import type { PM2Process } from '../types.js';

export interface ProcessChoice {
    name: string;
    value: string;
    short: string;
}

/**
 * Get running processes formatted for inquirer choices
 */
export async function getProcessChoices(): Promise<ProcessChoice[]> {
    const processes = await getPM2Processes();

    if (processes.length === 0) {
        return [];
    }

    return processes.map((proc) => ({
        name: `${proc.name} (id: ${proc.pm_id}, status: ${proc.pm2_env.status})`,
        value: String(proc.pm_id),
        short: proc.name,
    }));
}

/**
 * Get running processes with full info
 */
export async function getRunningProcesses(): Promise<PM2Process[]> {
    return getPM2Processes();
}

/**
 * Check if there are any running processes
 */
export async function hasRunningProcesses(): Promise<boolean> {
    const processes = await getPM2Processes();
    return processes.length > 0;
}
