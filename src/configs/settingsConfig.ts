import themesConfig from 'src/configs/themesConfig';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import i18n from '@i18n/i18n';

const settingsConfig: FuseSettingsConfigType = {
	layout: {
		style: 'layout1',
		config: {
			mode: 'fullwidth',
			containerWidth: 1120,
			toolbar: {
				display: false,
				style: 'fixed'
			},
			navbar: {
				display: true,
				style: 'style-2',
				folded: false,
				position: 'left',
				open: true
			},
			footer: {
				display: false,
				style: 'static'
			}
		}
	},
	customScrollbars: true,
	direction: i18n.dir(i18n.options.lng) || 'ltr',
	theme: {
		main: themesConfig.darkBlueSilver,
		navbar: themesConfig.dark3,
		toolbar: themesConfig.darkBlueSilver,
		footer: themesConfig.light
	},
	defaultAuth: [],
	loginRedirectUrl: '/'
};

export default settingsConfig;
