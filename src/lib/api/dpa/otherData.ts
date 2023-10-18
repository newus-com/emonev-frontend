import { List as ListSubKegiatan } from '$lib/api/perencanaan/subKegiatan';
import { List as ListKegiatan } from '$lib/api/perencanaan/kegiatan';
import { List as ListProgram } from '$lib/api/perencanaan/program';
import { List as ListUrusan } from '$lib/api/perencanaan/urusan';
import { List as ListBidang } from '$lib/api/perencanaan/bidang';
import { List as ListOrganisasi } from '$lib/api/organisasi';
import { List as ListSumberDana } from '$lib/api/sumberDana';
import { List as ListTahun } from '$lib/api/tahun';
import { List as ListUnit } from '$lib/api/unit';

import { toasts } from '$lib/component/toast/ToastStore';

let dataTable = {
	search: {
		column: [],
		value: ''
	},
	order: [
		{
		column: 'id',
		dir: 'desc'
		}
	],
	length: 0,
	page: 0
};

async function checkFetch (data: any) {
	if (data.status >= 200 && data.status < 300) {
		return await data;
	} else {
		if (typeof data.message !== 'undefined') {
			toasts.update((toastsList) => [
				...toastsList,
				{
					id: Date.now(),
					typeToast: 'error',
					messageToast: data.message,
					timeout: 3000
				}
			]);
		} else {
			// Throw Error Page
		}
		console.error(data);
		return [];
	}
}

export async function getTahunData () {
	let temp: any = [];
	const tempFetch = await ListTahun(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.tahun
	}));
	return temp;
}

export async function getUrusanData () {
	let temp: any = [];
	const tempFetch = await ListUrusan(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.kode + " | " + item.nomenklatur
	}));
	return temp;
}

export async function getBidangData () {
	let temp: any = [];
	const tempFetch = await ListBidang(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.kode + " | " + item.nomenklatur
	}));
	return temp;
}

export async function getUnitData () {
	let temp: any = [];
	const tempFetch = await ListUnit(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.kode + " | " + item.nomenklatur
	}));
	return temp;
}

export async function getProgramData () {
	let temp: any = [];
	const tempFetch = await ListProgram(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.kode + " | " + item.nomenklatur
	}));
	return temp;
}

export async function getKegiatanData () {
	let temp: any = [];
	const tempFetch = await ListKegiatan(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.kode + " | " + item.nomenklatur
	}));
	return temp;
}

export async function getSubKegiatanData () {
	let temp: any = [];
	const tempFetch = await ListSubKegiatan(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.kode + " | " + item.nomenklatur
	}));
	return temp;
}

export async function getSumberDanaData () {
	let temp: any = [];
	const tempFetch = await ListSumberDana(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.sumberDana
	}));
	return temp;
}

export async function getOrganisasiData () {
	let temp: any = [];
	const tempFetch = await ListOrganisasi(dataTable);
	temp = await checkFetch(tempFetch);
	temp = await temp.data.data.map((item: any) => ({
		value: item.id,
		name: item.kode + " | " + item.nomenklatur
	}));
	return temp;
}