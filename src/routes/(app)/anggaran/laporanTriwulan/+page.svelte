<script lang="ts">
	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import type { ISelect } from '$lib/interface/ISelect';
	import {
		Button,
		Card,
		Label,
		Table,
		TableBody,
		TableHeadCell,
		TableBodyRow,
		TableBodyCell
	} from 'flowbite-svelte';
	import Select2 from '$lib/component/Select2.svelte';
	import { onMount } from 'svelte';
	import { checkTenant } from '$lib/utils/check';
	import type { ITenant } from '$lib/interface/ITenant';
	import { List } from '$lib/api/dpa/subDpa';
	import type { ISubDpa } from '$lib/interface/ISubDpa';
	import { toasts } from '$lib/component/toast/ToastStore';
	import { formatCurrency } from '$lib/utils/rupiah';
	import { GetListTahun } from '$lib/forSelect/tahun';
	import { GetListDinas } from '$lib/forSelect/dinas';

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'Laporan', href: '/anggaran/laporan' }
	];

	// FILTER
	let DataTahunFilter: ISelect[] | boolean;
	let TahunSelectedFilter: ISelect;

	let DataDinasFilter: ISelect[] | boolean;
	let DinasSelectedFilter: ISelect;

	let showFilter = false;

	let isLoading: boolean = false;

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

	let SubDpa: any = [];

	let SubDpaTree: any = [];

	onMount(async () => {
		isLoading = true;
		const check: any = checkTenant();
		if (typeof check != 'undefined') {
			tenant.accessToken = check.accessToken;
			tenant.dinas = check.dinas;
			tenant.status = check.status;
		}

		await getSubDpa();
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
			// SubDpa = dataSubDpa.data.data.map((item: any) => {
			// 	return {
			// 		id: item.id,
			// 		lokasi: item.lokasi,
			// 		waktuPelaksanaan: item.waktuPelaksanaan,
			// 		target: item.target,
			// 		keterangan: item.keterangan,
			// 		dpaId: item.dpaId,
			// 		subKegiatanId: item.subKegiatanId,
			// 		sumberDanaId: item.sumberDanaId,
			// 		sumberDana: item.sumberDana,
			// 		jumlahAnggaran: item.jumlahAnggaran,
			// 		subKegiatanKode: item.subKegiatanKode,
			// 		subKegiatanNomenklatur: item.subKegiatanNomenklatur,
			// 		pagu: {
			// 			belanjaOperasi: item.detailPagu.belanjaOperasi,
			// 			belanjaModal: item.detailPagu.belanjaModal,
			// 			belanjaTidakTerduga: item.detailPagu.belanjaTidakTerduga,
			// 			belanjaTransfer: item.detailPagu.belanjaTransfer
			// 		},
			// 		paguRealisasi: {
			// 			belanjaOperasi: item.detailPagu.belanjaOperasiRealisasi,
			// 			belanjaModal: item.detailPagu.belanjaModalRealisasi,
			// 			belanjaTidakTerduga: item.detailPagu.belanjaTidakTerdugaRealisasi,
			// 			belanjaTransfer: item.detailPagu.belanjaTransferRealisasi
			// 		}
			// 	};
			// });

			SubDpaTree = dataSubDpa.data.dataTree;
			total = {
				belanjaOperasi: dataSubDpa.data.dataTotal.pagu.belanjaOperasi,
				belanjaModal: dataSubDpa.data.dataTotal.pagu.belanjaModal,
				belanjaTidakTerduga: dataSubDpa.data.dataTotal.pagu.belanjaTidakTerduga,
				belanjaTransfer: dataSubDpa.data.dataTotal.pagu.belanjaTransfer,
				belanjaOperasiRealisasi: dataSubDpa.data.dataTotal.paguRealisasi.belanjaOperasiRealisasi,
				belanjaModalRealisasi: dataSubDpa.data.dataTotal.paguRealisasi.belanjaModalRealisasi,
				belanjaTidakTerdugaRealisasi:
					dataSubDpa.data.dataTotal.paguRealisasi.belanjaTidakTerdugaRealisasi,
				belanjaTransferRealisasi: dataSubDpa.data.dataTotal.paguRealisasi.belanjaTransferRealisasi
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

	let total = {
		belanjaOperasi: 0,
		belanjaModal: 0,
		belanjaTidakTerduga: 0,
		belanjaTransfer: 0,
		belanjaOperasiRealisasi: 0,
		belanjaModalRealisasi: 0,
		belanjaTidakTerdugaRealisasi: 0,
		belanjaTransferRealisasi: 0
	};

	function persen(first: number, second: number) {
		if (first === 0 || second === 0) {
			return 0;
		}
		return ((second / first) * 100).toFixed(2);
	}
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="font-bold text-xl text-[#1E40AF] mb-2">List DPA</div>
	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="">
			<div class="flex justify-between mb-4">
				<div class="w-full">
					<div class="grid grid-cols-1">
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
						</div>
					</div>
				</Card>
			</div>
			<div class="rounded-md relative overflow-x-auto border">
				<Table class="rounded-md relative overflow-x-auto">
					<tr class="text-center bg-[#1E40AF] text-white p-0">
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400 " rowspan={3}
							>Kegiatan</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400 " colspan={15}
							>Anggaran</TableHeadCell
						>
						<!-- <TableHeadCell padding="p-1" class="text-xs border border-slate-400 " colspan={2}
							>Capaian Kinerja</TableHeadCell
						> -->
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400 " rowspan={3}
							>Keterangan</TableHeadCell
						>
					</tr>

					<tr class="text-center bg-[#1E40AF] text-white p-0">
						<TableHeadCell
							padding="p-1"
							colspan="3"
							class="align-middle text-center text-xs border border-slate-400">Total</TableHeadCell
						>
						<TableHeadCell
							padding="p-1"
							colspan="3"
							class="align-middle text-center text-xs border border-slate-400"
							>Belanja Operasi</TableHeadCell
						>
						<TableHeadCell
							padding="p-1"
							colspan="3"
							class="align-middle text-center text-xs border border-slate-400"
							>Belanja Modal</TableHeadCell
						>
						<TableHeadCell
							padding="p-1"
							colspan="3"
							class="align-middle text-center text-xs border border-slate-400"
							>Belanja Tidak Terduga</TableHeadCell
						>
						<TableHeadCell
							padding="p-1"
							colspan="3"
							class="align-middle text-center text-xs border border-slate-400"
							>Belanja Transfer</TableHeadCell
						>
						<!-- <TableHeadCell
							padding="p-1"
							colspan="2"
							class="align-middle text-center text-xs border border-slate-400">%</TableHeadCell
						> -->
					</tr>
					<tr class="text-center bg-[#1E40AF] text-white p-0">
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Anggaran</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Realisasi</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400">%</TableHeadCell>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Anggaran</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Realisasi</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400">%</TableHeadCell>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Anggaran</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Realisasi</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400">%</TableHeadCell>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Anggaran</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Realisasi</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400">%</TableHeadCell>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Anggaran</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400"
							>Realisasi</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-xs border border-slate-400">%</TableHeadCell>
						<!-- <TableHeadCell padding="p-1" class="text-center text-xs border border-slate-400"
							>RENC</TableHeadCell
						>
						<TableHeadCell padding="p-1" class="text-center text-xs border border-slate-400"
							>REAL</TableHeadCell
						> -->
					</tr>
					<!-- </thead>
					<tbody> -->
					<TableBody>
						{#if SubDpaTree.length == 0}
							<TableBodyRow class="text-center">
								<TableBodyCell colspan="19">No Data ...</TableBodyCell>
							</TableBodyRow>
						{:else}
							{#each SubDpaTree as item}
								<TableBodyRow>
									<TableBodyCell class="text-xs" tdClass="p-1" style="white-space: nowrap;">
										<p>{item.programNomenklatur}</p>
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(
											item.programJumlah.pagu.belanjaOperasi +
												item.programJumlah.pagu.belanjaModal +
												item.programJumlah.pagu.belanjaTidakTerduga +
												item.programJumlah.pagu.belanjaTransfer
										)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(
											item.programJumlah.paguRealisasi.belanjaOperasiRealisasi +
												item.programJumlah.paguRealisasi.belanjaModalRealisasi +
												item.programJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi +
												item.programJumlah.paguRealisasi.belanjaTransferRealisasi
										)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{persen(
											item.programJumlah.pagu.belanjaOperasi +
												item.programJumlah.pagu.belanjaModal +
												item.programJumlah.pagu.belanjaTidakTerduga +
												item.programJumlah.pagu.belanjaTransfer,
											item.programJumlah.paguRealisasi.belanjaOperasiRealisasi +
												item.programJumlah.paguRealisasi.belanjaModalRealisasi +
												item.programJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi +
												item.programJumlah.paguRealisasi.belanjaTransferRealisasi
										)}%
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.pagu.belanjaOperasi)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.paguRealisasi.belanjaOperasiRealisasi)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{persen(
											item.programJumlah.pagu.belanjaOperasi,
											item.programJumlah.paguRealisasi.belanjaOperasiRealisasi
										)}%
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.pagu.belanjaModal)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.paguRealisasi.belanjaModalRealisasi)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{persen(
											item.programJumlah.pagu.belanjaModal,
											item.programJumlah.paguRealisasi.belanjaModalRealisasi
										)}%
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.pagu.belanjaTidakTerduga)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{persen(
											item.programJumlah.pagu.belanjaTidakTerduga,
											item.programJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi
										)}%
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.pagu.belanjaTransfer)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{formatCurrency(item.programJumlah.paguRealisasi.belanjaTransferRealisasi)}
									</TableBodyCell>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									>
										{persen(
											item.programJumlah.pagu.belanjaTransfer,
											item.programJumlah.paguRealisasi.belanjaTransferRealisasi
										)}%
									</TableBodyCell>
									<!-- <TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1">1500000</TableBodyCell
									>
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1">5%</TableBodyCell
									> -->
									<TableBodyCell
										class="align-middle text-center border border-slate-400 text-xs"
										tdClass="p-1"
									/>
								</TableBodyRow>
								{#each item.kegiatan as kegiatan}
									<TableBodyRow>
										<TableBodyCell class="text-xs" tdClass="p-1">
											{kegiatan.kegiatanNomenklatur}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(
												kegiatan.kegiatanJumlah.pagu.belanjaOperasi +
													kegiatan.kegiatanJumlah.pagu.belanjaModal +
													kegiatan.kegiatanJumlah.pagu.belanjaTidakTerduga +
													kegiatan.kegiatanJumlah.pagu.belanjaTransfer
											)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi +
													kegiatan.kegiatanJumlah.paguRealisasi.belanjaModalRealisasi +
													kegiatan.kegiatanJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi +
													kegiatan.kegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
											)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{persen(
												kegiatan.kegiatanJumlah.pagu.belanjaOperasi +
													kegiatan.kegiatanJumlah.pagu.belanjaModal +
													kegiatan.kegiatanJumlah.pagu.belanjaTidakTerduga +
													kegiatan.kegiatanJumlah.pagu.belanjaTransfer,
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi +
													kegiatan.kegiatanJumlah.paguRealisasi.belanjaModalRealisasi +
													kegiatan.kegiatanJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi +
													kegiatan.kegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
											)}%
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(kegiatan.kegiatanJumlah.pagu.belanjaOperasi)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi
											)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{persen(
												kegiatan.kegiatanJumlah.pagu.belanjaOperasi,
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi
											)}%
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(kegiatan.kegiatanJumlah.pagu.belanjaModal)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(kegiatan.kegiatanJumlah.paguRealisasi.belanjaModalRealisasi)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{persen(
												kegiatan.kegiatanJumlah.pagu.belanjaModal,
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaModalRealisasi
											)}%
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(kegiatan.kegiatanJumlah.pagu.belanjaTidakTerduga)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi
											)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{persen(
												kegiatan.kegiatanJumlah.pagu.belanjaTidakTerduga,
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi
											)}%
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(kegiatan.kegiatanJumlah.pagu.belanjaTransfer)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{formatCurrency(
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
											)}
										</TableBodyCell>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										>
											{persen(
												kegiatan.kegiatanJumlah.pagu.belanjaTransfer,
												kegiatan.kegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
											)}%
										</TableBodyCell>
										<!-- <TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1">1500000</TableBodyCell
										>
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1">5%</TableBodyCell
										> -->
										<TableBodyCell
											class="align-middle text-center border border-slate-400 text-xs"
											tdClass="p-1"
										/>
									</TableBodyRow>
									{#each kegiatan.sub_kegiatan as sub_kegiatan}
										<TableBodyRow>
											<TableBodyCell class="text-xs" tdClass="p-1">
												{sub_kegiatan.subKegiatanNomenklatur}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(
													sub_kegiatan.subKegiatanJumlah.pagu.belanjaOperasi +
														sub_kegiatan.subKegiatanJumlah.pagu.belanjaModal +
														sub_kegiatan.subKegiatanJumlah.pagu.belanjaTidakTerduga +
														sub_kegiatan.subKegiatanJumlah.pagu.belanjaTransfer
												)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi +
														sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaModalRealisasi +
														sub_kegiatan.subKegiatanJumlah.paguRealisasi
															.belanjaTidakTerdugaRealisasi +
														sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
												)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{persen(
													sub_kegiatan.subKegiatanJumlah.pagu.belanjaOperasi +
														sub_kegiatan.subKegiatanJumlah.pagu.belanjaModal +
														sub_kegiatan.subKegiatanJumlah.pagu.belanjaTidakTerduga +
														sub_kegiatan.subKegiatanJumlah.pagu.belanjaTransfer,
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi +
														sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaModalRealisasi +
														sub_kegiatan.subKegiatanJumlah.paguRealisasi
															.belanjaTidakTerdugaRealisasi +
														sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
												)}%
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(sub_kegiatan.subKegiatanJumlah.pagu.belanjaOperasi)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi
												)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{persen(
													sub_kegiatan.subKegiatanJumlah.pagu.belanjaOperasi,
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaOperasiRealisasi
												)}%
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(sub_kegiatan.subKegiatanJumlah.pagu.belanjaModal)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaModalRealisasi
												)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{persen(
													sub_kegiatan.subKegiatanJumlah.pagu.belanjaModal,
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaModalRealisasi
												)}%
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(sub_kegiatan.subKegiatanJumlah.pagu.belanjaTidakTerduga)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi
												)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{persen(
													sub_kegiatan.subKegiatanJumlah.pagu.belanjaTidakTerduga,
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaTidakTerdugaRealisasi
												)}%
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(sub_kegiatan.subKegiatanJumlah.pagu.belanjaTransfer)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{formatCurrency(
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
												)}
											</TableBodyCell>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											>
												{persen(
													sub_kegiatan.subKegiatanJumlah.pagu.belanjaTransfer,
													sub_kegiatan.subKegiatanJumlah.paguRealisasi.belanjaTransferRealisasi
												)}%
											</TableBodyCell>
											<!-- <TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1">1500000</TableBodyCell
											>
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1">5%</TableBodyCell
											> -->
											<TableBodyCell
												class="align-middle text-center border border-slate-400 text-xs"
												tdClass="p-1"
											/>
										</TableBodyRow>
									{/each}
								{/each}
							{/each}
						{/if}
						<TableBodyRow>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>Jumlah Belanja Operasi</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaOperasi)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaOperasiRealisasi)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{persen(total.belanjaOperasi, total.belanjaOperasiRealisasi)}%</TableBodyCell
							>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>Jumlah Belanja Modal</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaModal)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaModalRealisasi)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{persen(total.belanjaModal, total.belanjaModalRealisasi)}%</TableBodyCell
							>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>Jumlah Belanja Tidak Terdgua</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaTidakTerduga)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaTidakTerdugaRealisasi)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{persen(
									total.belanjaTidakTerduga,
									total.belanjaTidakTerdugaRealisasi
								)}%</TableBodyCell
							>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>Jumlah Belanja Transfer</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaTransfer)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(total.belanjaTransferRealisasi)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1">
								{persen(total.belanjaTransfer, total.belanjaTransferRealisasi)}%
							</TableBodyCell>
						</TableBodyRow>

						<TableBodyRow>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>Total</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{formatCurrency(
									total.belanjaOperasi +
										total.belanjaModal +
										total.belanjaTidakTerduga +
										total.belanjaTransfer
								)}</TableBodyCell
							>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1">
								{formatCurrency(
									total.belanjaOperasiRealisasi +
										total.belanjaModalRealisasi +
										total.belanjaTidakTerdugaRealisasi +
										total.belanjaTransferRealisasi
								)}
							</TableBodyCell>
							<TableBodyCell class="text-center font-bold text-xs" tdClass="p-1"
								>{persen(
									total.belanjaOperasi +
										total.belanjaModal +
										total.belanjaTidakTerduga +
										total.belanjaTransfer,
									total.belanjaOperasiRealisasi +
										total.belanjaModalRealisasi +
										total.belanjaTidakTerdugaRealisasi +
										total.belanjaTransferRealisasi
								)}%</TableBodyCell
							>
						</TableBodyRow>
					</TableBody>
				</Table>
			</div>
		</div>
	</div>
</section>
