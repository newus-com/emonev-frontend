import { toasts } from "./ToastStore";

export function PushToast (type: string, message: string) {
	toasts.update((toastsList: any) => [
	   ...toastsList,
	   {
        id: Date.now(),
        typeToast: type,
        messageToast: message,
        timeout: 3000
	   }
	]);
}