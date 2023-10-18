import type { ISelect } from "$lib/interface/ISelect";

import { List as ListOrganisasi } from '$lib/api/organisasi';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListOrganisasi(search: string, bidangId: string = '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "organisasi.kode",
                "organisasi.nomenklatur"
            ],
            value: search
        },
        order: [
            {
                column: "id",
                dir: "desc"
            }
        ],
        length: 0,
        page: 0,
        bidangId: bidangId
    }

    let DataOrganisasi: ISelect[];
    const GetDataOrganisasi = await ListOrganisasi(data);

    if (GetDataOrganisasi.status == 200) {
        DataOrganisasi = GetDataOrganisasi.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.nomenklatur}`,
            value: item.id
        }));
        return DataOrganisasi;
    } else {
        DataOrganisasi = [];
        if (typeof GetDataOrganisasi.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataOrganisasi.message,
                    timeout: 3000
                }
            ]);
        }
        return DataOrganisasi;
    }
}