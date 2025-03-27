<script lang="ts">
    import { enhance } from '$app/forms';

    import type { PageProps } from './$types';

    let { form }: PageProps = $props();
</script>

<div
    class="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
    style="background: linear-gradient(to bottom right, var(--yak-background), var(--yak-background));"
>
    <div class="max-w-md w-full space-y-8">
        <div class="text-center">
            <h2 class="text-3xl font-bold mb-8" style="color: var(--yak-primary);">
                Créer un compte
            </h2>
        </div>

        <div class="yak-login-card">
            {#if form?.error}
                <div class="yak-error-card">
                    {form.error}
                </div>
            {/if}

            <form method="POST" use:enhance class="space-y-6">
                <div class="yak-input-group">
                    <label for="name" class="yak-input-label"> Pseudo </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        class="yak-input text-lg"
                        placeholder="Entrez votre pseudo"
                    />
                </div>

                <div class="yak-input-group">
                    <label for="first_name" class="yak-input-label"> Prénom </label>
                    <input
                        type="text"
                        id="first_name"
                        name="first_name"
                        required
                        class="yak-input text-lg"
                        placeholder="Entrez votre prénom"
                    />
                </div>

                <div class="yak-input-group">
                    <label for="last_name" class="yak-input-label"> Nom de famille </label>
                    <input
                        type="text"
                        id="last_name"
                        name="last_name"
                        required
                        class="yak-input text-lg"
                        placeholder="Entrez votre nom de famille"
                    />
                </div>

                <div class="yak-input-group">
                    <label for="password" class="yak-input-label"> Mot de passe </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        required
                        class="yak-input text-lg"
                        placeholder="Entrez votre mot de passe"
                    />
                </div>

                <button type="submit" class="yak-action-button w-full">Se connecter</button>
            </form>
        </div>
    </div>
</div>
