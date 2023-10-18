import type { ISelect } from "$lib/interface/ISelect";

import { List as ListJenisRekening } from '$lib/api/rekening/jenisRekening';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListJenisRekening(search: string = '', kelompokRekeningId: string = '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "jenis_rekening.kode",
                "jenis_rekening.uraianAkun"
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
        kelompokRekeningId: kelompokRekeningId
    }

    let DataJenisRekening: ISelect[];
    const GetDataJenisRekening = await ListJenisRekening(data);

    if (GetDataJenisRekening.status == 200) {
        DataJenisRekening = GetDataJenisRekening.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.uraianAkun}`,
            value: item.id
        }));
        return DataJenisRekening;
    } else {
        DataJenisRekening = [];
        if (typeof GetDataJenisRekening.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataJenisRekening.message,
                    timeout: 3000
                }
            ]);
        }
        return DataJenisRekening;
    }
}