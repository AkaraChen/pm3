import { runCrudAction } from '../utils/crud-helper.js';

export async function stopCommand(): Promise<void> {
    await runCrudAction('stop');
}
