import type { ISelect } from "$lib/interface/ISelect";

import { List as ListUnit } from '$lib/api/unit';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListUnit(search: string, organisasiId: string = '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "unit.kode",
                "unit.nomenklatur"
            ],
            value: search
        },
        order: [
            {
                column: "unit.id",
                dir: "desc"
            }
        ],
        length: 0,
        page: 0,
        organisasiId: organisasiId
    }

    let DataUnit: ISelect[];
    const GetDataUnit = await ListUnit(data);

    if (GetDataUnit.status == 200) {
        DataUnit = GetDataUnit.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.nomenklatur}`,
            value: item.id
        }));
        return DataUnit;
    } else {
        DataUnit = [];
        if (typeof GetDataUnit.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataUnit.message,
                    timeout: 3000
                }
            ]);
        }
        return DataUnit;
    }
}