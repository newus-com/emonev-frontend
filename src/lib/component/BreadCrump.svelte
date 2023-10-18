<script>
	import { Breadcrumb, BreadcrumbItem } from 'flowbite-svelte';
	/** @type {Array<{ label: string, href: string }>} */
	export let breadItems = [];
</script>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-2">
	{#each breadItems as item, index}
		{#if item.label === 'Home'}
        <BreadcrumbItem href={item.href} home class="text-base flex items-center hover:no-underline " homeClass="inline-flex items-center text-sm font-medium text-gray-700 hover:no-underline hover:text-blue-500">{item.label}</BreadcrumbItem>
		{:else if index === breadItems.length - 1}
        <BreadcrumbItem class="text-base flex items-center">{item.label}</BreadcrumbItem>
		{:else}
        <BreadcrumbItem href={item.href} class="text-base flex items-center hover:no-underline" linkClass="inline-flex items-center text-sm font-medium text-gray-700 hover:no-underline hover:text-blue-500">{item.label}</BreadcrumbItem>
		{/if}
	{/each}
</Breadcrumb>
