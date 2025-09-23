import { FuseNavItemType } from '@fuse/core/FuseNavigation/types/FuseNavItemType';

const SettingsAppNavigation: FuseNavItemType = {
	id: 'app.settings',
	title: 'Settings',
	type: 'collapse',
	icon: 'heroicons-outline:cog-6-tooth',
	url: '/settings',
	children: [
		{
			id: 'app.settings.profile',
			icon: 'heroicons-outline:user-circle',
			title: 'Profile',
			type: 'item',
			url: '/settings/profile',
			subtitle: 'Manage your profile and personal information'
		},
		{
			id: 'app.settings.security',
			icon: 'heroicons-outline:lock-closed',
			title: 'Security',
			type: 'item',
			url: '/settings/security',
			subtitle: 'Manage your password and 2-step verification preferences'
		},
		{
			id: 'app.settings.telegram',
			icon: 'heroicons-outline:link',
			title: 'Telegram',
			type: 'item',
			url: '/settings/telegram',
			subtitle: 'Connect your Telegram account to receive notifications'
		}
	]
};

export default SettingsAppNavigation;
