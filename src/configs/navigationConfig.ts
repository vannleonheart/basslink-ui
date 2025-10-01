import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'sidebar-menu-disbursements',
		title: 'Pengiriman Dana',
		type: 'collapse',
		icon: 'heroicons-solid:banknotes',
		auth: true,
		children: [
			{
				id: 'sidebar-menu-disbursement-list',
				title: 'Daftar Pengiriman',
				type: 'item',
				url: '/disbursements/list',
				end: true,
				auth: true
			},
			{
				id: 'sidebar-menu-new-disbursement',
				title: 'Kirim Dana',
				type: 'item',
				url: '/disbursements/new',
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
				url: '/customers/list',
				end: true,
				auth: ['agent', 'admin']
			},
			{
				id: 'sidebar-menu-new-customer',
				title: 'Tambah Pengirim',
				type: 'item',
				url: '/customers/new',
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
		end: false,
		children: [
			{
				id: 'sidebar-menu-contact-list',
				title: 'Daftar Penerima',
				type: 'item',
				url: '/contacts/list',
				end: true,
				auth: ['agent', 'admin']
			},
			{
				id: 'sidebar-menu-new-contact',
				title: 'Tambah Penerima',
				type: 'item',
				url: '/contacts/new',
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
				title: 'Pengguna Admin',
				type: 'item',
				url: '/admin-users',
				end: true,
				auth: 'admin'
			},
			{
				id: 'sidebar-menu-agent-users',
				title: 'Pengguna Agen',
				type: 'item',
				url: '/agent-users',
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
