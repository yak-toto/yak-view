<script lang="ts">
    import type { PageProps } from './$types';
    import { invalidateAll } from '$app/navigation';
    import TeamDisplay from './TeamDisplay.svelte';

    let { data }: PageProps = $props();

    // Create a reactive copy of the scoreBets data that we can modify
    // This will update whenever data.scoreBets changes
    let scoreBets = $state(
        data.scoreBets.map((bet) => ({
            ...bet,
            team1: { ...bet.team1 },
            team2: { ...bet.team2 },
        })),
    );

    // Update scoreBets when data changes (when navigating to different groups)
    $effect(() => {
        scoreBets = data.scoreBets.map((bet) => ({
            ...bet,
            team1: { ...bet.team1 },
            team2: { ...bet.team2 },
        }));
    });

    // Function to handle score updates and submit to server
    async function updateBet(betId: string, team1Score: number | null, team2Score: number | null) {
        const formData = new FormData();
        formData.set('betId', betId);
        formData.set('team1Score', team1Score?.toString() ?? '');
        formData.set('team2Score', team2Score?.toString() ?? '');

        try {
            const response = await fetch('?/updateBet', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                // Refresh all data (including group rank) after successful update
                await invalidateAll();
            } else {
                console.error('Failed to update bet');
            }
        } catch (error) {
            console.error('Error updating bet:', error);
        }
    }

    // Debounced update function
    let updateTimeout: number | null = null;
    function handleScoreChange(betId: string, team: 'team1' | 'team2', value: string) {
        // Find the bet and update the local state
        const bet = scoreBets.find((b) => b.id === betId);
        if (bet) {
            const scoreValue = value === '' ? null : parseInt(value);
            bet[team].score = scoreValue;

            // Clear existing timeout
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }

            // Set new timeout to update after 1 second of no changes
            updateTimeout = setTimeout(() => {
                updateBet(betId, bet.team1.score, bet.team2.score);
            }, 300);
        }
    }
</script>

<div class=" py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 class="yak-page-title">
            {data.group.description}
        </h1>

        <div class="space-y-8">
            <section>
                <h2 class="yak-section-title">Classement</h2>
                <div class="yak-table">
                    <table class="w-full">
                        <thead class="yak-table-header">
                            <tr class="w-full">
                                <th
                                    class="px-3 py-4 text-left text-xs font-semibold uppercase tracking-wider w-12"
                                    >#</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider min-w-48"
                                    >Équipe</th
                                >
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-16"
                                >
                                    <abbr
                                        title="Points"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">Pts</abbr
                                    >
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-12"
                                >
                                    <abbr
                                        title="Joué"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">J</abbr
                                    >
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-12"
                                >
                                    <abbr
                                        title="Gagné"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">G</abbr
                                    >
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-12"
                                >
                                    <abbr
                                        title="Nul"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">N</abbr
                                    >
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-12"
                                >
                                    <abbr
                                        title="Perdu"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">P</abbr
                                    >
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-16"
                                >
                                    <abbr
                                        title="Buts pour"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">BP</abbr
                                    >
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-16"
                                >
                                    <abbr
                                        title="Buts contre"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">BC</abbr
                                    >
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-16"
                                >
                                    <abbr
                                        title="Différence de buts"
                                        class="cursor-help border-b border-dotted"
                                        style="border-color: var(--yak-secondary);">Diff</abbr
                                    >
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y" style="border-color: rgba(135, 118, 102, 0.2);">
                            {#each data.groupRank as groupRank, index}
                                <tr
                                    class="yak-toto-row {index < 2
                                        ? 'yak-table-row-qualified'
                                        : ''}"
                                >
                                    <td class="px-3 py-2 text-sm">
                                        <div class="flex items-center">
                                            <span
                                                class="font-bold"
                                                style="color: var(--yak-primary);">{index + 1}</span
                                            >
                                        </div>
                                    </td>
                                    <td
                                        class="px-6 py-2 text-sm font-medium"
                                        style="color: var(--yak-primary);"
                                    >
                                        <TeamDisplay
                                            team={groupRank.team}
                                            alignment="left"
                                            size="sm"
                                        />
                                    </td>
                                    <td class="px-3 py-2 text-sm text-center">
                                        <span class="yak-points-badge">
                                            {groupRank.points}
                                        </span>
                                    </td>
                                    <td
                                        class="px-3 py-2 text-sm text-center"
                                        style="color: var(--yak-secondary);">{groupRank.played}</td
                                    >
                                    <td
                                        class="px-3 py-2 text-sm text-center"
                                        style="color: var(--yak-secondary);">{groupRank.won}</td
                                    >
                                    <td
                                        class="px-3 py-2 text-sm text-center"
                                        style="color: var(--yak-secondary);">{groupRank.drawn}</td
                                    >
                                    <td
                                        class="px-3 py-2 text-sm text-center"
                                        style="color: var(--yak-secondary);">{groupRank.lost}</td
                                    >
                                    <td
                                        class="px-3 py-2 text-sm text-center"
                                        style="color: var(--yak-secondary);"
                                        >{groupRank.goals_for}</td
                                    >
                                    <td
                                        class="px-3 py-2 text-sm text-center"
                                        style="color: var(--yak-secondary);"
                                        >{groupRank.goals_against}</td
                                    >
                                    <td class="px-3 py-2 text-sm text-center">
                                        <span
                                            class="font-semibold {groupRank.goals_difference > 0
                                                ? 'yak-goal-diff-positive'
                                                : groupRank.goals_difference < 0
                                                  ? 'yak-goal-diff-negative'
                                                  : 'yak-goal-diff-zero'}"
                                        >
                                            {groupRank.goals_difference > 0
                                                ? '+'
                                                : ''}{groupRank.goals_difference}
                                        </span>
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h2 class="yak-section-title">Matchs du groupe</h2>
                <div class="yak-table">
                    <table class="w-full">
                        <thead class="yak-table-header">
                            <tr>
                                <th
                                    class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider"
                                >
                                    Équipe 1
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-20"
                                >
                                    Score
                                </th>
                                <th
                                    class="px-3 py-4 text-center text-xs font-semibold uppercase tracking-wider w-20"
                                >
                                    Score
                                </th>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider"
                                >
                                    Équipe 2
                                </th>
                            </tr>
                        </thead>
                        <tbody class="divide-y" style="border-color: rgba(135, 118, 102, 0.2);">
                            {#each scoreBets as scoreBet}
                                <tr class="yak-toto-row">
                                    <!-- Team 1 name -->
                                    <td class="px-6 py-2">
                                        <TeamDisplay
                                            team={scoreBet.team1}
                                            alignment="right"
                                            size="sm"
                                        />
                                    </td>

                                    <!-- Team 1 score input -->
                                    <td class="px-3 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            readonly={scoreBet.locked}
                                            class="yak-score-input"
                                            class:readonly={scoreBet.locked}
                                            value={scoreBet.team1.score ?? ''}
                                            oninput={(e) =>
                                                handleScoreChange(
                                                    scoreBet.id,
                                                    'team1',
                                                    e.currentTarget.value,
                                                )}
                                        />
                                    </td>

                                    <!-- Team 2 score input -->
                                    <td class="px-3 py-2">
                                        <input
                                            type="number"
                                            min="0"
                                            readonly={scoreBet.locked}
                                            class="yak-score-input"
                                            class:readonly={scoreBet.locked}
                                            value={scoreBet.team2.score ?? ''}
                                            oninput={(e) =>
                                                handleScoreChange(
                                                    scoreBet.id,
                                                    'team2',
                                                    e.currentTarget.value,
                                                )}
                                        />
                                    </td>

                                    <!-- Team 2 name -->
                                    <td class="px-6 py-2">
                                        <TeamDisplay
                                            team={scoreBet.team2}
                                            alignment="left"
                                            size="sm"
                                        />
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    </div>
</div>

<style>
    input[type='number']::-webkit-outer-spin-button,
    input[type='number']::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    input[type='number'] {
        appearance: textfield;
    }
</style>
