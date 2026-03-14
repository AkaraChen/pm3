import { confirm } from '@inquirer/prompts';
import { runPM2 } from '../pm2.js';

export async function resurrectCommand(): Promise<void> {
    const confirmed = await confirm({
        message: 'This will restore all previously saved processes. Continue?',
        default: true,
    });

    if (!confirmed) {
        console.log('Cancelled.');
        return;
    }

    await runPM2(['resurrect']);
}
