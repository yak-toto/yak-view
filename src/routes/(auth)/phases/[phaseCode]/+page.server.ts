import { retrieveBetsByPhaseCodeApiV1BetsPhasesPhaseCodeGet } from '$lib/client/sdk.gen';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const response = await retrieveBetsByPhaseCodeApiV1BetsPhasesPhaseCodeGet({
        path: { phase_code: params.phaseCode },
    });

    if (!response.data) {
        throw redirect(302, '/login'); // Redirect to home if no result is found
    }

    return {
        phase: { description: response.data.result.phase.description },
        binaryBets: response.data.result.binary_bets.map((binaryBet) => ({
            team1: {
                description: binaryBet.team1?.description,
                score: binaryBet.team1?.won,
            },
            team2: {
                description: binaryBet.team2?.description,
                score: binaryBet.team2?.won,
            },
        })),
    };
};
