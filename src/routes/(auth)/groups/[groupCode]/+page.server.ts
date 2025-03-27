import {
    modifyScoreBetApiV1ScoreBetsBetIdPatch,
    retrieveBetsByGroupCodeApiV1BetsGroupsGroupCodeGet,
    retrieveGroupRankByCodeApiV1BetsGroupsRankGroupCodeGet,
} from '$lib/client/sdk.gen';
import { fail, redirect } from '@sveltejs/kit';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
    const response = await retrieveBetsByGroupCodeApiV1BetsGroupsGroupCodeGet({
        path: { group_code: params.groupCode },
    });

    if (!response.data) {
        throw redirect(302, '/');
    }

    const responseGroupRank = await retrieveGroupRankByCodeApiV1BetsGroupsRankGroupCodeGet({
        path: { group_code: params.groupCode },
    });

    if (!responseGroupRank.data) {
        throw redirect(302, '/');
    }

    // Helper function to create flag URL that points to our SvelteKit proxy
    const createFlagUrl = (teamId: string) => `/api/teams/${teamId}/flag`;

    return {
        group: { description: response.data.result.group.description },
        scoreBets: response.data.result.score_bets.map((scoreBet) => ({
            id: scoreBet.id,
            locked: scoreBet.locked,
            team1: {
                id: scoreBet.team1?.id,
                description: scoreBet.team1?.description,
                score: scoreBet.team1?.score,
                flagUrl: scoreBet.team1?.id ? createFlagUrl(scoreBet.team1.id) : null,
            },
            team2: {
                id: scoreBet.team2?.id,
                description: scoreBet.team2?.description,
                score: scoreBet.team2?.score,
                flagUrl: scoreBet.team2?.id ? createFlagUrl(scoreBet.team2.id) : null,
            },
        })),
        groupRank: responseGroupRank.data.result.group_rank.map((rank) => ({
            team: {
                id: rank.team.id,
                description: rank.team.description,
                flagUrl: rank.team.id ? createFlagUrl(rank.team.id) : null,
            },
            points: rank.points,
            played: rank.played,
            won: rank.won,
            drawn: rank.drawn,
            lost: rank.lost,
            goals_for: rank.goals_for,
            goals_against: rank.goals_against,
            goals_difference: rank.goals_difference,
        })),
    };
};

export const actions: Actions = {
    updateBet: async ({ request }) => {
        const formData = await request.formData();
        const betId = formData.get('betId') as string;
        const team1Score = formData.get('team1Score');
        const team2Score = formData.get('team2Score');

        if (!betId) {
            return fail(400, { message: 'Bet ID is required' });
        }

        // Convert scores to numbers or null
        const team1ScoreValue =
            team1Score === '' || team1Score === null ? null : parseInt(team1Score as string);
        const team2ScoreValue =
            team2Score === '' || team2Score === null ? null : parseInt(team2Score as string);

        // Validate scores
        if (
            team1Score !== '' &&
            team1Score !== null &&
            (isNaN(team1ScoreValue!) || team1ScoreValue! < 0)
        ) {
            return fail(400, { message: 'Team 1 score must be a valid non-negative number' });
        }

        if (
            team2Score !== '' &&
            team2Score !== null &&
            (isNaN(team2ScoreValue!) || team2ScoreValue! < 0)
        ) {
            return fail(400, { message: 'Team 2 score must be a valid non-negative number' });
        }

        try {
            const response = await modifyScoreBetApiV1ScoreBetsBetIdPatch({
                path: { bet_id: betId },
                body: {
                    team1: {
                        score: team1ScoreValue,
                    },
                    team2: {
                        score: team2ScoreValue,
                    },
                },
            });

            if (!response.data) {
                return fail(500, { message: 'Failed to update bet' });
            }

            return { success: true };
        } catch (error) {
            console.error('Error updating bet:', error);
            return fail(500, { message: 'Failed to update bet' });
        }
    },
};
