<script lang="ts">
	import { Toast } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { slide } from 'svelte/transition';

	export let messageToast: string = '-';
	export let typeToast: string = 'success';
	export let timeoutToast: number = 3000;
	
	let open = true;
	
	setTimeout(() => {
		open = false;
	},timeoutToast);

</script>

{#if typeToast == 'success'}
	<Toast color="green" bind:open transition={slide} divClass="w-full max-w-xs p-4 mb-2 text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 gap-3">
		<svelte:fragment slot="icon">
			<Icon name="check-circle-solid" class="w-5 h-5" />
			<span class="sr-only">Check icon</span>
		</svelte:fragment>
		{messageToast}
	</Toast>
{/if}
{#if typeToast == 'error'}
	<Toast color="red" bind:open transition={slide} divClass="w-full max-w-xs p-4 mb-2 text-gray-500 bg-white shadow dark:text-gray-400 dark:bg-gray-800 gap-3">
		<svelte:fragment slot="icon">
			<Icon name="close-circle-solid" class="w-5 h-5" />
			<span class="sr-only">Error icon</span>
		</svelte:fragment>
		{messageToast}
	</Toast>
{/if}
