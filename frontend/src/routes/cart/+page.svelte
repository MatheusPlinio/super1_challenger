<script lang="ts">
	interface CartItem {
		id: number;
		name: string;
		price: number;
		quantity: number;
	}

	let cart: CartItem[] = [
		{ id: 1, name: 'Produto A', price: 49.9, quantity: 1 },
		{ id: 2, name: 'Produto B', price: 29.9, quantity: 2 }
	];

	function removeItem(id: number) {
		cart = cart.filter((item) => item.id !== id);
	}

	$: total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
</script>

<div class="container mx-auto py-10">
	<h1 class="text-2xl font-bold mb-6">Minha Sacola</h1>

	{#if cart.length === 0}
		<div class="text-center py-20">
			<p class="text-lg font-medium mb-4">Sua sacola está vazia 🛍️</p>
			<a href="/" class="bg-blue-600 text-white px-4 py-2 rounded"> Voltar às compras </a>
		</div>
	{:else}
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<div class="lg:col-span-2 space-y-4">
				{#each cart as item}
					<div class="flex justify-between items-center p-4 border rounded">
						<div>
							<h2 class="font-semibold">{item.name}</h2>
							<p class="text-sm text-gray-500">
								{item.quantity}x R$ {item.price.toFixed(2)}
							</p>
						</div>
						<div class="flex items-center gap-4">
							<p class="font-semibold">
								R$ {(item.price * item.quantity).toFixed(2)}
							</p>
							<button
								on:click={() => removeItem(item.id)}
								class="p-2 rounded hover:bg-gray-200"
								aria-label="Remover item"
							>
								🗑️
							</button>
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
				<button class="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
					Finalizar Compra
				</button>
			</div>
		</div>
	{/if}
</div>
