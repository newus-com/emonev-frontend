import Cookies from 'js-cookie';
import { URL } from '../config';
import { goto } from '$app/navigation';

export async function One(data: Record<any, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/tenant/anggaran/pengambilan/realisasi/one", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}


export async function Update(data: Record<any, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/tenant/anggaran/pengambilan/realisasi/create", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + accessToken,
            })
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}