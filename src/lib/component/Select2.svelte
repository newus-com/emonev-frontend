<script lang="ts">
	import type { ISelect } from '$lib/interface/ISelect';
	import { createEventDispatcher } from 'svelte';
	import Select from 'svelte-select';

	const dispatch = createEventDispatcher();

	export let data: ISelect[] | boolean;

	export let placeholder: string = '-';
	export let name: string = '-';
	export let selected: ISelect;

	export let disabled: boolean = false;

	const handleOnChange = async (event: any) => {
		dispatch('Select2Change', {
			value: event.detail
		});
	};
</script>

<div class="mt-2 w-full">
	<Select
		value={selected}
		{name}
		{placeholder}
		items={data}
		disabled={disabled}
		--border-radius="0.5rem"
		--font-size="0.875rem"
		--line-height="1.25rem"
		--loading-color="#1E40AF"
		--border-focused="2px solid #1e40af"
		--height="2.4rem"
		on:input={handleOnChange}
	/>
</div>
