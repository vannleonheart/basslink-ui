import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'sidebar-menu-deals',
		title: 'Deals',
		type: 'item',
		icon: 'heroicons-solid:banknotes',
		url: '/deals',
		end: true,
		auth: ['admin', 'agent', 'client']
	},
	{
		id: 'sidebar-menu-agents',
		title: 'Agents',
		type: 'item',
		icon: 'heroicons-solid:users',
		url: '/agents',
		end: true,
		auth: 'admin'
	},
	{
		id: 'sidebar-menu-clients',
		title: 'Clients',
		type: 'item',
		icon: 'heroicons-solid:briefcase',
		url: '/clients',
		end: true,
		auth: ['admin', 'agent']
	},
	{
		id: 'sidebar-menu-payment-companies',
		title: 'Payment Companies',
		type: 'item',
		icon: 'heroicons-solid:building-office-2',
		url: '/companies',
		end: true,
		auth: [
			{
				type: 'agent',
				roles: ['owner', 'admin']
			}
		]
	},
	{
		id: 'sidebar-menu-contacts',
		title: 'Contacts',
		type: 'item',
		icon: 'heroicons-solid:user-group',
		url: '/contacts',
		end: true,
		auth: 'client'
	},
	{
		id: 'sidebar-menu-rates',
		title: 'Rates',
		type: 'item',
		icon: 'heroicons-outline:currency-dollar',
		url: '/rates',
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
		auth: [
			{
				type: 'agent',
				roles: ['owner', 'admin']
			}
		]
	},
	{
		id: 'sidebar-menu-settings',
		title: 'Settings',
		type: 'item',
		icon: 'heroicons-solid:cog-6-tooth',
		end: false,
		url: '/settings',
		auth: ['agent', 'client']
	}
];

export default navigationConfig;
