<script lang="ts">
	import {
		Label,
		Card,
		Button,
		Table,
		TableHead,
		TableHeadCell,
		TableBody,
		TableBodyRow,
		TableBodyCell,
		Input
	} from 'flowbite-svelte';
	import { createEventDispatcher, onMount, setContext } from 'svelte';

	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import Stepper from '$lib/component/Stepper.svelte';
	import { checkTenant } from '$lib/utils/check';
	import type { IStepper } from '$lib/interface/IStepper';
	import { page } from '$app/stores';
	import type { IDpa } from '$lib/interface/IDpa';
	import { toasts } from '$lib/component/toast/ToastStore';
	import type { ITenant } from '$lib/interface/ITenant';
	import type { ITahun } from '$lib/interface/ITahun';
	import type { IDinas } from '$lib/interface/IDinas';
	import { One } from '$lib/api/dpa/informasi';
	import { List as ListSubKegiatan } from '$lib/api/perencanaan/subKegiatan';
	import {
		CreateOrUpdate,
		DetailPagu,
		List as ListRencanaPenarikan
	} from '$lib/api/dpa/rencanaPenarikan';
	import type { IUrusan } from '$lib/interface/IUrusan';
	import type { IBidang } from '$lib/interface/IBidang';
	import type { IProgram } from '$lib/interface/IProgram';
	import type { IUnit } from '$lib/interface/IUnit';
	import type { IOrganisasi } from '$lib/interface/IOrganisasi';
	import type { IKegiatan } from '$lib/interface/IKegiatan';
	import type { ISubKegiatan } from '$lib/interface/ISubKegiatan';
	import { formatCurrency } from '$lib/utils/rupiah';
	import { layoutStore } from '$lib/store/layout';
	import Error from '$lib/component/Error.svelte';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import { goto } from '$app/navigation';
	import Search from '$lib/component/search/Search.svelte';
	import STable from '$lib/component/skeleton/STable.svelte';
	import Length from '$lib/component/length/Length.svelte';
	import { List, Update } from '$lib/api/dpa/tandaTangan';

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'DPA', href: '/anggaran/dpa' },
		{ label: 'Informasi DPA', href: '/anggaran/dpa/add/' + $page.params.dpaId },
		{
			label: 'Rincian DPA',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian'
		},
		{
			label: 'Sub Kegiatan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/subKegiatan'
		},
		{
			label: 'Rencana Penarikan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/rencanaPenarikan'
		},
		{
			label: 'Pengguna Anggaran',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/penggunaAnggaran'
		},
		{
			label: 'Tanda Tangan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/tandaTangan	'
		}
	];

	let stepperData: IStepper[] = [
		{
			label: 'Informasi DPA',
			href: '/anggaran/dpa/add/' + $page.params.dpaId
		},
		{
			label: 'Rincian DPA',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian'
		},
		{
			label: 'Sub Kegiatan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/subKegiatan'
		},
		{
			label: 'Rencana Penarikan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/rencanaPenarikan'
		},
		{
			label: 'Pengguna Anggaran',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/penggunaAnggaran'
		},
		{
			label: 'Tanda Tangan',
			href: '/anggaran/dpa/add/' + $page.params.dpaId + '/rincian/tandaTangan'
		}
	];

	let stepperActive: number = 5;

	let DPA: IDpa = {
		id: '',
		noDpa: '',
		tahunId: '',
		dinasId: '',
		jumlahAlokasi: 0,
		kegiatanId: '',
		unitId: '',
		penggunaAnggaran: '',
		ttdDpa: ''
	};

	let Kegiatan: IKegiatan = {
		id: '',
		kode: '',
		nomenklatur: '',
		programId: ''
	};

	let Tahun: ITahun = {
		id: '',
		tahun: '',
		active: null
	};

	let Dinas: IDinas = {
		id: '',
		name: '',
		email: '',
		noHp: '',
		address: '',
		logo: ''
	};

	let tenant: ITenant = {
		accessToken: '',
		status: '',
		dinas: ''
	};

	let dataTableSubKegiatan = {
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
		length: 0,
		page: 0,
		kegiatanId: Kegiatan.id
	};

	let dataTablePenggunaAnggaran = {
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

	let jumlahTerAlokasi: number;

	let isLoading: boolean = false;
	let isLoadingAdd: boolean = false;

	let errorMessage: Record<any, any> = {};

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};
		await getTandaTangan();
		await getOneDpa();
	});

	async function getOneDpa() {
		let data = {
			dinasId: '',
			dpaId: $page.params.dpaId
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				data.dinasId = tenant.dinas;
			}
		}
		const dataDpa = await One(data);
		if (dataDpa.status == 200) {
			DPA = {
				id: dataDpa.data.id,
				noDpa: dataDpa.data.noDpa,
				tahunId: dataDpa.data.tahunId,
				dinasId: dataDpa.data.dinasId,
				jumlahAlokasi: dataDpa.data.jumlahAlokasi,
				kegiatanId: dataDpa.data.kegiatanId,
				unitId: dataDpa.data.unitId,
				penggunaAnggaran: dataDpa.data.penggunaAnggaran,
				ttdDpa: dataDpa.data.ttdDpa
			};

			Tahun = {
				id: dataDpa.data.tahunId,
				tahun: dataDpa.data.tahun,
				active: null
			};

			Dinas.id = dataDpa.data.dinasId;
			Dinas.name = dataDpa.data.name;

			jumlahTerAlokasi = dataDpa.data.jumlahTerAlokasi;
		} else {
			//notif
			if (typeof dataDpa.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataDpa.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	let dataTable = {
		dinasId: '',
		dpaId: ''
	};

	interface typeTandaTangan {
		id: any;
		nama: string;
		nip: string;
		jabatan: string;
	}

	let tandaTangan: typeTandaTangan[] = [];
	let kota: string;
	let tanggal: string;

	async function getTandaTangan() {
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataTable.dinasId = tenant.dinas;
			}
		}
		dataTable.dpaId = $page.params.dpaId;
		const dataTandaTangan = await List(dataTable);
		if (dataTandaTangan.status == 200) {
			if (dataTandaTangan.data.ttdDpa != null) {
				tandaTangan = dataTandaTangan.data.dataTandaTangan;
			}
			kota = dataTandaTangan.data.ttdDpa.kota;
			tanggal = dataTandaTangan.data.ttdDpa.tanggal;
		} else {
			//notif
			if (typeof dataTandaTangan.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataTandaTangan.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	const buttonAdd = () => {
		errorMessage = {};
		isLoadingAdd = true;
		tandaTangan = [
			...tandaTangan,
			{
				id: Date.now(),
				nama: '',
				nip: '',
				jabatan: ''
			}
		];
		isLoadingAdd = false;
	};

	async function onEdit() {
		isLoadingAdd = true;
		let responses: any = {};
		let data: Record<string, any> = {
			dpaId: '',
			tandaTangan: {
				kota: '',
				tanggal: '',
				data: []
			}
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				data.dinasId = tenant.dinas;
			}
		}
		data['dpaId'] = $page.params.dpaId;
		data['tandaTangan'].kota = kota;
		data['tandaTangan'].tanggal = tanggal;
		data['tandaTangan'].data = tandaTangan;

		console.log(data);

		responses = await Update(data);
		if (responses.status >= 200 && responses.status <= 300) {
			isLoading = true;
			toasts.update((toastsList) => [
				...toastsList,
				{
					id: Date.now(),
					typeToast: 'success',
					messageToast: responses.message,
					timeout: 3000
				}
			]);
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
		isLoadingAdd = false;
	}

	const buttonDelete = () => {
		errorMessage = {};
		tandaTangan = tandaTangan.filter((item) => item.id !== deleteValue.id);
	};

	let action: string;

	let deleteValue: any = null;

	$: {
		if (action == 'delete') {
			buttonDelete();
			action = '';
		}
	}
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="">
		<div class="font-bold text-xl text-[#1E40AF] mb-2">Rincian DPA</div>

		<div class="wrap bg-white p-6 rounded-md shadow-md">
			<div class="mb-3">
				<Stepper stepperItems={stepperData} active={stepperActive} />
			</div>
			<div class="w-full mb-2">
				<Label class="mb-2">Informasi DPA</Label>
				<Card class="w-full max-w-full p-2">
					<div class="flex flex-row justify-between gap-2 mb-2">
						<div class="flex flex-col">
							<p class="text-lg font-bold text-black">
								DPA: {DPA.noDpa}
							</p>
							<p class="text-md font-bold pb-0 mb-0 text-black">Dinas: {Dinas.name}</p>
							<p class="text-xs font-bold text-black">
								Tahun: <span class="italic">{Tahun.tahun}</span>
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-lg font-bold pb-0 mb-0 text-black text-end">
								Alokasi:
								<span class="text-emerald-800">{formatCurrency(DPA.jumlahAlokasi)}</span>
							</p>
							<p class="text-md font-bold pb-0 mb-0 text-black text-end">
								Ter Alokasi:
								<span class="text-emerald-800">{formatCurrency(jumlahTerAlokasi)}</span>
							</p>
							<p class="text-md font-bold pb-0 mb-0 text-black text-end">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(DPA.jumlahAlokasi - jumlahTerAlokasi)}</span
								>
							</p>
						</div>
					</div>
				</Card>
			</div>
			<hr class="mb-2" />
			<div class="">
				<div class="flex justify-between mb-4 mt-4">
					<div class="w-full">
						<div class="grid grid-cols-4 gap-1">
							<div class="flex">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Masukan Kota"
									bind:value={kota}
								/>
							</div>
							<div class="flex">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="date"
									placeholder="Masukan Tanggal"
									bind:value={tanggal}
								/>
							</div>
							<div />
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
							<TableHeadCell>Nama</TableHeadCell>
							<TableHeadCell>NIP</TableHeadCell>
							<TableHeadCell>Jabatan</TableHeadCell>
							<TableHeadCell>Aksi</TableHeadCell>
						</TableHead>
						<TableBody>
							{#each tandaTangan as item (item.id)}
								<TableBodyRow class="text-center">
									<TableBodyCell tdClass="p-1">
										<div class="flex">
											<Input
												class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
												type="text"
												placeholder="Masukan Nama"
												bind:value={item.nama}
											/>
										</div>
									</TableBodyCell>
									<TableBodyCell tdClass="p-1">
										<div class="flex">
											<Input
												class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
												type="text"
												placeholder="Masukan NIP"
												bind:value={item.nip}
											/>
										</div>
									</TableBodyCell>
									<TableBodyCell tdClass="p-1">
										<div class="flex">
											<Input
												class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
												type="text"
												placeholder="Masukan Jabatan"
												bind:value={item.jabatan}
											/>
										</div>
									</TableBodyCell>
									<TableBodyCell tdClass="p-1">
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
						</TableBody>
					</Table>
				</div>
			</div>
			<hr class="mb-2" />
			<div class="flex justify-end content-center mb-2">
				{#if !isLoadingAdd}
					<Button type="button" size="sm" on:click={onEdit} class="bg-[#1E40AF] hover:bg-[#183593] "
						>Simpan</Button
					>
				{/if}
				{#if isLoadingAdd}
					<ButtonLoading />
				{/if}
			</div>
		</div>
	</div>
</section>
