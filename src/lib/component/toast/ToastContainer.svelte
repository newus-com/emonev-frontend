<script lang="ts">
	import Toast from './Toast.svelte';
	import { dismissToast, toasts } from './ToastStore';
</script>

<div class="fixed right-2 top-2" style="z-index: 9999;">
	{#each $toasts as toast (toast.id)}
		<Toast messageToast={toast.messageToast} typeToast={toast.typeToast} />
	{/each}
</div>
