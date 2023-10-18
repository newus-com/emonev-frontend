import type { ISelect } from "$lib/interface/ISelect";

import { List as ListTahun } from '$lib/api/tahun';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListTahun(search: string) {
    let data: Record<any, any> = {
        search: {
            column: [
                "tahun.tahun"
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

    let DataTahun: ISelect[];
    const GetDataTahun = await ListTahun(data);

    if (GetDataTahun.status == 200) {
        DataTahun = GetDataTahun.data.data.map((item: any) => ({
            label: `${item.tahun}`,
            value: item.id
        }));
        return DataTahun;
    } else {
        DataTahun = [];
        if (typeof GetDataTahun.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataTahun.message,
                    timeout: 3000
                }
            ]);
        }
        return DataTahun;
    }
}

export async function GetTahunActive() {
    let data: Record<any, any> = {
        search: {
            column: [
                "tahun.tahun"
            ],
            value: ""
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

    const GetDataTahun = await ListTahun(data);
    if (GetDataTahun.status == 200) {
        const Tahun = GetDataTahun.data.data.find((d:any) => d.active == "1");
        return Tahun
    } else {
        const Tahun = undefined;
        if (typeof GetDataTahun.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataTahun.message,
                    timeout: 3000
                }
            ]);
        }
        return Tahun;
    }
}