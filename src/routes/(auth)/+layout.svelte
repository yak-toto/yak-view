<script lang="ts">
    import type { LayoutProps } from './$types';

    let { data, children }: LayoutProps = $props();
</script>

<main class="yak-layout-container">
    <div class="yak-content-area">
        <div class="yak-sidebar">
            {#each data.groups as group}
                <a href="/groups/{group.code}" class="yak-group-link">{group.description}</a>
            {/each}
            <a href="/phases/{data.finale_phase.code}" class="yak-group-link">
                {data.finale_phase.description}
            </a>
        </div>

        <div class="yak-main-content">
            {@render children()}
        </div>
    </div>
</main>
