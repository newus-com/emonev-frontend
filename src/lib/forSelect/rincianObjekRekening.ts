import type { ISelect } from "$lib/interface/ISelect";

import { List as ListRincianObjekRekening } from '$lib/api/rekening/rincianObjekRekening';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListRincianObjekRekening(search: string = '', objekRekeningId: string = '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "rincian_objek_rekening.kode",
                "rincian_objek_rekening.uraianAkun"
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
        objekRekeningId: objekRekeningId
    }

    let DataRincianObjekRekening: ISelect[];
    const GetDataRincianObjekRekening = await ListRincianObjekRekening(data);

    if (GetDataRincianObjekRekening.status == 200) {
        DataRincianObjekRekening = GetDataRincianObjekRekening.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.uraianAkun}`,
            value: item.id
        }));
        return DataRincianObjekRekening;
    } else {
        DataRincianObjekRekening = [];
        if (typeof GetDataRincianObjekRekening.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataRincianObjekRekening.message,
                    timeout: 3000
                }
            ]);
        }
        return DataRincianObjekRekening;
    }
}