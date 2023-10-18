import type { ISelect } from "$lib/interface/ISelect";

import { List as ListSatuan } from '$lib/api/satuan';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListSatuan(search: string) {
    let data: Record<any, any> = {
        search: {
            column: [
                "satuan.satuan"
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

    let DataSatuan: ISelect[];
    const GetDataSatuan = await ListSatuan(data);

    if (GetDataSatuan.status == 200) {
        DataSatuan = GetDataSatuan.data.data.map((item: any) => ({
            label: `${item.satuan}`,
            value: item.id
        }));
        return DataSatuan;
    } else {
        DataSatuan = [];
        if (typeof GetDataSatuan.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataSatuan.message,
                    timeout: 3000
                }
            ]);
        }
        return DataSatuan;
    }
}