import { select, number } from '@inquirer/prompts';
import { runPM2 } from '../pm2.js';
import { getProcessChoices, hasRunningProcesses } from '../utils/process-list.js';

export async function logsCommand(): Promise<void> {
    const hasProcesses = await hasRunningProcesses();

    if (!hasProcesses) {
        console.log('No running processes. Showing all logs...');
        await runPM2(['logs']);
        return;
    }

    const choices = await getProcessChoices();

    // Add option for all logs
    choices.unshift({
        name: 'All processes',
        value: 'all',
        short: 'all',
    });

    const selectedId = await select<string>({
        message: 'Select process to view logs:',
        choices,
    });

    const lines = await number({
        message: 'Number of lines to show:',
        default: 20,
    });

    const args = ['logs', selectedId === 'all' ? '' : selectedId, '--lines', String(lines ?? 20)];

    // Remove empty strings
    const cleanArgs = args.filter(arg => arg !== '');

    await runPM2(cleanArgs);
}
