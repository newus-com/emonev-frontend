<script lang="ts">
	import { Login } from '$lib/api/login';
	import { Spinner } from 'flowbite-svelte';
	import { goto } from '$app/navigation';
	import Error from '$lib/component/Error.svelte';
	import ToastContainer from '$lib/component/toast/ToastContainer.svelte';
	import { toasts } from '$lib/component/toast/ToastStore';

let newPermission = '';

	let isLoading: boolean = false;

	let errorMessage: Record<string, string> = {};

	async function onSubmit(e: any) {
		const formData = new FormData(e.target);

		const data: Record<string, any> = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		isLoading = true;
		const actionLogin = await Login(data);
		if (actionLogin.status == 200) {
			document.cookie = 'accessToken=' + actionLogin.data.accessToken;
			document.cookie = 'refreshToken=' + actionLogin.data.refreshToken;
			document.cookie = 'status=' + actionLogin.data.status;
			document.cookie = 'name=' + actionLogin.data.name;
			document.cookie = 'permission=' + actionLogin.data.permission;

			if (typeof actionLogin.message !== 'undefined') {
				if (actionLogin.data.status == 0) {
					// goto('/dashboard');
					window.location.replace('/dashboard')
				} else {
					goto('/login/pilihDinas');
				}
			}
		} else {
			//notif
			if (typeof actionLogin.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: actionLogin.message,
						timeout: 3000
					}
				]);
			}
			//error
			if (typeof actionLogin.error !== 'undefined') {
				for (let field of actionLogin.error) {
					const [key, value] = field;
					errorMessage[key] = value;
				}
			}
		}
		isLoading = false;
	}
</script>

<div class="login overflow-hidden relative">
	<div class="container sm:px-10 overflow-hidden">
		<div class="block xl:grid grid-cols-2 gap-4">
			<!-- BEGIN: Login Info -->
			<div class="hidden xl:flex flex-col min-h-screen">
				<div class="-intro-x flex items-center pt-5">
					<span class="text-white text-xl">E-Monev</span>
				</div>
				<div class="my-auto">
					<div class="logoo flex h-[170px]">
						<img src="/logoEmonev.png" alt="" class="-intro-x bg-white h-full rounded-lg p-2" />
					</div>
					<div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
						Pantau dan Evaluasi Lebih
						<br />
						Mudah dengan e-Monev!
					</div>
				</div>
			</div>
			<!-- END: Login Info -->
			<!-- BEGIN: Login Form -->
			<div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
				<form
					id="loginData"
					on:submit|preventDefault={onSubmit}
					class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
				>
					<h2 class="font-bold text-2xl xl:text-3xl text-center xl:text-left">Sign In E-monev</h2>
					<div class="mt-2 text-slate-400 xl:hidden text-center">
						Pantau dan Evaluasi Lebih Mudah dengan e-Monev!
					</div>
					<div class="mt-8">
						<input
							type="text"
							class="intro-x login__input form-control py-3 px-4 block"
							placeholder="Email"
							name="email"
							required
						/>
						{#if typeof errorMessage.email !== 'undefined'}
							<Error messageError={errorMessage.email} typeError="error" />
						{/if}
						<input
							type="password"
							class="intro-x login__input form-control py-3 px-4 block mt-4"
							placeholder="Password"
							name="password"
							minlength="6"
							required
						/>
						{#if typeof errorMessage.password !== 'undefined'}
							<Error messageError={errorMessage.password} typeError="error" />
						{/if}
					</div>
					<div class="mt-5 xl:mt-8 text-center xl:text-left">
						<button
							type="submit"
							class="intro-x btn btn-primary py-3 px-4 w-full align-top w-full"
							disabled={isLoading}
						>
							{#if isLoading}
								<Spinner class="mr-3" size="4" color="white" />
								Loading ...
							{/if}
							{#if !isLoading}
								Login
							{/if}
						</button>
					</div>
				</form>
			</div>
			<!-- END: Login Form -->
		</div>
	</div>
</div>
