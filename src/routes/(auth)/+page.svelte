<script lang="ts">
    import type { PageProps } from './$types';

    let { data }: PageProps = $props();

    // Helper function to get rank suffix
    function getRankSuffix(rank: number): string {
        if (rank === 0) return '';
        const lastDigit = rank % 10;
        const lastTwoDigits = rank % 100;

        if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'ème';
        if (lastDigit === 1) return 'er';
        return 'ème';
    }

    // Helper function to get status message
    function getStatusMessage(rank: number, points: number): string {
        if (rank === 0) return 'Commencez à prédire pour apparaître au classement';
        if (rank === 1) return 'Vous êtes actuellement en première position';
        if (rank <= 3) return 'Vous êtes sur le podium';
        if (rank <= 10) return 'Vous êtes dans le top 10';
        if (points === 0) return 'Faites vos premiers pronostics pour marquer des points';
        return 'Continuez vos prédictions pour améliorer votre classement';
    }

    // Helper function to get status title
    function getStatusTitle(rank: number): string {
        if (rank === 0) return 'Statut : Non classé';
        if (rank === 1) return 'Statut : En tête';
        if (rank <= 3) return 'Statut : Sur le podium';
        if (rank <= 10) return 'Statut : Top 10';
        return 'Statut : Participant actif';
    }
</script>

<div class="yak-dashboard-container">
    <header class="yak-dashboard-header">
        <h1 class="yak-dashboard-title">Tableau de Bord</h1>
        <p class="yak-dashboard-subtitle">Votre performance dans le tournoi</p>
    </header>

    <div class="yak-stats-grid">
        <!-- Rank Card -->
        <div class="yak-stat-card">
            <h3 class="yak-stat-label">Position</h3>
            <div class="yak-stat-value">
                {#if data.rank === 0}
                    <span class="yak-no-rank">Non classé</span>
                {:else}
                    <span class="yak-rank-highlight">{data.rank}</span><span class="yak-rank-suffix"
                        >{getRankSuffix(data.rank)}</span
                    >
                {/if}
            </div>
        </div>

        <!-- Points Card -->
        <div class="yak-stat-card">
            <h3 class="yak-stat-label">Points</h3>
            <div class="yak-stat-value">
                <span class="yak-points-highlight">{data.points}</span><span class="yak-points-unit"
                    >pts</span
                >
            </div>
        </div>

        <!-- Name Card -->
        <div class="yak-stat-card">
            <h3 class="yak-stat-label">Participant</h3>
            <div class="yak-stat-value" style="font-size: 1.5rem;">
                {data.fullName || 'Utilisateur anonyme'}
            </div>
        </div>
    </div>

    <!-- Status Section -->
    <div class="yak-status-card">
        <h2 class="yak-status-title">{getStatusTitle(data.rank)}</h2>
        <p class="yak-status-message">{getStatusMessage(data.rank, data.points)}</p>
    </div>
</div>
