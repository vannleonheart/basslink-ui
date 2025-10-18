import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'sidebar-menu-dashboard',
		title: 'Dashboard',
		type: 'item',
		icon: 'heroicons-solid:home',
		url: '/dashboard',
		end: true,
		auth: true
	},
	{
		id: 'sidebar-menu-remittances',
		title: 'Kirim Dana',
		type: 'collapse',
		icon: 'heroicons-solid:banknotes',
		auth: true,
		children: [
			{
				id: 'sidebar-menu-remittance-list',
				title: 'Daftar Pengiriman',
				type: 'item',
				url: '/remittances/list',
				end: true,
				auth: true
			},
			{
				id: 'sidebar-menu-new-remittance',
				title: 'Kirim Dana',
				type: 'item',
				url: '/remittances/new',
				end: true,
				auth: 'agent'
			}
		]
	},
	{
		id: 'sidebar-menu-agents',
		title: 'Agen',
		type: 'item',
		icon: 'heroicons-solid:briefcase',
		url: '/agents',
		end: true,
		auth: 'admin'
	},
	{
		id: 'sidebar-menu-customers',
		title: 'Pengirim Dana',
		type: 'collapse',
		icon: 'heroicons-solid:users',
		auth: ['agent', 'admin'],
		children: [
			{
				id: 'sidebar-menu-customer-list',
				title: 'Daftar Pengirim',
				type: 'item',
				url: '/senders/list',
				end: true,
				auth: ['agent', 'admin']
			},
			{
				id: 'sidebar-menu-new-customer',
				title: 'Tambah Pengirim',
				type: 'item',
				url: '/senders/new',
				end: true,
				auth: 'agent'
			}
		]
	},
	{
		id: 'sidebar-menu-contacts',
		title: 'Penerima Dana',
		type: 'collapse',
		icon: 'heroicons-solid:user-group',
		auth: ['agent', 'admin'],
		children: [
			{
				id: 'sidebar-menu-contact-list',
				title: 'Daftar Penerima',
				type: 'item',
				url: '/recipients/list',
				end: true,
				auth: ['agent', 'admin']
			},
			{
				id: 'sidebar-menu-new-contact',
				title: 'Tambah Penerima',
				type: 'item',
				url: '/recipients/new',
				end: true,
				auth: 'agent'
			}
		]
	},
	{
		id: 'sidebar-menu-settings',
		title: 'Pengaturan',
		type: 'collapse',
		icon: 'heroicons-solid:cog-6-tooth',
		end: false,
		auth: true,
		children: [
			{
				id: 'sidebar-menu-admin-users',
				title: 'Akun Admin',
				type: 'item',
				url: '/users',
				end: true,
				auth: 'admin'
			},
			{
				id: 'sidebar-menu-agent-users',
				title: 'Akun Agen',
				type: 'item',
				url: '/users',
				end: true,
				auth: 'agent'
			},
			{
				id: 'sidebar-menu-rates',
				title: 'Rate',
				type: 'item',
				url: '/rates',
				end: true,
				auth: 'admin'
			}
		]
	}
];

export default navigationConfig;
