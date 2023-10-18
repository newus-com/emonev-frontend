import { goto } from "$app/navigation";
import Cookies from "js-cookie";
import { URL } from '$lib/api/config';

export async function Update(data: Record<any, any>) {
    let accessToken: string | undefined;
    accessToken = Cookies.get('accessToken');
    if (typeof accessToken === 'undefined') {
        goto('/login');
    }
    try {
        const response = await fetch(URL + "/tenant/pembangunan/monitoring/updateDataUmum/" + data['subDpaPembangunanId'], {
            method: 'POST',
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