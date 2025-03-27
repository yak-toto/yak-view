import { redirect } from '@sveltejs/kit';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
    cookies.delete('accessToken', { path: '/' });
    cookies.delete('refreshToken', { path: '/' });

    throw redirect(302, '/login');
};
