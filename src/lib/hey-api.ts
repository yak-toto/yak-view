import type { CreateClientConfig } from './client/client.gen';

import { env } from '$env/dynamic/private';

export const createClientConfig: CreateClientConfig = (config) => ({
    ...config,
    baseUrl: env.BACKEND_URL,
});
