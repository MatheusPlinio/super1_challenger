<script lang="ts">
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { PUBLIC_BACKEND_URL } from '$env/static/public';
	import { get } from 'svelte/store';

	interface Product {
		id: number;
		name: string;
		price: number;
		images: string[];
		description: string;
	}

	let product: Product | null = null;
	let loading = true;
	let errorMessage = '';

	async function fetchProduct(id: string) {
		try {
			const res = await fetch(`${PUBLIC_BACKEND_URL}/api/product/${id}`, {
				credentials: 'include'
			});
			if (!res.ok) throw new Error(`Failed to fetch product. Status: ${res.status}`);
			const json = await res.json();

			const data = json.data;
			if (!data) throw new Error('No data returned');

			product = {
				id: data.id,
				name: data.name,
				price: data.price,
				description: data.service?.description ?? 'Sem descrição',
				images: data.service?.photos ?? []
			};
		} catch (err) {
			console.error('Failed to fetch product', err);
			product = null;
			errorMessage = 'Erro ao carregar produto 😕';
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		const id = get(page).params.id;
		if (!id) {
			errorMessage = 'ID do produto não encontrado';
			loading = false;
			return;
		}
		fetchProduct(id);
	});

	async function addToCart() {
		if (!product) return;

		const token = get(page).data?.authToken;

		try {
			const res = await fetch(`${PUBLIC_BACKEND_URL}/api/cart/items`, {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					variationId: Number(product.id),
					quantity: 1
				})
			});

			const text = await res.text();

			if (!res.ok) {
				console.error('❌ Backend response:', text);
				throw new Error(`Failed to add to cart (${res.status})`);
			}

			alert('✅ Produto adicionado ao carrinho!');
		} catch (err) {
			console.error('❌ Erro ao adicionar produto ao carrinho:', err);
			alert('Falha ao adicionar produto ao carrinho 😕');
		}
	}
</script>

{#if loading}
	<p class="text-center py-10">Carregando produto...</p>
{:else if errorMessage}
	<p class="text-center py-10 text-red-600">{errorMessage}</p>
{:else if !product}
	<p class="text-center py-10">Produto não encontrado 😕</p>
{:else}
	<article class="container mx-auto py-10">
		<h1 class="text-2xl font-bold mb-4">{product.name}</h1>

		<section class="flex flex-col md:flex-row gap-6">
			<div class="md:w-1/2 grid gap-4">
				{#each product.images as img, index}
					<img
						src={img}
						alt={`${product.name} imagem ${index + 1}`}
						class="w-full h-60 object-cover rounded"
					/>
				{/each}
			</div>

			<div class="md:w-1/2 flex flex-col justify-between">
				<p class="text-gray-700 mb-4">{product.description}</p>
				<p class="text-xl font-bold mb-6">R$ {product.price.toFixed(2)}</p>
				<button
					on:click={addToCart}
					class="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
				>
					Adicionar ao Carrinho
				</button>
			</div>
		</section>
	</article>
{/if}
