<script>
    import { Button, Spinner } from 'flowbite-svelte';
  </script>
  
  <Button color="light" disabled={true}>
    <Spinner size="4" color="blue"/>
    <div class="flex">
      <span class="ml-2">Loading...</span>
    </div>
  </Button>