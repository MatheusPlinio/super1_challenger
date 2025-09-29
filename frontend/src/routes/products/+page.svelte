<script lang="ts">
	import { products } from '$lib/mocks/product';
</script>

<h1 class="text-2xl font-bold mb-4">Products</h1>

<div class="container mx-auto px-4 py-8">
	<h1 class="text-3xl font-bold mb-8 text-center">Products</h1>

	<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
		{#each products as product}
			<div
				class="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
			>
				<img src={product.image} alt={product.name} class="w-full h-48 object-cover" />

				<div class="p-4 flex flex-col justify-between h-full">
					<h2 class="text-lg font-semibold mb-1">{product.name}</h2>
					<p class="text-gray-500 text-sm line-clamp-2">{product.description}</p>
					<div class="mt-3 flex items-center justify-between">
						<span class="text-xl font-bold text-green-600">${product.price}</span>
						<a
							href={`/products/${product.id}`}
							class="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition"
						>
							View
						</a>
					</div>
				</div>
			</div>
		{/each}
	</div>
</div>
