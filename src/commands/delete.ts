import { runCrudAction } from '../utils/crud-helper.js';

export async function deleteCommand(): Promise<void> {
    await runCrudAction('delete');
}
