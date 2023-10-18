<script lang="ts">
	import { Search } from 'flowbite-svelte';
	import { createEventDispatcher } from 'svelte';

	let searchTimer: NodeJS.Timeout | null = null;
	const dispatch = createEventDispatcher();

	let value: string;
	const setSearch = async () => {
		if (searchTimer) {
			clearTimeout(searchTimer);
		}

		searchTimer = setTimeout(async () => {
			value = value;
			dispatch('searchPage', {
				searchPage: value
			});
		}, 700);
	};
</script>

<Search
	bind:value
	size="md"
	class="focus:ring focus:ring-blue-300 focus:border-blue-500 grow-0.5"
	on:input={setSearch}
/>
