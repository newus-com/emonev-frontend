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
		Card,
		Toggle
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import { checkTenant } from '$lib/utils/check';
	import { page } from '$app/stores';
	import { toasts } from '$lib/component/toast/ToastStore';
	import type { ITenant } from '$lib/interface/ITenant';
	import type { ISubDpa } from '$lib/interface/ISubDpa';
	import { Create, Update, List as ListKetSubDpa, One, Delete } from '$lib/api/dpa/ketSubDpa';
	import Pagination from '$lib/component/pagination/Pagination.svelte';
	import Search from '$lib/component/search/Search.svelte';
	import { formatCurrency } from '$lib/utils/rupiah';
	import { One as OneSubDpa } from '$lib/api/dpa/subDpa';
	import STable from '$lib/component/skeleton/STable.svelte';
	import Length from '$lib/component/length/Length.svelte';
	import type { IKetSubDpa } from '$lib/interface/IKetSubDpa';
	import type { ISelect } from '$lib/interface/ISelect';
	import Select2 from '$lib/component/Select2.svelte';
	import { GetListKelompokRekening } from '$lib/forSelect/kelompokRekening';
	import { GetListJenisRekening } from '$lib/forSelect/jenisRekening';
	import { GetListObjekRekening } from '$lib/forSelect/objekRekening';
	import { GetListRincianObjekRekening } from '$lib/forSelect/rincianObjekRekening';
	import { GetListSubRincianObjekRekening } from '$lib/forSelect/subRincianObjekRekening';
	import Error from '$lib/component/Error.svelte';
	import { GetListAkunRekening } from '$lib/forSelect/akunRekening';
	import { GetListSatuan } from '$lib/forSelect/satuan';

	let subBreadcrumb = [
		{
			label: 'Sub Kegiatan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/subKegiatan'
		},
		{
			label: 'Rincian',
			href:
				'/anggaran/dpa/add/' +
				$page.params.dpaId +
				'/rincian/subKegiatan/' +
				$page.params.subDpaId +
				'/rincian'
		}
	];

	let tenant: ITenant = {
		accessToken: '',
		status: '',
		dinas: ''
	};

	let dataTable = {
		search: {
			column: [
				'ket_sub_dpa.id',
				'ket_sub_dpa.satuanId',
				'satuan.satuan',
				'ket_sub_dpa.uraian',
				'ket_sub_dpa.spesifikasi',
				'ket_sub_dpa.koefisien',
				'ket_sub_dpa.harga',
				'ket_sub_dpa.ppn',
				'ket_sub_dpa.jumlah',
				'ket_sub_dpa.subRincianObjekRekeningId',
				'sub_rincian_objek_rekening.kode',
				'sub_rincian_objek_rekening.uraianAkun',

				'sub_rincian_objek_rekening.rincianObjekRekeningId',
				'rincian_objek_rekening.kode',
				'rincian_objek_rekening.uraianAkun',

				'rincian_objek_rekening.objekRekeningId',
				'objek_rekening.kode',
				'objek_rekening.uraianAkun',

				'objek_rekening.jenisRekeningId',
				'jenis_rekening.kode',
				'jenis_rekening.uraianAkun',

				'jenis_rekening.kelompokRekeningId',
				'kelompok_rekening.kode',
				'kelompok_rekening.uraianAkun',

				'kelompok_rekening.akunRekeningId',
				'akun_rekening.kode',
				'akun_rekening.uraianAkun'
			],
			value: ''
		},
		order: [
			{
				column: 'ket_sub_dpa.id',
				dir: 'desc'
			}
		],
		length: 10,
		page: 0,
		subDpaId: '',
		dinasId: ''
	};

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

	let indikator: string;
	let jumlahTerAlokasi: number;

	let KetSubDpa: IKetSubDpa[] = [];
	let KetSubDpaDetail: any = [];
	let withDetail: boolean = true;

	let totalKetSubDpaTerpakai: number = 0;

	let SubDpa: ISubDpa = {
		id: '',
		lokasi: '',
		waktuPelaksanaan: '',
		keterangan: '',
		dpaId: '',
		subKegiatanId: '',
		sumberDanaId: '',
		sumberDana: '',
		jumlahAnggaran: 0,
		subKegiatanKode: '',
		subKegiatanNomenklatur: ''
	};

	let totalPages: number = 1;

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};
		dataTable.subDpaId = $page.params.subDpaId;
		await getKetSubDpa();
		await getSubDpa();

		DataSatuan = await GetListSatuan('');

		DataAkunRekening = await GetListAkunRekening('');
	});

	let DataSatuan: ISelect[] | boolean;
	let DataSatuanSelected: ISelect;

	let DataAkunRekening: ISelect[] | boolean;
	let DataAkunRekeningSelected: ISelect;

	let DataKelompokRekening: ISelect[] | boolean;
	let DataKelompokRekeningSelected: ISelect;

	let DataJenisRekening: ISelect[] | boolean;
	let DataJenisRekeningSelected: ISelect;

	let DataObjekRekening: ISelect[] | boolean;
	let DataObjekRekeningSelected: ISelect;

	let DataRincianObjekRekening: ISelect[] | boolean;
	let DataRincianObjekRekeningSelected: ISelect;

	let DataSubRincianObjekRekening: ISelect[] | boolean;
	let DataSubRincianObjekRekeningSelected: ISelect;

	const handleChangeAkunRekening = async (event: any) => {
		DataKelompokRekening = await GetListKelompokRekening('', event.detail.value.value);
	};

	const handleChangeKelompokRekening = async (event: any) => {
		DataJenisRekening = await GetListJenisRekening('', event.detail.value.value);
	};

	const handleChangeJenisRekening = async (event: any) => {
		DataObjekRekening = await GetListObjekRekening('', event.detail.value.value);
	};

	const handleChangeObjekRekening = async (event: any) => {
		DataRincianObjekRekening = await GetListRincianObjekRekening('', event.detail.value.value);
	};

	const handleChangeRincianObjekRekening = async (event: any) => {
		DataSubRincianObjekRekening = await GetListSubRincianObjekRekening(
			'',
			event.detail.value.value
		);
	};

	let harga: number;
	let formatHarga: string;

	let uraian: string;
	let spesifikasi: string;
	let koefisien: number;
	let ppn: number;

	async function getKetSubDpa() {
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataTable.dinasId = tenant.dinas;
			}
		}
		const dataKetSubDpa = await ListKetSubDpa(dataTable);
		if (dataKetSubDpa.status == 200) {
			KetSubDpa = dataKetSubDpa.data.dataOri.map((item: any) => ({
				id: item.id,
				satuanId: item.satuanId,
				satuan: item.satuan,
				uraian: item.uraian,
				spesifikasi: item.spesifikasi,
				koefisien: item.koefisien,
				harga: item.harga,
				ppn: item.ppn,
				jumlah: item.jumlah,
				subRincianObjekRekeningId: item.subRincianObjekRekeningId,
				subRincianObjekRekeningKode: item.subRincianObjekRekeningKode,
				subRincianObjekRekeningUraian: item.subRincianObjekRekeningUraian
			}));

			KetSubDpaDetail = dataKetSubDpa.data.data;
			totalKetSubDpaTerpakai = dataKetSubDpa.data.totalKetSubDpa;
			if (KetSubDpa.length != 0) {
				totalPages = dataKetSubDpa.data.totalData / dataTable.length;
				if (totalPages <= 1) {
					totalPages = 1;
				} else {
					totalPages = Math.ceil(totalPages);
				}
			}
		} else {
			//notif
			if (typeof dataKetSubDpa.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataKetSubDpa.message,
						timeout: 3000
					}
				]);
			}
		}
		PaginationComponent.updatePagination();
	}

	async function getSubDpa() {
		let dataPost = {
			subDpaId: $page.params.subDpaId,
			dinasId: ''
		};

		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataPost.dinasId = tenant.dinas;
			}
		}
		const dataSubDpa = await OneSubDpa(dataPost);
		if (dataSubDpa.status == 200) {
			SubDpa = {
				id: dataSubDpa.data.id,
				lokasi: dataSubDpa.data.lokasi,
				waktuPelaksanaan: dataSubDpa.data.waktuPelaksanaan,
				keterangan: dataSubDpa.data.keterangan,
				dpaId: dataSubDpa.data.dpaId,
				subKegiatanId: dataSubDpa.data.subKegiatanId,
				sumberDanaId: dataSubDpa.data.sumberDanaId,
				sumberDana: dataSubDpa.data.sumberDana,
				jumlahAnggaran: dataSubDpa.data.jumlahAnggaran,
				subKegiatanKode: dataSubDpa.data.subKegiatanKode,
				subKegiatanNomenklatur: dataSubDpa.data.subKegiatanNomenklatur
			};
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

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		isLoading = true;
		await getKetSubDpa();
		isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		isLoading = true;
		await getKetSubDpa();
		isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		isLoading = true;
		await getKetSubDpa();
		isLoading = false;
	};

	const buttonAdd = async () => {
		errorMessage = {};
		harga = 0;
		formatHarga = '';
		isLoadingAdd = true;
		tambahModal = true;
		isLoadingAdd = false;
	};

	const buttonEdit = async () => {
		errorMessage = {};
		isLoadingEdit = true;
		harga = 0;
		formatHarga = '';
		let dataOne: Record<any, any> = {
			id: editValue.id,
			dinasId: ''
		};

		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataOne.dinasId = tenant.dinas;
			}
		}
		uraian = editValue.uraian;
		spesifikasi = editValue.spesifikasi;
		ppn = editValue.ppn;
		koefisien = editValue.koefisien;

		formatHarga = formatCurrency(editValue.harga);
		harga = editValue.harga;
		const DataRincianBelanja = await One(dataOne);

		if (typeof DataSatuan != 'boolean') {
			for (const d of DataSatuan) {
				if (d.value == DataRincianBelanja.data.satuanId) {
					DataSatuanSelected = {
						value: DataRincianBelanja.data.satuanId,
						label: DataRincianBelanja.data.satuan
					};
				}
			}
		}

		DataAkunRekening = await GetListAkunRekening('');
		if (typeof DataAkunRekening != 'boolean') {
			for (const d of DataAkunRekening) {
				if (d.value == DataRincianBelanja.data.akunRekeningId) {
					DataAkunRekeningSelected = {
						value: DataRincianBelanja.data.akunRekeningId,
						label:
							DataRincianBelanja.data.akunRekeningKode +
							' | ' +
							DataRincianBelanja.data.akunRekeningUraian
					};
				}
			}
		}

		DataKelompokRekening = await GetListKelompokRekening(
			'',
			DataRincianBelanja.data.akunRekeningId
		);
		if (typeof DataKelompokRekening != 'boolean') {
			for (const d of DataKelompokRekening) {
				if (d.value == DataRincianBelanja.data.kelompokRekeningId) {
					DataKelompokRekeningSelected = {
						value: DataRincianBelanja.data.kelompokRekeningId,
						label:
							DataRincianBelanja.data.kelompokRekeningKode +
							' | ' +
							DataRincianBelanja.data.kelompokRekeningUraian
					};
				}
			}
		}

		DataJenisRekening = await GetListJenisRekening('', DataRincianBelanja.data.kelompokRekeningId);
		if (typeof DataJenisRekening != 'boolean') {
			for (const kelompok of DataJenisRekening) {
				if (kelompok.value == DataRincianBelanja.data.jenisRekeningId) {
					DataJenisRekeningSelected = {
						value: DataRincianBelanja.data.jenisRekeningId,
						label:
							DataRincianBelanja.data.jenisRekeningKode +
							' | ' +
							DataRincianBelanja.data.jenisRekeningUraian
					};
				}
			}
		}

		DataObjekRekening = await GetListObjekRekening('', DataRincianBelanja.data.jenisRekeningId);
		if (typeof DataObjekRekening != 'boolean') {
			for (const d of DataObjekRekening) {
				if (d.value == DataRincianBelanja.data.objekRekeningId) {
					DataObjekRekeningSelected = {
						value: DataRincianBelanja.data.objekRekeningId,
						label:
							DataRincianBelanja.data.objekRekeningKode +
							' | ' +
							DataRincianBelanja.data.objekRekeningUraian
					};
				}
			}
		}

		DataRincianObjekRekening = await GetListRincianObjekRekening(
			'',
			DataRincianBelanja.data.objekRekeningId
		);
		if (typeof DataRincianObjekRekening != 'boolean') {
			for (const d of DataRincianObjekRekening) {
				if (d.value == DataRincianBelanja.data.rincianObjekRekeningId) {
					DataRincianObjekRekeningSelected = {
						value: DataRincianBelanja.data.rincianObjekRekeningId,
						label:
							DataRincianBelanja.data.rincianObjekRekeningKode +
							' | ' +
							DataRincianBelanja.data.rincianObjekRekeningUraian
					};
				}
			}
		}

		DataSubRincianObjekRekening = await GetListSubRincianObjekRekening(
			'',
			DataRincianBelanja.data.rincianObjekRekeningId
		);
		if (typeof DataSubRincianObjekRekening != 'boolean') {
			for (const d of DataSubRincianObjekRekening) {
				if (d.value == DataRincianBelanja.data.subRincianObjekRekeningId) {
					DataSubRincianObjekRekeningSelected = {
						value: DataRincianBelanja.data.subRincianObjekRekeningId,
						label:
							DataRincianBelanja.data.subRincianObjekRekeningKode +
							' | ' +
							DataRincianBelanja.data.subRincianObjekRekeningUraian
					};
				}
			}
		}

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
			data['harga'] = harga;
			data['subDpaId'] = $page.params.subDpaId;
			if (tenant.status == '1') {
				if (typeof tenant.dinas != 'undefined') {
					data['dinasId'] = tenant.dinas;
				}
			}
			responses = await Create(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getKetSubDpa();
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

		isLoadingEdit = true;
		let responses: any = {};

		if (editValue) {
			data['id'] = editValue.id;
			data['harga'] = harga;
			data['subDpaId'] = $page.params.subDpaId;
			if (tenant.status == '1') {
				if (typeof tenant.dinas != 'undefined') {
					data['dinasId'] = tenant.dinas;
				}
			}
			responses = await Update(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getKetSubDpa();
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
			responses = await Delete(data);
			if (responses.status >= 200 && responses.status <= 300) {
				isLoading = true;
				await getKetSubDpa();
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

	function handleInputHarga(event: any) {
		harga = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		formatHarga = formatCurrency(harga);
	}
</script>

<div class="flex justify-end content-center mb-2">
	<div>
		<Button
			type="button"
			href="/anggaran/dpa/add/{$page.params.dpaId}/rincian/rencanaPenarikan"
			class="hover:no-underline bg-[#1E40AF] hover:bg-[#183593] px-2 py-1"
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
<BreadCrump breadItems={subBreadcrumb} />
<div class="w-full mb-6">
	<Card class="w-full max-w-full p-2">
		<p class="text-lg font-bold pb-0 mb-0 text-black text-start">
			Total Pagu:
			<span class="text-emerald-800">{formatCurrency(SubDpa.jumlahAnggaran)}</span>
		</p>
		<p class="text-md font-bold pb-0 mb-0 text-black text-start">
			Ter Alokasi:
			<span class="text-emerald-800">{formatCurrency(totalKetSubDpaTerpakai)}</span>
		</p>
		<p class="text-md font-bold pb-0 mb-0 text-black text-start">
			Sisa Alokasi:
			<span class="text-emerald-800"
				>{formatCurrency(SubDpa.jumlahAnggaran - totalKetSubDpaTerpakai)}</span
			>
		</p>
	</Card>
</div>
<div class="">
	<Toggle
		color="blue"
		checked={withDetail}
		on:change={() => {
			withDetail = !withDetail;
		}}>Detail Rekening</Toggle
	>
	<div class="flex justify-between mb-4 mt-6">
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
			<TableHead class="text-center bg-[#1E40AF] text-white border-slate-600" defaultRow={false}>
				<tr>
					<TableHeadCell rowspan="2">Kode Rekening</TableHeadCell>
					<TableHeadCell rowspan="2">Uraian</TableHeadCell>
					<TableHeadCell colspan="4" padding="p-1">Rincian Perhitungan</TableHeadCell>
					<TableHeadCell padding="p-1">Jumlah</TableHeadCell>
					<TableHeadCell rowspan="2">Aksi</TableHeadCell>
				</tr>
				<tr>
					<TableHeadCell padding="p-1">Koefisien</TableHeadCell>
					<TableHeadCell padding="p-1">Satuan</TableHeadCell>
					<TableHeadCell padding="p-1">Harga</TableHeadCell>
					<TableHeadCell padding="p-1">PPN</TableHeadCell>
					<TableHeadCell padding="p-1">(Rp)</TableHeadCell>
				</tr>
			</TableHead>
			<TableBody>
				{#if isLoading == true}
					<STable totalColumn={8} totalRow={dataTable.length} />
				{:else if KetSubDpa.length == 0}
					<TableBodyRow class="text-center">
						<TableBodyCell colspan="8">No Data ...</TableBodyCell>
					</TableBodyRow>
				{:else if withDetail == true}
					{#each KetSubDpaDetail as akun}
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="p-0 m-0">
								<p class="font-bold text-start ml-2">{akun.akunRekeningKode}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0" colspan="5">
								<p class="font-bold text-start ml-2">{akun.akunRekeningUraian}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								<p class="font-bold">{formatCurrency(akun.akunRekeningJumlah)}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0 gap-2" />
						</TableBodyRow>
						{#each akun.kelompok as kelompok}
							<TableBodyRow class="text-center">
								<TableBodyCell tdClass="p-0 m-0">
									<p class="font-bold text-start ml-2">{kelompok.kelompokRekeningKode}</p>
								</TableBodyCell>
								<TableBodyCell tdClass="p-0 m-0" colspan="5">
									<p class="font-bold text-start ml-2">{kelompok.kelompokRekeningUraian}</p>
								</TableBodyCell>
								<TableBodyCell tdClass="p-0 m-0">
									<p class="font-bold">{formatCurrency(kelompok.kelompokRekeningJumlah)}</p>
								</TableBodyCell>
								<TableBodyCell tdClass="p-0 m-0 gap-2" />
							</TableBodyRow>
							{#each kelompok.jenis as jenis}
								<TableBodyRow class="text-center">
									<TableBodyCell tdClass="p-0 m-0">
										<p class="font-bold text-start ml-2">{jenis.jenisRekeningKode}</p>
									</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0" colspan="5">
										<p class="font-bold text-start ml-2">{jenis.jenisRekeningUraian}</p>
									</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0">
										<p class="font-bold">{formatCurrency(jenis.jenisRekeningJumlah)}</p>
									</TableBodyCell>
									<TableBodyCell tdClass="p-0 m-0 gap-2" />
								</TableBodyRow>
								{#each jenis.objek as objek}
									<TableBodyRow class="text-center">
										<TableBodyCell tdClass="p-0 m-0">
											<p class="font-bold text-start ml-2">{objek.objekRekeningKode}</p>
										</TableBodyCell>
										<TableBodyCell tdClass="p-0 m-0" colspan="5">
											<p class="font-bold text-start ml-2">{objek.objekRekeningUraian}</p>
										</TableBodyCell>
										<TableBodyCell tdClass="p-0 m-0">
											<p class="font-bold">{formatCurrency(objek.objekRekeningJumlah)}</p>
										</TableBodyCell>
										<TableBodyCell tdClass="p-0 m-0 gap-2" />
									</TableBodyRow>
									{#each objek.rincianObjek as rincianObjek}
										<TableBodyRow class="text-center">
											<TableBodyCell tdClass="p-0 m-0">
												<p class="font-bold text-start ml-2">
													{rincianObjek.rincianObjekRekeningKode}
												</p>
											</TableBodyCell>
											<TableBodyCell tdClass="p-0 m-0" colspan="5">
												<p class="font-bold text-start ml-2">
													{rincianObjek.rincianObjekRekeningUraian}
												</p>
											</TableBodyCell>
											<TableBodyCell tdClass="p-0 m-0">
												<p class="font-bold">
													{formatCurrency(rincianObjek.rincianObjekRekeningJumlah)}
												</p>
											</TableBodyCell>
											<TableBodyCell tdClass="p-0 m-0 gap-2" />
										</TableBodyRow>
										{#each rincianObjek.subRincianObjek as subRincianObjek}
											<TableBodyRow class="text-center">
												<TableBodyCell tdClass="p-0 m-0">
													<p class="font-bold text-start ml-2">
														{subRincianObjek.subRincianObjekRekeningKode}
													</p>
												</TableBodyCell>
												<TableBodyCell tdClass="p-0 m-0" colspan="5">
													<p class="font-bold text-start ml-2">
														{subRincianObjek.subRincianObjekRekeningUraian}
													</p>
												</TableBodyCell>
												<TableBodyCell tdClass="p-0 m-0">
													<p class="font-bold">
														{formatCurrency(subRincianObjek.subRincianObjekRekeningJumlah)}
													</p>
												</TableBodyCell>
												<TableBodyCell tdClass="p-0 m-0 gap-2" />
											</TableBodyRow>
											{#each subRincianObjek.ket_sub_dpa as ketSubDpa}
												<TableBodyRow class="text-center">
													<TableBodyCell tdClass="p-0 m-0" />
													<TableBodyCell tdClass="p-0 m-0">
														<p class="text-xs p-0 m-0 text-start ml-2">{ketSubDpa.uraian}</p>
														<p class="text-xs p-0 m-0 text-start ml-4">
															Spesifikasi: {ketSubDpa.spesifikasi}
														</p>
													</TableBodyCell>
													<TableBodyCell tdClass="p-0 m-0">
														{ketSubDpa.koefisien}
													</TableBodyCell>
													<TableBodyCell tdClass="p-0 m-0">
														{ketSubDpa.satuan}
													</TableBodyCell>
													<TableBodyCell tdClass="p-0 m-0">
														{formatCurrency(ketSubDpa.harga)}
													</TableBodyCell>
													<TableBodyCell tdClass="p-0 m-0">
														{ketSubDpa.ppn}
													</TableBodyCell>
													<TableBodyCell tdClass="p-0 m-0">
														{formatCurrency(ketSubDpa.jumlah)}
													</TableBodyCell>
													<TableBodyCell tdClass="p-0 m-0 gap-2">
														<Button
															class="hover:no-underline my-1 px-3 py-1 text-[12px]"
															size="md"
															color="yellow"
															on:click={() => {
																editValue = ketSubDpa;
																action = 'edit';
															}}>Edit</Button
														>
														<Button
															class="hover:no-underline hover:bg-[#CB2A2A] bg-[#FF3636] px-3 py-1 text-[12px]"
															size="sm"
															on:click={() => {
																deleteValue = ketSubDpa;
																action = 'delete';
															}}>Hapus</Button
														>
													</TableBodyCell>
												</TableBodyRow>
											{/each}
										{/each}
									{/each}
								{/each}
							{/each}
						{/each}
					{/each}
				{:else}
					{#each KetSubDpa as item (item.id)}
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="p-0 m-0">
								<p class="font-bold text-start ml-2">{item.subRincianObjekRekeningKode}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								<p class="font-bold text-xs italic p-0 m-0 text-start">
									{item.subRincianObjekRekeningUraian}
								</p>
								<p class="text-xs p-0 m-0 text-start ml-2">{item.uraian}</p>
								<p class="text-xs p-0 m-0 text-start ml-4">Spesifikasi: {item.spesifikasi}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								{item.koefisien}
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								{item.satuan}
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								{formatCurrency(item.harga)}
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								{item.ppn}
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								<p class="font-bold">{formatCurrency(item.jumlah)}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0 gap-2">
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
			currentPage={dataTable.page}
			totalPages={1}
			bind:this={PaginationComponent}
			on:currentPage={setPagination}
		/>
	</div>
</div>
<Modal bind:open={tambahModal} size="lg" autoclose={false} class="w-full">
	<form on:submit|preventDefault={onAdd} class="flex flex-col space-y-6" action="#">
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Tambah Rincian Belanja</h3>
		<div class="w-full flex gap-2">
			<div class="w-1/3">
				<Card>
					<Label class="space-y-1 mb-1">
						<span>Akun Rekening</span>
						<Select2
							placeholder="Pilih Akun Rekening"
							name="akunRekeningId"
							data={DataAkunRekening}
							selected={DataAkunRekeningSelected}
							on:Select2Change={handleChangeAkunRekening}
						/>
						{#if typeof errorMessage.akunRekeningId !== 'undefined'}
							<Error messageError={errorMessage.akunRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Kelompok Rekening</span>
						<Select2
							placeholder="Pilih Kelompok Rekening"
							name="kelompokRekeningId"
							data={DataKelompokRekening}
							selected={DataKelompokRekeningSelected}
							on:Select2Change={handleChangeKelompokRekening}
						/>
						{#if typeof errorMessage.kelompokRekeningId !== 'undefined'}
							<Error messageError={errorMessage.kelompokRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Jenis Rekening</span>
						<Select2
							placeholder="Pilih Jenis Rekening"
							name="jenisRekeningId"
							data={DataJenisRekening}
							selected={DataJenisRekeningSelected}
							on:Select2Change={handleChangeJenisRekening}
						/>
						{#if typeof errorMessage.jenisRekeningId !== 'undefined'}
							<Error messageError={errorMessage.jenisRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Objek Rekening</span>
						<Select2
							placeholder="Pilih Objek Rekening"
							name="objekRekeningId"
							data={DataObjekRekening}
							selected={DataObjekRekeningSelected}
							on:Select2Change={handleChangeObjekRekening}
						/>
						{#if typeof errorMessage.objekRekeningId !== 'undefined'}
							<Error messageError={errorMessage.objekRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Rincian Objek Rekening</span>
						<Select2
							placeholder="Pilih Rincian Objek Rekening"
							name="rincianObjekRekeningId"
							data={DataRincianObjekRekening}
							selected={DataRincianObjekRekeningSelected}
							on:Select2Change={handleChangeRincianObjekRekening}
						/>
						{#if typeof errorMessage.rincianObjekRekeningId !== 'undefined'}
							<Error messageError={errorMessage.rincianObjekRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Sub Rincian Objek Rekening</span>
						<Select2
							placeholder="Pilih Sub Rincian Objek Rekening"
							name="subRincianObjekRekeningId"
							data={DataSubRincianObjekRekening}
							selected={DataSubRincianObjekRekeningSelected}
						/>
						{#if typeof errorMessage.subRincianObjekRekeningId !== 'undefined'}
							<Error messageError={errorMessage.subRincianObjekRekeningId} typeError="error" />
						{/if}
					</Label>
				</Card>
			</div>
			<div class="w-2/3">
				<Label class="space-y-1 mb-2">
					<span>Uraian</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="uraian"
						placeholder="Masukan uraian"
					/>
					{#if typeof errorMessage.uraian !== 'undefined'}
						<Error messageError={errorMessage.uraian} typeError="error" />
					{/if}
				</Label>
				<Label class="space-y-1 mb-2">
					<span>Spesifikasi</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="spesifikasi"
						placeholder="Masukan spesifikasi"
					/>
					{#if typeof errorMessage.uraian !== 'undefined'}
						<Error messageError={errorMessage.uraian} typeError="error" />
					{/if}
				</Label>
				<Label class="space-y-1 mb-2">
					<span>Satuan</span>
					<Select2
						placeholder="Pilih Satuan"
						name="satuanId"
						data={DataSatuan}
						selected={DataSatuanSelected}
					/>
					{#if typeof errorMessage.satuanId !== 'undefined'}
						<Error messageError={errorMessage.satuanId} typeError="error" />
					{/if}
				</Label>
				<div class="w-full flex gap-2 items-center">
					<div class="w-6/12">
						<Label class="space-y-1 mb-2">
							<span>Harga</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="harga"
								placeholder="Masukan harga"
								bind:value={formatHarga}
								on:input={handleInputHarga}
							/>
							{#if typeof errorMessage.harga !== 'undefined'}
								<Error messageError={errorMessage.harga} typeError="error" />
							{/if}
						</Label>
					</div>
					<div class="w-2/12">
						<Label class="space-y-1 mb-2">
							<span>Koefisien</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="number"
								name="koefisien"
								placeholder="Masukan koefisien"
							/>
							{#if typeof errorMessage.koefisien !== 'undefined'}
								<Error messageError={errorMessage.koefisien} typeError="error" />
							{/if}
						</Label>
					</div>
					<div class="w-4/12">
						<Label class="space-y-1 mb-2">
							<span>PPN</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="number"
								name="ppn"
								placeholder="Masukan PPN"
							/>
							{#if typeof errorMessage.ppn !== 'undefined'}
								<Error messageError={errorMessage.ppn} typeError="error" />
							{/if}
						</Label>
					</div>
				</div>
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
		<h3 class="mb-2 text-xl font-medium text-gray-900 dark:text-white">Ubah Rincian Belanja</h3>
		<div class="w-full flex gap-2">
			<div class="w-1/3">
				<Card>
					<Label class="space-y-1 mb-1">
						<span>Akun Rekening</span>
						<Select2
							placeholder="Pilih Akun Rekening"
							name="akunRekeningId"
							data={DataAkunRekening}
							selected={DataAkunRekeningSelected}
							on:Select2Change={handleChangeAkunRekening}
						/>
						{#if typeof errorMessage.akunRekeningId !== 'undefined'}
							<Error messageError={errorMessage.akunRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Kelompok Rekening</span>
						<Select2
							placeholder="Pilih Kelompok Rekening"
							name="kelompokRekeningId"
							data={DataKelompokRekening}
							selected={DataKelompokRekeningSelected}
							on:Select2Change={handleChangeKelompokRekening}
						/>
						{#if typeof errorMessage.kelompokRekeningId !== 'undefined'}
							<Error messageError={errorMessage.kelompokRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Jenis Rekening</span>
						<Select2
							placeholder="Pilih Jenis Rekening"
							name="jenisRekeningId"
							data={DataJenisRekening}
							selected={DataJenisRekeningSelected}
							on:Select2Change={handleChangeJenisRekening}
						/>
						{#if typeof errorMessage.jenisRekeningId !== 'undefined'}
							<Error messageError={errorMessage.jenisRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Objek Rekening</span>
						<Select2
							placeholder="Pilih Objek Rekening"
							name="objekRekeningId"
							data={DataObjekRekening}
							selected={DataObjekRekeningSelected}
							on:Select2Change={handleChangeObjekRekening}
						/>
						{#if typeof errorMessage.objekRekeningId !== 'undefined'}
							<Error messageError={errorMessage.objekRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Rincian Objek Rekening</span>
						<Select2
							placeholder="Pilih Rincian Objek Rekening"
							name="rincianObjekRekeningId"
							data={DataRincianObjekRekening}
							selected={DataRincianObjekRekeningSelected}
							on:Select2Change={handleChangeRincianObjekRekening}
						/>
						{#if typeof errorMessage.rincianObjekRekeningId !== 'undefined'}
							<Error messageError={errorMessage.rincianObjekRekeningId} typeError="error" />
						{/if}
					</Label>
					<Label class="space-y-1 mb-1">
						<span>Sub Rincian Objek Rekening</span>
						<Select2
							placeholder="Pilih Sub Rincian Objek Rekening"
							name="subRincianObjekRekeningId"
							data={DataSubRincianObjekRekening}
							selected={DataSubRincianObjekRekeningSelected}
						/>
						{#if typeof errorMessage.subRincianObjekRekeningId !== 'undefined'}
							<Error messageError={errorMessage.subRincianObjekRekeningId} typeError="error" />
						{/if}
					</Label>
				</Card>
			</div>
			<div class="w-2/3">
				<Label class="space-y-1 mb-2">
					<span>Uraian</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="uraian"
						placeholder="Masukan uraian"
						bind:value={uraian}
					/>
					{#if typeof errorMessage.uraian !== 'undefined'}
						<Error messageError={errorMessage.uraian} typeError="error" />
					{/if}
				</Label>
				<Label class="space-y-1 mb-2">
					<span>Spesifikasi</span>
					<Input
						class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
						type="text"
						name="spesifikasi"
						placeholder="Masukan spesifikasi"
						bind:value={spesifikasi}
					/>
					{#if typeof errorMessage.spesifikasi !== 'undefined'}
						<Error messageError={errorMessage.spesifikasi} typeError="error" />
					{/if}
				</Label>
				<Label class="space-y-1 mb-2">
					<span>Satuan</span>
					<Select2
						placeholder="Pilih Satuan"
						name="satuanId"
						data={DataSatuan}
						selected={DataSatuanSelected}
					/>
					{#if typeof errorMessage.satuanId !== 'undefined'}
						<Error messageError={errorMessage.satuanId} typeError="error" />
					{/if}
				</Label>
				<div class="w-full flex gap-2 items-center">
					<div class="w-6/12">
						<Label class="space-y-1 mb-2">
							<span>Harga</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="text"
								name="harga"
								placeholder="Masukan harga"
								bind:value={formatHarga}
								on:input={handleInputHarga}
							/>
							{#if typeof errorMessage.harga !== 'undefined'}
								<Error messageError={errorMessage.harga} typeError="error" />
							{/if}
						</Label>
					</div>
					<div class="w-2/12">
						<Label class="space-y-1 mb-2">
							<span>Koefisien</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="number"
								name="koefisien"
								placeholder="Masukan koefisien"
								bind:value={koefisien}
							/>
							{#if typeof errorMessage.koefisien !== 'undefined'}
								<Error messageError={errorMessage.koefisien} typeError="error" />
							{/if}
						</Label>
					</div>
					<div class="w-4/12">
						<Label class="space-y-1 mb-2">
							<span>PPN</span>
							<Input
								class="focus:ring focus:ring-blue-300 focus:border-blue-500 mb-3 bg-white"
								type="number"
								name="ppn"
								placeholder="Masukan PPN"
								bind:value={ppn}
							/>
							{#if typeof errorMessage.ppn !== 'undefined'}
								<Error messageError={errorMessage.ppn} typeError="error" />
							{/if}
						</Label>
					</div>
				</div>
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
