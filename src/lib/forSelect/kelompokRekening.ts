import type { ISelect } from "$lib/interface/ISelect";

import { List as ListKelompokRekening } from '$lib/api/rekening/kelompokRekening';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListKelompokRekening(search: string = '', akunRekeningId: string = '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "kelompok_rekening.kode",
                "kelompok_rekening.uraianAkun"
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
        akunRekeningId: akunRekeningId
    }

    let DataKelompokRekening: ISelect[];
    const GetDataKelompokRekening = await ListKelompokRekening(data);

    if (GetDataKelompokRekening.status == 200) {
        DataKelompokRekening = GetDataKelompokRekening.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.uraianAkun}`,
            value: item.id
        }));
        return DataKelompokRekening;
    } else {
        DataKelompokRekening = [];
        if (typeof GetDataKelompokRekening.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataKelompokRekening.message,
                    timeout: 3000
                }
            ]);
        }
        return DataKelompokRekening;
    }
}