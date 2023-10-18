import { URL } from './config';
import { goto } from '$app/navigation';
import Cookies from 'js-cookie';

export async function Login(data: Record<string, any>) {
  try {
    const response = await fetch(URL + "/auth/login", {
      method: 'POST',
      body: JSON.stringify(data),
      headers: new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }),
    });

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error(`err => ${error}`);
  }
}


export async function getPermission() {
  let accessToken: string | undefined;
  accessToken = Cookies.get('accessToken');
  if (typeof accessToken === 'undefined') {
    goto('/login');
  }
  try {
    const response = await fetch(URL + "/auth/getPermission", {
      method: 'POST',
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