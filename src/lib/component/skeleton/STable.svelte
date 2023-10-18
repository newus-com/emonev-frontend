<script lang="ts">
	import { TableBodyCell, TableBodyRow } from 'flowbite-svelte';

	export let totalColumn: number = 3;
	export let totalRow: number = 10;
</script>

{#each Array.from({ length: totalRow }) as _}
	<TableBodyRow class="text-center">
		{#each Array.from({ length: totalColumn }) as _}
			<TableBodyCell tdClass="px-6 py-2 whitespace-nowrap font-medium">
				<div role="status" class="w-full animate-pulse">
					<div class="h-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full my-1" />
					<span class="sr-only">Loading...</span>
				</div>
			</TableBodyCell>
		{/each}
	</TableBodyRow>
{/each}
