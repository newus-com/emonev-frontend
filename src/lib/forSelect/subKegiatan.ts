import type { ISelect } from "$lib/interface/ISelect";

import { List as ListSubKegiatan } from '$lib/api/perencanaan/subKegiatan';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListSubKegiatan(search: string, kegiatanId: string= '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "sub_kegiatan.kode",
                "sub_kegiatan.nomenklatur",
                "sub_kegiatan.indikator",
            ],
            value: search
        },
        order: [
            {
                column: "sub_kegiatan.id",
                dir: "desc"
            }
        ],
        length: 0,
        page: 0,
        kegiatanId: kegiatanId
    }

    let DataSubKegiatan: ISelect[];
    const GetDataSubKegiatan = await ListSubKegiatan(data);

    if (GetDataSubKegiatan.status == 200) {
        DataSubKegiatan = GetDataSubKegiatan.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.nomenklatur}`,
            value: item.id
        }));
        return DataSubKegiatan;
    } else {
        DataSubKegiatan = [];
        if (typeof GetDataSubKegiatan.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataSubKegiatan.message,
                    timeout: 3000
                }
            ]);
        }
        return DataSubKegiatan;
    }
}