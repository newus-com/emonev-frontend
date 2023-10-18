import type { ISelect } from "$lib/interface/ISelect";

import { List as ListSubRincianObjekRekening } from '$lib/api/rekening/subRincianObjekRekening';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListSubRincianObjekRekening(search: string = '', rincianObjekRekeningId: string = '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "sub_rincian_objek_rekening.kode",
                "sub_rincian_objek_rekening.uraianAkun"
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
        rincianObjekRekeningId: rincianObjekRekeningId
    }

    let DataSubRincianObjekRekening: ISelect[];
    const GetDataSubRincianObjekRekening = await ListSubRincianObjekRekening(data);

    if (GetDataSubRincianObjekRekening.status == 200) {
        DataSubRincianObjekRekening = GetDataSubRincianObjekRekening.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.uraianAkun}`,
            value: item.id
        }));
        return DataSubRincianObjekRekening;
    } else {
        DataSubRincianObjekRekening = [];
        if (typeof GetDataSubRincianObjekRekening.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataSubRincianObjekRekening.message,
                    timeout: 3000
                }
            ]);
        }
        return DataSubRincianObjekRekening;
    }
}