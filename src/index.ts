#!/usr/bin/env node

import { program } from 'commander';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { startCommand } from './commands/start.js';
import { stopCommand } from './commands/stop.js';
import { restartCommand } from './commands/restart.js';
import { reloadCommand } from './commands/reload.js';
import { deleteCommand } from './commands/delete.js';
import { listCommand } from './commands/list.js';
import { logsCommand } from './commands/logs.js';
import { monitCommand } from './commands/monit.js';
import { initCommand } from './commands/init.js';
import { saveCommand } from './commands/save.js';
import { resurrectCommand } from './commands/resurrect.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read version from package.json
async function getVersion(): Promise<string> {
    try {
        const packagePath = join(__dirname, '..', 'package.json');
        const content = await readFile(packagePath, 'utf-8');
        const pkg = JSON.parse(content);
        return pkg.version || '1.0.0';
    } catch {
        return '1.0.0';
    }
}

async function main() {
    const version = await getVersion();

    program
        .name('pm3')
        .description('A user-friendly CLI wrapper for PM2')
        .version(version, '-v, --version');

    // CRUD Commands
    program
        .command('start')
        .description('Start a new process interactively')
        .action(async () => {
            try {
                await startCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    program
        .command('stop')
        .description('Stop running process(es)')
        .action(async () => {
            try {
                await stopCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    program
        .command('restart')
        .description('Restart process(es)')
        .action(async () => {
            try {
                await restartCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    program
        .command('reload')
        .description('Reload process(es) (zero-downtime for HTTP apps)')
        .action(async () => {
            try {
                await reloadCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    program
        .command('delete')
        .alias('del')
        .description('Delete process(es) from PM2')
        .action(async () => {
            try {
                await deleteCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    // Monitoring Commands
    program
        .command('list')
        .alias('ls')
        .description('List all processes in a formatted table')
        .action(async () => {
            try {
                await listCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    program
        .command('logs')
        .description('Stream logs for a process')
        .action(async () => {
            try {
                await logsCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    program
        .command('monit')
        .description('Launch terminal-based monitoring')
        .action(async () => {
            try {
                await monitCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    // Config Commands
    program
        .command('init')
        .description('Generate a minimal ecosystem.config.js')
        .action(async () => {
            try {
                await initCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    // Persistence Commands
    program
        .command('save')
        .description('Save current process list for resurrect')
        .action(async () => {
            try {
                await saveCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    program
        .command('resurrect')
        .description('Restore previously saved processes')
        .action(async () => {
            try {
                await resurrectCommand();
            } catch (error) {
                console.error('Error:', error instanceof Error ? error.message : String(error));
                process.exit(1);
            }
        });

    await program.parseAsync(process.argv);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
