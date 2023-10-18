<script lang="ts">
	import { page } from '$app/stores';

	import { onMount } from 'svelte';

	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import Stepper from '$lib/component/Stepper.svelte';
	import { List, Create, Update, Delete } from '$lib/api/perencanaan/program';
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
	import { One } from '$lib/api/perencanaan/bidang';
	import type { IBidang } from '$lib/interface/IBidang';
	import type { IStepper } from '$lib/interface/IStepper';
	import type { IProgram } from '$lib/interface/IProgram';
	import Error from '$lib/component/Error.svelte';

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Urusan', href: '/master/perencanaan' },
		{ label: 'Bidang', href: '/master/perencanaan/bidang/' + $page.params.urusanId },
		{ label: 'Program', href: '/master/perencanaan/bidang/' + $page.params.urusanId + '/program/' + $page.params.bidangId},
	];

	let stepperData: IStepper[] = [
		{
			label: 'Urusan',
			href: '/master/perencanaan'
		},
		{
			label: 'Bidang',
			href: '/master/perencanaan/bidang/' + $page.params.urusanId
		},
		{
			label: 'Program',
			href: '/master/perencanaan/bidang/' + $page.params.urusanId + '/program/' + $page.params.bidangId
		},
		{
			label: 'Kegiatan',
			href: ''
		},
		{
			label: 'Sub Kegiatan',
			href: ''
		}
	];

	let PaginationComponent: Pagination;

	let editModal: boolean = false;
	let tambahModal: boolean = false;
	let deleteModal: boolean = false;

	let isLoading: boolean = false;
	let isLoadingAdd: boolean = false;
	let isLoadingEdit: boolean = false;
	let isLoadingDelete: boolean = false;

	let editValue: any = null;
	let deleteValue: any = null;

	let errorMessage: Record<any, any> = {};

	let dataTable = {
		search: {
			column: ['program.kode', 'program.nomenklatur'],
			value: ''
		},
		order: [
			{
				column: 'program.id',
				dir: 'desc'
			}
		],
		length: 10,
		page: 0,
		bidangId: $page.params.bidangId
	};

	let totalPages: number = 1;

	let Program: IProgram[] = [];
	let Bidang: IBidang = {
		id: '',
		kode: '',
		nomenklatur: '',
        urusanId: '',
	};

	async function getProgram() {
		const dataProgram = await List(dataTable);
		if (dataProgram.status == 200) {
			Program = dataProgram.data.data.map((item: any) => ({
				id: item.id,
				kode: item.kode,
				nomenklatur: item.nomenklatur,
				bidangId: item.bidangId
			}));

			if (Program.length != 0) {
				totalPages = dataProgram.data.totalData / dataTable.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
		} else {
			//notif
			if (typeof dataProgram.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataProgram.message,
						timeout: 3000
					}
				]);
			}
		}
		PaginationComponent.updatePagination();
	}

	async function getOneBidang(id: string) {
		const dataBidang = await One(id);
		if (dataBidang.status == 200) {
			Bidang = {
				id: dataBidang.data.id,
				kode: dataBidang.data.kode,
				nomenklatur: dataBidang.data.nomenklatur,
				urusanId: dataBidang.data.urusanId,
			};
		} else {
			//notif
			if (typeof dataBidang.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataBidang.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	onMount(async () => {
		isLoading = true;
		await getProgram();
		await getOneBidang($page.params.bidangId);
		isLoading = false;
	});

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		isLoading = true;
		await getProgram();
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		isLoading = true;
		await getProgram();
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		isLoading = true;
		await getProgram();
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
			data['bidangId'] = $page.params.bidangId;
			responses = await Create(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getProgram();
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
			data['bidangId'] = editValue.bidangId;
			responses = await Update(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getProgram();
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
				await getProgram();
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
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Data Program</div>
	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="mb-3">
			<Stepper stepperItems={stepperData} active={2} />
		</div>
		<div class="">
			<Blockquote border bg class="p-4 my-4">
				<P size="xs" height="relaxed"><b>Data program dari bidang:</b></P>

				<P size="xs" height="relaxed">
					"{Bidang.kode} | {Bidang.nomenklatur}"
				</P>
				<P size="xs" class="text-[#FF3636]" height="relaxed">
					Perhatian :
				</P>
				<P size="xs" height="relaxed">
					<small class="text-[#FF3636] pt-0 mt-0">**</small> Klik Kode atau Nomenklatur jika ingin ke data kegiatan.
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
					<TableHeadCell>Nomenklatur</TableHeadCell>
					<TableHeadCell>Aksi</TableHeadCell>
				</TableHead>
				<TableBody>
					{#if isLoading == true}
						<STable totalColumn={3} totalRow={dataTable.length} />
					{:else if Program.length === 0}
						<TableBodyRow class="text-center">
							<TableBodyCell colspan="3">No Data ...</TableBodyCell>
						</TableBodyRow>
					{:else}
						{#each Program as item}
							<TableBodyRow class="text-center">
								<TableBodyCell tdClass="p-0 m-0"
									><a href="/master/perencanaan/bidang/{$page.params.urusanId}/program/{$page.params.bidangId}/kegiatan/{item.id}"
										>{item.kode}</a
									></TableBodyCell
								>
								<TableBodyCell tdClass="p-0 m-0"
									><a href="/master/perencanaan/bidang/{$page.params.urusanId}/program/{$page.params.bidangId}/kegiatan/{item.id}"
										>{item.nomenklatur}</a
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
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Tambah Program</h3>
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
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Ubah Program</h3>
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
