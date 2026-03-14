import { runCrudAction } from '../utils/crud-helper.js';

export async function restartCommand(): Promise<void> {
    await runCrudAction('restart');
}
