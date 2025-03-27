import { retrieveUserResultsApiV1ResultsGet } from '$lib/client/sdk.gen';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
    const result = await retrieveUserResultsApiV1ResultsGet();

    if (!result.data) {
        if (result.error.description === 'No results for admin user') {
            return {
                rank: 0,
                fullName: '',
                points: 0,
            };
        }

        throw redirect(302, '/'); // Redirect to home if no results are found
    }

    return {
        rank: result.data.result.rank,
        fullName: result.data.result.full_name,
        points: result.data.result.points,
    };
};
