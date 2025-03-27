<script lang="ts">
    import '../app.css';
    import { page } from '$app/stores';
</script>

<nav class="yak-header">
    {#if $page.route.id?.startsWith('/(auth)')}
        <!-- Authenticated pages: show both buttons -->
        <a href="/" class="yak-home-link">Accueil</a>
        <a href="/logout" class="yak-logout-link">Se déconnecter</a>
    {:else if $page.route.id === '/login'}
        <!-- Login page: show signup button on right -->
        <div></div>
        <!-- Empty div to push signup to the right -->
        <a href="/signup" class="yak-home-link">Créer un compte</a>
    {:else if $page.route.id === '/signup'}
        <!-- Signup page: show login button on right -->
        <div></div>
        <!-- Empty div to push login to the right -->
        <a href="/login" class="yak-home-link">Se connecter</a>
    {:else}
        <!-- Default: show login link on right -->
        <div></div>
        <!-- Empty div to push login to the right -->
        <a href="/login" class="yak-home-link">Se connecter</a>
    {/if}
</nav>

<slot />
