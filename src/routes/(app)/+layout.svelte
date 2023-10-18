<script lang="ts">
	import { Avatar, Button, Dropdown, DropdownItem } from 'flowbite-svelte';
	import { page } from '$app/stores';
	import { checkDinas, checkLogin, checkPermission } from '$lib/utils/check';
	import ToastContainer from '$lib/component/toast/ToastContainer.svelte';
	import Cookies from 'js-cookie';

	checkLogin();
	checkDinas();

	function menuMaster(path: string): string {
		const delimiter = '/';
		const exploded = path.split(delimiter);
		return typeof exploded[1] !== 'undefined' ? exploded[1] : '/';
	}

	function menuSub(path: string): string {
		const delimiter = '/';
		const exploded = path.split(delimiter);
		return typeof exploded[1] !== 'undefined' && typeof exploded[2] !== 'undefined'
			? '/' + exploded[1] + '/' + exploded[2]
			: '/';
	}

	let status: string | undefined = Cookies.get('status');
	let name: string | undefined = Cookies.get('name');
	let NameDinas: string | undefined = Cookies.get('NameDinas');

	let permission: string[] = [];

	const cookiePermission = Cookies.get('permission');

	if (typeof cookiePermission !== 'undefined') {
		permission = cookiePermission.split(',');
	}
</script>

<!-- <ToastContainer /> -->
<div class="py-5 px-5 bg-[#1E40AF]">
	<div class="mobile-menu md:hidden">
		<div class="mobile-menu-bar">
			<a href="/dashboard" class="flex mr-auto">
				<div class="flex items-center bg-[#F1F5F9] rounded-b-[18px] justify-center ml-2 p-1">
					<div class="">
						<img alt="E-Monev" class="z-2 sm:h-[45px] md:h-[60px] lg:h-[240px]" src="/logo.png" />
					</div>
				</div>
			</a>
			<a href="javascript:;" class="mobile-menu-toggler">
				<i data-lucide="bar-chart-2" class="w-8 h-8 text-white transform -rotate-90" />
			</a>
		</div>
		<div class="scrollable z-100">
			<a href="javascript:;" class="mobile-menu-toggler">
				<i data-lucide="x-circle" class="w-8 h-8 text-white transform -rotate-90" />
			</a>
			<ul class="scrollable__content py-2">
				{#if checkPermission('M_DASHBOARD', permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="/dashboard"
						class="menu {menuMaster($page.url.pathname) == 'dashboard' ? 'menu--active' : ''}"
					>
						<div class="menu__icon"><i data-lucide="home" /></div>
						<div class="menu__title">Dashboard</div>
					</a>
				</li>
				{/if}
				{#if checkPermission(['M_DPA_ANGGARAN','M_RENCANA_PENGAMBILAN','M_LAPORAN_ANGGARAN'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="menu {menuMaster($page.url.pathname) == 'anggaran' ? 'menu--active' : ''}"
					>
						<div class="menu__icon"><i data-lucide="pocket" /></div>
						<div class="menu__title">
							Anggaran
							<div
								class="menu__sub-icon {menuMaster($page.url.pathname) == 'anggaran'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul class={menuMaster($page.url.pathname) == 'anggaran' ? 'menu__sub-open' : ''}>
						{#if checkPermission('M_DPA_ANGGARAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/anggaran/dpa"
								class="menu {menuSub($page.url.pathname) == '/anggaran/dpa' ? 'menu--active' : ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">DPA</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_RENCANA_PENGAMBILAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/anggaran/pengambilan"
								class="menu no-underline {menuSub($page.url.pathname) == '/anggaran/pengambilan'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Rencana Pengambilan</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_LAPORAN_ANGGARAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/anggaran/laporan"
								class="menu no-underline {menuSub($page.url.pathname) == '/anggaran/laporan'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Laporan</div>
							</a>
						</li>
						{/if}
					</ul>
				</li>
				{/if}
				{#if checkPermission(['M_DPA_PEMBANGUNAN','M_MONITORING_PEMBANGUNAN','M_LAPORAN_PEMBANGUNAN'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="menu {menuMaster($page.url.pathname) == 'pembangunan' ? 'menu--active' : ''}"
					>
						<div class="menu__icon"><i data-lucide="building" /></div>
						<div class="menu__title">
							Pembangunan
							<div
								class="menu__sub-icon {menuMaster($page.url.pathname) == 'pembangunan'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul class={menuMaster($page.url.pathname) == 'pembangunan' ? 'menu__sub-open' : ''}>
						{#if checkPermission('M_DPA_PEMBANGUNAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/pembangunan/dpa"
								class="menu {menuSub($page.url.pathname) == '/pembangunan/dpa'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">DPA</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_MONITORING_PEMBANGUNAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/pembangunan/monitoring"
								class="menu {menuSub($page.url.pathname) == '/pembangunan/monitoring'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Monitoring</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_LAPORAN_PEMBANGUNAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/pembangunan/laporan"
								class="menu {menuSub($page.url.pathname) == '/pembangunan/lapora'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Laporan</div>
							</a>
						</li>
						{/if}
					</ul>
				</li>
				{/if}
				{#if checkPermission(['M_USER','M_ROLE'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="menu {menuMaster($page.url.pathname) == 'management_users'
							? 'menu--active'
							: ''}"
					>
						<div class="menu__icon"><i data-lucide="users" /></div>
						<div class="menu__title">
							Kelola Users
							<div
								class="menu__sub-icon {menuMaster($page.url.pathname) == 'management_users'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul class={menuMaster($page.url.pathname) == 'management_users' ? 'menu__sub-open' : ''}>
						{#if checkPermission('M_USER', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/management_users/role"
								class="menu {menuSub($page.url.pathname) == '/management_users/role'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Role</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_ROLE', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/management_users/user"
								class="menu {menuSub($page.url.pathname) == '/management_users/user'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Users</div>
							</a>
						</li>
						{/if}
					</ul>
				</li>
				{/if}
				{#if checkPermission(['M_TAHUN','M_DINAS','M_SATUAN','M_SUMBER_DANA','M_PERENCANAAN','M_REKENING','M_ORGANISASI'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="menu {menuMaster($page.url.pathname) == 'master' ? 'menu--active' : ''}"
					>
						<div class="menu__icon"><i data-lucide="shopping-bag" /></div>
						<div class="menu__title">
							Master
							<div
								class="menu__sub-icon {menuMaster($page.url.pathname) == 'master'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul class={menuMaster($page.url.pathname) == 'master' ? 'menu__sub-open' : ''}>
						{#if checkPermission('M_TAHUN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/tahun"
								class="menu {menuSub($page.url.pathname) == '/master/tahun' ? 'menu--active' : ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Tahun</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_DINAS', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/dinas"
								class="menu {menuSub($page.url.pathname) == '/master/dinas' ? 'menu--active' : ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Dinas</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_SATUAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/satuan"
								class="menu {menuSub($page.url.pathname) == '/master/satuan' ? 'menu--active' : ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Satuan</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_SUMBER_DANA', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/sumberDana"
								class="menu {menuSub($page.url.pathname) == '/master/sumberDana'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Sumber Dana</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_PERENCANAAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/perencanaan"
								class="menu {menuSub($page.url.pathname) == '/master/perencanaan'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Perencanaan</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_REKENING', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/rekening"
								class="menu {menuSub($page.url.pathname) == '/master/rekening'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Rekening</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_ORGANISASI', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/organisasi"
								class="menu {menuSub($page.url.pathname) == '/master/organisasi'
									? 'menu--active'
									: ''}"
							>
								<div class="menu__icon"><i data-lucide="minus" /></div>
								<div class="menu__title">Organisasi</div>
							</a>
						</li>
						{/if}
					</ul>
				</li>
				{/if}
			</ul>
		</div>
	</div>
	<!-- END: Mobile Menu -->
	<div class="flex mt-[4.7rem] md:mt-0">
		<!-- BEGIN: Side Menu -->
		<nav class="side-nav bg-[#1E40AF] z-0">
			<div
				class="flex items-center bg-[#F1F5F9] sm:rounded-b-[18px] md:rounded-b-[26px] lg:rounded-b-[26px] xl:rounded-b-[88px] justify-center ml-2 p-2"
			>
				<div class="z-0">
					<img
						alt="E-Monev"
						class="sm:h-[30px] md:h-[60px] lg:h-[60px] xl:h-[240px] w-auto"
						src="/logo.png"
					/>
				</div>
			</div>
			<div class="side-nav__devider my-6" />
			<ul>
				{#if checkPermission('M_DASHBOARD', permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="/dashboard"
						class="side-menu {menuMaster($page.url.pathname) == 'dashboard'
							? 'side-menu--active'
							: ''}"
					>
						<div class="side-menu__icon"><i data-lucide="home" /></div>
						<div class="side-menu__title">Dashboard</div>
					</a>
				</li>
				{/if}
				{#if checkPermission(['M_DPA_ANGGARAN','M_RENCANA_PENGAMBILAN','M_LAPORAN_ANGGARAN'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="side-menu {menuMaster($page.url.pathname) == 'anggaran'
							? 'side-menu--active'
							: ''}"
					>
						<div class="side-menu__icon"><i data-lucide="pocket" /></div>
						<div class="side-menu__title">
							Anggaran
							<div
								class="side-menu__sub-icon {menuMaster($page.url.pathname) == 'anggaran'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul class={menuMaster($page.url.pathname) == 'anggaran' ? 'side-menu__sub-open' : ''}>
						{#if checkPermission('M_DPA_ANGGARAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/anggaran/dpa"
								class="side-menu {menuSub($page.url.pathname) == '/anggaran/dpa'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">DPA</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_RENCANA_PENGAMBILAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/anggaran/pengambilan"
								class="side-menu no-underline {menuSub($page.url.pathname) ==
								'/anggaran/pengambilan'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Rencana Pengambilan</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_LAPORAN_ANGGARAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/anggaran/laporan"
								class="side-menu no-underline {menuSub($page.url.pathname) ==
								'/anggaran/laporan'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Laporan</div>
							</a>
						</li>
						{/if}
					</ul>
				</li>
				{/if}
				{#if checkPermission(['M_DPA_PEMBANGUNAN','M_MONITORING_PEMBANGUNAN','M_LAPORAN_PEMBANGUNAN'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="side-menu {menuMaster($page.url.pathname) == 'pembangunan'
							? 'side-menu--active'
							: ''}"
					>
						<div class="side-menu__icon"><i data-lucide="building" /></div>
						<div class="side-menu__title">
							Pembangunan
							<div
								class="side-menu__sub-icon {menuMaster($page.url.pathname) == 'pembangunan'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul class={menuMaster($page.url.pathname) == 'pembangunan' ? 'side-menu__sub-open' : ''}>
						{#if checkPermission('M_DPA_PEMBANGUNAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/pembangunan/dpa"
								class="side-menu {menuSub($page.url.pathname) ==
								'/pembangunan/dpa'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">DPA</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_MONITORING_PEMBANGUNAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/pembangunan/monitoring"
								class="side-menu {menuSub($page.url.pathname) ==
								'/pembangunan/monitoring'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Monitoring</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_LAPORAN_PEMBANGUNAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/pembangunan/laporan"
								class="side-menu {menuSub($page.url.pathname) == '/pembangunan/laporan'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Laporan</div>
							</a>
						</li>
						{/if}
					</ul>
				</li>
				{/if}
				{#if checkPermission(['M_USER','M_ROLE'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="side-menu {menuMaster($page.url.pathname) == 'management_users'
							? 'side-menu--active'
							: ''}"
					>
						<div class="side-menu__icon"><i data-lucide="users" /></div>
						<div class="side-menu__title">
							Kelola Users
							<div
								class="side-menu__sub-icon {menuMaster($page.url.pathname) == 'management_users'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul
						class={menuMaster($page.url.pathname) == 'management_users'
							? 'side-menu__sub-open'
							: ''}
					>
						{#if checkPermission('M_USER', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/management_users/role"
								class="side-menu {menuSub($page.url.pathname) == '/management_users/role'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Role</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_ROLE', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/management_users/user"
								class="side-menu {menuSub($page.url.pathname) == '/management_users/user'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Users</div>
							</a>
						</li>
						{/if}	
					</ul>
				</li>
				{/if}
				{#if checkPermission(['M_TAHUN','M_DINAS','M_SATUAN','M_SUMBER_DANA','M_PERENCANAAN','M_REKENING','M_ORGANISASI'], permission)}
				<li>
					<a
						style="text-decoration: none;"
						href="javascript:;"
						class="side-menu {menuMaster($page.url.pathname) == 'master'
							? 'side-menu--active'
							: ''}"
					>
						<div class="side-menu__icon"><i data-lucide="shopping-bag" /></div>
						<div class="side-menu__title">
							Master
							<div
								class="side-menu__sub-icon {menuMaster($page.url.pathname) == 'master'
									? 'transform rotate-180'
									: ''}"
							>
								<i data-lucide="chevron-down" />
							</div>
						</div>
					</a>
					<ul class={menuMaster($page.url.pathname) == 'master' ? 'side-menu__sub-open' : ''}>
						{#if checkPermission('M_TAHUN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/tahun"
								class="side-menu {menuSub($page.url.pathname) == '/master/tahun'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Tahun</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_DINAS', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/dinas"
								class="side-menu {menuSub($page.url.pathname) == '/master/dinas'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Dinas</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_SATUAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/satuan"
								class="side-menu {menuSub($page.url.pathname) == '/master/satuan'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Satuan</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_SUMBER_DANA', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/sumberDana"
								class="side-menu {menuSub($page.url.pathname) == '/master/sumberDana'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Sumber Dana</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_PERENCANAAN', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/perencanaan"
								class="side-menu {menuSub($page.url.pathname) == '/master/perencanaan'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Perencanaan</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_REKENING', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/rekening"
								class="side-menu {menuSub($page.url.pathname) == '/master/rekening'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Rekening</div>
							</a>
						</li>
						{/if}
						{#if checkPermission('M_ORGANISASI', permission)}
						<li>
							<a
								style="text-decoration: none;"
								href="/master/organisasi"
								class="side-menu {menuSub($page.url.pathname) == '/master/organisasi'
									? 'side-menu--active'
									: ''}"
							>
								<div class="side-menu__icon"><i data-lucide="minus" /></div>
								<div class="side-menu__title">Organisasi</div>
							</a>
						</li>
						{/if}
					</ul>
				</li>
				{/if}
				<li class="side-nav__devider my-6" />
			</ul>
		</nav>
		<!-- END: Side Menu -->
		<!-- BEGIN: Content -->
		<div class="content">
			<!-- BEGIN: Top Bar -->
			<div class="top-bar w-full mt-3">
				<!-- BEGIN: Breadcrumb -->
				<nav aria-label="breadcrumb" class="mr-auto sm:flex w-full">
					<div class="flex justify-between items-center w-full">
						<div>
							{#if status == '1'}
								<p class="font-bold text-xl text-[#1E40AF]">{NameDinas}</p>
								<p class="text-md text-secondary">{name}</p>
							{/if}
							{#if status == '0'}
								<p class="font-bold text-xl text-[#1E40AF]">Semua Dinas</p>
								<p class="text-md text-secondary">Super Admin</p>
							{/if}
						</div>
						<div class="profile">
							<Button
								pill
								id="avatar_with_name"
								class="p-0 shadow rounded-lg bg-white text-[#1E40AF] hover:bg-[#1E40AF] hover:text-white"
							>
								<Avatar src="/logoEmonev.png" class="rounded-md w-12 h-[40px]" />
							</Button>
							<Dropdown triggeredBy="#avatar_with_name">
								<div slot="header" class="px-4 py-2">
									<span class="block text-sm text-gray-900 dark:text-white">Super Admin</span>
									<span class="block truncate text-sm font-medium">name@flowbite.com</span>
								</div>
								<DropdownItem>Dashboard</DropdownItem>
								<DropdownItem href="/profile">Profile</DropdownItem>
								<DropdownItem>Earnings</DropdownItem>
								<DropdownItem slot="footer">Sign out</DropdownItem>
							</Dropdown>
						</div>
					</div>
				</nav>
			</div>
			<!-- END: Top Bar -->

			<!-- CONTENT -->
			<div class=" p-4 p-3">
				<slot />
			</div>
			<!-- CONTENT -->
		</div>
		<!-- END: Content -->
	</div>
</div>
