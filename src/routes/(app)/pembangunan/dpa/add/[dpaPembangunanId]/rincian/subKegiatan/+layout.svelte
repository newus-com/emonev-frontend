<script lang="ts">
	import { Label, Card, Button } from 'flowbite-svelte';
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
	import { List as ListSubKegiatan } from '$lib/api/perencanaan/subKegiatan';
	import type { IUrusan } from '$lib/interface/IUrusan';
	import type { IBidang } from '$lib/interface/IBidang';
	import type { IProgram } from '$lib/interface/IProgram';
	import type { IUnit } from '$lib/interface/IUnit';
	import type { IOrganisasi } from '$lib/interface/IOrganisasi';
	import type { IKegiatan } from '$lib/interface/IKegiatan';
	import type { ISubKegiatan } from '$lib/interface/ISubKegiatan';
	import { formatCurrency } from '$lib/utils/rupiah';
	import { layoutStore } from '$lib/store/layout';
	import { One } from '$lib/api/pembangunan/dpa/informasi';

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'DPA', href: '/pembangunan/dpa' },
		{ label: 'Informasi DPA', href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId },
		{
			label: 'Rincian DPA',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId + '/rincian'
		},
		{
			label: 'Sub Kegiatan',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId + '/rincian/subKegiatan'
		}
	];

	let stepperData: IStepper[] = [
		{
			label: 'Informasi DPA',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId
		},
		{
			label: 'Rincian DPA',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId + '/rincian'
		},
		{
			label: 'Sub Kegiatan',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId + '/rincian/subKegiatan'
		}
	];

	let stepperActive: number = 2;

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

	let Urusan: IUrusan = {
		id: '',
		kode: '',
		nomenklatur: ''
	};

	let Bidang: IBidang = {
		id: '',
		kode: '',
		nomenklatur: '',
		urusanId: ''
	};

	let Program: IProgram = {
		id: '',
		kode: '',
		nomenklatur: '',
		bidangId: ''
	};

	let Kegiatan: IKegiatan = {
		id: '',
		kode: '',
		nomenklatur: '',
		programId: ''
	};

	let Organisasi: IOrganisasi = {
		id: '',
		kode: '',
		nomenklatur: '',
		bidangId: ''
	};

	let Unit: IUnit = {
		id: '',
		kode: '',
		nomenklatur: '',
		organisasiId: ''
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

	let jumlahTerAlokasi: number;

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};

		await getOneDpa();
	});

	async function getOneDpa() {
		let dataPost = {
			dpaPembangunanId: $page.params.dpaPembangunanId,
			dinasId: ''
		};
		
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataPost.dinasId = tenant.dinas;
			}
		}
		const dataDpa = await One(dataPost);
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

			Urusan = {
				id: dataDpa.data.urusanId,
				kode: dataDpa.data.urusanKode,
				nomenklatur: dataDpa.data.urusanNomenklatur
			};

			Bidang = {
				id: dataDpa.data.bidangId,
				kode: dataDpa.data.bidangKode,
				nomenklatur: dataDpa.data.bidangNomenklatur,
				urusanId: dataDpa.data.urusanId
			};

			Program = {
				id: dataDpa.data.programId,
				kode: dataDpa.data.programKode,
				nomenklatur: dataDpa.data.programNomenklatur,
				bidangId: dataDpa.data.bidangId
			};

			Kegiatan = {
				id: dataDpa.data.kegiatanId,
				kode: dataDpa.data.kegiatanKode,
				nomenklatur: dataDpa.data.kegiatanNomenklatur,
				programId: dataDpa.data.programId
			};

			dataTableSubKegiatan.kegiatanId = dataDpa.data.kegiatanId;
			jumlahTerAlokasi = dataDpa.data.jumlahTerAlokasi;

			Organisasi = {
				id: dataDpa.data.organisasiId,
				kode: dataDpa.data.organisasiKode,
				nomenklatur: dataDpa.data.organisasiNomenklatur,
				bidangId: dataDpa.data.bidangId
			};

			Unit = {
				id: dataDpa.data.unitId,
				kode: dataDpa.data.unitKode,
				nomenklatur: dataDpa.data.unitNomenklatur,
				organisasiId: dataDpa.data.organisasiId
			};
			layoutStore.update((store) => {
				store.kegiatanId = Kegiatan.id;
				return store;
			});
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

	$: {
		const updateDpa = $layoutStore.updateDpa;

		if (updateDpa == true) {
			getOneDpa();
			layoutStore.update((store) => {
				store.updateDpa = false;
				return store;
			});
		}
	}
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="">
		<div class="font-bold text-xl text-[#1E40AF] mb-2">Sub Kegiatan</div>

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
					<hr />
					<div class="flex flex-col p-2">
						<p class="text-xs font-bold">
							- Urusan: <span class="italic">{Urusan.kode} | {Urusan.nomenklatur}</span>
						</p>
						<p class="text-xs font-bold ml-2">
							- Bidang: <span class="italic">{Bidang.kode} | {Bidang.nomenklatur}</span>
						</p>
						<p class="text-xs font-bold ml-4">
							- Program: <span class="italic">{Program.kode} | {Program.nomenklatur}</span>
						</p>
						<p class="text-xs font-bold ml-6">
							- Kegiatan: <span class="italic">{Kegiatan.kode} | {Kegiatan.nomenklatur}</span>
						</p>
						<p class="text-xs font-bold ml-4">
							- Organisasi: <span class="italic">{Organisasi.kode} | {Organisasi.nomenklatur}</span>
						</p>
						<p class="text-xs font-bold ml-6">
							- Unit: <span class="italic">{Unit.kode} | {Unit.nomenklatur}</span>
						</p>
					</div>
				</Card>
			</div>
			<slot />
		</div>
	</div>
</section>
