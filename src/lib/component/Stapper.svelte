<script>
	import { Indicator } from 'flowbite-svelte';
	import { Icon } from 'flowbite-svelte-icons';
</script>

<ol class="flex items-center w-[700px]">
  <li class="relative w-full mb-6">
    <div class="flex items-center">
      <Indicator size="xl" color="none" class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0">
        <Icon name="check-circle-solid" class="w-6 h-6 text-[#57DD55] dark:text-primary-300" />
      </Indicator>
      <div class="flex w-full bg-indigo-400 h-0.5 dark:bg-gray-700" />
    </div>
    <div class="mt-3">
      <h3 class="font-medium text-gray-900 dark:text-white">Urusan</h3>
    </div>
  </li>
  <li class="relative w-full mb-6">
    <div class="flex items-center">
      <Indicator size="xl" color="none" class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0">
        <Icon name="check-circle-solid" class="w-6 h-6 text-gray-600 dark:text-primary-300" />
      </Indicator>
      <div class="flex w-full bg-indigo-400 h-0.5 dark:bg-gray-700" />
    </div>
    <div class="mt-3">
      <h3 class="font-medium text-gray-900 dark:text-white">Bidang</h3>
    </div>
  </li>
  <li class="relative w-full mb-6">
    <div class="flex items-center">
      <Indicator size="xl" color="none" class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0">
        <Icon name="check-circle-solid" class="w-6 h-6 text-gray-600 dark:text-primary-300" />
      </Indicator>
      <div class="flex w-full bg-indigo-400 h-0.5 dark:bg-gray-700" />
    </div>
    <div class="mt-3">
      <h3 class="font-medium text-gray-900 dark:text-white">Program</h3>
    </div>
  </li>
  <li class="relative w-full mb-6">
    <div class="flex items-center">
      <Indicator size="xl" color="none" class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0">
        <Icon name="check-circle-solid" class="w-6 h-6 text-gray-600 dark:text-primary-300" />
      </Indicator>
      <div class="flex w-full bg-indigo-400 h-0.5 dark:bg-gray-700" />
    </div>
    <div class="mt-3">
      <h3 class="font-medium text-gray-900 dark:text-white">Kegiatan</h3>
    </div>
  </li>
  <li class="relative w-full mb-6">
    <div class="flex items-center">
      <Indicator size="xl" color="none" class="bg-primary-200 dark:bg-primary-900 z-10 ring-0 ring-white sm:ring-8 dark:ring-gray-900 shrink-0">
        <Icon name="check-circle-solid" class="w-6 h-6 text-gray-600 dark:text-primary-300" />
      </Indicator>
      <div class="flex w-full h-0.5 dark:bg-gray-700" />
    </div>
    <div class="mt-3">
      <h3 class="font-medium text-gray-900 dark:text-white">Sub Kegiatan</h3>
    </div>
  </li>
</ol>
