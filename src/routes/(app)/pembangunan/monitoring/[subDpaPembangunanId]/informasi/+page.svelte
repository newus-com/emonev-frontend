<script lang="ts">
	import { Button, Input, Label, Radio } from 'flowbite-svelte';
	import Error from '$lib/component/Error.svelte';
	import ButtonLoading from '$lib/component/ButtonLoading.svelte';

	let errorMessage: Record<any, any> = {};
    let isLoadingAddOrUpdate: boolean = false;
</script>

<Label defaultClass="text-lg text-center font-medium block">Informasi Pembangunan</Label>
<div class="flex flex-col gap-3">
	<hr />
	<Label>Keselamatan Pekerja Konstruksi :</Label>
	<hr />
	<div class="w-full flex">
		<div class="w-1/2">
			<Label class="text-[14px]">
				Semua Pekerja Dilindungi Dengan Asuransi Kesehatan
				<div class="flex gap-3">
					<Radio name="kriteria1" value="ya">Ya</Radio>
					<Radio name="kriteria1" value="tidak">Tidak</Radio>
					<Radio name="kriteria1" value="sebagian">Sebagian</Radio>
				</div>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-1/2">
			<Label class="text-[14px]">
				Kalau Terjadi Kecelakaan Kerja Sudah Ada Rencana
				<div class="flex gap-3">
					<Radio name="kriteria2" value="ya">Ya</Radio>
					<Radio name="kriteria2" value="tidak">Tidak</Radio>
				</div>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>
	<hr />
	<div class="w-full flex">
		<div class="w-1/2">
			<Label class="text-[14px]">
				Dilokasi Kerja Sudah Tersedia Kotak P3K
				<div class="flex gap-3">
					<Radio name="kriteria1" value="ya">Ya</Radio>
					<Radio name="kriteria1" value="tidak">Tidak</Radio>
				</div>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-1/2">
			<Label class="text-[14px]">
				Dilokasi Kerja Sudah Ada Rambu Keselamatan/Petunjuk
				<div class="flex gap-3">
					<Radio name="kriteria2" value="ya">Ya</Radio>
					<Radio name="kriteria2" value="tidak">Tidak</Radio>
				</div>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>
	<hr />
	<Label>Catatan :</Label>
	<hr />
	<Label class="text-[14px]">Kepala Tukang</Label>
	<div class="w-full flex gap-2">
		<div class="w-1/2">
			<Label class="text-[14px]">
				Berasal
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="text"
					placeholder="Berasal"
				/>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-1/2">
			<Label class="text-[14px]">
				Punya SKT/SKK ?
				<div class="flex gap-3 mt-2">
					<Radio name="kriteria2" value="ya">Ya</Radio>
					<Radio name="kriteria2" value="tidak">Tidak</Radio>
				</div>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>
	<hr />
	<div class="w-full flex gap-2">
		<div class="w-2/12">
			<Label class="text-[14px]">
				Jumlah Pekerja
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="number"
					placeholder="Jumlah"
				/>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-5/12">
			<Label class="text-[14px]">
				Pekerja Berasal Dari Kabupaten Pesisir Barat
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="number"
					placeholder="Jumlah"
				/>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-5/12">
			<Label class="text-[14px]">
				Pekerja Berasal Dari Luar Kabupaten Pesisir Barat
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="number"
					placeholder="Jumlah"
				/>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>
	<hr />
	<Label class="text-[14px]">Asal Material</Label>
	<div class="w-full flex gap-2">
		<div class="w-1/2">
			<Label class="text-[14px]">
				Pesisir Barat
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="number"
					placeholder="Jumlah"
				/>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
		<div class="w-1/2">
			<Label class="text-[14px]">
				Luar Pesisir Barat
				<Input
					class="focus:ring focus:ring-blue-300 focus:border-blue-500 bg-white mt-2"
					type="number"
					placeholder="Jumlah"
				/>
				{#if typeof errorMessage.judulKontrak !== 'undefined'}
					<Error messageError={errorMessage.judulKontrak} typeError="error" />
				{/if}
			</Label>
		</div>
	</div>
	<hr />
	<div class="mt-5 flex justify-end gap-2">
		{#if !isLoadingAddOrUpdate}
			<Button
				size="sm"
				type="button"
				class="bg-[#1E40AF] hover:bg-[#183593]">Simpan</Button
			>
		{/if}
		{#if isLoadingAddOrUpdate}
			<ButtonLoading />
		{/if}
	</div>
</div>
