import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'sidebar-menu-disbursements',
		title: 'Disbursements',
		type: 'item',
		icon: 'heroicons-solid:banknotes',
		url: '/disbursements',
		end: true,
		auth: true
	},
	{
		id: 'sidebar-menu-agents',
		title: 'Agents',
		type: 'item',
		icon: 'heroicons-solid:briefcase',
		url: '/agents',
		end: true,
		auth: 'admin'
	},
	{
		id: 'sidebar-menu-users',
		title: 'Users',
		type: 'item',
		icon: 'heroicons-solid:users',
		url: '/users',
		end: true,
		auth: 'agent'
	},
	{
		id: 'sidebar-menu-contacts',
		title: 'Contacts',
		type: 'item',
		icon: 'heroicons-solid:user-group',
		url: '/contacts',
		end: true,
		auth: ['user', 'agent']
	},
	{
		id: 'sidebar-menu-settings',
		title: 'Settings',
		type: 'collapse',
		icon: 'heroicons-solid:cog-6-tooth',
		end: false,
		auth: true,
		children: [
			{
				id: 'sidebar-menu-admin-users',
				title: 'Users',
				type: 'item',
				url: '/admin-users',
				end: true,
				auth: 'admin'
			},
			{
				id: 'sidebar-menu-agent-users',
				title: 'Users',
				type: 'item',
				url: '/agent-users',
				end: true,
				auth: 'agent'
			},
			{
				id: 'sidebar-menu-rates',
				title: 'Rates',
				type: 'item',
				url: '/rates',
				end: true,
				auth: 'admin'
			}
		]
	}
];

export default navigationConfig;
