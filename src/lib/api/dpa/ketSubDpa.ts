import Cookies from 'js-cookie';
import { checkTenant } from '../../utils/check';
import { URL } from '../config';
import { goto } from '$app/navigation';

// import axios from 'axios';

export async function List(data: Record<any, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/tenant/anggaran/subDpa/ketSubDpa/list", {
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

export async function One(data: Record<any, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/tenant/anggaran/subDpa/ketSubDpa/one/" + data['id'], {
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

export async function Create(data: Record<any, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/tenant/anggaran/subDpa/ketSubDpa/create", {
            method: 'POST',
            body: JSON.stringify(data),
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
                'Accept': 'application/json',
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
        const response = await fetch(URL + "/tenant/anggaran/subDpa/ketSubDpa/update/" + data['id'], {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}

export async function Delete(data: Record<any, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/tenant/anggaran/subDpa/ketSubDpa/delete/" + data['id'], {
            method: 'DELETE',
            body: JSON.stringify(data),
            headers: new Headers({
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json',
            }),
        });

        const responseData = await response.json();
        return responseData;
    } catch (error) {
        console.error(`err => ${error}`);
    }
}