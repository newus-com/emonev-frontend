<script lang="ts">
	import { onMount } from 'svelte';

	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import Stepper from '$lib/component/Stepper.svelte';
	import { List, Create, Update, Delete } from '$lib/api/rekening/objekRekening';
	import { One } from '$lib/api/rekening/jenisRekening';
	import {
		Button,
		Modal,
		Label,
		Input,
		Table,
		TableBody,
		TableHead,
		TableHeadCell,
		TableBodyCell,
		TableBodyRow,
		Indicator,
		Blockquote,
		P
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { toasts } from '$lib/component/toast/ToastStore';
	import Pagination from '$lib/component/pagination/Pagination.svelte';
	import STable from '$lib/component/skeleton/STable.svelte';
	import Length from '$lib/component/length/Length.svelte';
	import Search from '$lib/component/search/Search.svelte';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import type { IStepper } from '$lib/interface/IStepper';
	import Error from '$lib/component/Error.svelte';
	import { page } from '$app/stores';
	import type { IObjekRekening } from '$lib/interface/IObjekRekening.js';
	import type { IJenisRekening } from '$lib/interface/IJenisRekening.js';

	let PaginationComponent: Pagination;

	let editModal: boolean = false;
	let tambahModal: boolean = false;
	let deleteModal: boolean = false;

	let isLoadingAdd: boolean = false;
	let isLoadingEdit: boolean = false;
	let isLoadingDelete: boolean = false;

	let editValue: any = null;
	let deleteValue: any = null;
	let errorMessage: Record<any, any> = {};

	let isLoading: boolean = false;

	let dataTable = {
		search: {
			column: ['objek_rekening.kode', 'objek_rekening.uraianAkun', 'objek_rekening.deskripsiAkun'],
			value: ''
		},
		order: [
			{
				column: 'objek_rekening.id',
				dir: 'desc'
			}
		],
		length: 10,
		page: 0,
		jenisRekeningId: $page.params.jenisRekeningId
	};

	let totalPages: number = 1;

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Rekening', href: '/master/rekening' },
		{ label: 'Kelompok', href: '/master/rekening/kelompok/' + $page.params.akunRekeningId },
		{
			label: 'Jenis',
			href:
				'/master/rekening/kelompok/' +
				$page.params.akunRekeningId +
				'/jenis/' +
				$page.params.kelompokRekeningId
		},
		{
			label: 'Objek',
			href:
				'/master/rekening/kelompok/' +
				$page.params.akunRekeningId +
				'/jenis/' +
				$page.params.kelompokRekeningId +
				'/objek/' +
				$page.params.jenisRekeningId
		}
	];

	let ObjekRekening: IObjekRekening[] = [];

	let JenisRekening: IJenisRekening = {
		id: '',
		kode: '',
		uraianAkun: '',
		deskripsiAkun: '',
		kelompokRekeningId: ''
	};

	let stepperData: IStepper[] = [
		{
			label: 'Akun Rekening',
			href: '/master/rekening'
		},
		{
			label: 'Kelompok Rekening',
			href: '/master/rekening/kelompok/' + $page.params.akunRekeningId
		},
		{
			label: 'Jenis Rekening',
			href:
				'/master/rekening/kelompok/' +
				$page.params.akunRekeningId +
				'/jenis/' +
				$page.params.kelompokRekeningId
		},
		{
			label: 'Objek Rekening',
			href:
				'/master/rekening/kelompok/' +
				$page.params.akunRekeningId +
				'/jenis/' +
				$page.params.kelompokRekeningId +
				'/objek/' +
				$page.params.jenisRekeningId
		},
		{
			label: 'Rincian Objek Rekening',
			href: ''
		},
		{
			label: 'Sub Rincian Objek Rekening',
			href: ''
		}
	];

	async function getObjekRekening() {
		const dataObjekRekening = await List(dataTable);
		if (dataObjekRekening.status == 200) {
			ObjekRekening = dataObjekRekening.data.data.map((item: any) => ({
				id: item.id,
				kode: item.kode,
				uraianAkun: item.uraianAkun,
				deskripsiAkun: item.deskripsiAkun,
				jenisRekeningId: item.jenisRekeningId
			}));

			if (ObjekRekening.length != 0) {
				totalPages = dataObjekRekening.data.totalData / dataTable.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
		} else {
			//notif
			if (typeof dataObjekRekening.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataObjekRekening.message,
						timeout: 3000
					}
				]);
			}
		}
		PaginationComponent.updatePagination();
	}

	async function getOneJenisRekening(id: string) {
		const dataJenisRekening = await One(id);
		if (dataJenisRekening.status == 200) {
			JenisRekening = {
				id: dataJenisRekening.data.id,
				kode: dataJenisRekening.data.kode,
				uraianAkun: dataJenisRekening.data.uraianAkun,
				deskripsiAkun: dataJenisRekening.data.deskripsiAkun,
				kelompokRekeningId: dataJenisRekening.data.kelompokRekeningId
			};
		} else {
			//notif
			if (typeof dataJenisRekening.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataJenisRekening.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	onMount(async () => {
		isLoading = true;
		await getObjekRekening();
		await getOneJenisRekening($page.params.jenisRekeningId);
		isLoading = false;
	});

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		isLoading = true;
		await getObjekRekening();
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		isLoading = true;
		await getObjekRekening();
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		isLoading = true;
		await getObjekRekening();
		isLoading = false;
	};

	async function onAdd(e: any) {
		const formData = new FormData(e.target);
		const data: Record<string, any> = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		isLoadingAdd = true;
		let responses: any = {};
		if (tambahModal) {
			data['jenisRekeningId'] = $page.params.jenisRekeningId;
			responses = await Create(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getObjekRekening();
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'success',
						messageToast: responses.message,
						timeout: 3000
					}
				]);
				PaginationComponent.updatePagination();
				tambahModal = false;
				isLoading = false;
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
		isLoadingAdd = false;
	}

	async function onEdit(e: any) {
		const formData = new FormData(e.target);
		const data: Record<string, any> = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		isLoadingEdit = true;
		let responses: any = {};
		if (editModal) {
			data['id'] = editValue.id;
			data['jenisRekeningId'] = editValue.jenisRekeningId;
			responses = await Update(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getObjekRekening();
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'success',
						messageToast: responses.message,
						timeout: 3000
					}
				]);
				PaginationComponent.updatePagination();
				editModal = false;
				isLoading = false;
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
		isLoadingEdit = false;
	}

	async function onDelete(e: any) {
		isLoadingDelete = true;
		let data: Record<string, any> = {};
		let responses: any = {};
		if (deleteModal) {
			data['id'] = deleteValue.id;
			responses = await Delete(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getObjekRekening();
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'success',
						messageToast: responses.message,
						timeout: 3000
					}
				]);
				PaginationComponent.updatePagination();
				deleteModal = false;
				isLoading = false;
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
		isLoadingDelete = false;
	}

	const buttonAdd = () => {
		isLoadingAdd = true;
		tambahModal = true;
		isLoadingAdd = false;
	};

	const buttonEdit = () => {
		isLoadingEdit = true;
		editModal = true;
		isLoadingEdit = false;
	};

	const buttonDelete = () => {
		isLoadingDelete = true;
		deleteModal = true;
		isLoadingDelete = false;
	};

	let action: string;

	$: {
		if (action == 'edit') {
			buttonEdit();
			action = '';
		} else if (action == 'delete') {
			buttonDelete();
			action = '';
		}
	}
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Data Objek Rekening</div>
	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="mb-3">
			<Stepper stepperItems={stepperData} active={3} />
		</div>
		<div class="">
			<Blockquote border bg class="p-4 my-4">
				<P size="xs" height="relaxed">
					<b>Data objek rekening dari jenis rekening: </b>
				</P>
				<P size="xs" height="relaxed">
					"{JenisRekening.kode} | {JenisRekening.uraianAkun} | {JenisRekening.deskripsiAkun}"
				</P>
				<P size="xs" class="text-[#FF3636]" height="relaxed">Perhatian :</P>
				<P size="xs" height="relaxed">
					<small class="text-[#FF3636] pt-0 mt-0">**</small> Klik Kode, Uraian Akun, Deskripsi Akun jika
					ingin ke data rincian objek rekening.
				</P>
			</Blockquote>
			<div class="flex justify-between mb-4">
				<div class="w-full">
					<div class="grid grid-cols-2">
						<Search on:searchPage={setSearch} />
						<div class="flex justify-end gap-2">
							{#if !isLoadingAdd}
								<Button
									size="sm"
									on:click={buttonAdd}
									class="hover:no-underline bg-[#1E40AF] hover:bg-blue-900 hover:text-white-700"
								>
									Tambah
								</Button>
							{/if}
							{#if isLoadingAdd}
								<ButtonLoading />
							{/if}
						</div>
					</div>
				</div>
			</div>
			<Table class="rounded-md overflow-hidden">
				<TableHead class="text-center bg-[#1E40AF] text-white">
					<TableHeadCell>Kode</TableHeadCell>
					<TableHeadCell>Uraian Akun</TableHeadCell>
					<TableHeadCell>Deskripsi Akun</TableHeadCell>
					<TableHeadCell>Aksi</TableHeadCell>
				</TableHead>
				<TableBody>
					{#if isLoading == true}
						<STable totalColumn={4} totalRow={dataTable.length} />
					{:else if ObjekRekening.length === 0}
						<TableBodyRow class="text-center">
							<TableBodyCell colspan="4">No Data ...</TableBodyCell>
						</TableBodyRow>
					{:else}
						{#each ObjekRekening as item (item.id)}
							<TableBodyRow class="text-center">
								<TableBodyCell tdClass="p-0 m-0"
									><a
										href="/master/rekening/kelompok/{$page.params.akunRekeningId}/jenis/{$page
											.params.kelompokRekeningId}/objek/{$page.params
											.jenisRekeningId}/rincianObjek/{item.id}">{item.kode}</a
									></TableBodyCell
								>
								<TableBodyCell tdClass="p-0 m-0"
									><a
										href="/master/rekening/kelompok/{$page.params.akunRekeningId}/jenis/{$page
											.params.kelompokRekeningId}/objek/{$page.params
											.jenisRekeningId}/rincianObjek/{item.id}">{item.uraianAkun}</a
									></TableBodyCell
								>
								<TableBodyCell tdClass="p-0 m-0"
									><a
										href="/master/rekening/kelompok/{$page.params.akunRekeningId}/jenis/{$page
											.params.kelompokRekeningId}/objek/{$page.params
											.jenisRekeningId}/rincianObjek/{item.id}">{item.deskripsiAkun}</a
									></TableBodyCell
								>
								<TableBodyCell tdClass="p-0 m-0">
									<Button
										class="mr-2 hover:no-underline my-1 px-3 py-1 text-[12px]"
										size="md"
										color="yellow"
										on:click={() => {
											editValue = item;
											action = 'edit';
										}}>Edit</Button
									>
									<Button
										class="hover:no-underline hover:bg-[#CB2A2A] bg-[#FF3636] px-3 py-1 text-[12px]"
										size="sm"
										on:click={() => {
											deleteValue = item;
											action = 'delete';
										}}>Hapus</Button
									>
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{/if}
				</TableBody>
			</Table>
		</div>
		<hr />
		<div class="mt-3 flex justify-between">
			<Length on:lengthPage={setLength} />
			<Pagination
				currentPage={dataTable.page}
				{totalPages}
				bind:this={PaginationComponent}
				on:currentPage={setPagination}
			/>
		</div>
	</div>
</section>

<Modal bind:open={tambahModal} size="xs" autoclose={false} class="w-full">
	<form on:submit|preventDefault={onAdd} class="flex flex-col space-y-6" action="#">
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Tambah Objek Rekening</h3>
		<Label class="space-y-2">
			<span>Kode</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="kode"
				placeholder="Masukkan Kode"
			/>
			{#if typeof errorMessage.kode !== 'undefined'}
				<Error messageError={errorMessage.kode} typeError="error" />
			{/if}
		</Label>
		<Label class="space-y-2">
			<span>Uraian Objek Rekening</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="uraianAkun"
				placeholder="Masukkan Uraian Objek Rekening"
			/>
			{#if typeof errorMessage.uraianAkun !== 'undefined'}
				<Error messageError={errorMessage.uraianAkun} typeError="error" />
			{/if}
		</Label>
		<Label class="space-y-2">
			<span>Deskripsi Objek Rekening</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="deskripsiAkun"
				placeholder="Masukkan Deskripsi Objek Rekening"
			/>
			{#if typeof errorMessage.deskripsiAkun !== 'undefined'}
				<Error messageError={errorMessage.deskripsiAkun} typeError="error" />
			{/if}
		</Label>
		{#if !isLoadingAdd}
			<Button type="submit" class="bg-[#1E40AF] hover:bg-[#183593] ">Tambah</Button>
		{/if}
		{#if isLoadingAdd}
			<ButtonLoading />
		{/if}
	</form>
</Modal>

<Modal bind:open={editModal} size="xs" autoclose={false} class="w-full">
	<form on:submit|preventDefault={onEdit} class="flex flex-col space-y-6" action="#">
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Ubah Objek Rekening</h3>
		<Label class="space-y-2">
			<span>Kode</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="kode"
				placeholder="Masukkan Kode"
				bind:value={editValue.kode}
			/>
			{#if typeof errorMessage.kode !== 'undefined'}
				<Error messageError={errorMessage.kode} typeError="error" />
			{/if}
		</Label>
		<Label class="space-y-2">
			<span>Uraian Objek Rekening</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="uraianAkun"
				placeholder="Masukkan Uraian Objek Rekening"
				bind:value={editValue.uraianAkun}
			/>
			{#if typeof errorMessage.uraianAkun !== 'undefined'}
				<Error messageError={errorMessage.uraianAkun} typeError="error" />
			{/if}
		</Label>
		<Label class="space-y-2">
			<span>Deskripsi Objek Rekening</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="deskripsiAkun"
				placeholder="Masukkan Deskripsi Objek Rekening"
				bind:value={editValue.deskripsiAkun}
			/>
			{#if typeof errorMessage.deskripsiAkun !== 'undefined'}
				<Error messageError={errorMessage.deskripsiAkun} typeError="error" />
			{/if}
		</Label>
		{#if !isLoadingEdit}
			<Button type="submit" class="bg-[#1E40AF] hover:bg-[#183593] ">Ubah</Button>
		{/if}
		{#if isLoadingEdit}
			<ButtonLoading />
		{/if}
	</form>
</Modal>

<Modal bind:open={deleteModal} size="xs" autoclose={false}>
	<div class="text-center">
		<Icon
			name="exclamation-circle-outline"
			class="mx-auto mb-4 text-[#FF3636] w-12 h-12 dark:text-gray-200"
		/>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Apakah anda yakin Ingin Menghapus?
		</h3>
		<form on:submit|preventDefault={onDelete}>
			{#if !isLoadingDelete}
				<Button class="mr-2 bg-[#1E40AF] hover:bg-[#183593]" type="submit">Ya</Button>
			{/if}
			{#if isLoadingDelete}
				<ButtonLoading />
			{/if}
			<Button
				color="alternative"
				on:click={() => {
					deleteModal = false;
				}}>Tidak</Button
			>
		</form>
	</div>
</Modal>
