<script lang="ts">
	import { onMount } from 'svelte';

	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import Stepper from '$lib/component/Stepper.svelte';

	import { List, Create, Update, Delete } from '$lib/api/organisasi';
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
		P,
		Card
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { toasts } from '$lib/component/toast/ToastStore';
	import Pagination from '$lib/component/pagination/Pagination.svelte';
	import STable from '$lib/component/skeleton/STable.svelte';
	import Length from '$lib/component/length/Length.svelte';
	import Search from '$lib/component/search/Search.svelte';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import Error from '$lib/component/Error.svelte';
	import Select2 from '$lib/component/Select2.svelte';
	import type { ISelect } from '$lib/interface/ISelect';
	import { GetListBidang } from '$lib/forSelect/bidang';
	import type { IOrganisasi } from '$lib/interface/IOrganisasi';
	import type { IStepper } from '$lib/interface/IStepper';

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
	let value: any = '';

	let dataTable = {
		search: {
			column: ['organisasi.kode', 'organisasi.nomenklatur'],
			value: ''
		},
		order: [
			{
				column: 'id',
				dir: 'desc'
			}
		],
		length: 10,
		page: 0,
		bidangId: 0
	};

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Organisasi', href: '/master/organisasi' }
	];

	let stepperData: IStepper[] = [
		{
			label: 'Organisasi',
			href: '/master/organisasi'
		},
		{
			label: 'Unit',
			href: ''
		}
	];

	let totalPages: number = 1;

	let Organisasi: IOrganisasi[] = [];

	async function getOrganisasi(dataBody: any) {
		const dataOrganisasi = await List(dataBody);
		if (dataOrganisasi.status == 200) {
			Organisasi = dataOrganisasi.data.data.map((item: any) => ({
				id: item.id,
				kode: item.kode,
				nomenklatur: item.nomenklatur,
				bidangId: item.bidangId
			}));

			if (Organisasi.length != 0) {
				totalPages = dataOrganisasi.data.totalData / dataTable.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
		} else {
			//notif
			if (typeof dataOrganisasi.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataOrganisasi.message,
						timeout: 3000
					}
				]);
			}
		}
		PaginationComponent.updatePagination();
	}

	onMount(async () => {
		isLoading = true;
		await getOrganisasi(dataTable);
		DataBidangFilter = await GetListBidang('');
		BidangSelectedFilter = {
			value: '0',
			label: 'Semua Bidang'
		};
		DataBidangFilter.unshift(BidangSelectedFilter);
		isLoading = false;
	});

	const handleBidangSelectFilter = async (event: any) => {
		dataTable.bidangId = event.detail.value.value;
	};

	function handleClickFilter() {
		showFilter = !showFilter;
	}

	const setFilter = async (event: any) => {
		isLoading = true;
		await getOrganisasi(dataTable);
		isLoading = false;
	};

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		isLoading = true;
		await getOrganisasi(dataTable);
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		isLoading = true;
		await getOrganisasi(dataTable);
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		isLoading = true;
		await getOrganisasi(dataTable);
		isLoading = false;
	};

	let DataBidang: ISelect[] | boolean;
	let BidangSelected: ISelect;

	let DataBidangFilter: ISelect[] | boolean;
	let BidangSelectedFilter: ISelect;
	let showFilter = false;

	const buttonAdd = () => {
		isLoadingAdd = true;
		GetListBidang('')
			.then((result) => {
				DataBidang = result;
				tambahModal = true;
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				isLoadingAdd = false;
			});
	};

	const buttonEdit = () => {
		isLoadingEdit = true;
		GetListBidang('')
			.then((result) => {
				DataBidang = result;
				for (const item of DataBidang) {
					if (editValue.bidangId === item.value) {
						BidangSelected = item;
						break;
					}
				}
				editModal = true;
			})
			.catch((error) => {
				console.error(error);
			})
			.finally(() => {
				isLoadingEdit = false;
			});
	};

	const buttonDelete = () => {
		deleteModal = true;
	};

	async function onAdd(e: any) {
		const formData = new FormData(e.target);
		let data: Record<string, any> = {};
		for (let field of formData) {
			const [keyField, valueField] = field;
			if (typeof valueField === 'string') {
				if (valueField.startsWith('{') && valueField.endsWith('}')) {
					try {
						data[keyField] = JSON.parse(valueField).value;
					} catch (error) {
						console.error(`Error parsing JSON for field ${keyField}: ${error}`);
						data[keyField] = '';
					}
				} else {
					data[keyField] = valueField;
				}
			} else {
				data[keyField] = valueField;
			}
		}

		isLoadingAdd = true;
		let responses: any = {};
		if (tambahModal) {
			responses = await Create(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getOrganisasi(dataTable);
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
		let data: Record<string, any> = {};
		for (let field of formData) {
			const [keyField, valueField] = field;
			if (typeof valueField === 'string') {
				if (valueField.startsWith('{') && valueField.endsWith('}')) {
					try {
						data[keyField] = JSON.parse(valueField).value;
					} catch (error) {
						console.error(`Error parsing JSON for field ${keyField}: ${error}`);
						data[keyField] = '';
					}
				} else {
					data[keyField] = valueField;
				}
			} else {
				data[keyField] = valueField;
			}
		}

		isLoadingEdit = true;
		let responses: any = {};

		if (editValue) {
			data['id'] = editValue.id;
			responses = await Update(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getOrganisasi(dataTable);
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
				await getOrganisasi(dataTable);
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
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Data Organisasi</div>
	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="mb-3">
			<Stepper stepperItems={stepperData} active={0} />
		</div>
		<div class="">
			<Blockquote border bg class="p-4 my-4">
				<P size="xs" class="text-[#FF3636]" height="relaxed">Perhatian :</P>
				<P size="xs" height="relaxed">
					<small class="text-[#FF3636] pt-0 mt-0">**</small> Klik Kode atau Nomenklatur Organisasi jika
					ingin ke data unit.
				</P>
			</Blockquote>
			<div class="flex justify-between mb-4">
				<div class="w-full">
					<div class="grid grid-cols-2">
						<Search on:searchPage={setSearch} />
						<div class="flex justify-end gap-2">
							<Button
								size="xs"
								class="bg-[#1E40AF] hover:bg-blue-900 hover:text-white-700"
								on:click={handleClickFilter}
							>
								Filter
								<svg
									class="w-4 h-4 text-white dark:text-white pl-1"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 20 18"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="m2.133 2.6 5.856 6.9L8 14l4 3 .011-7.5 5.856-6.9a1 1 0 0 0-.804-1.6H2.937a1 1 0 0 0-.804 1.6Z"
									/>
								</svg>
							</Button>
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
			<div class="my-2 flex {showFilter ? '' : 'hidden'}">
				<Card class="w-full max-w-full p-2">
					<div class="flex flex-col gap-y-2">
						<div class="grid grid-cols-2 gap-2">
							<Label class="space-y-2 mb-2">
								<span>Bidang</span>
								<Select2
									placeholder="Pilih Bidang"
									name="bidangIdFilter"
									data={DataBidangFilter}
									selected={BidangSelectedFilter}
									on:Select2Change={handleBidangSelectFilter}
								/>
							</Label>
						</div>
						<div class="flex justify-end">
							{#if !isLoadingAdd}
								<Button
									on:click={setFilter}
									size="sm"
									class="hover:no-underline bg-[#1E40AF] hover:bg-blue-900 hover:text-white-700"
								>
									Cari
									<svg
										class="w-4 h-4 text-white dark:text-white pl-1"
										aria-hidden="true"
										xmlns="http://www.w3.org/2000/svg"
										fill="none"
										viewBox="0 0 20 20"
									>
										<path
											stroke="currentColor"
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
										/>
									</svg>
								</Button>
							{/if}
							{#if isLoadingAdd}
								<ButtonLoading />
							{/if}
						</div>
					</div>
				</Card>
			</div>
			<Table class="rounded-md overflow-hidden">
				<TableHead class="text-center bg-[#1E40AF] text-white">
					<TableHeadCell>Kode</TableHeadCell>
					<TableHeadCell>Nomenklatur</TableHeadCell>
					<TableHeadCell>Aksi</TableHeadCell>
				</TableHead>
				<TableBody>
					{#if isLoading == true}
						<STable totalColumn={3} totalRow={dataTable.length} />
					{:else if Organisasi.length === 0}
						<TableBodyRow class="text-center">
							<TableBodyCell colspan="3">No Data ...</TableBodyCell>
						</TableBodyRow>
					{:else}
						{#each Organisasi as item}
							<TableBodyRow class="text-center">
								<TableBodyCell tdClass="p-0 m-0"
									><a href="/master/organisasi/unit/{item.id}">{item.kode}</a></TableBodyCell
								>
								<TableBodyCell tdClass="p-0 m-0"
									><a href="/master/organisasi/unit/{item.id}">{item.nomenklatur}</a></TableBodyCell
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
	</div>
</section>

<Modal bind:open={tambahModal} size="xs" autoclose={false} class="w-full">
	<form on:submit|preventDefault={onAdd} class="flex flex-col space-y-6" action="#">
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Tambah Organisasi</h3>
		<Label class="space-y-2 mb-2">
			<span>Bidang</span>
			<Select2
				placeholder="Pilih Bidang"
				name="bidangId"
				data={DataBidang}
				selected={BidangSelected}
			/>
			{#if typeof errorMessage.bidangId !== 'undefined'}
				<Error messageError={errorMessage.bidangId} typeError="error" />
			{/if}
		</Label>
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
			<span>Nomenklatur</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="nomenklatur"
				placeholder="Masukkan Nomenklatur"
			/>
			{#if typeof errorMessage.nomenklatur !== 'undefined'}
				<Error messageError={errorMessage.nomenklatur} typeError="error" />
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
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Ubah Organisasi</h3>
		<Label class="space-y-2 mb-2">
			<span>Bidang</span>
			<Select2
				placeholder="Pilih Bidang"
				name="bidangId"
				data={DataBidang}
				selected={BidangSelected}
			/>
			{#if typeof errorMessage.bidangId !== 'undefined'}
				<Error messageError={errorMessage.bidangId} typeError="error" />
			{/if}
		</Label>
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
			<span>Nomenklatur</span>
			<Input
				class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
				type="text"
				name="nomenklatur"
				placeholder="Masukkan Nomenklatur"
				bind:value={editValue.nomenklatur}
			/>
			{#if typeof errorMessage.nomenklatur !== 'undefined'}
				<Error messageError={errorMessage.nomenklatur} typeError="error" />
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
