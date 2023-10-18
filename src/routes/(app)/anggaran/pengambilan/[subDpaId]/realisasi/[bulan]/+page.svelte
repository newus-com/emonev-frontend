<script lang="ts">
	import { page } from '$app/stores';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import { Button, Card, Input, Label, Textarea } from 'flowbite-svelte';
	import Error from '$lib/component/Error.svelte';
	import { formatCurrency } from '$lib/utils/rupiah';
	import { onDestroy, onMount } from 'svelte';
	import { checkTenant } from '$lib/utils/check';
	import { One, Update } from '$lib/api/dpa/realisasi';
	import type { ITenant } from '$lib/interface/ITenant';
	import { toasts } from '$lib/component/toast/ToastStore';
	import { layoutStore } from '$lib/store/layout';

	let isLoadingAddOrUpdate: boolean = false;
	let errorMessage: Record<any, any> = {};

	let formatBelanjaOperasi: string = '';
	let formatBelanjaModal: string = '';
	let formatBelanjaTidakTerduga: string = '';
	let formatBelanjaTransfer: string = '';

	let pagu: Record<any, any> = {};
	let keterangan: string = '-';

	function handleInputBelanjaOperasi(event: any) {
		pagu.belanjaOperasi = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		formatBelanjaOperasi = formatCurrency(pagu.belanjaOperasi);
	}
	function handleInputBelanjaModal(event: any) {
		pagu.belanjaModal = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		formatBelanjaModal = formatCurrency(pagu.belanjaModal);
	}
	function handleInputBelanjaTidakTerduga(event: any) {
		pagu.belanjaTidakTerduga = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		formatBelanjaTidakTerduga = formatCurrency(pagu.belanjaTidakTerduga);
	}
	function handleInputBelanjaTransfer(event: any) {
		pagu.belanjaTransfer = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		formatBelanjaTransfer = formatCurrency(pagu.belanjaTransfer);
	}

	let tenant: ITenant = {
		accessToken: '',
		status: '',
		dinas: ''
	};

	let unsubscribe: any;

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};

		unsubscribe = page.subscribe(getRealisasi);
	});

	async function getRealisasi() {
		let dataGet: Record<any, any> = {
			subDpaId: $page.params.subDpaId,
			bulan: $page.params.bulan,
			dinasId: ''
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataGet.dinasId = tenant.dinas;
			}
		}
		const dataRealisasi = await One(dataGet);
		if (dataRealisasi.status == 200) {
			pagu = {
				belanjaOperasi: dataRealisasi.data.pagu.belanjaOperasi,
				belanjaModal: dataRealisasi.data.pagu.belanjaModal,
				belanjaTidakTerduga: dataRealisasi.data.pagu.belanjaTidakTerduga,
				belanjaTransfer: dataRealisasi.data.pagu.belanjaTransfer
			};
			formatBelanjaOperasi = formatCurrency(pagu.belanjaOperasi);
			formatBelanjaModal = formatCurrency(pagu.belanjaModal);
			formatBelanjaTidakTerduga = formatCurrency(pagu.belanjaTidakTerduga);
			formatBelanjaTransfer = formatCurrency(pagu.belanjaTransfer);

			keterangan = dataRealisasi.data.keteranganPermasalahan;
		} else {
			//notif
			if (typeof dataRealisasi.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataRealisasi.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	async function postRealisasi() {
		let dataPost: Record<any, any> = {
			subDpaId: $page.params.subDpaId,
			bulan: $page.params.bulan,
			pagu: pagu,
			keteranganPermasalahan: keterangan
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataPost.dinasId = tenant.dinas;
			}
		}
		const responses = await Update(dataPost);
		if (responses.status >= 200 && responses.status <= 300) {
			isLoadingAddOrUpdate = true;
			await getRealisasi();
			layoutStore.update((store) => {
				store.updateDpa = true;
				return store;
			});
			toasts.update((toastsList) => [
				...toastsList,
				{
					id: Date.now(),
					typeToast: 'success',
					messageToast: responses.message,
					timeout: 3000
				}
			]);
			isLoadingAddOrUpdate = false;
		} else {
			//notif
			if (typeof responses.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: responses.message,
						timeout: 3000
					}
				]);
			}
			//error
			if (typeof responses.error !== 'undefined') {
				if (typeof responses.error === 'object') {
					for (let key in responses.error) {
						if (responses.error.hasOwnProperty(key)) {
							const value = responses.error[key];
							errorMessage[key] = value;
						}
					}
				}
			}
		}
	}
</script>

<div>
	<Label>Form Realisasi Bulan {$page.params.bulan}</Label>
	<Card class="w-full max-w-full p-2">
		<div class="grid grid-cols-4 gap-2">
			<Label>
				Belanja Operasi
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					placeholder="Belanja Operasi"
					bind:value={formatBelanjaOperasi}
					on:input={handleInputBelanjaOperasi}
				/>
				{#if typeof errorMessage.belanjaOperasi !== 'undefined'}
					<Error messageError={errorMessage.belanjaOperasi} typeError="error" />
				{/if}
			</Label>
			<Label>
				Belanja Modal
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					placeholder="Belanja Modal"
					bind:value={formatBelanjaModal}
					on:input={handleInputBelanjaModal}
				/>
				{#if typeof errorMessage.belanjaModal !== 'undefined'}
					<Error messageError={errorMessage.belanjaModal} typeError="error" />
				{/if}
			</Label>
			<Label>
				Belanja Tidak Terduga
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					placeholder="Belanja Tidak Terduga"
					bind:value={formatBelanjaTidakTerduga}
					on:input={handleInputBelanjaTidakTerduga}
				/>
				{#if typeof errorMessage.belanjaTidakTerduga !== 'undefined'}
					<Error messageError={errorMessage.belanjaTidakTerduga} typeError="error" />
				{/if}
			</Label>
			<Label>
				Belanja Transfer
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					placeholder="Belanja Transfer"
					bind:value={formatBelanjaTransfer}
					on:input={handleInputBelanjaTransfer}
				/>
				{#if typeof errorMessage.belanjaTransfer !== 'undefined'}
					<Error messageError={errorMessage.belanjaTransfer} typeError="error" />
				{/if}
			</Label>
		</div>
		<div>
			<Label for="textarea-id" class="mb-2">Keterangan</Label>
			<Textarea
				id="textarea-id"
				placeholder="Keterangan"
				rows="4"
				bind:value={keterangan}
				unWrappedClass="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
			/>
		</div>
		<div class="flex justify-end mt-2">
			{#if !isLoadingAddOrUpdate}
				<Button
					size="sm"
					on:click={postRealisasi}
					type="button"
					class="bg-[#1E40AF] hover:bg-[#183593]">Simpan</Button
				>
			{/if}
			{#if isLoadingAddOrUpdate}
				<ButtonLoading />
			{/if}
		</div>
	</Card>
</div>
