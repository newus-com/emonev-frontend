<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		Progressbar,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import Pagination from '$lib/component/Pagination.svelte';
	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import { Modal } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import Search from '$lib/component/search/Search.svelte';

	let myBreadItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Monitoring', href: '/anggaran/pembangunan/monitoring' }
	];

	let dataTable = {
		search: {
			column: [
				'sub_kegiatan.kode',
				'sub_kegiatan.nomenklatur',
				'sub_kegiatan.kinerja',
				'sub_kegiatan.indikator',
				'sumber_dana.sumberDana'
			],
			value: ''
		},
		order: [
			{
				column: 'sub_dpa_pembangunan.id',
				dir: 'desc'
			}
		],
		length: 0,
		page: 0,
		dpaId: $page.params.dpaId,
		dinasId: ''
	};

	const setSearch = async (event: any) => {
		dataTable.search.value = event.detail.searchPage;
		// isLoading = true;
		// await getDpa();
		// isLoading = false;
	};

	async function setLength(event: any) {
		dataTable.length = event.detail.lengthPage;
		// isLoading = true;
		// await getDpa();
		// isLoading = false;
	}

	const setPagination = async (event: any) => {
		dataTable.page = event.detail.currentPage;
		// isLoading = true;
		// await getDpa();
		// isLoading = false;
	};
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Monitoring</div>
	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="">
			<div class="flex justify-between mb-4">
				<div class="w-full">
					<div class="grid grid-cols-2">
						<Search on:searchPage={setSearch} />
					</div>
				</div>
			</div>
			<div class="rounded-md overflow-hidden border">
				<Table class="rounded-md overflow-hidden">
					<TableHead class="text-center bg-[#1E40AF] text-white">
						<TableHeadCell>No</TableHeadCell>
						<TableHeadCell>Instansi</TableHeadCell>
						<TableHeadCell>Nama Pekerjaan</TableHeadCell>
						<TableHeadCell>Progress Pekerjaan</TableHeadCell>
						<TableHeadCell>Pelaksana Kontrak</TableHeadCell>
						<TableHeadCell>Aksi</TableHeadCell>
					</TableHead>
					<TableBody>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="py-2">1</TableBodyCell>
							<TableBodyCell tdClass="py-2">Dinas Pariwisata</TableBodyCell>
							<TableBodyCell tdClass="py-2">Lorem Ipsum</TableBodyCell>
							<TableBodyCell tdClass="py-2"
								><Progressbar progress="50" size="h-4" labelInside /></TableBodyCell
							>
							<TableBodyCell tdClass="py-2"
								><Button
									class="mr-2 px-3 py-2 text-[13px] hover:no-underline bg-[#FFC736] hover:bg-[#EFBA32]"
									size="md">Kontrak</Button
								></TableBodyCell
							>
							<TableBodyCell tdClass="py-2">
								<Button
									class="mr-2 px-3 py-2 text-[13px] hover:no-underline"
									size="sm"
									color="blue"
									href="./monitoring/detail">Detail</Button
								>
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			</div>
		</div>
		<hr />
		<div class="mt-3 flex justify-between" />
	</div>
</section>
<!-- <Modal title="Pelaksana Kontrak" bind:open={clickOutsideModal} autoclose outsideclose>
	<div class="inform p-6 rounded-md border">
		<Table class="rounded-md overflow-hidden">
			<TableBody>
				<TableBodyRow class="">
					<TableBodyCell tdClass="py-2">Lokasi</TableBodyCell>
					<TableBodyCell tdClass="py-2">:</TableBodyCell>
					<TableBodyCell tdClass="py-2">Kalianda</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow class="">
					<TableBodyCell tdClass="py-2">Pelaksana</TableBodyCell>
					<TableBodyCell tdClass="py-2">:</TableBodyCell>
					<TableBodyCell tdClass="py-2">TamTam4U</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow class="">
					<TableBodyCell tdClass="py-2">Nomor Kontrak</TableBodyCell>
					<TableBodyCell tdClass="py-2">:</TableBodyCell>
					<TableBodyCell tdClass="py-2">1234</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow class="">
					<TableBodyCell tdClass="py-2">Jangka Waktu</TableBodyCell>
					<TableBodyCell tdClass="py-2">:</TableBodyCell>
					<TableBodyCell tdClass="py-2">54 Hari</TableBodyCell>
				</TableBodyRow>
				<TableBodyRow class="">
					<TableBodyCell tdClass="py-2">Nilai Kontrak(RP)</TableBodyCell>
					<TableBodyCell tdClass="py-2">:</TableBodyCell>
					<TableBodyCell tdClass="py-2">12343212</TableBodyCell>
				</TableBodyRow>
			</TableBody>
		</Table>
	</div>
</Modal> -->
