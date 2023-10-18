<script lang="ts">
	import { Icon } from 'flowbite-svelte-icons';
	import { Button, Input, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import Stepper from '$lib/component/Stepper.svelte';
	import { checkTenant } from '$lib/utils/check';
	import type { ISelect } from '$lib/interface/ISelect';
	import type { IStepper } from '$lib/interface/IStepper';
	import Error from '$lib/component/Error.svelte';
	import Select2 from '$lib/component/Select2.svelte';
	import { GetListTahun, GetTahunActive } from '$lib/forSelect/tahun';
	import type { IUpdateDpa } from '$lib/interface/update/IUpdateDpa';
	import { formatCurrency } from '$lib/utils/rupiah';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import type { ITenant } from '$lib/interface/ITenant';
	import { GetListDinas } from '$lib/forSelect/dinas';
	import { One, Update } from '$lib/api/dpa/informasi';
	import { toasts } from '$lib/component/toast/ToastStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'DPA', href: '/anggaran/dpa' },
		{ label: 'Informasi DPA', href: '/anggaran/dpa/add/' + $page.params.dpaId }
	];

	let stepperData: IStepper[] = [
		{
			label: 'Informasi DPA',
			href: '/anggaran/dpa/add/' + $page.params.dpaId
		},
		{
			label: 'Rincian DPA',
			href: ''
		},
		{
			label: 'Sub Kegiatan',
			href: ''
		},
		{
			label: 'Rencana Penarikan',
			href: ''
		},
		{
			label: 'Pengguna Anggaran',
			href: ''
		},
		{
			label: 'Tanda Tangan',
			href: ''
		}
	];

	let UpdateDpa: IUpdateDpa = {
		id: '',
		noDpa: '',
		tahunId: '',
		dinasId: '',
		jumlahAlokasi: 0
	};

	let tenant: ITenant = {
		accessToken: '',
		status: '',
		dinas: ''
	};

	let isLoadingEdit: boolean = false;

	let errorMessage: Record<any, any> = {};

	let isLoading: boolean = false;

	let DataTahun: ISelect[] | boolean;
	let DataTahunSelected: ISelect;

	let DataDinas: ISelect[] | boolean;
	let DinasSelected: ISelect;

	onMount(async () => {
		// CHECK PERMISSION
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};

		await getOneDpa();

		DataTahun = await GetListTahun('');

		DataDinas = await GetListDinas('');

		DataTahun.find((d) => {
			if (d.value == UpdateDpa.tahunId) {
				DataTahunSelected = {
					value: d.value,
					label: d.label
				};
			}
		});

		DataDinas.find((d) => {
			if (d.value == UpdateDpa.dinasId) {
				DinasSelected = {
					value: d.value,
					label: d.label
				};
			}
		});

		formatJumlahAlokasi = formatCurrency(UpdateDpa.jumlahAlokasi);
	});

	async function getOneDpa() {
		let dataPost = {
			dpaId: $page.params.dpaId,
			dinasId: ''
		};
		
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataPost.dinasId = tenant.dinas;
			}
		}
		const dataDpa = await One(dataPost);
		if (dataDpa.status == 200) {
			UpdateDpa = {
				id: dataDpa.data.id,
				noDpa: dataDpa.data.noDpa,
				tahunId: dataDpa.data.tahunId,
				dinasId: dataDpa.data.dinasId,
				jumlahAlokasi: dataDpa.data.jumlahAlokasi
			};
		} else {
			//notif
			if (typeof dataDpa.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataDpa.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	async function editDpa(e: any) {
		isLoadingEdit = true;
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				UpdateDpa.dinasId = tenant.dinas;
			}
		} else {
			if (UpdateDpa.dinasId == '') {
				errorMessage['dinasId'] = 'Dinas harus diisi';
			}
		}
		const responses: any = await Update(UpdateDpa);
		if (responses.status >= 200 && responses.status <= 300) {
			toasts.update((toastsList) => [
				...toastsList,
				{
					id: Date.now(),
					typeToast: 'success',
					messageToast: responses.message,
					timeout: 3000
				}
			]);
			isLoadingEdit = false;
			goto('/anggaran/dpa/add/' + responses.data.id + '/rincian');
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
		isLoadingEdit = false;
	}

	let formatJumlahAlokasi: string = '';

	function handleInputJumlahAlokasi(event: any) {
		UpdateDpa.jumlahAlokasi = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		formatJumlahAlokasi = formatCurrency(UpdateDpa.jumlahAlokasi);
	}

	const handleDinasSelect = async (event: any) => {
		UpdateDpa.dinasId = event.detail.value.value.toString();
	};
</script>

<BreadCrump breadItems={myBreadItems} />
<div class="">
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Informasi DPA</div>
	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="mb-3">
			<Stepper stepperItems={stepperData} active={0} />
		</div>
		<form on:submit|preventDefault={editDpa} class="flex flex-col gap-3">
			<div class="w-full flex gap-2">
				<div class={tenant.status == '0' ? 'w-2/3' : 'w-full'}>
					<Label class="space-y-2">
						<span>No DPA</span>
						<Input
							class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
							type="text"
							name="noDpa"
							placeholder="Masukkan No DPA"
							bind:value={UpdateDpa.noDpa}
						/>
						{#if typeof errorMessage.noDpa !== 'undefined'}
							<Error messageError={errorMessage.noDpa} typeError="error" />
						{/if}
					</Label>
				</div>
				{#if tenant.status == '0'}
					<div class="w-1/3">
						<Label class="space-y-2">
							<span>Dinas</span>
							<Select2
								placeholder="Pilih Dinas"
								name="dinasId"
								data={DataDinas}
								selected={DinasSelected}
								on:Select2Change={handleDinasSelect}
							/>
							{#if typeof errorMessage.dinasId !== 'undefined'}
								<Error messageError={errorMessage.dinasId} typeError="error" />
							{/if}
						</Label>
					</div>
				{/if}
			</div>
			<hr />
			<div class="mb-3">
				<Label for="" class="required text-[#1E40AF] mb-2 text-[16px]">Alokasi Dana</Label>
				<div class="w-full flex gap-2">
					<div class="w-1/3">
						<Label class="space-y-2">
							<span>Tahun</span>
							<Select2
								placeholder="Pilih Tahun"
								name="tahunId"
								data={DataTahun}
								selected={DataTahunSelected}
								disabled={true}
							/>
							{#if typeof errorMessage.tahunId !== 'undefined'}
								<Error messageError={errorMessage.tahunId} typeError="error" />
							{/if}
						</Label>
					</div>
					<div class="w-2/3">
						<Label class="space-y-2">
							<span>Jumlah Alokasi</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								placeholder="Masukkan jumlah alokasi dana"
								bind:value={formatJumlahAlokasi}
								on:input={handleInputJumlahAlokasi}
							/>
							{#if typeof errorMessage.jumlahAlokasi !== 'undefined'}
								<Error messageError={errorMessage.jumlahAlokasi} typeError="error" />
							{/if}
						</Label>
					</div>
				</div>
			</div>
			<div class="flex justify-end">
				{#if !isLoadingEdit}
					<Button type="submit" class="bg-[#1E40AF] hover:bg-[#183593] ">
						Selanjutnya
						<svg
							class="w-4 h-4 text-white dark:text-white ml-1"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 14 10"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M1 5h12m0 0L9 1m4 4L9 9"
							/>
						</svg>
					</Button>
				{/if}
				{#if isLoadingEdit}
					<ButtonLoading />
				{/if}
			</div>
		</form>
	</div>
</div>
