import Cookies from 'js-cookie';
import { URL } from './config';
import { goto } from '$app/navigation';

export async function List(data: Record<string, any>) {
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


export async function ListDinasFromUser() {
  let accessToken: string | undefined;
  accessToken = Cookies.get('accessToken');
  if (typeof accessToken === 'undefined') {
      goto('/login');
  }
  try {
      const response = await fetch(URL + "/user/allDinasFromUser", {
          method: 'GET',
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