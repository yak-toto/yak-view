import { retrieveTeamFlagByIdApiV1TeamsTeamIdFlagGet } from '$lib/client/sdk.gen';
import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
    try {
        const response = await retrieveTeamFlagByIdApiV1TeamsTeamIdFlagGet({
            path: { team_id: params.teamId },
        });

        if (!response.data) {
            throw error(404, 'Flag not found');
        }

        // Return the flag image with appropriate headers
        return new Response(response.data as BodyInit, {
            headers: {
                'Content-Type': 'image/png', // Adjust based on your flag image format
                'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
            },
        });
    } catch (err) {
        console.error('Error fetching team flag:', err);
        throw error(500, 'Failed to fetch team flag');
    }
};
