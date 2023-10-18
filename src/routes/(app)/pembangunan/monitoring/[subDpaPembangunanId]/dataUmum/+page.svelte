<script lang="ts">
	import { Button, Dropdown, DropdownItem, Input, Label, Textarea } from 'flowbite-svelte';

	import Error from '$lib/component/Error.svelte';
	import { page } from '$app/stores';
	import type { ISelect } from '$lib/interface/ISelect';
	import Select2 from '$lib/component/Select2.svelte';
	import { onMount } from 'svelte';
	import { checkTenant } from '$lib/utils/check';
	import type { ITenant } from '$lib/interface/ITenant';
	import { Update } from '$lib/api/pembangunan/monitoring/dataUmum';
	import { layoutStore } from '$lib/store/layout';
	import { toasts } from '$lib/component/toast/ToastStore';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import { One as OneSubDpa } from '$lib/api/pembangunan/dpa/subDpa';
	import { formatCurrency } from '$lib/utils/rupiah';

	let dataJenisPengadaanSelected: ISelect;
	let dataJenisPengadaan: ISelect[] = [
		{
			label: 'Pengadaan barang',
			value: '1'
		},
		{
			label: 'Konsultasi perencanaan',
			value: '2'
		},
		{
			label: 'Konsultasi pengawasan',
			value: '3'
		},
		{
			label: 'Konstruksi',
			value: '4'
		},
		{
			label: 'Pengadaan jasa lainnya',
			value: '5'
		},
		{
			label: 'Konsultasi non konstruksi',
			value: '6'
		}
	];

	const handleJenisPengadaan = async (event: any) => {
		dataUpdate.jenisPengadaan = event.detail.value.value.toString();
	};

	let dataMekanismePengadaanSelected: ISelect;
	let dataMekanismePengadaan: ISelect[] = [
		{
			label: 'E-Purchasing',
			value: '1'
		},
		{
			label: 'Penunjukan langsung',
			value: '2'
		},
		{
			label: 'Pengadaan langsung',
			value: '3'
		},
		{
			label: 'Tender (lelang)',
			value: '4'
		}
	];

	const handleMekanismePengadaan = async (event: any) => {
		dataUpdate.mekanismePengadaan = event.detail.value.value.toString();
	};

	let dataSwakelolaSelected: ISelect;
	let dataSwakelola: ISelect[] = [
		{
			label: 'Ya',
			value: '1'
		},
		{
			label: 'Tidak',
			value: '2'
		}
	];

	const handleSwakelola = async (event: any) => {
		dataUpdate.swakelola = event.detail.value.value.toString();
	};

	let dataPenerapanK3Selected: ISelect;
	let dataPenerapanK3: ISelect[] = [
		{
			label: 'Ya',
			value: '1'
		},
		{
			label: 'Tidak',
			value: '2'
		}
	];

	const handlePenerapanK3 = async (event: any) => {
		dataUpdate.penerapanK3 = event.detail.value.value.toString();
	};

	let dataUpdate = {
		judulKontrak: '',
		nilaiKontrak: 0,
		noKontrak: '',
		jenisPengadaan: '',
		mekanismePengadaan: '',
		swakelola: '',
		tanggalKontrak: '',
		tanggalMulai: '',
		tanggalSelesai: '',
		ppk: '',
		pelaksana: '',
		lokasi: '',
		kendala: '',
		tenagaKerja: 0,
		penerapanK3: '',
		keterangan: '',
		dinasId: '',
		subDpaPembangunanId: $page.params.subDpaPembangunanId
	};

	let tenant: ITenant = {
		accessToken: '',
		status: '',
		dinas: ''
	};

	let isLoadingAddOrUpdate: boolean = false;
	let errorMessage: Record<any, any> = {};

	let formatNilaiKontrak: string = "";

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};

		await getSubDpa();
	});

	async function postDataUmum() {
		errorMessage = {};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataUpdate.dinasId = tenant.dinas;
			}
		}
		const responses = await Update(dataUpdate);
		if (responses.status >= 200 && responses.status <= 300) {
			isLoadingAddOrUpdate = true;
			// await getRealisasi();
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

	async function getSubDpa() {
		let data = {
			dinasId: '',
			subDpaId: $page.params.subDpaPembangunanId
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				data.dinasId = tenant.dinas;
			}
		}
		const dataSubDpa = await OneSubDpa(data);
		if (dataSubDpa.status == 200) {
			dataUpdate.judulKontrak = dataSubDpa.data.judulKontrak;
			dataUpdate.nilaiKontrak = dataSubDpa.data.nilaiKontrak;
			dataUpdate.noKontrak = dataSubDpa.data.noKontrak;
			dataUpdate.jenisPengadaan = dataSubDpa.data.jenisPengadaan;
			dataUpdate.mekanismePengadaan = dataSubDpa.data.mekanismePengadaan;
			dataUpdate.swakelola = dataSubDpa.data.swakelola;
			dataUpdate.tanggalKontrak = dataSubDpa.data.tanggalKontrak;
			dataUpdate.tanggalMulai = dataSubDpa.data.tanggalMulai;
			dataUpdate.tanggalSelesai = dataSubDpa.data.tanggalSelesai;
			dataUpdate.ppk = dataSubDpa.data.ppk;
			dataUpdate.pelaksana = dataSubDpa.data.pelaksana;
			dataUpdate.lokasi = dataSubDpa.data.lokasi;
			dataUpdate.kendala = dataSubDpa.data.kendala;
			dataUpdate.tenagaKerja = dataSubDpa.data.tenagaKerja;
			dataUpdate.penerapanK3 = dataSubDpa.data.penerapanK3;
			dataUpdate.keterangan = dataSubDpa.data.keterangan;

			dataJenisPengadaan.find((d) => {
				if (d.value == dataUpdate.jenisPengadaan) {
					dataJenisPengadaanSelected = {
						value: d.value,
						label: d.label
					};
				}
			});

			dataMekanismePengadaan.find((d) => {
				if (d.value == dataUpdate.mekanismePengadaan) {
					dataMekanismePengadaanSelected = {
						value: d.value,
						label: d.label
					};
				}
			});

			dataSwakelola.find((d) => {
				if (d.value == dataUpdate.swakelola) {
					dataSwakelolaSelected = {
						value: d.value,
						label: d.label
					};
				}
			});

			dataPenerapanK3.find((d) => {
				if (d.value == dataUpdate.penerapanK3) {
					dataPenerapanK3Selected = {
						value: d.value,
						label: d.label
					};
				}
			});

			formatNilaiKontrak = formatCurrency(dataUpdate.nilaiKontrak);
		} else {
			//notif
			if (typeof dataSubDpa.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataSubDpa.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	function handleInputNilaiKontrak(event: any) {
		dataUpdate.nilaiKontrak = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		formatNilaiKontrak = formatCurrency(dataUpdate.nilaiKontrak);
	}
</script>

<Label defaultClass="text-lg text-center font-medium block">Data Umum</Label>
<div class="flex flex-col gap-3">
	<div class="w-full">
		<Label for="noDpa" class="mb-1 text-[14px]">
			Judul Kontrak
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
				type="text"
				placeholder="Masukkan Judul Kontrak"
				bind:value={dataUpdate.judulKontrak}
			/>
			{#if typeof errorMessage.judulKontrak !== 'undefined'}
				<Error messageError={errorMessage.judulKontrak} typeError="error" />
			{/if}
		</Label>
	</div>
	<div class="w-full">
		<Label for="noDpa" class="mb-1 text-[14px]">
			Pelaksana
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
				type="text"
				placeholder="Masukkan Pelaksana"
				bind:value={dataUpdate.pelaksana}
			/>
			{#if typeof errorMessage.pelaksana !== 'undefined'}
				<Error messageError={errorMessage.pelaksana} typeError="error" />
			{/if}
		</Label>
	</div>
	<div class="w-full flex gap-2">
		<div class="w-2/4">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Nilai Kontrak
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="text"
					placeholder="Masukkan Nilai Kontrak"
					bind:value={formatNilaiKontrak}
					on:input={handleInputNilaiKontrak}
				/>
				{#if typeof errorMessage.nilaiKontrak !== 'undefined'}
					<Error messageError={errorMessage.nilaiKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-2/4">
			<Label for="noDpa" class="mb-1 text-[14px]">
				No Kontrak
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="text"
					placeholder="Masukkan No Kontrak"
					bind:value={dataUpdate.noKontrak}
				/>
				{#if typeof errorMessage.noKontrak !== 'undefined'}
					<Error messageError={errorMessage.noKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>
	<div class="w-full flex gap-2">
		<div class="w-2/6">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Jenis Pengadaan
				<Select2
					data={dataJenisPengadaan}
					selected={dataJenisPengadaanSelected}
					on:Select2Change={handleJenisPengadaan}
				/>
				{#if typeof errorMessage.jenisPengadaan !== 'undefined'}
					<Error messageError={errorMessage.jenisPengadaan} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-2/6">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Mekanisme Pengadaan
				<Select2
					data={dataMekanismePengadaan}
					selected={dataMekanismePengadaanSelected}
					on:Select2Change={handleMekanismePengadaan}
				/>
				{#if typeof errorMessage.mekanismePengadaan !== 'undefined'}
					<Error messageError={errorMessage.mekanismePengadaan} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-2/6">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Swakelola
				<Select2
					data={dataSwakelola}
					selected={dataSwakelolaSelected}
					on:Select2Change={handleSwakelola}
				/>
				{#if typeof errorMessage.swakelola !== 'undefined'}
					<Error messageError={errorMessage.swakelola} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>

	<div class="w-full flex gap-2">
		<div class="w-2/6">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Tanggal Kontrak
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="date"
					placeholder="Masukkan Tanggal Kontrak"
					bind:value={dataUpdate.tanggalKontrak}
				/>
				{#if typeof errorMessage.tanggalKontrak !== 'undefined'}
					<Error messageError={errorMessage.tanggalKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-2/6">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Tanggal Mulai
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="date"
					placeholder="Masukkan Tanggal Mulai"
					bind:value={dataUpdate.tanggalMulai}
				/>
				{#if typeof errorMessage.tanggalMulai !== 'undefined'}
					<Error messageError={errorMessage.tanggalMulai} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-2/6">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Tanggal Selesai
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="date"
					placeholder="Masukkan Tanggal Selesai"
					bind:value={dataUpdate.tanggalSelesai}
				/>
				{#if typeof errorMessage.tanggalSelesai !== 'undefined'}
					<Error messageError={errorMessage.tanggalSelesai} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>

	<div class="w-full">
		<Label for="noDpa" class="mb-1 text-[14px]">
			PPK
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
				type="text"
				placeholder="Masukkan PPK"
				bind:value={dataUpdate.ppk}
			/>
			{#if typeof errorMessage.ppk !== 'undefined'}
				<Error messageError={errorMessage.ppk} typeError="error" />
			{/if}
		</Label>
	</div>

	<div class="w-full flex gap-2">
		<div class="w-3/12">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Lokasi
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="text"
					placeholder="Masukkan Lokasi"
					bind:value={dataUpdate.lokasi}
				/>
				{#if typeof errorMessage.lokasi !== 'undefined'}
					<Error messageError={errorMessage.lokasi} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-3/12">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Kendala
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="text"
					placeholder="Masukkan Kendala"
					bind:value={dataUpdate.kendala}
				/>
				{#if typeof errorMessage.kendala !== 'undefined'}
					<Error messageError={errorMessage.kendala} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-3/12">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Tenaga Kerja
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="number"
					placeholder="Masukkan Tenaga Kerja"
					bind:value={dataUpdate.tenagaKerja}
				/>
				{#if typeof errorMessage.tenagaKerja !== 'undefined'}
					<Error messageError={errorMessage.tenagaKerja} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-3/12">
			<Label for="noDpa" class="mb-1 text-[14px]">
				Penerapan K3
				<Select2
					data={dataPenerapanK3}
					selected={dataPenerapanK3Selected}
					on:Select2Change={handlePenerapanK3}
				/>
				{#if typeof errorMessage.penerapanK3 !== 'undefined'}
					<Error messageError={errorMessage.penerapanK3} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>
	<div class="w-full">
		<Label for="textarea-id" class="mb-1">
			Keterangan
			<Textarea
				placeholder="Keterangan"
				rows="4"
				unWrappedClass="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
				bind:value={dataUpdate.keterangan}
			/>
			{#if typeof errorMessage.keterangan !== 'undefined'}
				<Error messageError={errorMessage.keterangan} typeError="error" />
			{/if}
		</Label>
	</div>
	<div class="mt-5 flex justify-end gap-2">
		{#if !isLoadingAddOrUpdate}
			<Button
				size="sm"
				on:click={postDataUmum}
				type="button"
				class="bg-[#1E40AF] hover:bg-[#183593]">Simpan</Button
			>
		{/if}
		{#if isLoadingAddOrUpdate}
			<ButtonLoading />
		{/if}
	</div>
</div>
