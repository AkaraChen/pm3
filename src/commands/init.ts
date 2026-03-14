import { input, confirm } from '@inquirer/prompts';
import {
    ecosystemExists,
    writeEcosystemConfig,
    getCurrentDirName,
} from '../utils/ecosystem.js';

export async function initCommand(): Promise<void> {
    const dirName = getCurrentDirName();

    // Check if file already exists
    if (await ecosystemExists()) {
        const overwrite = await confirm({
            message: 'ecosystem.config.js already exists. Overwrite?',
            default: false,
        });

        if (!overwrite) {
            console.log('Cancelled.');
            return;
        }
    }

    // Ask for app name
    const name = await input({
        message: 'App name:',
        default: dirName,
    });

    // Write the config file
    await writeEcosystemConfig(name);

    console.log(`✓ Created ecosystem.config.js`);
}
