import type { ISelect } from "$lib/interface/ISelect";

import { List as ListDinas } from '$lib/api/dinas';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListDinas(search: string) {
    let data: Record<any, any> = {
        search: {
            column: [
                "dinas.id",
                "dinas.name",
                "dinas.email",
                "dinas.noHp",
                "dinas.address",
                "dinas.logo"
            ],
            value: search
        },
        order: [
            {
                column: "dinas.id",
                dir: "desc"
            }
        ],
        length: 0,
        page: 0
    }

    let DataDinas: ISelect[];
    const GetDataDinas = await ListDinas(data);

    if (GetDataDinas.status == 200) {
        DataDinas = GetDataDinas.data.data.map((item: any) => ({
            label: `${item.name}`,
            value: item.id
        }));
        return DataDinas;
    } else {
        DataDinas = [];
        if (typeof GetDataDinas.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataDinas.message,
                    timeout: 3000
                }
            ]);
        }
        return DataDinas;
    }
}