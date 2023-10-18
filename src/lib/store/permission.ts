import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

// export const permissions: Writable<string[]> = writable([]);
export const permissions = writable<string[]>([]);


