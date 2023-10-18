import { goto } from '$app/navigation';
import Cookies from 'js-cookie';
import { URL } from './config';


export async function List(data: Record<string, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/organisasi/unit/list", {
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

export async function Create(data: Record<string, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/organisasi/unit/create", {
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
    // data['bidangId'] = BIDANG;
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/organisasi/unit/update/" + data['id'], {
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
    // data['bidangId'] = BIDANG;
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/organisasi/unit/delete/" + data['id'], {
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

export async function GetOne(data: Record<string, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/organisasi/unit/one/" + data['id'], {
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