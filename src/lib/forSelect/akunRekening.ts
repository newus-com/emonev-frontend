import type { ISelect } from "$lib/interface/ISelect";

import { List as ListAkunRekening } from '$lib/api/rekening/akunRekening';
import { toasts } from "$lib/component/toast/ToastStore";

export async function GetListAkunRekening(search: string) {
    let data: Record<any, any> = {
        search: {
            column: [
                "akun_rekening.kode",
                "akun_rekening.uraianAkun"
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

    let DataAkunRekening: ISelect[];
    const GetDataAkunRekening = await ListAkunRekening(data);

    if (GetDataAkunRekening.status == 200) {
        DataAkunRekening = GetDataAkunRekening.data.data.map((item: any) => ({
            label: `${item.kode} | ${item.uraianAkun}`,
            value: item.id
        }));
        return DataAkunRekening;
    } else {
        DataAkunRekening = [];
        if (typeof GetDataAkunRekening.message !== 'undefined') {
            toasts.update((toastsList) => [
                ...toastsList,
                {
                    id: Date.now(),
                    typeToast: 'error',
                    messageToast: GetDataAkunRekening.message,
                    timeout: 3000
                }
            ]);
        }
        return DataAkunRekening;
    }
}