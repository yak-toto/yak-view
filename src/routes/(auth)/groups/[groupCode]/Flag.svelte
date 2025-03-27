<script lang="ts">
    interface Props {
        flagUrl: string;
        description: string;
    }

    let { flagUrl, description }: Props = $props();
</script>

<img
    src={flagUrl}
    alt="{description} flag"
    class="w-6 h-4 object-cover rounded-sm border border-gray-200"
    loading="lazy"
/>
