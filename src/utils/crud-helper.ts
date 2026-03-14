import { checkbox } from '@inquirer/prompts';
import { runPM2 } from '../pm2.js';
import { getProcessChoices, hasRunningProcesses } from './process-list.js';

type CrudAction = 'stop' | 'restart' | 'reload' | 'delete';

const actionMessages: Record<CrudAction, { noProcesses: string; success: string }> = {
    stop: {
        noProcesses: 'No running processes to stop.',
        success: 'stopped',
    },
    restart: {
        noProcesses: 'No processes to restart.',
        success: 'restarted',
    },
    reload: {
        noProcesses: 'No processes to reload.',
        success: 'reloaded',
    },
    delete: {
        noProcesses: 'No processes to delete.',
        success: 'deleted',
    },
};

export async function runCrudAction(action: CrudAction): Promise<void> {
    const hasProcesses = await hasRunningProcesses();
    const messages = actionMessages[action];

    if (!hasProcesses) {
        console.log(messages.noProcesses);
        return;
    }

    const choices = await getProcessChoices();

    if (choices.length === 0) {
        console.log(messages.noProcesses);
        return;
    }

    const selectedIds = await checkbox<string>({
        message: `Select processes to ${action}:`,
        choices,
        validate: (selected) => {
            if (selected.length === 0) {
                return 'Please select at least one process';
            }
            return true;
        },
    });

    if (selectedIds.length === 0) {
        console.log('Cancelled.');
        return;
    }

    // Execute the action for each selected process
    for (const id of selectedIds) {
        await runPM2([action, id]);
    }
}
