<script lang="ts">
	import { get } from 'svelte/store';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';

	interface CartItem {
		id: number;
		variationId: number;
		name: string;
		price: number;
		quantity: number;
	}

	let cart: CartItem[] = [];
	let loading = true;

	async function fetchCart() {
		const token = get(page).data?.authToken;

		try {
			const res = await fetch('http://localhost:3000/api/cart', {
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
			});
			const json = await res.json();

			cart = json.data?.items ?? [];
		} catch (err) {
			console.error('Failed to load cart', err);
			cart = [];
		} finally {
			loading = false;
		}
	}

	onMount(fetchCart);

	$: total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

	async function removeItem(id: number) {
		const token = get(page).data?.authToken;
		try {
			await fetch(`http://localhost:3000/api/cart/remove/${id}`, {
				method: 'DELETE',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
			});
			cart = cart.filter((item) => item.id !== id);
		} catch (err) {
			console.error(err);
		}
	}

	async function updateQuantity(id: number, quantity: number) {
		const token = get(page).data?.authToken;
		try {
			const res = await fetch(`http://localhost:3000/api/cart/items/${id}`, {
				method: 'PATCH',
				headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
				body: JSON.stringify({ quantity })
			});
			const json = await res.json();
			cart = cart.map((item) =>
				item.id === id
					? {
							...item,
							name: json.data.variation.name,
							price: json.data.variation.price,
							quantity: json.data.quantity
						}
					: item
			);
		} catch (err) {
			console.error(err);
		}
	}

	async function checkout() {
		alert(`Total: R$ ${total.toFixed(2)}. Função de checkout aqui.`);
	}
</script>

<div class="container mx-auto py-10">
	<h1 class="text-2xl font-bold mb-6">Minha Sacola</h1>

	{#if loading}
		<p>Carregando...</p>
	{:else if cart.length === 0}
		<div class="text-center py-20">
			<p class="text-lg font-medium mb-4">Seu carrinho está vazio 🛍️</p>
			<a href="/" class="bg-blue-600 text-white px-4 py-2 rounded">Voltar às compras</a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2 space-y-4">
				{#each cart as item}
					<div class="flex justify-between items-center p-4 border rounded">
						<div>
							<h2 class="font-semibold">{item.name}</h2>
							<p class="text-sm text-gray-500">{item.quantity}x R$ {item.price.toFixed(2)}</p>
							<div class="flex items-center gap-2 mt-2">
								<button
									on:click={() => updateQuantity(item.id, item.quantity - 1)}
									disabled={item.quantity <= 1}
									class="px-2 border rounded">-</button
								>
								<button
									on:click={() => updateQuantity(item.id, item.quantity + 1)}
									class="px-2 border rounded">+</button
								>
							</div>
						</div>
						<div class="flex items-center gap-4">
							<p class="font-semibold">R$ {(item.price * item.quantity).toFixed(2)}</p>
							<button
								on:click={() => removeItem(item.id)}
								class="p-2 rounded hover:bg-gray-200"
								aria-label="Remover item">🗑️</button
							>
						</div>
					</div>
				{/each}
			</div>

			<div class="p-6 border rounded">
				<h2 class="text-lg font-semibold mb-4">Resumo do Pedido</h2>
				<div class="flex justify-between mb-2">
					<span>Subtotal</span>
					<span>R$ {total.toFixed(2)}</span>
				</div>
				<div class="flex justify-between mb-4">
					<span>Frete</span>
					<span>Grátis</span>
				</div>
				<div class="flex justify-between font-bold text-lg mb-6">
					<span>Total</span>
					<span>R$ {total.toFixed(2)}</span>
				</div>
				<button
					on:click={checkout}
					class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
				>
					Finalizar Compra
				</button>
			</div>
		</div>
	{/if}
</div>
