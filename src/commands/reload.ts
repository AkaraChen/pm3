import { runCrudAction } from '../utils/crud-helper.js';

export async function reloadCommand(): Promise<void> {
    await runCrudAction('reload');
}
