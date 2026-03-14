# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**pm3** is a user-friendly CLI wrapper for PM2. It provides interactive prompts for CRUD operations (start, stop, restart, reload, delete) and simplifies common PM2 workflows.

## Commands

```bash
# Install dependencies
vp install

# Build the CLI (outputs to dist/index.js)
vp pack

# Watch mode for development
vp pack --watch

# Type check only
pnpm run typecheck

# Run tests (via Vitest)
vp test

# Run a specific test file
vp test run src/utils/ecosystem.test.ts

# Link locally for testing
pnpm link --global
pm3 --help
```

## Architecture

### Entry Point
`src/index.ts` - CLI setup using Commander. Registers all commands and their handlers.

### Command Structure
Each command is in `src/commands/` and exports an async function:
- `start.ts` - Interactive prompts for script selection, instances, memory, watch mode
- `stop.ts`, `restart.ts`, `reload.ts`, `delete.ts` - Multi-select process picker using checkbox prompts
- `list.ts` - Formatted table from `pm2 jlist` JSON
- `logs.ts`, `monit.ts` - Pass-through to PM2
- `init.ts` - Generate minimal ecosystem.config.js
- `save.ts`, `resurrect.ts` - Process persistence

### PM2 Integration
`src/pm2.ts` provides two key functions:
- `runPM2(args)` - Spawn PM2 with stdio inheritance (for user-facing commands)
- `runPM2JSON(args)` - Spawn PM2 and parse JSON output (for `pm2 jlist`)

The PM2 binary is resolved from `node_modules/.bin/pm2` relative to `process.cwd()`.

### Utilities
`src/utils/`:
- `package-json.ts` - Read and parse scripts from package.json
- `process-list.ts` - Get running processes for interactive selection
- `ecosystem.ts` - Generate ecosystem.config.js
- `crud-helper.ts` - Shared logic for stop/restart/reload/delete commands

## Build Configuration

`vite.config.ts` builds as an ES library with external dependencies:
- Entry: `src/index.ts`
- Output: `dist/index.js` (shebang preserved for CLI use)
- External: All node_modules (not bundled)

## Dependencies

Runtime dependencies (marked external in vite.config.ts):
- `commander` - CLI framework
- `@inquirer/prompts` - Interactive prompts
- `cli-table3` - Table formatting
- `globby` - File globbing for .js discovery
- `pm2` - Process manager (wrapped)

## Key Patterns

### Adding a New Command
1. Create `src/commands/mycommand.ts` with async function
2. Import and register in `src/index.ts` with `program.command()`
3. Use `runPM2()` to execute PM2 commands
4. Use `@inquirer/prompts` for interactive input

### Using PM2 JSON Output
```typescript
import { runPM2JSON } from './pm2.js';
const processes = await runPM2JSON<PM2Process[]>(['jlist']);
```

### Interactive Selection
```typescript
import { checkbox } from '@inquirer/prompts';
import { getProcessChoices } from './utils/process-list.js';

const choices = await getProcessChoices();
const selected = await checkbox<string>({ message: 'Select:', choices });
```
