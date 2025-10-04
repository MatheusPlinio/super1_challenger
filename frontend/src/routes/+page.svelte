<script lang="ts">
	import { onMount } from 'svelte';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import Pagination from '$lib/components/Pagination.svelte';

	interface Product {
		id: number;
		name: string;
		price: number;
		images: string[];
		description: string;
	}

	let products: Product[] = [];
	let search = '';
	let loading = true;
	let currentPage = 1;
	let totalPages = 1;
	const limit = 6;

	async function fetchProducts(page = 1) {
		loading = true;
		try {
			const params = new URLSearchParams({
				page: page.toString(),
				limit: limit.toString(),
				search
			});

			const res = await fetch(`${PUBLIC_BACKEND_URL}/api/product?${params.toString()}`);
			const json = await res.json();

			products = json.data ?? [];
			totalPages = json.meta?.lastPage ?? 1;
			currentPage = json.meta?.page ?? page;
		} catch (err) {
			console.error('Failed to fetch products', err);
			products = [];
			totalPages = 1;
		} finally {
			loading = false;
		}
	}

	onMount(() => fetchProducts(currentPage));

	function handlePageChange(event: CustomEvent<number>) {
		fetchProducts(event.detail);
	}
</script>

<div class="container mx-auto py-10">
	<h1 class="text-2xl font-bold mb-6">Marketplace</h1>

	<input
		type="text"
		placeholder="Buscar produtos..."
		bind:value={search}
		on:input={() => fetchProducts(1)}
		class="w-full p-2 border rounded mb-6"
	/>

	{#if loading}
		<p>Carregando produtos...</p>
	{:else if products.length === 0}
		<p>Nenhum produto encontrado 😕</p>
	{:else}
		<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
			{#each products as product}
				<a
					href={`/${product.id}`}
					class="block border p-4 rounded hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
				>
					<img
						src={product.images?.[0] ?? '/images/default.png'}
						alt={product.name}
						class="h-40 w-full object-cover mb-2 rounded"
					/>
					<h2 class="font-semibold">{product.name}</h2>
					<p class="text-gray-600">R$ {product.price.toFixed(2)}</p>
				</a>
			{/each}
		</div>

		<Pagination {currentPage} {totalPages} on:pageChange={handlePageChange} />
	{/if}
</div>
