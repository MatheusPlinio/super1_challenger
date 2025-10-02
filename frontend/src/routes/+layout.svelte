<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';
	import Header from '$lib/components/Header.svelte';

	export let data;

	$: authToken = data?.authToken ?? null;
	import '../app.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<Header data={{ authToken: authToken ?? undefined }} />

	<main class="flex-1 container mx-auto p-4">
		<slot />
	</main>

	<footer class="bg-gray-100 p-4 text-center text-sm text-gray-600">
		© {new Date().getFullYear()} MiniMarket. All rights reserved.
	</footer>
</div>
