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

	let subBreadcrumb = [
		{
			label: 'Sub Kegiatan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/subKegiatan'
		}
	];

	let SubKegiatan: ISubKegiatan[];

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
		dpaId: $page.params.dpaId,
		dinasId: ''
	};

	let PaginationComponent: Pagination;

	let editModal: boolean = false;
	let tambahModal: boolean = false;
	let deleteModal: boolean = false;
	let detailPaguModal: boolean = false;

	let isLoading: boolean = false;
	let isLoadingAdd: boolean = false;
	let isLoadingEdit: boolean = false;
	let isLoadingDelete: boolean = false;

	let detailPaguValue: any = null;
	let editValue: any = null;
	let deleteValue: any = null;
	let errorMessage: Record<any, any> = {};

	let indikator: string;
	let SubDpa: ISubDpa[] = [];
	let totalPages: number = 1;

	let SelectSubKegiatan: ISelect[] | boolean;
	let SelectSubKegiatanSelected: ISelect;
	const handleChangeSubKegiatan = async (event: any) => {
		SubKegiatan.find((v: any) => {
			if (v.id == event.detail.value.value) {
				indikator = v.indikator;
			}
		});
	};

	let kegiatanId: string = '';

	let SelectSumberDana: ISelect[] | boolean;
	let SelectSumberDanaSelected: ISelect;

	let formatBelanjaOperasi: string = '';
	let formatBelanjaModal: string = '';
	let formatBelanjaTidakTerduga: string = '';
	let formatBelanjaTransfer: string = '';

	let pagu: Record<any, any> = {};
	let dataPagu: Record<any, any> = [];

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

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};

		layoutStore.update((store) => {
			store.updateDpa = true;
			return store;
		});
		kegiatanId = $layoutStore.kegiatanId;

		await getSubDpa();
		await getSubKegiatan();
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
					subKegiatanKode: item.subKegiatanKode,
					subKegiatanNomenklatur: item.subKegiatanNomenklatur
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
			kegiatanId: $layoutStore.kegiatanId
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

	const buttonAdd = async () => {
		errorMessage = {};
		pagu = {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		};
		isLoadingAdd = true;
		SelectSubKegiatan = await GetListSubKegiatan('', kegiatanId);
		SelectSubKegiatanSelected = {
			label: 'Pilih Sub Kegiatan',
			value: '0'
		};

		SelectSumberDana = await GetListSumberDana('');
		SelectSumberDanaSelected = {
			label: 'Pilih Sumber Dana',
			value: '0'
		};

		tambahModal = true;
		isLoadingAdd = false;
	};

	const buttonEdit = async () => {
		errorMessage = {};
		isLoadingEdit = true;

		SelectSubKegiatan = await GetListSubKegiatan('', kegiatanId);
		for (const itemSubKegitan of SelectSubKegiatan) {
			if (editValue.subKegiatanId == itemSubKegitan.value) {
				SelectSubKegiatanSelected = itemSubKegitan;
				break;
			}
		}

		SubKegiatan.find((v: any) => {
			if (v.id == editValue.subKegiatanId) {
				indikator = v.indikator;
			}
		});

		SelectSumberDana = await GetListSumberDana('');
		for (const item of SelectSumberDana) {
			if (editValue.sumberDanaId == item.value) {
				SelectSumberDanaSelected = item;
				break;
			}
		}

		dataPagu.find((data: any) => {
			if (data.subDpaId == editValue.id) {
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

		editModal = true;
		isLoadingEdit = false;
	};

	const buttonDelete = () => {
		isLoadingDelete = true;
		deleteModal = true;
		isLoadingDelete = false;
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

		data['dpaId'] = $page.params.dpaId;
		data['belanjaOperasi'] = pagu.belanjaOperasi;
		data['belanjaModal'] = pagu.belanjaModal;
		data['belanjaTidakTerduga'] = pagu.belanjaTidakTerduga;
		data['belanjaTransfer'] = pagu.belanjaTransfer;

		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				data['dinasId'] = tenant.dinas;
			}
		}

		isLoadingAdd = true;
		let responses: any = {};
		if (tambahModal) {
			responses = await Create(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				layoutStore.update((store) => {
					store.updateDpa = true;
					return store;
				});
				await getSubDpa();
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

		data['dpaId'] = $page.params.dpaId;
		data['belanjaOperasi'] = pagu.belanjaOperasi;
		data['belanjaModal'] = pagu.belanjaModal;
		data['belanjaTidakTerduga'] = pagu.belanjaTidakTerduga;
		data['belanjaTransfer'] = pagu.belanjaTransfer;
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				data['dinasId'] = tenant.dinas;
			}
		}
		isLoadingEdit = true;
		let responses: any = {};
		if (editModal) {
			data['id'] = editValue.id;
			responses = await Update(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				layoutStore.update((store) => {
					store.updateDpa = true;
					return store;
				});
				await getSubDpa();
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
			if (tenant.status == '1') {
				if (typeof tenant.dinas != 'undefined') {
					data['dinasId'] = tenant.dinas;
				}
			}
			responses = await Delete(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				layoutStore.update((store) => {
					store.updateDpa = true;
					return store;
				});
				await getSubDpa();
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
		} else if (action == 'detailPagu') {
			buttonDetailPagu();
			action = '';
		}
	}
</script>

<div class="flex justify-end content-center mb-2">
	<div>
		<Button
			type="button"
			href="/anggaran/dpa/add/{$page.params.dpaId}/rincian/rencanaPenarikan"
			class="hover:no-underline bg-[#1E40AF] hover:bg-[#183593] px-2 py-1 "
		>
			Rencana Penarikan
			<svg
				class="w-3 h-3 text-white dark:text-white ml-1"
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
	</div>
</div>
<hr class="mb-2" />
<!-- <BreadCrump breadItems={subBreadcrumb} /> -->
<div class="">
	<div class="flex justify-between mb-4 mt-4">
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
	<div class="rounded-md overflow-hidden border">
		<Table class="rounded-md overflow-hidden">
			<TableHead class="text-center bg-[#1E40AF] text-white">
				<TableHeadCell>Sub Kegiatan / Sumber Dana / Lokasi</TableHeadCell>
				<TableHeadCell>Total Pagu</TableHeadCell>
				<TableHeadCell>Aksi</TableHeadCell>
			</TableHead>
			<TableBody>
				{#if isLoading == true}
					<STable totalColumn={3} totalRow={dataTableSubDpa.length} />
				{:else if SubDpa.length == 0}
					<TableBodyRow class="text-center">
						<TableBodyCell colspan="3">No Data ...</TableBodyCell>
					</TableBodyRow>
				{:else}
					{#each SubDpa as item (item.id)}
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="p-0 m-0">
								<p class="text-sm font-bold italic p-0 m-0">
									{item.subKegiatanKode} | {item.subKegiatanNomenklatur}
								</p>
								<p class="text-xs p-0 m-0">{item.sumberDana}</p>
								<p class="text-xs p-0 m-0">{item.lokasi}</p>
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
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0 gap-2">
								<!-- <Button
									class="hover:no-underline my-1 px-3 py-1 text-[12px]"
									size="md"
									color="blue"
									on:click={() => {
										goto(
											'/anggaran/dpa/add/' +
												$page.params.dpaId +
												'/rincian/subKegiatan/' +
												item.id +
												'/rincian'
										);
									}}
								>
									Rincian Belanja
								</Button> -->
								<Button
									class="hover:no-underline my-1 px-3 py-1 text-[12px]"
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
			currentPage={dataTableSubDpa.page}
			totalPages={1}
			bind:this={PaginationComponent}
			on:currentPage={setPagination}
		/>
	</div>
</div>
<Modal bind:open={tambahModal} size="lg" autoclose={false} class="w-full">
	<form on:submit|preventDefault={onAdd} class="flex flex-col space-y-6" action="#">
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Tambah Sub Kegiatan</h3>
		<div class="flex flex-column gap-2">
			<div class="w-2/3">
				<Label class="space-y-2 mb-2">
					<span>Sub Kegiatan</span>
					<Select2
						placeholder="Pilih Sub Kegiatan"
						name="subKegiatanId"
						data={SelectSubKegiatan}
						selected={SelectSubKegiatanSelected}
						on:Select2Change={handleChangeSubKegiatan}
					/>
					{#if typeof errorMessage.subKegiatanId !== 'undefined'}
						<Error messageError={errorMessage.subKegiatanId} typeError="error" />
					{/if}
				</Label>
				<div class="flex flex-column gap-2 mb-2">
					<div class="w-1/3">
						<Label class="space-y-2">
							<span>Sumber Dana</span>
							<Select2
								placeholder="Pilih Sumber Dana"
								name="sumberDanaId"
								data={SelectSumberDana}
								selected={SelectSumberDanaSelected}
							/>
							{#if typeof errorMessage.sumberDanaId !== 'undefined'}
								<Error messageError={errorMessage.sumberDanaId} typeError="error" />
							{/if}
						</Label>
					</div>
					<div class="w-2/3">
						<Label class="space-y-2">
							<span>Lokasi</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="lokasi"
								placeholder="Masukkan Lokasi"
							/>
							{#if typeof errorMessage.lokasi !== 'undefined'}
								<Error messageError={errorMessage.lokasi} typeError="error" />
							{/if}
						</Label>
					</div>
				</div>
				<div class="flex flex-column gap-2 mb-2">
					<div class="w-2/3">
						<Label class="space-y-2">
							<span>Indikator</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								placeholder="Pilih Sub Kegiatan"
								disabled={true}
								bind:value={indikator}
							/>
						</Label>
					</div>
					<div class="w-1/3">
						<Label class="space-y-2">
							<span>Target</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="number"
								name="target"
								placeholder="Masukkan Target"
							/>
							{#if typeof errorMessage.target !== 'undefined'}
								<Error messageError={errorMessage.target} typeError="error" />
							{/if}
						</Label>
					</div>
				</div>
				<Label class="space-y-2 mb-2">
					<span>Waktu Pelaksanaan</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="waktuPelaksanaan"
						placeholder="Masukan Waktu Pelaksanaan"
					/>
					{#if typeof errorMessage.waktuPelaksanaan !== 'undefined'}
						<Error messageError={errorMessage.waktuPelaksanaan} typeError="error" />
					{/if}
				</Label>
				<Label class="space-y-2 mb-2">
					<span>Keterangan</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="keterangan"
						placeholder="Masukan Keterangan"
					/>
					{#if typeof errorMessage.keterangan !== 'undefined'}
						<Error messageError={errorMessage.keterangan} typeError="error" />
					{/if}
				</Label>
			</div>
			<div class="w-1/3">
				<Label class="space-y-2">
					<span>Pagu</span>
					<Card class="py-2 px-2.5">
						<Label class="space-y-2 mb-2">
							<span>Belanja Operasi</span>
							<small>Kode Rekening (5.1)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaOperasi"
								placeholder="Masukan Belanja Operasi"
								bind:value={formatBelanjaOperasi}
								on:input={handleInputBelanjaOperasi}
							/>
							{#if typeof errorMessage.belanjaOperasi !== 'undefined'}
								<Error messageError={errorMessage.belanjaOperasi} typeError="error" />
							{/if}
						</Label>
						<Label class="space-y-2 mb-2">
							<span>Belanja Modal</span>
							<small>Kode Rekening (5.2)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaModal"
								placeholder="Masukan Belanja Modal"
								bind:value={formatBelanjaModal}
								on:input={handleInputBelanjaModal}
							/>
							{#if typeof errorMessage.belanjaModal !== 'undefined'}
								<Error messageError={errorMessage.belanjaModal} typeError="error" />
							{/if}
						</Label>
						<Label class="space-y-2 mb-2">
							<span>Belanja Tidak Terduga</span>
							<small>Kode Rekening (5.3)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaTidakTerduga"
								placeholder="Masukan Belanja Tidak Terduga"
								bind:value={formatBelanjaTidakTerduga}
								on:input={handleInputBelanjaTidakTerduga}
							/>
							{#if typeof errorMessage.belanjaTidakTerduga !== 'undefined'}
								<Error messageError={errorMessage.belanjaTidakTerduga} typeError="error" />
							{/if}
						</Label>
						<Label class="space-y-2 mb-2">
							<span>Belanja Transfer</span>
							<small>Kode Rekening (5.4)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaTransfer"
								placeholder="Masukan Belanja Transfer"
								bind:value={formatBelanjaTransfer}
								on:input={handleInputBelanjaTransfer}
							/>
							{#if typeof errorMessage.belanjaTransfer !== 'undefined'}
								<Error messageError={errorMessage.belanjaTransfer} typeError="error" />
							{/if}
						</Label>
					</Card>
				</Label>
			</div>
		</div>

		{#if !isLoadingAdd}
			<Button type="submit" class="bg-[#1E40AF] hover:bg-[#183593] ">Tambah</Button>
		{/if}
		{#if isLoadingAdd}
			<ButtonLoading />
		{/if}
	</form>
</Modal>

<Modal bind:open={editModal} size="lg" autoclose={false} class="w-full">
	<form on:submit|preventDefault={onEdit} class="flex flex-col space-y-6" action="#">
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Ubah Sub Kegiatan</h3>
		<div class="flex flex-column gap-2">
			<div class="w-2/3">
				<Label class="space-y-2 mb-2">
					<span>Sub Kegiatan</span>
					<Select2
						placeholder="Pilih Sub Kegiatan"
						name="subKegiatanId"
						data={SelectSubKegiatan}
						selected={SelectSubKegiatanSelected}
						on:Select2Change={handleChangeSubKegiatan}
					/>
					{#if typeof errorMessage.subKegiatanId !== 'undefined'}
						<Error messageError={errorMessage.subKegiatanId} typeError="error" />
					{/if}
				</Label>
				<div class="flex flex-column gap-2 mb-2">
					<div class="w-1/3">
						<Label class="space-y-2">
							<span>Sumber Dana</span>
							<Select2
								placeholder="Pilih Sumber Dana"
								name="sumberDanaId"
								data={SelectSumberDana}
								selected={SelectSumberDanaSelected}
							/>
							{#if typeof errorMessage.sumberDanaId !== 'undefined'}
								<Error messageError={errorMessage.sumberDanaId} typeError="error" />
							{/if}
						</Label>
					</div>
					<div class="w-2/3">
						<Label class="space-y-2">
							<span>Lokasi</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="lokasi"
								placeholder="Masukkan Lokasi"
								bind:value={editValue.lokasi}
							/>
							{#if typeof errorMessage.lokasi !== 'undefined'}
								<Error messageError={errorMessage.lokasi} typeError="error" />
							{/if}
						</Label>
					</div>
				</div>
				<div class="flex flex-column gap-2 mb-2">
					<div class="w-2/3">
						<Label class="space-y-2">
							<span>Indikator</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								placeholder="Pilih Sub Kegiatan"
								disabled={true}
								bind:value={indikator}
							/>
						</Label>
					</div>
					<div class="w-1/3">
						<Label class="space-y-2">
							<span>Target</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="number"
								name="target"
								placeholder="Masukkan Target"
								bind:value={editValue.target}
							/>
							{#if typeof errorMessage.target !== 'undefined'}
								<Error messageError={errorMessage.target} typeError="error" />
							{/if}
						</Label>
					</div>
				</div>
				<Label class="space-y-2 mb-2">
					<span>Waktu Pelaksanaan</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="waktuPelaksanaan"
						placeholder="Masukan Waktu Pelaksanaan"
						bind:value={editValue.waktuPelaksanaan}
					/>
					{#if typeof errorMessage.waktuPelaksanaan !== 'undefined'}
						<Error messageError={errorMessage.waktuPelaksanaan} typeError="error" />
					{/if}
				</Label>
				<Label class="space-y-2 mb-2">
					<span>Keterangan</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="keterangan"
						placeholder="Masukan Keterangan"
						bind:value={editValue.keterangan}
					/>
					{#if typeof errorMessage.keterangan !== 'undefined'}
						<Error messageError={errorMessage.keterangan} typeError="error" />
					{/if}
				</Label>
			</div>
			<div class="w-1/3">
				<Label class="space-y-2">
					<span>Pagu</span>
					<Card class="py-2 px-2.5">
						<Label class="space-y-2 mb-2">
							<span>Belanja Operasi</span>
							<small>Kode Rekening (5.1)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaOperasi"
								placeholder="Masukan Belanja Operasi"
								bind:value={formatBelanjaOperasi}
								on:input={handleInputBelanjaOperasi}
							/>
							{#if typeof errorMessage.belanjaOperasi !== 'undefined'}
								<Error messageError={errorMessage.belanjaOperasi} typeError="error" />
							{/if}
						</Label>
						<Label class="space-y-2 mb-2">
							<span>Belanja Modal</span>
							<small>Kode Rekening (5.2)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaModal"
								placeholder="Masukan Belanja Modal"
								bind:value={formatBelanjaModal}
								on:input={handleInputBelanjaModal}
							/>
							{#if typeof errorMessage.belanjaModal !== 'undefined'}
								<Error messageError={errorMessage.belanjaModal} typeError="error" />
							{/if}
						</Label>
						<Label class="space-y-2 mb-2">
							<span>Belanja Tidak Terduga</span>
							<small>Kode Rekening (5.3)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaTidakTerduga"
								placeholder="Masukan Belanja Tidak Terduga"
								bind:value={formatBelanjaTidakTerduga}
								on:input={handleInputBelanjaTidakTerduga}
							/>
							{#if typeof errorMessage.belanjaTidakTerduga !== 'undefined'}
								<Error messageError={errorMessage.belanjaTidakTerduga} typeError="error" />
							{/if}
						</Label>
						<Label class="space-y-2 mb-2">
							<span>Belanja Transfer</span>
							<small>Kode Rekening (5.4)</small>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="belanjaTransfer"
								placeholder="Masukan Belanja Transfer"
								bind:value={formatBelanjaTransfer}
								on:input={handleInputBelanjaTransfer}
							/>
							{#if typeof errorMessage.belanjaTransfer !== 'undefined'}
								<Error messageError={errorMessage.belanjaTransfer} typeError="error" />
							{/if}
						</Label>
					</Card>
				</Label>
			</div>
		</div>

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
