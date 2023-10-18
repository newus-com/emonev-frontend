<script lang="ts">
	import { goto } from '$app/navigation';
	import { ListDinasFromUser } from '$lib/api/user';
	import { toasts } from '$lib/component/toast/ToastStore';
	import { checkLogin } from '$lib/utils/check';
	import { Select, Label, Skeleton, Spinner } from 'flowbite-svelte';
	import Cookies from 'js-cookie';
	import { onMount } from 'svelte';

	interface Dinas {
		name: string;
		value: string;
	}
	let dinas: Dinas[] = [];
	let selectedDinas: any;
	let isLoading: boolean = false;

	checkLogin();

	onMount(async () => {
		const dataDinas = await ListDinasFromUser();
		if (dataDinas.status == 200) {
			dinas = dataDinas.data.map((item: any) => ({
				name: item.name,
				value: item.id
			}));
		} else {
			//notif
			if (typeof dataDinas.message !== 'undefined') {
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

	const handleCahngeDinas = async (e: any) => {
		selectedDinas = dinas.find((d) => d.value == e.target.value);
	};

	async function onSubmit(e: any) {
		isLoading = true;
		const formData = new FormData(e.target);
		if (formData.has('dinas')) {
			if (typeof selectedDinas !== 'undefined') {
				Cookies.set('Dinas', selectedDinas.value);
				Cookies.set('NameDinas', selectedDinas.name);
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'success',
						messageToast: 'Berhasil memilih dinas',
						timeout: 3000
					}
				]);
				window.location.replace('/dashboard');
				// goto('/dashboard');
			}
		}
		isLoading = false;
	}
</script>

<div class="login overflow-hidden">
	<div class="container sm:px-10 overflow-hidden">
		<div class="block xl:grid grid-cols-2 gap-4">
			<!-- BEGIN: Login Info -->
			<div class="hidden xl:flex flex-col min-h-screen">
				<div class="-intro-x flex items-center pt-5">
					<span class="text-white text-xl">E-Monev</span>
				</div>
				<div class="my-auto">
					<!-- <img alt="Emonev logo" class="bg-white -intro-x w-1/2 -mt-16" src="\logoEmonev.png"> -->
					<div class="logoo flex h-[170px]">
						<img src="\logoEmonev.png" alt="" class="-intro-x bg-white h-full rounded-lg p-2" />
					</div>
					<div class="-intro-x text-white font-medium text-4xl leading-tight mt-10">
						Pantau dan Evaluasi Lebih
						<br />
						Mudah dengan e-Monev!
					</div>
					<!-- <div class="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">Manage all your e-commerce accounts in one place</div> -->
				</div>
			</div>
			<!-- END: Login Info -->
			<!-- BEGIN: Login Form -->
			<div class="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
				<div
					class="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto"
				>
					<h2 class="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
						Pilih Dinas
					</h2>
					<div class="intro-x mt-2 text-slate-400 xl:hidden text-center">
						Pantau dan Evaluasi Lebih Mudah dengan e-Monev!
					</div>
					<form on:submit|preventDefault={onSubmit}>
						<div class="intro-x mt-4 w-full">
							<div class="intro-x login__input form-control block">
								<Label>
									<Select
										name="dinas"
										placeholder="Pilih Dinas"
										size="lg"
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										items={dinas}
										required={true}
										on:change={handleCahngeDinas}
									/>
								</Label>
							</div>
						</div>
						<div class="intro-x mt-[20px] xl:mt-[20px] text-center xl:text-left">
							<button
								type="submit"
								class="btn btn-primary py-3 px-4 w-full align-top w-full"
								disabled={isLoading}
							>
								{#if isLoading}
									<Spinner class="mr-3" size="4" color="white" />
									Loading ...
								{/if}
								{#if !isLoading}
									Pilih
								{/if}
							</button>
						</div>
					</form>
				</div>
			</div>
			<!-- END: Login Form -->
		</div>
	</div>
</div>
