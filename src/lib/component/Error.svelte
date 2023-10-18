<script lang="ts">
	import { Helper } from 'flowbite-svelte';

	export let messageError: string = '-';
	export let typeError: string = 'success';
</script>

{#if typeError == 'success'}
	<Helper class="mt-2" color="green">
		{messageError}
	</Helper>
{/if}
{#if typeError == 'error'}
	<Helper class="mt-2" color="red">
		{messageError}
	</Helper>
{/if}
