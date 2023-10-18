<script>
  import { Button, Modal } from 'flowbite-svelte';
  import { Icon } from 'flowbite-svelte-icons';

  /**
	 * @type {any}
	 */
  export let deleteId = null; // Prop untuk ID tombol "Ya" dengan nilai default null
  let popupModal = false;
</script>

<Button class="hover:no-underline hover:bg-[#CB2A2A] bg-[#FF3636] px-3 py-1 text-[12px]" size="sm" on:click={() => (popupModal = true)}>Hapus</Button>

<Modal bind:open={popupModal} size="xs" autoclose>
  <div class="text-center">
      <Icon name="exclamation-circle-outline" class="mx-auto mb-4 text-[#FF3636] w-12 h-12 dark:text-gray-200"/>
      <h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">Apakah anda yakin Ingin Menghapus?</h3>
      {#if deleteId != null}
      <Button class="mr-2 bg-[#1E40AF] hover:bg-[#183593]" id={deleteId}>Ya</Button>
      {/if}
      <Button color="alternative">Tidak</Button>
  </div>
</Modal>
