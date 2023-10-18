<script lang="ts">
	import { Icon } from 'flowbite-svelte-icons';
	import {
		TableHeadCell,
		TableBodyCell,
		TableBodyRow,
		MultiSelect,
		TableBody,
		TableHead,
		Indicator,
		Spinner,
		Button,
		Search,
		Select,
		Input,
		Label,
		Modal,
		Table,
		Card
	} from 'flowbite-svelte';
	import { onMount } from 'svelte';

	import ButtonLoading from '$lib/component/ButtonLoading.svelte';
	import BreadCrump from '$lib/component/BreadCrump.svelte';
	import Stepper from '$lib/component/Stepper.svelte';
	import { checkTenant } from '$lib/utils/check';
	import { GetListOrganisasi } from '$lib/forSelect/organisasi';
	import { GetListUnit } from '$lib/forSelect/unit';
	import type { ISelect } from '$lib/interface/ISelect';
	import type { IStepper } from '$lib/interface/IStepper';
	import Error from '$lib/component/Error.svelte';
	import Select2 from '$lib/component/Select2.svelte';
	import { GetListTahun } from '$lib/forSelect/tahun';
	import { GetListUrusan } from '$lib/forSelect/urusan';
	import { GetListBidang } from '$lib/forSelect/bidang';
	import { GetListProgram } from '$lib/forSelect/program';
	import { GetListKegiatan } from '$lib/forSelect/kegiatan';
	import { page } from '$app/stores';
	import type { IDpa } from '$lib/interface/IDpa';
	import { toasts } from '$lib/component/toast/ToastStore';
	import type { ITenant } from '$lib/interface/ITenant';
	import type { ITahun } from '$lib/interface/ITahun';
	import type { IDinas } from '$lib/interface/IDinas';
	import { goto } from '$app/navigation';
	import type { IUrusan } from '$lib/interface/IUrusan';
	import type { IBidang } from '$lib/interface/IBidang';
	import type { IProgram } from '$lib/interface/IProgram';
	import type { IUnit } from '$lib/interface/IUnit';
	import type { IOrganisasi } from '$lib/interface/IOrganisasi';
	import type { IKegiatan } from '$lib/interface/IKegiatan';
	import { formatCurrency } from '$lib/utils/rupiah';
	import { One, Update, UpdateRincian } from '$lib/api/pembangunan/dpa/informasi';

	let myBreadItems = [
		{ label: 'Home', href: '/dashboard' },
		{ label: 'DPA', href: '/pembangunan/dpa' },
		{ label: 'Informasi DPA', href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId },
		{
			label: 'Rincian DPA',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId + '/rincian'
		}
	];

	let stepperData: IStepper[] = [
		{
			label: 'Informasi DPA',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId
		},
		{
			label: 'Rincian DPA',
			href: '/pembangunan/dpa/add/' + $page.params.dpaPembangunanId + '/rincian'
		},
		{
			label: 'Sub Kegiatan',
			href: ''
		}
	];

	let isLoadingAdd: boolean = false;

	let errorMessage: Record<any, any> = {};
	let dataRincian: Record<any, any> = {
		id: $page.params.dpaPembangunanId
	};

	let DataUrusan: ISelect[] | boolean;
	let DataUrusanSelected: ISelect;
	const handleChangeUrusan = async (event: any) => {
		DataBidang = await GetListBidang('', event.detail.value.value);
		if (Bidang.id == '') {
			DataBidangSelected = {
				label: 'Pilih Bidang',
				value: '0'
			};
		} else {
			DataBidang.find((d) => {
				if (d.value == Bidang.id) {
					DataBidangSelected = {
						value: Bidang.id,
						label: Bidang.kode + ' | ' + Bidang.nomenklatur
					};
				}
			});
		}
	};

	let DataBidang: ISelect[] | boolean;
	let DataBidangSelected: ISelect;
	const handleChangeBidang = async (event: any) => {
		if (Program.id == '') {
			DataProgramSelected = {
				label: 'Pilih Program',
				value: '0'
			};
		} else {
			if (event.detail.value.value != '0') {
				DataProgram = await GetListProgram('', event.detail.value.value);
				DataProgram.find((d) => {
					if (d.value == Program.id) {
						DataProgramSelected = {
							value: Program.id,
							label: Program.kode + ' | ' + Program.nomenklatur
						};
					}
				});
			}
		}
		if (Organisasi.id == '') {
			DataOrganisasiSelected = {
				label: 'Pilih Organisasi',
				value: '0'
			};
		} else {
			if (event.detail.value.value != '0') {
				DataOrganisasi = await GetListOrganisasi('', event.detail.value.value);
				DataOrganisasi.find((d) => {
					if (d.value == Organisasi.id) {
						DataOrganisasiSelected = {
							value: Organisasi.id,
							label: Organisasi.kode + ' | ' + Organisasi.nomenklatur
						};
					}
				});
			}
		}
	};

	let DataProgram: ISelect[] | boolean;
	let DataProgramSelected: ISelect;
	const handleChangeProgram = async (event: any) => {
		if (Kegiatan.id == '') {
			DataKegiatanSelected = {
				label: 'Pilih Kegiatan',
				value: '0'
			};
		} else {
			if (event.detail.value.value != '0') {
				DataKegiatan = await GetListKegiatan('', event.detail.value.value);
				DataKegiatan.find((d) => {
					if (d.value == Kegiatan.id) {
						DataKegiatanSelected = {
							value: Kegiatan.id,
							label: Kegiatan.kode + ' | ' + Kegiatan.nomenklatur
						};
					}
				});
			}
		}
	};

	let DataKegiatan: ISelect[] | boolean;
	let DataKegiatanSelected: ISelect;
	const handleChangeKegiatan = async (event: any) => {
		dataRincian.kegiatanId = event.detail.value.value;
	};

	let DataOrganisasi: ISelect[] | boolean;
	let DataOrganisasiSelected: ISelect;
	const handleChangeOrganisasi = async (event: any) => {
		if (Unit.id == '') {
			DataUnitSelected = {
				label: 'Pilih Unit',
				value: '0'
			};
		} else {
			if (event.detail.value.value != '0') {
				DataUnit = await GetListUnit('', event.detail.value.value);
				DataUnit.find((d) => {
					if (d.value == Unit.id) {
						DataUnitSelected = {
							value: Unit.id,
							label: Unit.kode + ' | ' + Unit.nomenklatur
						};
					}
				});
			}
		}
	};

	let DataUnit: ISelect[] | boolean;
	let DataUnitSelected: ISelect;
	const handleChangeUnit = async (event: any) => {
		dataRincian.unitId = event.detail.value.value;
	};

	let DPA: IDpa = {
		id: '',
		noDpa: '',
		tahunId: '',
		dinasId: '',
		jumlahAlokasi: 0,
		kegiatanId: '',
		unitId: '',
		penggunaAnggaran: '',
		ttdDpa: ''
	};

	let Urusan: IUrusan = {
		id: '',
		kode: '',
		nomenklatur: ''
	};

	let Bidang: IBidang = {
		id: '',
		kode: '',
		nomenklatur: '',
		urusanId: ''
	};

	let Program: IProgram = {
		id: '',
		kode: '',
		nomenklatur: '',
		bidangId: ''
	};

	let Kegiatan: IKegiatan = {
		id: '',
		kode: '',
		nomenklatur: '',
		programId: ''
	};

	let Organisasi: IOrganisasi = {
		id: '',
		kode: '',
		nomenklatur: '',
		bidangId: ''
	};

	let Unit: IUnit = {
		id: '',
		kode: '',
		nomenklatur: '',
		organisasiId: ''
	};

	let Tahun: ITahun = {
		id: '',
		tahun: '',
		active: null
	};

	let Dinas: IDinas = {
		id: '',
		name: '',
		email: '',
		noHp: '',
		address: '',
		logo: ''
	};

	let tenant: ITenant = {
		accessToken: '',
		status: '',
		dinas: ''
	};

	onMount(async () => {
		const tenantCheck = checkTenant();
		tenant = {
			accessToken: tenantCheck.accessToken,
			status: tenantCheck.status,
			dinas: tenantCheck.dinas
		};

		await getOneDpa($page.params.dpaPembangunanId);

		DataUrusan = await GetListUrusan('');
		if (Urusan.id != '') {
			DataUrusan.find((d) => {
				if (d.value == Urusan.id) {
					DataUrusanSelected = {
						value: Urusan.id,
						label: Urusan.kode + ' | ' + Urusan.nomenklatur
					};
				}
			});
		}
	});

	async function getOneDpa(id: string) {
		let dataPost = {
			dpaPembangunanId: $page.params.dpaPembangunanId,
			dinasId: ''
		};
		
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataPost.dinasId = tenant.dinas;
			}
		}
		const dataDpa = await One(dataPost);
		if (dataDpa.status == 200) {
			DPA = {
				id: dataDpa.data.id,
				noDpa: dataDpa.data.noDpa,
				tahunId: dataDpa.data.tahunId,
				dinasId: dataDpa.data.dinasId,
				jumlahAlokasi: dataDpa.data.jumlahAlokasi,
				kegiatanId: dataDpa.data.kegiatanId,
				unitId: dataDpa.data.unitId,
				penggunaAnggaran: dataDpa.data.penggunaAnggaran,
				ttdDpa: dataDpa.data.ttdDpa
			};

			Tahun = {
				id: dataDpa.data.tahunId,
				tahun: dataDpa.data.tahun,
				active: null
			};

			Dinas.id = dataDpa.data.dinasId;
			Dinas.name = dataDpa.data.name;

			Urusan = {
				id: dataDpa.data.urusanId,
				kode: dataDpa.data.urusanKode,
				nomenklatur: dataDpa.data.urusanNomenklatur
			};

			Bidang = {
				id: dataDpa.data.bidangId,
				kode: dataDpa.data.bidangKode,
				nomenklatur: dataDpa.data.bidangNomenklatur,
				urusanId: dataDpa.data.urusanId
			};

			Program = {
				id: dataDpa.data.programId,
				kode: dataDpa.data.programKode,
				nomenklatur: dataDpa.data.programKode,
				bidangId: dataDpa.data.bidangId
			};

			Kegiatan = {
				id: dataDpa.data.kegiatanId,
				kode: dataDpa.data.kegiatanKode,
				nomenklatur: dataDpa.data.kegiatanNomenklatur,
				programId: dataDpa.data.programId
			};

			Organisasi = {
				id: dataDpa.data.organisasiId,
				kode: dataDpa.data.organisasiKode,
				nomenklatur: dataDpa.data.organisasiNomenklatur,
				bidangId: dataDpa.data.bidangId
			};

			Unit = {
				id: dataDpa.data.unitId,
				kode: dataDpa.data.unitKode,
				nomenklatur: dataDpa.data.unitNomenklatur,
				organisasiId: dataDpa.data.organisasiId
			};
		} else {
			//notif
			if (typeof dataDpa.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: dataDpa.message,
						timeout: 3000
					}
				]);
			}
		}
	}

	async function addRincian(e: any) {		
		if (tenant.status == '1') {
			if (typeof tenant.dinas != 'undefined') {
				dataRincian.dinasId = tenant.dinas;
			}
		}
		isLoadingAdd = true;
		const responses: any = await UpdateRincian(dataRincian);
		if (responses.status >= 200 && responses.status <= 300) {
			toasts.update((toastsList) => [
				...toastsList,
				{
					id: Date.now(),
					typeToast: 'success',
					messageToast: responses.message,
					timeout: 3000
				}
			]);
			isLoadingAdd = false;
			goto('/pembangunan/dpa/add/' + responses.data.id + '/rincian/subKegiatan');
		} else {
			//notif
			if (typeof responses.message !== 'undefined') {
				toasts.update((toastsList) => [
					...toastsList,
					{
						id: Date.now(),
						typeToast: 'error',
						messageToast: responses.message,
						timeout: 3000
					}
				]);
			}
			//error
			if (typeof responses.error !== 'undefined') {
				if (typeof responses.error === 'object') {
					for (let key in responses.error) {
						if (responses.error.hasOwnProperty(key)) {
							const value = responses.error[key];
							errorMessage[key] = value;
						}
					}
				}
			}
		}
		isLoadingAdd = false;
	}
</script>

<BreadCrump breadItems={myBreadItems} />
<div class="">
	<div class="font-bold text-xl text-[#1E40AF] mb-2">Rincian DPA</div>

	<div class="wrap bg-white p-6 rounded-md shadow-md">
		<div class="mb-3">
			<Stepper stepperItems={stepperData} active={1} />
		</div>
		<form on:submit|preventDefault={addRincian} class="flex flex-col gap-3">
			<div class="w-full mb-2">
				<Label class="mb-2">Informasi DPA</Label>
				<Card class="w-full max-w-full p-2">
					<div class="flex flex-row justify-between gap-2">
						<div class="flex flex-col">
                            <p class="text-lg font-bold text-black">
                                DPA: {DPA.noDpa}
							</p>
                            <p class="text-md font-bold pb-0 mb-0 text-black">Dinas: {Dinas.name}</p>
							<p class="text-xs font-bold text-black">Tahun: <span class="italic">{Tahun.tahun}</span></p>
						</div>
						<div class="flex flex-col">
							<p class="text-lg font-bold pb-0 mb-0 text-black text-end">
								Alokasi:
								<span class="text-emerald-800">{formatCurrency(DPA.jumlahAlokasi)}</span>
							</p>
						</div>
					</div>
				</Card>
			</div>
			<hr />
			<div class="w-full flex gap-2 items-center">
				<div class="w-1/2">
					<Label class="space-y-2">
						<span>Urusan</span>
						<Select2
							placeholder="Pilih Urusan"
							name="urusanId"
							data={DataUrusan}
							selected={DataUrusanSelected}
							on:Select2Change={handleChangeUrusan}
						/>
						{#if typeof errorMessage.urusanId !== 'undefined'}
							<Error messageError={errorMessage.urusanId} typeError="error" />
						{/if}
					</Label>
				</div>
				<div class="w-1/2">
					<Label class="space-y-2">
						<span>Bidang</span>
						<Select2
							placeholder="Pilih Bidang"
							name="bidangId"
							data={DataBidang}
							selected={DataBidangSelected}
							on:Select2Change={handleChangeBidang}
						/>
						{#if typeof errorMessage.bidangId !== 'undefined'}
							<Error messageError={errorMessage.bidangId} typeError="error" />
						{/if}
					</Label>
				</div>
			</div>

			<div class="w-full flex gap-2 items-center">
				<div class="w-1/2">
					<Label class="space-y-2">
						<span>Program</span>
						<Select2
							placeholder="Pilih Program"
							name="programId"
							data={DataProgram}
							selected={DataProgramSelected}
							on:Select2Change={handleChangeProgram}
						/>
						{#if typeof errorMessage.programId !== 'undefined'}
							<Error messageError={errorMessage.programId} typeError="error" />
						{/if}
					</Label>
				</div>
				<div class="w-1/2">
					<Label class="space-y-2">
						<span>Kegiatan</span>
						<Select2
							placeholder="Pilih Kegiatan"
							name="kegiatanId"
							data={DataKegiatan}
							selected={DataKegiatanSelected}
							on:Select2Change={handleChangeKegiatan}
						/>
						{#if typeof errorMessage.kegiatanId !== 'undefined'}
							<Error messageError={errorMessage.kegiatanId} typeError="error" />
						{/if}
					</Label>
				</div>
			</div>
			<div class="w-full flex gap-2 items-center">
				<div class="w-1/2">
					<Label class="space-y-2">
						<span>Organisasi</span>
						<Select2
							placeholder="Pilih Organisasi"
							name="organisasiId"
							data={DataOrganisasi}
							selected={DataOrganisasiSelected}
							on:Select2Change={handleChangeOrganisasi}
						/>
						{#if typeof errorMessage.organisasiId !== 'undefined'}
							<Error messageError={errorMessage.organisasiId} typeError="error" />
						{/if}
					</Label>
				</div>
				<div class="w-1/2">
					<Label class="space-y-2">
						<span>Unit</span>
						<Select2
							placeholder="Pilih Unit"
							name="unitId"
							data={DataUnit}
							selected={DataUnitSelected}
							on:Select2Change={handleChangeUnit}
						/>
						{#if typeof errorMessage.unitId !== 'undefined'}
							<Error messageError={errorMessage.unitId} typeError="error" />
						{/if}
					</Label>
				</div>
			</div>
			<div class="flex justify-end">
				<div class="flex flex-row gap-2">
					<div>
						<Button
							type="button"
							href={'/pembangunan/dpa/add/' + $page.params.dpaPembangunanId}
							class="hover:no-underline hover:bg-[#CB2A2A] bg-[#FF3636] "
						>
							<svg
								class="w-4 h-4 text-white dark:text-white mr-1"
								aria-hidden="true"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 14 10"
							>
								<path
									stroke="currentColor"
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M13 5H1m0 0 4 4M1 5l4-4"
								/>
							</svg>
							Sebelumnya
						</Button>
					</div>
					<div>
						{#if !isLoadingAdd}
							<Button type="submit" class="bg-[#1E40AF] hover:bg-[#183593] ">
								Selanjutnya
								<svg
									class="w-4 h-4 text-white dark:text-white ml-1"
									aria-hidden="true"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 14 10"
								>
									<path
										stroke="currentColor"
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M1 5h12m0 0L9 1m4 4L9 9"
									/>
								</svg>
							</Button>
						{/if}
						{#if isLoadingAdd}
							<ButtonLoading />
						{/if}
					</div>
				</div>
			</div>
		</form>
	</div>
</div>
