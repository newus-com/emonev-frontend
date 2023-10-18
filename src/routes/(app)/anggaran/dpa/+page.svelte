<script lang="ts">
	import {
		Button,
		Card,
		Label,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Pagination from '$lib/component/pagination/Pagination.svelte';
	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import { toasts } from '$lib/component/toast/ToastStore';
	import { List } from '$lib/api/dpa/informasi';
	import STable from '$lib/component/skeleton/STable.svelte';
	import Length from '$lib/component/length/Length.svelte';
	import Search from '$lib/component/search/Search.svelte';

	import { checkDinas, checkLogin, checkPermission, checkTenant } from '$lib/utils/check';
	import Cookies from 'js-cookie';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import Select2 from '$lib/component/Select2.svelte';
	import type { ISelect } from '$lib/interface/ISelect';
	import { GetListTahun } from '$lib/forSelect/tahun';
	import { GetListDinas } from '$lib/forSelect/dinas';
	import type { ITenant } from '$lib/interface/ITenant';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let Dinas: string | undefined = Cookies.get('Dinas');

	let PaginationComponent: Pagination;

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Dpa', href: '/anggaran/dpa' }
	];

	let isLoading: boolean = false;

	export let dataTable = {
		search: {
			column: ['dpa.noDpa', 'urusan.nomenklatur'],
			value: ''
		},
		order: [
			{
				column: 'dpa.id',
				dir: 'desc'
			}
		],
		length: 10,
		page: 0,
		tahunId: '',
		dinasId: ''
	};

	interface IDpa {
		id: string;
		name: string;
		noDpa: string;
		tahun: string;
		nomenklatur: string;
	}

	let Dpa: IDpa[] = [];

	let totalPages: number = 1;

	let isLoadingAdd: boolean = false;
	let isLoadingEdit: boolean = false;
	let isLoadingDelete: boolean = false;

	// FILTER
	let DataTahunFilter: ISelect[] | boolean;
	let TahunSelectedFilter: ISelect;

	let DataDinasFilter: ISelect[] | boolean;
	let DinasSelectedFilter: ISelect;

	let showFilter = false;

	const handleTahunSelectFilter = async (event: any) => {
		dataTable.tahunId = event.detail.value.value;
	};

	const handleDinasSelectFilter = async (event: any) => {
		dataTable.dinasId = event.detail.value.value;
	};

	function handleClickFilter() {
		showFilter = !showFilter;
	}

	const setFilter = async (event: any) => {
		isLoading = true;
		await getDpa();
		isLoading = false;
	};

	async function getDpa() {
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataTable.dinasId = tenant.dinas;
			}
		}
		const dataDpa = await List(dataTable).then((v) => {
			if (v.status == 200) {
				Dpa = v.data.data.map((item: any) => ({
					id: item.id,
					noDpa: item.noDpa,
					name: item.name,
					tahun: item.tahun,
					nomenklatur: item.nomenklatur
				}));

				if (Dpa.length != 0) {
					totalPages = v.data.totalData / dataTable.length;
					if (totalPages <= 1) {
						totalPages = 1;
					} else {
						totalPages = Math.ceil(totalPages);
					}
				}
			} else {
				//notif
				if (typeof v.message !== 'undefined') {
					toasts.update((toastsList) => [
						...toastsList,
						{
							id: Date.now(),
							typeToast: 'error',
							messageToast: v.message,
							timeout: 3000
						}
					]);
				}
			}
			PaginationComponent.updatePagination();
		});
	}

	let tenant: ITenant = {
		accessToken: undefined,
		dinas: undefined,
		status: undefined
	};

	onMount(async () => {
		isLoading = true;
		const check: any = checkTenant();
		if (typeof check != 'undefined') {
			tenant.accessToken = check.accessToken;
			tenant.dinas = check.dinas;
			tenant.status = check.status;
		}

		await getDpa();
		DataTahunFilter = await GetListTahun('');
		TahunSelectedFilter = {
			value: '0',
			label: 'Semua Tahun'
		};
		DataTahunFilter.unshift(TahunSelectedFilter);

		DataDinasFilter = await GetListDinas('');
		DinasSelectedFilter = {
			value: '0',
			label: 'Semua Dinas'
		};
		DataDinasFilter.unshift(DinasSelectedFilter);

		isLoading = false;
	});

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		isLoading = true;
		await getDpa();
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		isLoading = true;
		await getDpa();
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		isLoading = true;
		await getDpa();
		isLoading = false;
	};

	const buttonAdd = () => {
		isLoadingAdd = true;
		goto('/anggaran/dpa/add');
		isLoadingAdd = false;
	};

	let permission: string[] = [];

	const cookiePermission = Cookies.get('permission');

	if (typeof cookiePermission !== 'undefined') {
		permission = cookiePermission.split(',');
	}
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="font-bold text-xl text-[#1E40AF] mb-2">List DPA</div>
	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="">
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
							{#if checkPermission('C_DPA', permission)}
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
							{/if}
						</div>
					</div>
				</div>
			</div>
			<div class="my-2 flex {showFilter ? '' : 'hidden'}">
				<Card class="w-full max-w-full p-2">
					<div class="flex flex-col gap-y-2">
						<div class="grid grid-cols-2 gap-2">
							{#if tenant.status == '0'}
								<Label class="space-y-2 mb-2">
									<span>Dinas</span>
									<Select2
										placeholder="Pilih Dinas"
										name="dinasIdFilter"
										data={DataDinasFilter}
										selected={DinasSelectedFilter}
										on:Select2Change={handleDinasSelectFilter}
									/>
								</Label>
							{/if}
							<Label class="space-y-2 mb-2">
								<span>Tahun</span>
								<Select2
									placeholder="Pilih Tahun"
									name="tahunIdFilter"
									data={DataTahunFilter}
									selected={TahunSelectedFilter}
									on:Select2Change={handleTahunSelectFilter}
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
			<div class="rounded-md overflow-hidden border">
				<Table class="rounded-md overflow-hidden">
					<TableHead class="text-center bg-[#1E40AF] text-white">
						<TableHeadCell>Dinas/No DPA</TableHeadCell>
						<TableHeadCell>Tahun</TableHeadCell>
						<TableHeadCell>Urusan</TableHeadCell>
						<TableHeadCell>Aksi</TableHeadCell>
					</TableHead>
					<TableBody>
						{#if checkPermission('R_DPA', permission)}
							{#if isLoading == true}
								<STable totalColumn={4} totalRow={dataTable.length} />
							{:else if Dpa.length === 0}
								<TableBodyRow class="text-center">
									<TableBodyCell colspan="4">No Data ...</TableBodyCell>
								</TableBodyRow>
							{:else}
								{#each Dpa as item (item.id)}
									<TableBodyRow class="text-center">
										<TableBodyCell tdClass="p-0 m-0">
											<p class="text-sm font-bold italic p-0 m-0">{item.noDpa}</p>
											<p class="text-xs p-0 m-0">{item.name}</p>
										</TableBodyCell>
										<TableBodyCell tdClass="p-0 m-0">
											{item.tahun}
										</TableBodyCell>
										<TableBodyCell tdClass="p-0 m-0">
											{item.nomenklatur == null ? '-' : item.nomenklatur}
										</TableBodyCell>
										<TableBodyCell tdClass="p-0 m-0">
											<Button
												href="/anggaran/dpa/add/{item.id}"
												class="hover:no-underline my-1 px-3 py-1 text-[12px]"
												size="md"
												color="blue"
											>
												Detail
											</Button>
										</TableBodyCell>
									</TableBodyRow>
								{/each}
							{/if}
						{:else}
							<TableBodyRow class="text-center">
								<TableBodyCell colspan="4">No Data ...</TableBodyCell>
							</TableBodyRow>
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
</section>
