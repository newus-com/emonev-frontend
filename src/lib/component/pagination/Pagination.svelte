<script lang="ts">
	export let currentPage = 0;
	export let totalPages = 1;
	export let pages: any[] = [];

	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export const previous = () => {
		if (currentPage > 0) {
			currentPage = currentPage - 1;
			updatePagination();
			dispatch('currentPage', {
				currentPage: currentPage
			});
		}
	};

	export const next = () => {
		if (currentPage < totalPages - 1) {
			currentPage = currentPage + 1;
			updatePagination();
			dispatch('currentPage', {
				currentPage: currentPage
			});
		}
	};

	export function updatePagination() {
		pages = [];


		if (currentPage === 0) {
			for (let i = 0; i < Math.min(2, totalPages); i++) {
				pages.push({
					name: (currentPage + 1 + i).toString(),
					id: currentPage + i,
					active: currentPage === i
				});
			}
		} else if (currentPage === totalPages - 1) {
			for (let i = 0; i < Math.min(2, totalPages); i++) {
				pages.unshift({
					name: (currentPage + 1 - i).toString(),
					id: currentPage - i,
					active: i === 0
				});
			}
		} else {
			pages.push({
				name: (currentPage + 1 - 1).toString(),
				id: currentPage - 1,
				active: false
			});

			pages.push({
				name: (currentPage + 1).toString(),
				id: currentPage,
				active: true
			});

			pages.push({
				name: (currentPage + 1 + 1).toString(),
				id: currentPage + 1,
				active: false
			});
		}
	}

	export const goToPage = (page: number) => {
		currentPage = page;
		dispatch('currentPage', {
			currentPage: currentPage
		});
		updatePagination();
	};
</script>

<nav aria-label="Page navigation">
	<ul class="inline-flex -space-x-px text-sm">
		<li>
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a
				style="text-decoration: none;"
				href="javascript:void(0)"
				class="flex items-center justify-center px-3 h-8 ml-0 leading-tight text-gray-500 bg-white border border-gray-100 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				on:click={previous}>Previous</a
			>
		</li>
		{#each pages as pageItem}
			<li>
				<!-- svelte-ignore a11y-invalid-attribute -->
				<a
					style="text-decoration: none;"
					href="javascript:void(0)"
					class="flex items-center justify-center px-3 h-8 leading-tight {pageItem.active
						? 'text-white bg-[#1E40AF] hover:bg-blue-900 hover:text-white-700 dark:border-gray-100 dark:bg-gray-700 dark:text-white'
						: 'text-gray-500 bg-white border border-gray-100 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'}"
					on:click={() => goToPage(pageItem.id)}>{pageItem.name}</a
				>
			</li>
		{/each}
		<li>
			<!-- svelte-ignore a11y-invalid-attribute -->
			<a
				style="text-decoration: none;"
				href="javascript:void(0)"
				class="flex items-center justify-center px-3 h-8 leading-tight text-gray-500 bg-white border border-gray-100 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
				on:click={next}>Next</a
			>
		</li>
	</ul>
</nav>
