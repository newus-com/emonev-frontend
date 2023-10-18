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
			href: ''
		},
		{
			label: 'Tanda Tangan',
			href: ''
		}
	];

	let stepperActive: number = 3;

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
	let errorMessage: Record<any, any> = {};

	interface InputForm {
		[key: string]: {
			belanjaOperasi: number;
			belanjaModal: number;
			belanjaTidakTerduga: number;
			belanjaTransfer: number;
		};
	}

	interface InputFormHandle {
		[key: string]: {
			belanjaOperasi: string;
			belanjaModal: string;
			belanjaTidakTerduga: string;
			belanjaTransfer: string;
		};
	}
	let inputForm: InputForm = {
		Januari: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Februari: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Maret: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		April: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Mei: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Juni: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Juli: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Agustus: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		September: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Oktober: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		November: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		},
		Desember: {
			belanjaOperasi: 0,
			belanjaModal: 0,
			belanjaTidakTerduga: 0,
			belanjaTransfer: 0
		}
	};

	let inputFormHandle: InputFormHandle = {
		Januari: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Februari: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Maret: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		April: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Mei: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Juni: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Juli: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Agustus: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		September: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Oktober: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		November: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		},
		Desember: {
			belanjaOperasi: '',
			belanjaModal: '',
			belanjaTidakTerduga: '',
			belanjaTransfer: ''
		}
	};

	let sumTotal = {
		belanjaOperasi: 0,
		belanjaModal: 0,
		belanjaTidakTerduga: 0,
		belanjaTransfer: 0
	};

	let paguDetail = {
		belanjaOperasi: 0,
		belanjaModal: 0,
		belanjaTidakTerduga: 0,
		belanjaTransfer: 0
	};

	let isLoadingAddOrUpdate: boolean = false;

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};

		await getOneDpa($page.params.dpaId);
		await getRencanaPenarikan($page.params.dpaId);
		await getDetailPagu($page.params.dpaId);
	});

	async function getOneDpa(id: string) {
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
				nomenklatur: dataDpa.data.programKode,
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

	async function getRencanaPenarikan(id: string) {
		let bodyPostRencanaPenarikan = {
			dinasId: '',
			dpaId: id
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				bodyPostRencanaPenarikan.dinasId = tenant.dinas;
			}
		}
		const dataRencanaPenarikan = await ListRencanaPenarikan(bodyPostRencanaPenarikan);
		if (dataRencanaPenarikan.status == 200) {
			for (const data of dataRencanaPenarikan.data) {
				const { bulan, ...rest } = data;
				inputForm[bulan] = { ...rest };
				inputFormHandle[bulan] = {
					belanjaOperasi: formatCurrency(rest.belanjaOperasi),
					belanjaModal: formatCurrency(rest.belanjaModal),
					belanjaTidakTerduga: formatCurrency(rest.belanjaTidakTerduga),
					belanjaTransfer: formatCurrency(rest.belanjaTransfer)
				};
			}
			updateTotal();
		} else {
			//notif
			if (typeof dataRencanaPenarikan.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataRencanaPenarikan.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	async function getDetailPagu(id: string) {
		let bodyPostDetailPagu = {
			dinasId: '',
			dpaId: id
		};
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				bodyPostDetailPagu.dinasId = tenant.dinas;
			}
		}
		const dataDetailPagu = await DetailPagu(bodyPostDetailPagu);
		if (dataDetailPagu.status == 200) {
			paguDetail.belanjaOperasi = dataDetailPagu.data.belanjaOperasi;
			paguDetail.belanjaModal = dataDetailPagu.data.belanjaModal;
			paguDetail.belanjaTidakTerduga = dataDetailPagu.data.belanjaTidakTerduga;
			paguDetail.belanjaTransfer = dataDetailPagu.data.belanjaTransfer;
			updateTotal();
		} else {
			//notif
			if (typeof dataDetailPagu.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataDetailPagu.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	function handleInputRupiahBelanjaOperasi(event: any, bulan: string) {
		inputForm[bulan].belanjaOperasi = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		inputFormHandle[bulan].belanjaOperasi = formatCurrency(inputForm[bulan].belanjaOperasi);
		updateTotal();
	}

	function handleInputRupiahBelanjaModal(event: any, bulan: string) {
		inputForm[bulan].belanjaModal = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		inputFormHandle[bulan].belanjaModal = formatCurrency(inputForm[bulan].belanjaModal);
		updateTotal();
	}

	function handleInputRupiahBelanjaTidakTerduga(event: any, bulan: string) {
		inputForm[bulan].belanjaTidakTerduga = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		inputFormHandle[bulan].belanjaTidakTerduga = formatCurrency(
			inputForm[bulan].belanjaTidakTerduga
		);
		updateTotal();
	}

	function handleInputRupiahBelanjaTransfer(event: any, bulan: string) {
		inputForm[bulan].belanjaTransfer = parseFloat(event.target.value.replace(/\D/g, '')) || 0;
		inputFormHandle[bulan].belanjaTransfer = formatCurrency(inputForm[bulan].belanjaTransfer);
		updateTotal();
	}

	function updateTotal() {
		sumTotal.belanjaOperasi = 0;
		sumTotal.belanjaModal = 0;
		sumTotal.belanjaTidakTerduga = 0;
		sumTotal.belanjaTransfer = 0;
		for (let month in inputForm) {
			if (inputForm.hasOwnProperty(month)) {
				sumTotal.belanjaOperasi += inputForm[month].belanjaOperasi;
				sumTotal.belanjaModal += inputForm[month].belanjaModal;
				sumTotal.belanjaTidakTerduga += inputForm[month].belanjaTidakTerduga;
				sumTotal.belanjaTransfer += inputForm[month].belanjaTransfer;
			}
		}
	}

	async function onAddOrUpdate() {
		let formData = {
			rencanaPenarikan: inputForm,
			dpaId: $page.params.dpaId,
			dinasId: ''
		};

		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				formData.dinasId = tenant.dinas;
			}
		}

		isLoadingAddOrUpdate = true;
		let responses: any = {};
		responses = await CreateOrUpdate(formData);
		if (responses.status >= 200 && responses.status <= 300) {
			toasts.update((toastsList) => [
				...toastsList,
				{
					id: Date.now(),
					typeToast: 'success',
					messageToast: responses.message,
					timeout: 3000
				}
			]);
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
		isLoadingAddOrUpdate = false;
	}

	$: {
		const updateDpa = $layoutStore.updateDpa;

		if (updateDpa == true) {
			getOneDpa($page.params.dpaId);
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
			<div class="flex justify-end content-center mb-2">
				<div>
					<Button
						type="button"
						href="/anggaran/dpa/add/{$page.params.dpaId}/rincian/penggunaAnggaran"
						class="hover:no-underline bg-[#1E40AF] hover:bg-[#183593] px-2 py-1"
					>
						Pengguna Anggaran
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
			<div class="w-full mb-2">
				<Card class="w-full max-w-full p-2">
					<div class="flex flex-row justify-between gap-2 mb-2">
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Operasi:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800">{formatCurrency(paguDetail.belanjaOperasi)}</span>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Ter Alokasi:
								<span class="text-emerald-800">{formatCurrency(sumTotal.belanjaOperasi)}</span>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(paguDetail.belanjaOperasi - sumTotal.belanjaOperasi)}</span
								>
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Modal:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800">{formatCurrency(paguDetail.belanjaModal)}</span>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Ter Alokasi:
								<span class="text-emerald-800">{formatCurrency(sumTotal.belanjaModal)}</span>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(paguDetail.belanjaModal - sumTotal.belanjaModal)}</span
								>
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Tidak Terduga:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(paguDetail.belanjaTidakTerduga)}</span
								>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Ter Alokasi:
								<span class="text-emerald-800">{formatCurrency(sumTotal.belanjaTidakTerduga)}</span>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(
										paguDetail.belanjaTidakTerduga - sumTotal.belanjaTidakTerduga
									)}</span
								>
							</p>
						</div>
						<div class="flex flex-col">
							<p class="text-sm font-bold text-black">Belanja Transfer:</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Alokasi:
								<span class="text-emerald-800">{formatCurrency(paguDetail.belanjaTransfer)}</span>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Ter Alokasi:
								<span class="text-emerald-800">{formatCurrency(sumTotal.belanjaTransfer)}</span>
							</p>
							<p class="text-xs font-bold pb-0 mb-0 text-black ml-2">
								Sisa Alokasi:
								<span class="text-emerald-800"
									>{formatCurrency(paguDetail.belanjaTransfer - sumTotal.belanjaTransfer)}</span
								>
							</p>
						</div>
					</div>
				</Card>
			</div>
			<div class="w-full mb-2">
				<Table class="rounded-md overflow-hidden">
					<TableHead class="text-center bg-[#1E40AF] text-white">
						<TableHeadCell>Bulan</TableHeadCell>
						<TableHeadCell>Belanja Operasi</TableHeadCell>
						<TableHeadCell>Belanja Modal</TableHeadCell>
						<TableHeadCell>Belanja Tidak Terduga</TableHeadCell>
						<TableHeadCell>Belanja Transfer</TableHeadCell>
						<TableHeadCell>Total</TableHeadCell>
					</TableHead>
					<TableBody>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Januari</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Januari.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Januari');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiJanuari !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiJanuari} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Januari.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Januari');
									}}
								/>
								{#if typeof errorMessage.belanjaModalJanuari !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalJanuari} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Januari.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Januari');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaJanuari !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaJanuari} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Januari.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Januari');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferJanuari !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferJanuari} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Januari.belanjaOperasi +
											inputForm.Januari.belanjaModal +
											inputForm.Januari.belanjaTidakTerduga +
											inputForm.Januari.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Februari</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Februari.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Februari');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiFebruari !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiFebruari} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Februari.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Februari');
									}}
								/>
								{#if typeof errorMessage.belanjaModalFebruari !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalFebruari} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Februari.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Februari');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaFebruari !== 'undefined'}
									<Error
										messageError={errorMessage.belanjaTidakTerdugaFebruari}
										typeError="error"
									/>
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Februari.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Februari');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferFebruari !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferFebruari} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Februari.belanjaOperasi +
											inputForm.Februari.belanjaModal +
											inputForm.Februari.belanjaTidakTerduga +
											inputForm.Februari.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Maret</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Maret.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Maret');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiMaret !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiMaret} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Maret.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Maret');
									}}
								/>
								{#if typeof errorMessage.belanjaModalMaret !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalMaret} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Maret.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Maret');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaMaret !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaMaret} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Maret.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Maret');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferMaret !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferMaret} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Maret.belanjaOperasi +
											inputForm.Maret.belanjaModal +
											inputForm.Maret.belanjaTidakTerduga +
											inputForm.Maret.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">April</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.April.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'April');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiApril !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiApril} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.April.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'April');
									}}
								/>
								{#if typeof errorMessage.belanjaModalApril !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalApril} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.April.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'April');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaApril !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaApril} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.April.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'April');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferApril !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferApril} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.April.belanjaOperasi +
											inputForm.April.belanjaModal +
											inputForm.April.belanjaTidakTerduga +
											inputForm.April.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Mei</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Mei.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Mei');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiMei !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiMei} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Mei.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Mei');
									}}
								/>
								{#if typeof errorMessage.belanjaModalMei !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalMei} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Mei.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Mei');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaMei !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaMei} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Mei.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Mei');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferMei !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferMei} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Mei.belanjaOperasi +
											inputForm.Mei.belanjaModal +
											inputForm.Mei.belanjaTidakTerduga +
											inputForm.Mei.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Juni</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Juni.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Juni');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiJuni !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiJuni} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Juni.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Juni');
									}}
								/>
								{#if typeof errorMessage.belanjaModalJuni !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalJuni} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Juni.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Juni');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaJuni !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaJuni} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Juni.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Juni');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferJuni !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferJuni} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Juni.belanjaOperasi +
											inputForm.Juni.belanjaModal +
											inputForm.Juni.belanjaTidakTerduga +
											inputForm.Juni.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Juli</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Juli.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Juli');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiJuli !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiJuli} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Juli.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Juli');
									}}
								/>
								{#if typeof errorMessage.belanjaModalJuli !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalJuli} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Juli.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Juli');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaJuli !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaJuli} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Juli.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Juli');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferJuli !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferJuli} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Juli.belanjaOperasi +
											inputForm.Juli.belanjaModal +
											inputForm.Juli.belanjaTidakTerduga +
											inputForm.Juli.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Agustus</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Agustus.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Agustus');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiAgustus !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiAgustus} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Agustus.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Agustus');
									}}
								/>
								{#if typeof errorMessage.belanjaModalAgustus !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalAgustus} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Agustus.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Agustus');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaAgustus !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaAgustus} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Agustus.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Agustus');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferAgustus !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferAgustus} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Agustus.belanjaOperasi +
											inputForm.Agustus.belanjaModal +
											inputForm.Agustus.belanjaTidakTerduga +
											inputForm.Agustus.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">September</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.September.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'September');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiSeptember !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiSeptember} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.September.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'September');
									}}
								/>
								{#if typeof errorMessage.belanjaModalSeptember !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalSeptember} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.September.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'September');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaSeptember !== 'undefined'}
									<Error
										messageError={errorMessage.belanjaTidakTerdugaSeptember}
										typeError="error"
									/>
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.September.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'September');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferSeptember !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferSeptember} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.September.belanjaOperasi +
											inputForm.September.belanjaModal +
											inputForm.September.belanjaTidakTerduga +
											inputForm.September.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Oktober</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Oktober.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Oktober');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiOktober !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiOktober} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Oktober.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Oktober');
									}}
								/>
								{#if typeof errorMessage.belanjaModalOktober !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalOktober} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Oktober.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Oktober');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaOktober !== 'undefined'}
									<Error messageError={errorMessage.belanjaTidakTerdugaOktober} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Oktober.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Oktober');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferOktober !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferOktober} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Oktober.belanjaOperasi +
											inputForm.Oktober.belanjaModal +
											inputForm.Oktober.belanjaTidakTerduga +
											inputForm.Oktober.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">November</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.November.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'November');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiNovember !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiNovember} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.November.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'November');
									}}
								/>
								{#if typeof errorMessage.belanjaModalNovember !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalNovember} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.November.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'November');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaNovember !== 'undefined'}
									<Error
										messageError={errorMessage.belanjaTidakTerdugaNovember}
										typeError="error"
									/>
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.November.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'November');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferNovember !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferNovember} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.November.belanjaOperasi +
											inputForm.November.belanjaModal +
											inputForm.November.belanjaTidakTerduga +
											inputForm.November.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Desember</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<div class="flex">
									<Input
										class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
										type="text"
										placeholder="Belanja Operasi"
										bind:value={inputFormHandle.Desember.belanjaOperasi}
										on:input={(e) => {
											handleInputRupiahBelanjaOperasi(e, 'Desember');
										}}
									/>
									{#if typeof errorMessage.belanjaOperasiDesember !== 'undefined'}
										<Error messageError={errorMessage.belanjaOperasiDesember} typeError="error" />
									{/if}
								</div>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Modal"
									bind:value={inputFormHandle.Desember.belanjaModal}
									on:input={(e) => {
										handleInputRupiahBelanjaModal(e, 'Desember');
									}}
								/>
								{#if typeof errorMessage.belanjaModalDesember !== 'undefined'}
									<Error messageError={errorMessage.belanjaModalDesember} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Tidak Terduga"
									bind:value={inputFormHandle.Desember.belanjaTidakTerduga}
									on:input={(e) => {
										handleInputRupiahBelanjaTidakTerduga(e, 'Desember');
									}}
								/>
								{#if typeof errorMessage.belanjaTidakTerdugaDesember !== 'undefined'}
									<Error
										messageError={errorMessage.belanjaTidakTerdugaDesember}
										typeError="error"
									/>
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<Input
									class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white"
									type="text"
									placeholder="Belanja Transfer"
									bind:value={inputFormHandle.Desember.belanjaTransfer}
									on:input={(e) => {
										handleInputRupiahBelanjaTransfer(e, 'Desember');
									}}
								/>
								{#if typeof errorMessage.belanjaTransferDesember !== 'undefined'}
									<Error messageError={errorMessage.belanjaTransferDesember} typeError="error" />
								{/if}
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										inputForm.Desember.belanjaOperasi +
											inputForm.Desember.belanjaModal +
											inputForm.Desember.belanjaTidakTerduga +
											inputForm.Desember.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="">
								<p class="align-center font-bold">Total</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">{formatCurrency(sumTotal.belanjaOperasi)}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">{formatCurrency(sumTotal.belanjaModal)}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">{formatCurrency(sumTotal.belanjaTidakTerduga)}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">{formatCurrency(sumTotal.belanjaTransfer)}</p>
							</TableBodyCell>
							<TableBodyCell tdClass="p-1">
								<p class="align-center font-bold">
									{formatCurrency(
										sumTotal.belanjaOperasi +
											sumTotal.belanjaModal +
											sumTotal.belanjaTidakTerduga +
											sumTotal.belanjaTransfer
									)}
								</p>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			</div>
			<div class="flex justify-end mt-2">
				{#if !isLoadingAddOrUpdate}
					<Button type="button" on:click={onAddOrUpdate} class="bg-[#1E40AF] hover:bg-[#183593] "
						>Simpan</Button
					>
				{/if}
				{#if isLoadingAddOrUpdate}
					<ButtonLoading />
				{/if}
			</div>
		</div>
	</div>
</section>
