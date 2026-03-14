import Table from 'cli-table3';
import { getRunningProcesses } from '../utils/process-list.js';
import type { PM2Process } from '../types.js';

function formatMemory(bytes: number): string {
    if (bytes === 0) return '0B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)}${sizes[i]}`;
}

function formatUptime(timestamp: number): string {
    if (!timestamp) return 'N/A';
    const diff = Date.now() - timestamp;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
}

function getStatusColor(status: string): (text: string) => string {
    const colors: Record<string, (text: string) => string> = {
        online: (t) => `\x1b[32m${t}\x1b[0m`,     // green
        stopped: (t) => `\x1b[33m${t}\x1b[0m`,    // yellow
        errored: (t) => `\x1b[31m${t}\x1b[0m`,    // red
        launching: (t) => `\x1b[36m${t}\x1b[0m`,  // cyan
    };
    return colors[status] || ((t) => t);
}

export async function listCommand(): Promise<void> {
    const processes = await getRunningProcesses();

    if (processes.length === 0) {
        console.log('No processes running. Use "pm3 start" to start a process.');
        return;
    }

    // Create table
    const table = new Table({
        head: ['ID', 'Name', 'Status', 'CPU', 'Memory', 'Uptime', 'Restarts'],
        style: {
            head: ['cyan'],
            border: ['gray'],
        },
        colWidths: [6, 20, 12, 8, 12, 10, 10],
    });

    for (const proc of processes) {
        const colorize = getStatusColor(proc.pm2_env.status);
        table.push([
            proc.pm_id,
            proc.name,
            colorize(proc.pm2_env.status),
            `${proc.monit.cpu}%`,
            formatMemory(proc.monit.memory),
            formatUptime(proc.pm2_env.pm_uptime),
            proc.pm2_env.restart_time,
        ]);
    }

    console.log(table.toString());
}
