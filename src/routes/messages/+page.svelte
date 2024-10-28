<script lang="ts">
import {
    onMount
} from 'svelte';
import type {
    PageData
} from './$types';
import {
    invalidateAll
} from '$app/navigation';

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

<main class="flex min-h-screen flex-col items-center p-6">
    <div class="mb-6 flex w-full max-w-lg items-center justify-between">
        <h1 class="text-2xl font-bold">Messages</h1>
        <form
            method={data.unauthorized ? 'GET' : 'POST'}
            action={data.unauthorized ? '/auth/' : '/auth?/logout'}
            >
            <button class="btn btn-primary" type="submit">{data.unauthorized ? 'Login' : 'Logout'}</button
                >
                </form>
                </div>

                {#if data.unauthorized || !data.messages || !data.username}
                <h1>You are not logged in!</h1>
                {:else}
                {#if data.messages.length === 0}
                <h2 class="mb-4 text-lg text-gray-400">Be the first to send a message 🥇!</h2>
                {/if}

                <div class="mb-6 h-96 w-full max-w-lg overflow-y-auto rounded-lg border border-gray-700 p-4">
                    {#each data.messages as message}
                    <div
                        class="card card-body card-bordered mb-2 w-[300px] rounded-lg bg-gray-800 p-3 shadow-md {message.user.username === data.username ? 'float-right text-right' : 'float-left text-left'}"
                        >
                        <strong class="text-white" style="color: {message.user.color}">
                            {message.user.username} - {new Date(message.createdAt).toLocaleTimeString()}:
                        </strong>
                        <p class="text-gray-300">{message.content}</p>
                        <div class="mt-2 flex justify-end space-x-2">
                            <form method="POST" action="?/reportMessage">
                                <input type="hidden" name="messageId" value={message.id}>
                                <button class="btn btn-accent" type="submit">
                                    🚩
                                </button>
                            </form>
                            {#if message.user.username === data.username}
                            <form action="?/deleteMessage" method="post">
                                <input type="hidden" name="messageId" value={message.id}>
                                <button type="submit" class="btn btn-secondary">
                                    ☠
                                </button>
                            </form>
                            {/if}
                        </div>
                    </div>
                    {/each}

                </div>

                <form method="POST" action="?/sendMessage" class="w-full max-w-lg">
                    <div class="flex items-center">
                        <input
                            class="input input-bordered mr-2 flex-grow bg-gray-800 text-white placeholder-gray-400"
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
