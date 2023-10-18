import { goto } from '$app/navigation';
import Cookies from 'js-cookie';
import { URL } from '$lib/api/config';


export async function List(data: Record<string, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/rekening/subRincianObjekRekening/list", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}

export async function One(id: string) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/rekening/subRincianObjekRekening/one/" + id, {
            method: 'GET',
            // body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}

export async function Create(data: Record<string, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/rekening/subRincianObjekRekening/create", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}

export async function Update(data: Record<string, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/rekening/subRincianObjekRekening/update/" + data['id'], {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}

export async function Delete(data: Record<string, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    // data['pembangunan'] = DINAS;
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/rekening/subRincianObjekRekening/delete/" + data['id'], {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: new Headers({
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + accessToken
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}