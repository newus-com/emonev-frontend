<script>
	import {
		Button,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	let myBreadItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Tahun', href: '/master/tahun' }
	];
	import { Dropdown, DropdownItem } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
	import { page } from '$app/stores';
	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import Delete from '$lib/component/Delete.svelte';
	import Pagination from '$lib/component/Pagination.svelte';
	$: activeUrl = $page.url.pathname;
</script>

<section>
	<BreadCrump breadItems={myBreadItems} />
	<div class="font-bold text-xl text-[#1E40AF] mb-4">List Tahun</div>
	<div class="wrap bg-white p-6 rounded-md shadow-lg">
		<div class="">
			<div class="flex justify-between mb-4">
				<div class="w-full">
					<form class="flex gap-2 w-full justify-between">
						<Search
							size="md"
							class="focus:ring focus:ring-blue-300 focus:border-blue-500 w-[600px]"
						/>
						<Button size="sm" href="./tahun/add" class="hover:no-underline bg-[#1E40AF]">
							Tambah
						</Button>
					</form>
				</div>
			</div>
			<div class="wotable border rounded-md overflow-hidden">
				<Table class="rounded-md overflow-hidden">
					<TableHead class="text-center bg-[#1E40AF] text-white">
						<TableHeadCell>Tahun</TableHeadCell>
						<TableHeadCell>Aksi</TableHeadCell>
					</TableHead>
					<TableBody>
						<TableBodyRow class="text-center">
							<TableBodyCell tdClass="p-0 m-0">Apple MacBook Pro 17"</TableBodyCell>
							<TableBodyCell tdClass="p-0 m-0">
								<Button
									class="mr-2 hover:no-underline my-1 px-3 py-1 text-[12px]"
									size="md"
									color="yellow"
									href="./tahun/edit">Edit</Button
								>
								<Delete />
							</TableBodyCell>
						</TableBodyRow>
					</TableBody>
				</Table>
			</div>
		</div>
		<hr />
		<div class="mt-3 flex justify-between">
			<Button color='blue'
				>5<Icon
					name="chevron-down-solid"
					class="w-3 h-3 ml-2 text-white dark:text-white"
				/></Button
			>
			<Dropdown {activeUrl}>
				<DropdownItem href="/">10</DropdownItem>
				<DropdownItem href="/docs/components/dropdown">15</DropdownItem>
				<DropdownItem href="/docs/components/accordion">20</DropdownItem>
				<DropdownItem href="/docs/components/alert">25</DropdownItem>
			</Dropdown>
			<Pagination />
		</div>
	</div>
</section>

