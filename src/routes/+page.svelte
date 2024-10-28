<main class="space-y-4 text-center">
	<h1 class="text-[44px] font-bold">Rawky</h1>
	<p>A simple, light-weight chat app made for self-hosting!</p>
	<button class="btn btn-primary" on:click={() => window.location.replace('/auth')}
		>Lets get started!</button
	>
	<button class="btn btn-accent" on:click={() => window.location.replace('/messages')}
		>Messages</button
	>
</main>
