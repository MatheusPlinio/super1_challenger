<script lang="ts">
	export let data: { authToken?: string } = {};

	$: authToken = data?.authToken ?? null;
</script>

<header class="bg-white shadow p-4 flex justify-between items-center">
	<a href="/" class="text-xl font-bold">MiniMarket</a>
    
	<nav class="flex gap-4">
		<a href="/cart" class="hover:underline">Cart</a>

		{#if authToken}
			<a href="/logout" class="hover:underline">Logout</a>
		{:else}
			<a href="/auth/login" class="hover:underline">Login</a>
		{/if}
	</nav>
</header>
