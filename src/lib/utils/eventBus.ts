import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

// Define the shape of the event bus data
interface EventBusCustomData {
    [key: string]: any;
}

// Create a writable store for the event bus
export const eventBusCustom: Writable<EventBusCustomData> = writable({});

// Function to dispatch events
export function dispatchEventCustom(eventType: string, data: any) {
    eventBusCustom.update((bus) => ({
        ...bus,
        [eventType]: data,
    }));
}