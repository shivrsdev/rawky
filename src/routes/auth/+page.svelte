<script lang="ts">
	import type { ActionData } from "./$types";

    export let form: ActionData;
</script>

<main class="flex h-screen">
    <!-- Left Side: Title and Image -->
    <div class="flex flex-col justify-center items-center w-1/2">
        <h1 class="text-[44px] font-bold">Login 🧇🥞</h1>
    </div>

    <!-- Right Side: Login Form -->
    <div class="flex justify-center items-center w-1/2">
        <form method="POST" action="?/login" class="space-y-4 w-80">
        {#if form?.incorrect}
            <p class="text-red-500">Incorrect username or password</p>
        {/if}
        {#if form?.userAlreadyExists}
            <p class="text-red-500">User already exists</p>
        {/if}
        {#if form?.missingFields}
            <p class="text-red-500">Missing fields...</p>
        {/if}
            <input class="input input-bordered w-full" type="text" name="username" placeholder="super.cool.guy" required>
            <input class="input input-bordered w-full" type="email" name="email" placeholder="super.cool.guy@example.com" required>
            <input class="input input-bordered w-full" type="password" name="password" placeholder="$uper $ecur3 p@ssword" required>
            <button type="submit" class="btn btn-primary w-full">
                Login ✨
            </button>
            <button formaction="?/register" class="btn btn-accent w-full">
                Register 🚀
            </button>
        </form>
    </div>
</main>
