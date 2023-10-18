<script lang="ts">
	import type { IStepper } from '$lib/interface/IStepper';

	export let stepperItems: IStepper[] = [];
	export let active = 0;
</script>

{#if stepperItems.length !== 0}
	<ol
		class="flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 rounded-lg shadow-sm dark:text-gray-400 sm:text-base dark:bg-gray-800 dark:border-gray-700 sm:p-4 sm:space-x-4"
	>
		{#each stepperItems as item, index}
			{#if index <= active}
				<li class="flex items-center text-blue-600 dark:text-blue-500">
					<span
						class="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-blue-600 rounded-full shrink-0 dark:border-blue-500"
					>
						{index + 1}
					</span>

					<a href={item.href} style="text-decoration:none">{item.label}</a>
					<span class="hidden sm:inline-flex sm:ml-2">Info</span>

					{#if index !== stepperItems.length - 1}
						<svg
							class="w-3 h-3 ml-2 sm:ml-4"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 12 10"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m7 9 4-4-4-4M1 9l4-4-4-4"
							/>
						</svg>
					{/if}
				</li>{/if}
			{#if index > active}
				<li class="flex items-center">
					<span
						class="flex items-center justify-center w-5 h-5 mr-2 text-xs border border-gray-500 rounded-full shrink-0 dark:border-gray-400"
					>
						{index + 1}
					</span>

					{item.label} <span class="hidden sm:inline-flex sm:ml-2">Info</span>

					{#if index !== stepperItems.length - 1}
						<svg
							class="w-3 h-3 ml-2 sm:ml-4"
							aria-hidden="true"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 12 10"
						>
							<path
								stroke="currentColor"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="m7 9 4-4-4-4M1 9l4-4-4-4"
							/>
						</svg>
					{/if}
				</li>
			{/if}
		{/each}
	</ol>
{/if}
