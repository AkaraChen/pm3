import { select, input, confirm, number } from '@inquirer/prompts';
import { globby } from 'globby';
import { runPM2 } from '../pm2.js';
import { getPackageScripts, hasPackageScripts } from '../utils/package-json.js';
import type { ScriptSource } from '../types.js';

export async function startCommand(): Promise<void> {
    // Step 1: Choose script source
    const scriptSource = await select<ScriptSource>({
        message: 'What do you want to run?',
        choices: [
            { name: 'JavaScript file (.js)', value: 'js-file' },
            { name: 'Package.json script', value: 'package-json' },
        ],
    });

    let script: string;
    let defaultName: string;

    if (scriptSource === 'js-file') {
        // Find all .js files
        const jsFiles = await globby(['*.js', '*.ts', '!node_modules/**'], { cwd: process.cwd() });

        if (jsFiles.length === 0) {
            console.error('No .js or .ts files found in current directory.');
            process.exit(1);
        }

        script = await select<string>({
            message: 'Select a file:',
            choices: jsFiles.map(file => ({ name: file, value: file })),
        });

        defaultName = script.replace(/\.(js|ts)$/, '');
    } else {
        // Package.json scripts
        const hasScripts = await hasPackageScripts();
        if (!hasScripts) {
            console.error('No scripts found in package.json');
            process.exit(1);
        }

        const scripts = await getPackageScripts();
        const scriptName = await select<string>({
            message: 'Select a script:',
            choices: scripts.map(s => ({
                name: `${s.name} (${s.command})`,
                value: s.name,
            })),
        });

        script = `npm run ${scriptName}`;
        defaultName = scriptName;
    }

    // Step 2: Process name
    const name = await input({
        message: 'Process name:',
        default: defaultName,
    });

    // Step 3: Instances
    const useCluster = await confirm({
        message: 'Enable cluster mode (multiple instances)?',
        default: false,
    });

    let instances: string | undefined;
    if (useCluster) {
        const instanceChoice = await select<'max' | 'number'>({
            message: 'Number of instances:',
            choices: [
                { name: 'Max (use all CPU cores)', value: 'max' },
                { name: 'Specific number', value: 'number' },
            ],
        });

        if (instanceChoice === 'max') {
            instances = 'max';
        } else {
            const num = await number({
                message: 'Number of instances:',
                default: 2,
                min: 1,
            });
            instances = String(num ?? 1);
        }
    }

    // Step 4: Memory limit
    const memoryLimit = await input({
        message: 'Memory restart limit (e.g., 512M, 1G):',
        default: '512M',
    });

    // Step 5: Watch mode
    const watch = await confirm({
        message: 'Enable watch mode (auto-restart on file changes)?',
        default: false,
    });

    // Build the command arguments
    const args = ['start', script, '--name', name];

    if (instances) {
        args.push('--instances', instances);
    }

    if (memoryLimit) {
        args.push('--max-memory-restart', memoryLimit);
    }

    if (watch) {
        args.push('--watch');
    }

    // Execute PM2
    await runPM2(args);
}
