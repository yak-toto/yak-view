import { loginApiV1UsersLoginPost } from '$lib/client/sdk.gen';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
    default: async ({ request, cookies }) => {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const password = formData.get('password') as string;

        if (!name || !password) {
            return fail(400, { error: 'Veuillez remplir tous les champs.' });
        }

        const response = await loginApiV1UsersLoginPost({
            body: { name: name, password: password },
        });

        if (!response.data) {
            return fail(401, {
                error: 'Échec de la connexion. Veuillez vérifier vos identifiants.',
            });
        }

        // Save the access token in cookies
        cookies.set('accessToken', response.data.result.access_token, {
            path: '/',
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: 'lax',
            maxAge: response.data.result.access_expires_in,
        });

        // Save the refresh token in cookies
        cookies.set('refreshToken', response.data.result.refresh_token, {
            path: '/',
            httpOnly: true,
            secure: true, // Set to true in production
            sameSite: 'lax',
            maxAge: response.data.result.refresh_expires_in,
        });

        // Redirect to the groups page on success
        throw redirect(303, '/');
    },
};
