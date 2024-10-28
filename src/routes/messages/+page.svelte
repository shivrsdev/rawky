<script lang="ts">
import { onMount } from "svelte";
import type { PageData } from "./$types";
import { invalidateAll } from "$app/navigation";

export let data: PageData;
let messageContent = '';

onMount(() => {
    const reloadData = (interval: number) => {
        setTimeout(() => {
            invalidateAll();
            reloadData(interval);
        }, interval);
    };

    reloadData(5000);
});
</script>

<main class="flex flex-col items-center min-h-screen p-6">
    <div class="flex justify-between items-center w-full max-w-lg mb-6">
        <h1 class="text-2xl font-bold">Messages</h1>
        <button class="btn btn-primary">Logout</button>
    </div>

    {#if data.unauthorized || !data.messages || !data.username}
        <h1>You are not logged in!</h1>
    {:else}
        {#if data.messages.length === 0}
            <h2 class="text-lg text-gray-400 mb-4">Be the first to send a message 🥇!</h2>
        {/if}

        <div class="w-full max-w-lg mb-6 overflow-y-auto h-96 border border-gray-700 rounded-lg p-4">
            {#each data.messages as message}
                <div class="card card-body card-bordered w-[300px] bg-gray-800 p-3 mb-2 rounded-lg shadow-md {message.user.username === data.username ? 'text-right float-right' : 'text-left float-left'}">
                    <strong class="text-white" style="color: {message.user.color}">
                        {message.user.username} - {new Date(message.createdAt).toLocaleTimeString()}:
                    </strong>
                    <p class="text-gray-300">{message.content}</p>
                </div>
            {/each}
        </div>

        <form method="POST" action="?/sendMessage" class="w-full max-w-lg">
            <div class="flex items-center">
                <input
                    class="input input-bordered flex-grow mr-2 bg-gray-800 text-white placeholder-gray-400"
                    type="text"
                    name="content"
                    placeholder="Type your message..."
                    required
                    bind:value={messageContent}
                />
                <button class="btn btn-accent" type="submit" disabled={messageContent === ''}>
                    Send 📪
                </button>
            </div>
        </form>
    {/if}
</main>
