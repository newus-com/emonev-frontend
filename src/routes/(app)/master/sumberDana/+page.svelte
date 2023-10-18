<script lang="ts">
	import { onMount } from 'svelte';

	import BreadCrump from '$lib/component/BreadCrump.svelte';
	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Sumber Dana', href: '/master/sumberDana' }
	];
	import { List, Create, Update, Delete } from '$lib/api/sumberDana';
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
		TableBodyRow
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { toasts } from '$lib/component/toast/ToastStore';
	import Pagination from '$lib/component/pagination/Pagination.svelte';
	import STable from '$lib/component/skeleton/STable.svelte';
	import Length from '$lib/component/length/Length.svelte';
	import Search from '$lib/component/search/Search.svelte';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import Error from '$lib/component/Error.svelte';

	let PaginationComponent: Pagination;

	let editModal: boolean = false;
	let tambahModal: boolean = false;
	let deleteModal: boolean = false;
	let isLoadingAdd: boolean = false;
	let editIndex: number | undefined | string = undefined;
	let editValue: number | null | string = null;
	let deleteId: number | null | string = null;
	let errorMessage: Record<any, any> = {};

	let isLoading: boolean = false;
	let value: any = '';

	export let dataTable = {
		search: {
			column: ['sumber_dana.sumberDana'],
			value: ''
		},
		order: [
			{
				column: 'sumber_dana.id',
				dir: 'desc'
			}
		],
		length: 10,
		page: 0
	};

	let totalPages: number = 1;

	interface ISumberDana {
		id: string;
		sumberDana: string;
	}

	let SumberDana: ISumberDana[] = [];

	async function getSumberDana() {
		const dataSumberDana = await List(dataTable);
		if (dataSumberDana.status == 200) {
			SumberDana = dataSumberDana.data.data.map((item: any) => ({
				id: item.id,
				sumberDana: item.sumberDana
			}));

			if (SumberDana.length != 0) {
				totalPages = dataSumberDana.data.totalData / dataTable.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
		} else {
			//notif
			if (typeof dataSumberDana.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataSumberDana.message,
						timeout: 3000
					}
				]);
			}
		}
		await PaginationComponent.updatePagination();
	}

	onMount(async () => {
		isLoading = true;
		await getSumberDana();
		// PaginationComponent.updatePagination();
		isLoading = false;
	});

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		isLoading = true;
		await getSumberDana();
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		isLoading = true;
		await getSumberDana();
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		isLoading = true;
		await getSumberDana();
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
			responses = await Create(data);
		} else if (editIndex && data['id'] !== undefined) {
			responses = await Update(data);
		} else if (deleteId && data['id'] !== undefined) {
			responses = await Delete(data);
		}
		editIndex = undefined;
		deleteId = null;
		if (responses.status >= 200 && responses.status <= 300) {
			isLoading = true;
			await getSumberDana();
			toasts.update((toastsList) => [
				...toastsList,
				{
					id: Date.now(),
					typeToast: 'error',
					messageToast: responses.message,
					timeout: 3000
				}
			]);
			PaginationComponent.updatePagination();
			tambahModal = false;
			editModal = false;
			deleteModal = false;
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
		isLoadingAdd = false;

		isLoading = false;
	}
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Data Sumber Dana</div>
	<div class="wrap bg-white p-6 rounded-md shadow-lg">
		<div class="">
			<div class="flex justify-between mb-4">
				<div class="w-full">
					<div class="grid grid-cols-2">
						<Search on:searchPage={setSearch} />
						<div class="flex justify-end">
							<Button
								size="sm"
								on:click={() => (tambahModal = true)}
								class="hover:no-underline bg-[#1E40AF]"
							>
								Tambah
							</Button>
						</div>
					</div>
				</div>
			</div>
			<div class="wotable border rounded-md overflow-hidden">
				<Table class="rounded-md overflow-hidden">
					<TableHead class="text-center bg-[#1E40AF] text-white">
						<TableHeadCell>Sumber Dana</TableHeadCell>
						<TableHeadCell>Aksi</TableHeadCell>
					</TableHead>
					<TableBody>
						{#if isLoading == true}
							<STable totalColumn={2} totalRow={dataTable.length} />
						{:else if SumberDana.length === 0}
							<TableBodyRow class="text-center">
								<TableBodyCell colspan="2">No Data ...</TableBodyCell>
							</TableBodyRow>
						{:else}
							{#each SumberDana as item (item.id)}
								<TableBodyRow class="text-center">
									<TableBodyCell tdClass="p-0 m-0">{item.sumberDana}</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0">
										<Button
											class="mr-2 hover:no-underline my-1 px-3 py-1 text-[12px]"
											size="md"
											color="yellow"
											on:click={() => {
												editModal = true;
												editIndex = item.id;
												editValue = item.sumberDana;
											}}>Edit</Button
										>
										<Button
											class="hover:no-underline hover:bg-[#CB2A2A] bg-[#FF3636] px-3 py-1 text-[12px]"
											size="sm"
											on:click={() => {
												deleteModal = true;
												deleteId = item.id;
											}}>Hapus</Button
										>
									</TableBodyCell>
								</TableBodyRow>
							{/each}
						{/if}
					</TableBody>
				</Table>
			</div>
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

	<Modal bind:open={tambahModal} size="xs" autoclose={false} class="w-full">
		<form on:submit|preventDefault={onAdd} class="flex flex-col space-y-6" action="#">
			<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Tambah Sumber Dana</h3>
			<Label class="space-y-2">
				<span>Sumber Dana</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="sumberDana"
					placeholder="Masukkan Sumber Dana"
				/>
				{#if typeof errorMessage.sumberDana !== 'undefined'}
					<Error messageError={errorMessage.sumberDana} typeError="error" />
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
		<form on:submit|preventDefault={onAdd} class="flex flex-col space-y-6" action="#">
			<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Ubah Sumber Dana</h3>
			<Label class="space-y-2">
				<span>Sumber Dana</span>
				<input type="text" name="id" value={editIndex} hidden />
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="sumberDana"
					placeholder="Masukkan Sumber Dana"
					bind:value={editValue}
				/>
				{#if typeof errorMessage.sumberDana !== 'undefined'}
					<Error messageError={errorMessage.sumberDana} typeError="error" />
				{/if}
			</Label>
			{#if !isLoadingAdd}
				<Button type="submit" class="bg-[#1E40AF] hover:bg-[#183593] ">Ubah</Button>
			{/if}
			{#if isLoadingAdd}
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
			<form on:submit|preventDefault={onAdd}>
				<input type="number" name="id" value={deleteId} hidden />
				{#if !isLoadingAdd}
					<Button class="mr-2 bg-[#1E40AF] hover:bg-[#183593]" type="submit">Ya</Button>
				{/if}
				{#if isLoadingAdd}
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
</section>
