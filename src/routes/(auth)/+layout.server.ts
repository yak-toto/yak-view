import { retrieveAllGroupsApiV1GroupsGet } from '$lib/client/sdk.gen';
import { redirect } from '@sveltejs/kit';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
    const response = await retrieveAllGroupsApiV1GroupsGet();

    if (!response.data) {
        throw redirect(302, '/login');
    }

    const group_phase_id = response.data.result.phases.find((phase) => phase.code === 'GROUP')?.id;
    const finale_phase = response.data.result.phases.find((phase) => phase.code === 'FINAL');

    if (!finale_phase) {
        throw redirect(302, '/login');
    }

    return {
        // Navigation data needed by layout
        groups: response.data.result.groups
            .filter((group) => group.phase.id === group_phase_id)
            .map((group) => ({
                id: group.id,
                code: group.code,
                description: group.description,
            })),
        finale_phase: {
            id: finale_phase.id,
            code: finale_phase.code,
            description: finale_phase.description,
        },
        // Remove score_bets and binary_bets since pages will fetch their own data
    };
};
