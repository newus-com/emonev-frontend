import type { ISelect } from "$lib/interface/ISelect";

import { List as ListObjekRekening } from '$lib/api/rekening/objekRekening';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListObjekRekening(search: string = '', jenisRekeningId: string = '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "objek_rekening.kode",
                "objek_rekening.uraianAkun"
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
        jenisRekeningId: jenisRekeningId
    }

    let DataObjekRekening: ISelect[];
    const GetDataObjekRekening = await ListObjekRekening(data);

    if (GetDataObjekRekening.status == 200) {
        DataObjekRekening = GetDataObjekRekening.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.uraianAkun}`,
            value: item.id
        }));
        return DataObjekRekening;
    } else {
        DataObjekRekening = [];
        if (typeof GetDataObjekRekening.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataObjekRekening.message,
                    timeout: 3000
                }
            ]);
        }
        return DataObjekRekening;
    }
}