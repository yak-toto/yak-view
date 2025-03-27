<script lang="ts">
    import Flag from './Flag.svelte';

    interface Props {
        team: {
            flagUrl: string | null;
            description: string;
        };
        alignment: 'left' | 'right';
        size: 'sm' | 'md' | 'lg';
    }

    let { team, alignment, size }: Props = $props();

    // Text size classes based on size prop
    const textSizeClass = {
        sm: 'text-sm',
        md: 'text-base',
        lg: 'text-lg',
    }[size];

    // Font weight classes based on size prop
    const fontWeightClass = {
        sm: 'font-medium',
        md: 'font-semibold',
        lg: 'font-bold',
    }[size];
</script>

<div class="flex items-center gap-3 {alignment === 'right' ? 'justify-end' : ''}">
    {#if alignment === 'left'}
        {#if team.flagUrl}
            <Flag flagUrl={team.flagUrl} description={team.description} />
        {/if}
        <span class="{textSizeClass} {fontWeightClass}" style="color: var(--yak-primary);">
            {team.description}
        </span>
    {:else}
        <span class="{textSizeClass} {fontWeightClass}" style="color: var(--yak-primary);">
            {team.description}
        </span>
        {#if team.flagUrl}
            <Flag flagUrl={team.flagUrl} description={team.description} />
        {/if}
    {/if}
</div>
