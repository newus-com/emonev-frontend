<script lang="ts">
	import {
		Button,
		Dropdown,
		DropdownItem,
		Pagination,
		Search,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';

	export let headerTable: string[] = [];
	export let pages = [
        {
            name: "1"
        }
    ];

    

	const previous = () => {
		alert('Previous btn clicked. Make a call to your server to fetch data.');
	};
	const next = () => {
		alert('Next btn clicked. Make a call to your server to fetch data.');
	};
</script>

<div class="">
	<div class="flex justify-between mb-4">
		<div class="w-full">
			<div class="grid grid-cols-2">
				<Search size="md" class="focus:ring focus:ring-blue-300 focus:border-blue-500 grow-0.5" />
				<div class="flex justify-end">
					<Button size="sm" href="./tahun/add" class="hover:no-underline bg-[#1E40AF]">
						Tambah
					</Button>
				</div>
			</div>
		</div>
	</div>
	<div class="wotable border rounded-md overflow-hidden">
		<Table class="rounded-md overflow-hidden">
			<TableHead class="text-center bg-[#1E40AF] text-white">
				{#each headerTable as item}
					<TableHeadCell>{item}</TableHeadCell>
				{/each}
			</TableHead>
			<TableBody>
				<slot />
			</TableBody>
		</Table>
	</div>
</div>
<hr />
<div class="mt-3 flex justify-between">
	<Button color="blue"
		>5<Icon name="chevron-down-solid" class="w-3 h-3 ml-2 text-white dark:text-white" /></Button
	>
	<Dropdown>
		<DropdownItem href="/">10</DropdownItem>
		<DropdownItem href="/docs/components/dropdown">15</DropdownItem>
		<DropdownItem href="/docs/components/accordion">20</DropdownItem>
		<DropdownItem href="/docs/components/alert">25</DropdownItem>
	</Dropdown>
	<Pagination {pages} on:previous={previous} on:next={next} />
</div>
