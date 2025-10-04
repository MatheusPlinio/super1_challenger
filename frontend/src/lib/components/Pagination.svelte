<script lang="ts">
	export let currentPage: number = 1;
	export let totalPages: number = 1;
	export let maxVisiblePages: number = 5;

	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	function goToPage(page: number) {
		if (page < 1 || page > totalPages || page === currentPage) return;
		dispatch('pageChange', page);
	}

	$: visiblePages = (() => {
		if (totalPages <= maxVisiblePages) {
			return Array.from({ length: totalPages }, (_, i) => i + 1);
		}

		const half = Math.floor(maxVisiblePages / 2);
		let start = Math.max(currentPage - half, 1);
		let end = Math.min(start + maxVisiblePages - 1, totalPages);

		if (end - start + 1 < maxVisiblePages) {
			start = Math.max(end - maxVisiblePages + 1, 1);
		}

		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	})();

	$: showFirstPage = visiblePages[0] > 1;
	$: showLastPage = visiblePages[visiblePages.length - 1] < totalPages;
</script>

<div class="flex items-center gap-2 justify-center mt-6 flex-wrap">
	<button
		on:click={() => goToPage(currentPage - 1)}
		disabled={currentPage === 1}
		class="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-transparent transition-colors"
		aria-label="Página anterior"
	>
		Anterior
	</button>

	{#if showFirstPage}
		<button
			on:click={() => goToPage(1)}
			class="px-3 py-1 rounded border hover:bg-gray-100 transition-colors"
		>
			1
		</button>
		{#if visiblePages[0] > 2}
			<span class="px-2">...</span>
		{/if}
	{/if}

	{#each visiblePages as page}
		<button
			on:click={() => goToPage(page)}
			class="px-3 py-1 rounded border transition-colors {page === currentPage
				? 'bg-blue-500 text-white hover:bg-blue-600'
				: 'hover:bg-gray-100'}"
			aria-label="Página {page}"
			aria-current={page === currentPage ? 'page' : undefined}
		>
			{page}
		</button>
	{/each}

	{#if showLastPage}
		{#if visiblePages[visiblePages.length - 1] < totalPages - 1}
			<span class="px-2">...</span>
		{/if}
		<button
			on:click={() => goToPage(totalPages)}
			class="px-3 py-1 rounded border hover:bg-gray-100 transition-colors"
		>
			{totalPages}
		</button>
	{/if}

	<button
		on:click={() => goToPage(currentPage + 1)}
		disabled={currentPage === totalPages}
		class="px-3 py-1 rounded border disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-transparent transition-colors"
		aria-label="Próxima página"
	>
		Próximo
	</button>
</div>

