import { writable } from 'svelte/store';
import type { IStepper } from '../interface/IStepper';

export const layoutStore = writable({
    updateDpa: false,
    kegiatanId: '',
    totalPagu: 0,
});