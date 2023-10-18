<script lang="ts">
	import { onMount } from 'svelte';

	import BreadCrump from '$lib/component/BreadCrump.svelte';

	import { List, Create, Update, Delete } from '$lib/api/dinas';
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
	import type { IDinas } from '$lib/interface/IDinas';
	import Error from '$lib/component/Error.svelte';


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

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Dinas', href: '/master/dinas' }
	];

	export let dataTable = {
		search: {
			column: ['dinas.name', 'dinas.email', 'dinas.noHp', 'dinas.address'],
			value: ''
		},
		order: [
			{
				column: 'dinas.id',
				dir: 'desc'
			}
		],
		length: 10,
		page: 0
	};

	let totalPages: number = 1;

	let Dinas: IDinas[] = [];

	async function getDinas() {
		const dataDinas = await List(dataTable);
		if (dataDinas.status == 200) {
			Dinas = dataDinas.data.data.map((item: any) => ({
				id: item.id,
				name: item.name,
				email: item.email,
				noHp: item.noHp,
				address: item.address,
				logo: item.logo
			}));

			if (Dinas.length != 0) {
				totalPages = dataDinas.data.totalData / dataTable.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
		} else {
			//notif
			if (typeof dataDinas.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataDinas.message,
						timeout: 3000
					}
				]);
			}
		}
		PaginationComponent.updatePagination();
	}

	onMount(async () => {
		isLoading = true;
		await getDinas();
		isLoading = false;
	});

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		isLoading = true;
		await getDinas();
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		isLoading = true;
		await getDinas();
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		isLoading = true;
		await getDinas();
		isLoading = false;
	};

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

	async function onAdd(e: any) {
		const formData = new FormData(e.target);
		let data: Record<string, any> = {};
		for (let field of formData) {
			const [key, value] = field;
			data[key] = value;
		}

		data['logo'] = '-';

		isLoadingAdd = true;
		let responses: any = {};
		if (tambahModal) {
			responses = await Create(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getDinas();
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
			const [key, value] = field;
			data[key] = value;
		}
		data['logo'] = '-';

		isLoadingEdit = true;
		let responses: any = {};

		if (editValue) {
			data['id'] = editValue.id;
			responses = await Update(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getDinas();
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
				await getDinas();
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
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Data Dinas</div>
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
								class="hover:no-underline bg-[#1E40AF] hover:bg-blue-900 hover:text-white-700"
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
						<TableHeadCell>Nama Dinas</TableHeadCell>
						<TableHeadCell>Email</TableHeadCell>
						<TableHeadCell>No HP</TableHeadCell>
						<TableHeadCell>Alamat</TableHeadCell>
						<TableHeadCell>Logo</TableHeadCell>
						<TableHeadCell>Aksi</TableHeadCell>
					</TableHead>
					<TableBody>
						{#if isLoading == true}
							<STable totalColumn={6} totalRow={dataTable.length} />
						{:else if Dinas.length === 0}
							<TableBodyRow class="text-center">
								<TableBodyCell colspan="6">No Data ...</TableBodyCell>
							</TableBodyRow>
						{:else}
							{#each Dinas as item (item.id)}
								<TableBodyRow class="text-center">
									<TableBodyCell tdClass="p-0 m-0">{item.name}</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0">{item.email}</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0">{item.noHp}</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0">{item.address}</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0"><img src={item.logo} alt="LOGO" /></TableBodyCell
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
												action = "delete";
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
			<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Tambah Dinas</h3>
			<Label class="space-y-2">
				<span>Nama Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="name"
					placeholder="Masukkan Nama Dinas"
				/>
				{#if typeof errorMessage.name !== 'undefined'}
					<Error messageError={errorMessage.name} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>Email Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="email"
					name="email"
					placeholder="Masukkan Email Dinas"
				/>
				{#if typeof errorMessage.email !== 'undefined'}
					<Error messageError={errorMessage.email} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>No Telp Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="noHp"
					placeholder="Masukkan No Telp Dinas"
				/>
				{#if typeof errorMessage.noHp !== 'undefined'}
					<Error messageError={errorMessage.noHp} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>Alamat Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="address"
					placeholder="Masukkan Alamat Dinas"
				/>
				{#if typeof errorMessage.address !== 'undefined'}
					<Error messageError={errorMessage.address} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>Logo Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="file"
					name="logo"
					placeholder="Masukkan Logo Dinas"
				/>
				{#if typeof errorMessage.logo !== 'undefined'}
					<Error messageError={errorMessage.logo} typeError="error" />
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
			<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Ubah Dinas</h3>
			<Label class="space-y-2">
				<span>Nama Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="name"
					placeholder="Masukkan Nama Dinas"
					bind:value={editValue.name}
				/>
				{#if typeof errorMessage.name !== 'undefined'}
					<Error messageError={errorMessage.name} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>Email Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="email"
					name="email"
					placeholder="Masukkan Email Dinas"
					bind:value={editValue.email}
					/>
				{#if typeof errorMessage.email !== 'undefined'}
					<Error messageError={errorMessage.email} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>No Telp Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="noHp"
					placeholder="Masukkan No Telp Dinas"
					bind:value={editValue.noHp}
					/>
				{#if typeof errorMessage.noHp !== 'undefined'}
					<Error messageError={errorMessage.noHp} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>Alamat Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="text"
					name="address"
					placeholder="Masukkan Alamat Dinas"
					bind:value={editValue.address}
					/>
				{#if typeof errorMessage.address !== 'undefined'}
					<Error messageError={errorMessage.address} typeError="error" />
				{/if}
			</Label>
			<Label class="space-y-2">
				<span>Logo Dinas</span>
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
					type="file"
					name="logo"
					placeholder="Masukkan Logo Dinas"
					/>
				{#if typeof errorMessage.logo !== 'undefined'}
					<Error messageError={errorMessage.logo} typeError="error" />
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
</section>
