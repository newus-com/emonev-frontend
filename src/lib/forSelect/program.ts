import type { ISelect } from "$lib/interface/ISelect";

import { List as ListProgram } from '$lib/api/perencanaan/program';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListProgram(search: string, urusanId: string= '') {
    let data: Record<any, any> = {
        search: {
            column: [
                "program.kode",
                "program.nomenklatur"
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

    let DataProgram: ISelect[];
    const GetDataProgram = await ListProgram(data);

    if (GetDataProgram.status == 200) {
        DataProgram = GetDataProgram.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.nomenklatur}`,
            value: item.id
        }));
        return DataProgram;
    } else {
        DataProgram = [];
        if (typeof GetDataProgram.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataProgram.message,
                    timeout: 3000
                }
            ]);
        }
        return DataProgram;
    }
}