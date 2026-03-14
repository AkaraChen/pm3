import { runPM2 } from '../pm2.js';

export async function monitCommand(): Promise<void> {
    // monit launches an interactive TUI, just pass through
    await runPM2(['monit']);
}
