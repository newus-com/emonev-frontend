<script lang="ts">
	import { List } from '$lib/api/dinas';
	import Cookies from 'js-cookie';
	import { createEventDispatcher, onMount } from 'svelte';
	import { toasts } from '../toast/ToastStore';
	import { dispatchEventCustom } from '$lib/utils/eventBus';

	interface IDinas {
		name: string;
		value: string;
	}

	let isLoading: boolean = false;

	let dinas: IDinas[] = [];
	let status: string | undefined = Cookies.get('status');
	let Dinas: string | undefined = Cookies.get('Dinas');

	let searchDinas: string = '';

	let selected: string = 'default';

	// const dispatch = createEventDispatcher();

	// export const onChangeDinas = () => {
	//     Cookies.set('Dinas', selected);

	// 	dispatch('onChangeDinas', {
	// 		DinasId: selected
	// 	});
	// };

	function onChangeDinas() {
		Cookies.set('Dinas', selected);
		dispatchEventCustom('onChangeDinas', { DinasId: selected });
	}

	onMount(() => {
		isLoading = true;
		const dataDinas = List({ search: searchDinas }).then((v) => {
			if (v.status == 200) {
				dinas = v.data.data.map((item: any) => ({
					name: item.name,
					value: item.id
				}));
			} else {
				if (typeof v.message !== 'undefined') {
					toasts.update((toastsList) => [
						...toastsList,
						{
							id: Date.now(),
							typeToast: 'error',
							messageToast: '',
							timeout: 3000
						}
					]);
				}
			}
		});
		isLoading = false;
	});
</script>

<select
	bind:value={selected}
	on:change={onChangeDinas}
	class="bg-white border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
>
	<option selected disabled value="default">Pilih Dinas</option>
	{#if isLoading}
		<option selected disabled class="text-center" value="default">Loading ...</option>
	{:else}
		{#each dinas as dina (dina.value)}
			<option value={dina.value}>{dina.name}</option>
		{/each}
	{/if}
</select>
