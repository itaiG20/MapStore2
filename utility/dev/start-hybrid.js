/* eslint-disable no-console */
const { spawn } = require('child_process');

const DEFAULT_BACKEND_URL = 'http://localhost:8080/mapstore';
const backendUrl = process.env.MAPSTORE_BACKEND_URL || DEFAULT_BACKEND_URL;

console.log(`[hybrid-dev] MAPSTORE_BACKEND_URL=${backendUrl}`);
console.log('[hybrid-dev] Running frontend dev server on http://localhost:8081');

const child = spawn('npm', ['run', 'fe:start'], {
    stdio: 'inherit',
    shell: true,
    env: {
        ...process.env,
        MAPSTORE_BACKEND_URL: backendUrl
    }
});

child.on('exit', (code) => {
    process.exit(code ?? 0);
});

