/**
 * PM2 Process Information
 * Based on pm2 jlist output
 */
export interface PM2Process {
    pm_id: number;
    name: string;
    pid: number;
    pm2_env: {
        status: 'online' | 'stopped' | 'errored' | 'launching' | 'one-launch-status';
        pm_uptime: number;
        restart_time: number;
        unstable_restarts: number;
        namespace?: string;
        version?: string;
        exec_mode?: string;
        [key: string]: unknown;
    };
    monit: {
        memory: number;
        cpu: number;
    };
}

/**
 * Options for starting a process
 */
export interface StartOptions {
    name?: string;
    instances?: number | string;
    maxMemoryRestart?: string;
    watch?: boolean;
    env?: string;
    logDateFormat?: string;
    namespace?: string;
    cron?: string;
}

/**
 * Script source type
 */
export type ScriptSource = 'js-file' | 'package-json';

/**
 * Package.json scripts
 */
export interface PackageJson {
    name?: string;
    scripts?: Record<string, string>;
    [key: string]: unknown;
}
