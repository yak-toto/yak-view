<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();
</script>

<h1>{data.phase.description}</h1>
<div class="matches-container">
    {#each data.binaryBets as binaryBet}
        <div class="match-row">
            <div class="team team-left">{binaryBet.team1.description}</div>
            <div class="score-container">
                <div class="score">{binaryBet.team1.score}</div>
                <div class="separator">-</div>
                <div class="score">{binaryBet.team2.score}</div>
            </div>
            <div class="team team-right">{binaryBet.team2.description}</div>
        </div>
    {/each}
</div>

<style>
    .matches-container {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
    }

    .match-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 0;
        border-bottom: 1px solid #eee;
    }

    .team {
        flex: 1;
        padding: 0 10px;
    }

    .team-left {
        text-align: right;
    }

    .team-right {
        text-align: left;
    }

    .score-container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-width: 80px;
    }

    .score {
        font-weight: bold;
        padding: 0 5px;
        min-width: 20px;
        text-align: center;
    }

    .separator {
        margin: 0 5px;
    }
</style>
