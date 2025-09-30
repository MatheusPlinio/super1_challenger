<script lang="ts">
	import favicon from '$lib/assets/favicon.svg';

	let { children, user } = $props<{ children: unknown; user: { name: string } | null }>();
	import '../app.css';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen flex flex-col">
	<header class="bg-white shadow p-4 flex justify-between items-center">
		<a href="/" class="text-xl font-bold">MiniMarket</a>
		<nav class="flex gap-4">
			<a href="/products" class="hover:underline">Products</a>
			<a href="/cart" class="hover:underline">Cart</a>
			{#if user}
				<a href="/logout">Logout</a>
			{:else}
				<a href="/auth/login" class="hover:underline">Login</a>
			{/if}
		</nav>
	</header>

	<main class="flex-1 container mx-auto p-4">
		{@render children?.()}
	</main>

	<footer class="bg-gray-100 p-4 text-center text-sm text-gray-600">
		© {new Date().getFullYear()} MiniMarket. All rights reserved.
	</footer>
</div>
