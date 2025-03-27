// src/hooks.server.ts
import { refreshApiV1UsersRefreshPost } from '$lib/client/sdk.gen';
import type { Handle } from '@sveltejs/kit';
import { jwtDecode } from 'jwt-decode';

import { client } from '$lib/client/client.gen';

export const handle: Handle = async ({ event, resolve }) => {
    const cookies = event.cookies;

    let accessToken = cookies.get('accessToken');
    const refreshToken = cookies.get('refreshToken');

    let isAccessTokenValid = false;

    if (accessToken) {
        try {
            const decoded: { exp: number } = jwtDecode(accessToken);

            const now = Math.floor(Date.now() / 1000);
            isAccessTokenValid = decoded.exp > now;
        } catch (err) {
            console.error('Invalid access token', err);
            isAccessTokenValid = false;
        }
    }

    if (!isAccessTokenValid && refreshToken) {
        const response = await refreshApiV1UsersRefreshPost({
            body: { refresh_token: refreshToken },
        });

        if (response.data) {
            const { result } = response.data;

            accessToken = result.access_token;

            cookies.set('accessToken', result.access_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: result.access_expires_in,
            });

            cookies.set('refreshToken', result.refresh_token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                path: '/',
                maxAge: result.refresh_expires_in,
            });
        } else {
            console.error('Refresh failed — user must re-authenticate');
            cookies.delete('accessToken', { path: '/' });
            cookies.delete('refreshToken', { path: '/' });
        }
    }

    // ✅ Make the token available to load functions or endpoints:
    event.locals.accessToken = accessToken;

    client.setConfig({
        auth: () => accessToken,
    });

    return resolve(event);
};
