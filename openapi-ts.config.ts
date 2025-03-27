import { defineConfig } from '@hey-api/openapi-ts';
import { execSync } from 'node:child_process';

import pkg from './package.json';

const openapi_spec = JSON.parse(
    execSync(`uv run --isolated --with yak-server==${pkg.backendApiVersion} yak openapi`)
        .toString()
        .trim(),
);

console.log(`Generating client for backend API version ${pkg.backendApiVersion}...`);

export default defineConfig({
    input: openapi_spec,
    output: `src/lib/client`,
    plugins: [
        {
            name: '@hey-api/client-fetch',
            runtimeConfigPath: './src/lib/hey-api.ts',
        },
    ],
});
