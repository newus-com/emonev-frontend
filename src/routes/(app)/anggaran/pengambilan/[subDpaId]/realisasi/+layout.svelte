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
	import { One as OneSubDpa } from '$lib/api/dpa/subDpa';
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
	import type { ISubDpa } from '$lib/interface/ISubDpa';

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Rencana Pengambilan', href: '/anggaran/pengambilan' },
		{ label: 'Realisasi', href: '/anggaran/pengambilan/' + $page.params.subDpaId + '/realisasi' }
	];

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

		await getSubDpa($page.params.subDpaId);
	});

	let Terealisasi: number = 0;

	let DetailTerealisasi = {
		belanjaOperasiRealisasi: 0,
		belanjaModalRealisasi: 0,
		belanjaTidakTerdugaRealisasi: 0,
		belanjaTransferRealisasi: 0,
		belanjaOperasi: 0,
		belanjaModal: 0,
		belanjaTidakTerduga: 0,
		belanjaTransfer: 0
	};

	async function getSubDpa(id: string) {
		let data = {
			dinasId: '',
			subDpaId: $page.params.subDpaId
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				data.dinasId = tenant.dinas;
			}
		}
		const dataSubDpa = await OneSubDpa(data);
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

			Terealisasi =
				dataSubDpa.data.penarikan.belanjaOperasiRealisasi +
				dataSubDpa.data.penarikan.belanjaModalRealisasi +
				dataSubDpa.data.penarikan.belanjaTidakTerdugaRealisasi +
				dataSubDpa.data.penarikan.belanjaTransferRealisasi;

			DetailTerealisasi = {
				belanjaOperasiRealisasi: dataSubDpa.data.penarikan.belanjaOperasiRealisasi,
				belanjaModalRealisasi: dataSubDpa.data.penarikan.belanjaModalRealisasi,
				belanjaTidakTerdugaRealisasi: dataSubDpa.data.penarikan.belanjaTidakTerdugaRealisasi,
				belanjaTransferRealisasi: dataSubDpa.data.penarikan.belanjaTransferRealisasi,
				belanjaOperasi: dataSubDpa.data.penarikan.belanjaOperasi,
				belanjaModal: dataSubDpa.data.penarikan.belanjaModal,
				belanjaTidakTerduga: dataSubDpa.data.penarikan.belanjaTidakTerduga,
				belanjaTransfer: dataSubDpa.data.penarikan.belanjaTransfer
			};
			Program = {
				id: '',
				kode: dataSubDpa.data.programKode,
				nomenklatur: dataSubDpa.data.programNomenklatur,
				bidangId: ''
			};

			Kegiatan = {
				id: '',
				kode: dataSubDpa.data.kegiatanKode,
				nomenklatur: dataSubDpa.data.kegiatanNomenklatur,
				programId: ''
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

	$: {
		const updateDpa = $layoutStore.updateDpa;

		if (updateDpa == true) {
			getSubDpa($page.params.subDpaId);
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
		<div class="font-bold text-xl text-[#1E40AF] mb-2">Realisasi</div>

		<div class="wrap bg-white p-6 rounded-md shadow-md">
			<div class="w-full mb-2">
				<Card class="w-full max-w-full p-0 mb-2">
					<div class="flex flex-row justify-between gap-2">
						<div class="flex flex-col p-2">
							<p class="text-xs font-bold text-black ml-2">
								- Program: <span class="italic">{Program.kode} | {Program.nomenklatur}</span>
							</p>
							<p class="text-xs font-bold text-black ml-4">
								- Kegiatan: <span class="italic">{Kegiatan.kode} | {Kegiatan.nomenklatur}</span>
							</p>
							<p class="text-xs font-bold text-black ml-6">
								- Sub Kegiatan: <span class="italic"
									>{SubDpa.subKegiatanKode} | {SubDpa.subKegiatanNomenklatur}</span
								>
							</p>
						</div>
						<div class="flex flex-col p-2">
							<p class="text-xs font-bold text-black text-end">
								Pagu: <span class="italic text-emerald-800"
									>{formatCurrency(SubDpa.jumlahAnggaran)}</span
								>
							</p>
							<p class="text-xs font-bold text-black text-end">
								Terealisasi: <span class="italic text-emerald-800"
									>{formatCurrency(Terealisasi)}</span
								>
							</p>
							<p class="text-xs font-bold text-black text-end">
								Persentase: <span class="italic text-emerald-800"
									>{((Terealisasi / SubDpa.jumlahAnggaran) * 100).toFixed(2)} %</span
								>
							</p>
						</div>
					</div>
				</Card>
				<Card class="w-full max-w-full p-2">
					<div class="flex flex-row justify-between gap-2 mb-2">
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Operasi:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaOperasi)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Realisasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaOperasiRealisasi)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(
										DetailTerealisasi.belanjaOperasi - DetailTerealisasi.belanjaOperasiRealisasi
									)}</span
								>
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Modal:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaModal)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Realisasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaModalRealisasi)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(
										DetailTerealisasi.belanjaModal - DetailTerealisasi.belanjaModalRealisasi
									)}</span
								>
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Tidak Terduga:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaTidakTerduga)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Realisasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaTidakTerdugaRealisasi)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(
										DetailTerealisasi.belanjaTidakTerduga -
											DetailTerealisasi.belanjaTidakTerdugaRealisasi
									)}</span
								>
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Transfer:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaTransfer)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Realisasi:
								<span class="text-emerald-800"
									>{formatCurrency(DetailTerealisasi.belanjaTransferRealisasi)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(
										DetailTerealisasi.belanjaTransfer - DetailTerealisasi.belanjaTransferRealisasi
									)}</span
								>
							</p>
						</div>
					</div>
				</Card>
			</div>
			<div class="flex flex-row gap-2">
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Januari"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Januari
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Februari"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Februari
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Maret"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Maret
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/April"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						April
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Mei"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Mei
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Juni"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Juni
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Juli"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Juli
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Agustus"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Agustus
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/September"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						September
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Oktober"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Oktober
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/November"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						November
					</Button>
				</div>
				<div class="">
					<Button
						href="/anggaran/pengambilan/{$page.params.subDpaId}/realisasi/Desember"
						class="hover:no-underline my-1 px-3 py-1 text-[12px]"
						size="sm"
						color="blue"
					>
						Desember
					</Button>
				</div>
			</div>
			<slot />
		</div>
	</div>
</section>
