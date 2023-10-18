import type { ISelect } from "$lib/interface/ISelect";

import { List as ListBidang } from '$lib/api/perencanaan/bidang';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListBidang(search: string, urusanId: string= '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "bidang.kode",
                "bidang.nomenklatur"
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
        urusanId: urusanId
    }

    let DataBidang: ISelect[];
    const GetDataBidang = await ListBidang(data);

    if (GetDataBidang.status == 200) {
        DataBidang = GetDataBidang.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.nomenklatur}`,
            value: item.id
        }));
        return DataBidang;
    } else {
        DataBidang = [];
        if (typeof GetDataBidang.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataBidang.message,
                    timeout: 3000
                }
            ]);
        }
        return DataBidang;
    }
}