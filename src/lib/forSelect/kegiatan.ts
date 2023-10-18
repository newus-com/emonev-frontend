import type { ISelect } from "$lib/interface/ISelect";

import { List as ListKegiatan } from '$lib/api/perencanaan/kegiatan';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListKegiatan(search: string, programId: string= '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "kegiatan.kode",
                "kegiatan.nomenklatur"
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
        programId: programId
    }

    let DataKegiatan: ISelect[];
    const GetDataKegiatan = await ListKegiatan(data);

    if (GetDataKegiatan.status == 200) {
        DataKegiatan = GetDataKegiatan.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.nomenklatur}`,
            value: item.id
        }));
        return DataKegiatan;
    } else {
        DataKegiatan = [];
        if (typeof GetDataKegiatan.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataKegiatan.message,
                    timeout: 3000
                }
            ]);
        }
        return DataKegiatan;
    }
}