# pm3

> This project is under heavy construction.

**Process management that speaks human.**

[中文版本](./README.CN.md)

---

## Installation

```bash
bun add -g @akrc/pm3
```

## Why pm3?

PM2 is powerful—but its command-line interface feels like it was designed for robots. Every operation requires memorizing obscure flags, chaining arguments, and decoding cryptic output. For developers who just want to run their apps reliably, the learning curve is unnecessarily steep.

**pm3 is built on a simple idea: you shouldn't need to read documentation to start a process.**

## The Philosophy

### Guiding, Not Guessing
Instead of typing `pm2 start app.js --name myapp --instances max --max-memory-restart 512M`, just run `pm3 start`. Answer a few straightforward prompts, and you're done. We handle the flags; you focus on your code.

### Discoverability Over Memorization
Can't remember the exact command to scale your app? Neither can we. That's why pm3 presents your options interactively—available scripts, running processes, configuration choices—all at your fingertips without consulting a manual.

### Power Without Complexity
pm3 doesn't sacrifice PM2's capabilities. Cluster mode, memory limits, watch mode, log streaming, monitoring—it's all there. We've just hidden the complexity behind a conversational interface that respects your time.

## What You Can Do

**Start & Configure**
- Launch JavaScript files or npm scripts interactively
- Configure cluster mode, memory limits, and watch mode through prompts
- Generate ecosystem.config.js with sensible defaults

**Manage & Control**
- Stop, restart, or reload processes with visual selection
- Delete processes cleanly with confirmation
- Save and resurrect your process list across reboots

**Monitor & Observe**
- View all processes in a clean, formatted table
- Stream logs for specific processes
- Launch terminal-based monitoring dashboard

## Who It's For

pm3 is for developers who:
- Want PM2's reliability without its learning curve
- Prefer interactive prompts over memorizing CLI flags
- Manage multiple Node.js applications and need to move fast
- Believe developer tools should be approachable, not intimidating

## The Vision

We imagine a world where process management is invisible—where deploying and monitoring applications feels as natural as writing the code itself. pm3 is a step toward that future: powerful infrastructure wrapped in human-centered design.

---

*pm3 requires Node.js and PM2 to be installed in your project.*
