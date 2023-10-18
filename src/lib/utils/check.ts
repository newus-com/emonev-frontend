import { goto } from '$app/navigation';
import { toasts } from '$lib/component/toast/ToastStore';
import Cookies from 'js-cookie';
import { onMount } from 'svelte';
export function checkLogin() {
    let accessToken: string | undefined;
    onMount(() => {
        accessToken = Cookies.get('accessToken');
        if (typeof accessToken === 'undefined') {
            goto('/login');
        }
    });
}


export function checkPermission(permission: string | string[], data: string[]): boolean {
    if (typeof permission === 'string') {
        return data.includes(permission);
    } else if (Array.isArray(permission)) {
        return permission.some(p => data.includes(p));
    } else {
        return false;
    }
}


export function checkDinas() {
    let status: string | undefined;
    let dinas: string | undefined;

    onMount(() => {
        status = Cookies.get('status');
        if (typeof status === 'undefined') {
            goto('/login');
        }
        if (status == '1') {
            dinas = Cookies.get('Dinas');
            if (typeof status === 'undefined') {
                goto('/login/pilihDinas');
            }
        }
    });
}


export function checkTenant(): Record<any, any> {
    let accessToken: string | undefined;
    let status: string | undefined;
    let dinas: string | undefined;

    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }

    status = Cookies.get('status');
    if (typeof status === 'undefined') {
        goto('/login');
    }
    
    if (status == '1') {
        dinas = Cookies.get('Dinas');
        if (typeof dinas === 'undefined') {
            goto('/login/pilihDinas');
        }
    }
    return {
        accessToken: accessToken,
        status: status,
        dinas: dinas
    }
}