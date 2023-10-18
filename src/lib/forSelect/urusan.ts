import type { ISelect } from "$lib/interface/ISelect";

import { List as ListUrusan } from '$lib/api/perencanaan/urusan';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListUrusan(search: string) {
    let data: Record<any, any> = {
        search: {
            column: [
                "urusan.kode",
                "urusan.nomenklatur"
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
        page: 0
    }

    let DataUrusan: ISelect[];
    const GetDataUrusan = await ListUrusan(data);

    if (GetDataUrusan.status == 200) {
        DataUrusan = GetDataUrusan.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.nomenklatur}`,
            value: item.id
        }));
        return DataUrusan;
    } else {
        DataUrusan = [];
        if (typeof GetDataUrusan.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataUrusan.message,
                    timeout: 3000
                }
            ]);
        }
        return DataUrusan;
    }
}