<script lang="ts">
	import { Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let length: number = 10;

	function setLength(newLength: number) {
		length = newLength;
		dispatch('lengthPage', {
			lengthPage: length
		});
	}
</script>

<Button color="blue" size="xs">
	{length}
	<Icon name="chevron-down-solid" class="w-3 h-3 ml-2 text-white dark:text-white" />
</Button>
<Dropdown>
	<DropdownItem
		href="javascript:void(0)"
		style="text-decoration: none;"
		on:click={() => setLength(10)}>10</DropdownItem
	>
	<DropdownItem
		href="javascript:void(0)"
		style="text-decoration: none;"
		on:click={() => setLength(15)}>15</DropdownItem
	>
	<DropdownItem
		href="javascript:void(0)"
		style="text-decoration: none;"
		on:click={() => setLength(20)}>20</DropdownItem
	>
	<DropdownItem
		href="javascript:void(0)"
		style="text-decoration: none;"
		on:click={() => setLength(25)}>25</DropdownItem
	>
</Dropdown>
