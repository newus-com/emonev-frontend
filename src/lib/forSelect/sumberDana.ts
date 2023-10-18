import type { ISelect } from "$lib/interface/ISelect";

import { List as ListSumberDana } from '$lib/api/sumberDana';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListSumberDana(search: string) {
    let data: Record<any, any> = {
        search: {
            column: [
                "sumber_dana.sumberDana"
            ],
            value: search
        },
        order: [
            {
                column: "sumber_dana.id",
                dir: "desc"
            }
        ],
        length: 0,
        page: 0
    }

    let DataSumberDana: ISelect[];
    const GetDataSumberDana = await ListSumberDana(data);

    if (GetDataSumberDana.status == 200) {
        DataSumberDana = GetDataSumberDana.data.data.map((item: any) => ({
            label: `${item.sumberDana}`,
            value: item.id
        }));
        return DataSumberDana;
    } else {
        DataSumberDana = [];
        if (typeof GetDataSumberDana.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataSumberDana.message,
                    timeout: 3000
                }
            ]);
        }
        return DataSumberDana;
    }
}