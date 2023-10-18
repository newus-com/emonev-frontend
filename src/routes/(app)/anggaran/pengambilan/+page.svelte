<script lang="ts">
	import { Icon } from 'flowbite-svelte-icons';
	import {
		TableHeadCell,
		TableBodyCell,
		TableBodyRow,
		MultiSelect,
		TableBody,
		TableHead,
		Indicator,
		Spinner,
		Button,
		Select,
		Input,
		Label,
		Modal,
		Table,
		Card
	} from 'flowbite-svelte';
	import { getContext, onMount } from 'svelte';

	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import { checkTenant } from '$lib/utils/check';
	import type { ISelect } from '$lib/interface/ISelect';
	import Error from '$lib/component/Error.svelte';
	import Select2 from '$lib/component/Select2.svelte';
	import { page } from '$app/stores';
	import type { IDpa } from '$lib/interface/IDpa';
	import { toasts } from '$lib/component/toast/ToastStore';
	import type { ITenant } from '$lib/interface/ITenant';
	import type { ISubDpa } from '$lib/interface/ISubDpa';
	import { goto } from '$app/navigation';
	import { List as ListSubKegiatan } from '$lib/api/perencanaan/subKegiatan';
	import Pagination from '$lib/component/pagination/Pagination.svelte';
	import Search from '$lib/component/search/Search.svelte';
	import type { ISubKegiatan } from '$lib/interface/ISubKegiatan';
	import { GetListSubKegiatan } from '$lib/forSelect/subKegiatan';
	import { formatCurrency } from '$lib/utils/rupiah';
	import { Create, Update, List, Delete } from '$lib/api/dpa/subDpa';
	import STable from '$lib/component/skeleton/STable.svelte';
	import Length from '$lib/component/length/Length.svelte';
	import { GetListSumberDana } from '$lib/forSelect/sumberDana';
	import { layoutStore } from '$lib/store/layout';
	import { GetListTahun } from '$lib/forSelect/tahun';
	import { GetListDinas } from '$lib/forSelect/dinas';

	let SubKegiatan: ISubKegiatan[];

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Rencana Pengambilan', href: '/anggaran/pengambilan' }
	];
	let tenant: ITenant = {
		accessToken: '',
		status: '',
		dinas: ''
	};

	let dataTableSubDpa = {
		search: {
			column: [
				'sub_kegiatan.kode',
				'sub_kegiatan.nomenklatur',
				'sub_kegiatan.kinerja',
				'sub_kegiatan.indikator',
				'sumber_dana.sumberDana',
				'sub_dpa.lokasi'
			],
			value: ''
		},
		order: [
			{
				column: 'sub_dpa.id',
				dir: 'desc'
			}
		],
		length: 0,
		page: 0,
		dpaId: '',
		dinasId: '',
		tahunId: ''
	};

	let PaginationComponent: Pagination;

	let detailPaguModal: boolean = false;

	let isLoading: boolean = false;
	let isLoadingAdd: boolean = false;

	let detailPaguValue: any = null;
	let errorMessage: Record<any, any> = {};

	let indikator: string;
	let SubDpa: any = [];
	let totalPages: number = 1;

	let kegiatanId: string = '';

	let formatBelanjaOperasi: string = '';
	let formatBelanjaModal: string = '';
	let formatBelanjaTidakTerduga: string = '';
	let formatBelanjaTransfer: string = '';

	let pagu: Record<any, any> = {};
	let dataPagu: Record<any, any> = [];

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};
		await getSubDpa();
		await getSubKegiatan();

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
	});

	async function getSubDpa() {
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataTableSubDpa.dinasId = tenant.dinas;
			}
		}
		const dataSubDpa = await List(dataTableSubDpa);
		if (dataSubDpa.status == 200) {
			SubDpa = dataSubDpa.data.data.map((item: any) => {
				kegiatanId = item.kegiatanId;
				dataPagu.push({
					subDpaId: item.id,
					belanjaOperasi: item.detailPagu.belanjaOperasi,
					belanjaModal: item.detailPagu.belanjaModal,
					belanjaTidakTerduga: item.detailPagu.belanjaTidakTerduga,
					belanjaTransfer: item.detailPagu.belanjaTransfer
				});
				return {
					id: item.id,
					lokasi: item.lokasi,
					waktuPelaksanaan: item.waktuPelaksanaan,
					target: item.target,
					keterangan: item.keterangan,
					dpaId: item.dpaId,
					subKegiatanId: item.subKegiatanId,
					sumberDanaId: item.sumberDanaId,
					sumberDana: item.sumberDana,
					jumlahAnggaran: item.jumlahAnggaran,

					terealisasi:
						item.detailPagu.belanjaOperasiRealisasi +
						item.detailPagu.belanjaModalRealisasi +
						item.detailPagu.belanjaTidakTerdugaRealisasi +
						item.detailPagu.belanjaTransferRealisasi,

					subKegiatanKode: item.subKegiatanKode,
					subKegiatanNomenklatur: item.subKegiatanNomenklatur,

					kegiatanKode: item.kegiatanKode,
					kegiatanNomenklatur: item.kegiatanNomenklatur,

					programKode: item.programKode,
					programNomenklatur: item.programNomenklatur,

					dinasName: item.dinasName,
					tahun: item.tahun
				};
			});

			if (SubDpa.length != 0) {
				totalPages = dataSubDpa.data.totalData / dataTableSubDpa.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
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
		PaginationComponent.updatePagination();
	}

	async function getSubKegiatan() {
		let dataTable = {
			search: {
				column: [
					'sub_kegiatan.kode',
					'sub_kegiatan.nomenklatur',
					'sub_kegiatan.kinerja',
					'sub_kegiatan.indikator',
					'satuan.satuan'
				],
				value: ''
			},
			order: [
				{
					column: 'sub_kegiatan.id',
					dir: 'desc'
				}
			],
			length: 10,
			page: 0,
			kegiatanId: kegiatanId
		};
		const dataSubKegiatan = await ListSubKegiatan(dataTable);
		if (dataSubKegiatan.status == 200) {
			SubKegiatan = dataSubKegiatan.data.data.map((item: any) => ({
				id: item.id,
				kode: item.kode,
				nomenklatur: item.nomenklatur,
				kegiatanId: item.kegiatanId,
				satuanId: item.satuanId,
				satuan: item.satuan,
				indikator: item.indikator,
				kinerja: item.kinerja
			}));

			if (SubKegiatan.length != 0) {
				totalPages = dataSubKegiatan.data.totalData / dataTable.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
		} else {
			//notif
			if (typeof dataSubKegiatan.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataSubKegiatan.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	const setSearch = async (event: any) => {
		dataTableSubDpa.search.value = event.detail.searchPage;
		isLoading = true;
		await getSubDpa();
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTableSubDpa.length = event.detail.lengthPage;
		isLoading = true;
		await getSubDpa();
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTableSubDpa.page = event.detail.currentPage;
		isLoading = true;
		await getSubDpa();
		isLoading = false;
	};

	const buttonDetailPagu = async () => {
		errorMessage = {};
		dataPagu.find((data: any) => {
			if (data.subDpaId == detailPaguValue.id) {
				pagu = {
					belanjaOperasi: data.belanjaOperasi,
					belanjaModal: data.belanjaModal,
					belanjaTidakTerduga: data.belanjaTidakTerduga,
					belanjaTransfer: data.belanjaTransfer
				};
			}
		});

		formatBelanjaOperasi = formatCurrency(pagu.belanjaOperasi);
		formatBelanjaModal = formatCurrency(pagu.belanjaModal);
		formatBelanjaTidakTerduga = formatCurrency(pagu.belanjaTidakTerduga);
		formatBelanjaTransfer = formatCurrency(pagu.belanjaTransfer);
		detailPaguModal = true;
	};

	let action: string;

	$: {
		if (action == 'detailPagu') {
			buttonDetailPagu();
			action = '';
		}
	}

	// FILTER
	let DataTahunFilter: ISelect[] | boolean;
	let TahunSelectedFilter: ISelect;

	let DataDinasFilter: ISelect[] | boolean;
	let DinasSelectedFilter: ISelect;

	let showFilter = false;

	const handleTahunSelectFilter = async (event: any) => {
		dataTableSubDpa.tahunId = event.detail.value.value;
	};

	const handleDinasSelectFilter = async (event: any) => {
		dataTableSubDpa.dinasId = event.detail.value.value;
	};

	function handleClickFilter() {
		showFilter = !showFilter;
	}

	const setFilter = async (event: any) => {
		isLoading = true;
		await getSubDpa();
		isLoading = false;
	};
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="font-bold text-xl text-[#1E40AF] mb-2">List Sub Kegiatan</div>
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
						<TableHeadCell>Program / Kegiatan / Sub Kegiatan</TableHeadCell>
						<TableHeadCell>Dinas / Tahun</TableHeadCell>
						<TableHeadCell>Total Pagu</TableHeadCell>
						<TableHeadCell>Status</TableHeadCell>
						<TableHeadCell>Aksi</TableHeadCell>
					</TableHead>
					<TableBody>
						{#if isLoading == true}
							<STable totalColumn={5} totalRow={dataTableSubDpa.length} />
						{:else if SubDpa.length == 0}
							<TableBodyRow class="text-center">
								<TableBodyCell colspan="5">No Data ...</TableBodyCell>
							</TableBodyRow>
						{:else}
							{#each SubDpa as item (item.id)}
								<TableBodyRow class="text-center">
									<TableBodyCell tdClass="p-1 m-0">
										<p class="text-md p-0 m-0 italic text-start">
											{item.programKode} | {item.programNomenklatur}
										</p>
										<p class="text-sm p-0 m-0 italic text-start">
											{item.kegiatanKode} | {item.kegiatanNomenklatur}
										</p>
										<p class="text-xs p-0 m-0 italic text-start">
											{item.subKegiatanKode} | {item.subKegiatanNomenklatur}
										</p>
									</TableBodyCell>
									<TableBodyCell tdClass="p-1 m-0">
										<p class="text-xs p-0 m-0 italic">Dinas: {item.dinasName}</p>
										<p class="text-xs p-0 m-0 italic">Tahun: {item.tahun}</p>
									</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0">
										<div class="flex flex-column content-center justify-center gap-1">
											<p class="text-xs p-0 m-0">{formatCurrency(item.jumlahAnggaran)}</p>
											<Button
												class="hover:no-underline m-0 p-0 text-[8px]"
												size="md"
												color="blue"
												on:click={() => {
													detailPaguValue = item;
													action = 'detailPagu';
												}}
											>
												<svg
													class="w-4 h-4 text-with dark:text-white"
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
														d="M8 9h2v5m-2 0h4M9.408 5.5h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
													/>
												</svg>
											</Button>
										</div>
										<p class="text-xs font-bold p-0 m-0">Terealisasi: {formatCurrency(item.terealisasi)}</p>
									</TableBodyCell>
									<TableBodyCell tdClass="p-1 m-0">
										<p class="text-xs p-0 m-0 font-bold italic">{(item.jumlahAnggaran == item.terealisasi ? "Tercapai": "Tidak Tercapai")}</p>
									</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0">
										<Button
											href="/anggaran/pengambilan/{item.id}/realisasi"
											class="hover:no-underline my-1 px-3 py-1 text-[12px]"
											size="md"
											color="blue"
										>
											Realisasi
										</Button>
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
					currentPage={dataTableSubDpa.page}
					totalPages={1}
					bind:this={PaginationComponent}
					on:currentPage={setPagination}
				/>
			</div>
		</div>
	</div>
</section>

<Modal bind:open={detailPaguModal} size="md" autoclose={false} class="w-full">
	<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Pagu Sub Kegiatan</h3>
	<div class="flex">
		<Label class="space-y-2 w-full">
			<span>Pagu Total: {formatCurrency(detailPaguValue.jumlahAnggaran)}</span>
		</Label>
		<Card class="py-2 px-2.5 w-full">
			<Label class="space-y-2 mb-2">
				<span>Belanja Operasi: {formatBelanjaOperasi}</span>
			</Label>
			<Label class="space-y-2 mb-2">
				<span>Belanja Modal: {formatBelanjaModal}</span>
			</Label>
			<Label class="space-y-2 mb-2">
				<span>Belanja Tidak Terduga: {formatBelanjaTidakTerduga}</span>
			</Label>
			<Label class="space-y-2 mb-2">
				<span>Belanja Transfer: {formatBelanjaTransfer}</span>
			</Label>
		</Card>
	</div>
</Modal>
