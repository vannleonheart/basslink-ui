import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const navigationConfig: FuseNavItemType[] = [
	{
		id: 'sidebar-menu-disbursements',
		title: 'Disbursements',
		type: 'collapse',
		icon: 'heroicons-solid:banknotes',
		auth: true,
		children: [
			{
				id: 'sidebar-menu-disbursement-list',
				title: 'Disbursement List',
				type: 'item',
				url: '/disbursements/list',
				end: true,
				auth: true
			},
			{
				id: 'sidebar-menu-new-disbursement',
				title: 'New Disbursement',
				type: 'item',
				url: '/disbursements/new',
				end: true,
				auth: 'agent'
			}
		]
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
		id: 'sidebar-menu-customers',
		title: 'Customers',
		type: 'collapse',
		icon: 'heroicons-solid:users',
		auth: ['agent', 'admin'],
		children: [
			{
				id: 'sidebar-menu-customer-list',
				title: 'Customer List',
				type: 'item',
				url: '/customers/list',
				end: true,
				auth: ['agent', 'admin']
			},
			{
				id: 'sidebar-menu-new-customer',
				title: 'New Customer',
				type: 'item',
				url: '/customers/new',
				end: true,
				auth: 'agent'
			}
		]
	},
	{
		id: 'sidebar-menu-contacts',
		title: 'Contacts',
		type: 'collapse',
		icon: 'heroicons-solid:user-group',
		auth: ['agent', 'admin'],
		children: [
			{
				id: 'sidebar-menu-contact-list',
				title: 'Contact List',
				type: 'item',
				url: '/contacts/list',
				end: true,
				auth: ['agent', 'admin']
			},
			{
				id: 'sidebar-menu-new-contact',
				title: 'New Contact',
				type: 'item',
				url: '/contacts/new',
				end: true,
				auth: 'agent'
			}
		]
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
