import { writable } from "svelte/store";
import type { Writable } from "svelte/store";

interface Toast {
  id: number;
  typeToast: string;
  messageToast: string;
  timeout?: number;
}

export const toasts: Writable<Toast[]> = writable([]);

export const addToast = (toast: Partial<Toast>) => {
  const id = Math.floor(Math.random() * 10000);

  const defaults: Toast = {
    id,
    typeToast: "success",
    messageToast: "-",
    timeout: 3000,
  };

  console.log(toasts);
  

  toasts.update((all) => [{ ...defaults, ...toast }, ...all]);

  if (toast.timeout) setTimeout(() => dismissToast(id), toast.timeout);
};

export const dismissToast = (id: number) => {
  toasts.update((all) => all.filter((t) => t.id !== id));
};
