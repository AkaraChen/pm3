import { runPM2 } from '../pm2.js';

export async function saveCommand(): Promise<void> {
    await runPM2(['save']);
}
