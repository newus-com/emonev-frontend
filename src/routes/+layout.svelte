<script>
	import '../app.postcss';
	import './styles.css';
	import './app.css';
	import ToastContainer from '$lib/component/toast/ToastContainer.svelte';
</script>

<head>
	<script src="/app.js"></script>
</head>

<ToastContainer />
<div class="app flex min-h-screen ">
	<div>
		<slot />
	</div>
</div>

<style>
	.app {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		padding: 0;
	}
</style>
