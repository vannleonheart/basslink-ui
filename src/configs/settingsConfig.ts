import themesConfig from 'src/configs/themesConfig';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import i18n from '@i18n/i18n';

const settingsConfig: FuseSettingsConfigType = {
	layout: {
		style: 'layout1', // layout1 layout2 layout3
		config: {
			mode: '',
			toolbar: {
				display: false
			},
			navbar: {
				style: 'style-2'
			},
			footer: {
				display: false
			}
		} // checkout default layout configs at src/components/theme-layouts for example  src/components/theme-layouts/layout1/Layout1Config.js
	},
	customScrollbars: true,
	direction: i18n.dir(i18n.options.lng) || 'ltr', // rtl, ltr
	theme: {
		main: themesConfig.default,
		navbar: themesConfig.defaultDark,
		toolbar: themesConfig.default,
		footer: themesConfig.defaultDark
	},
	defaultAuth: [],
	loginRedirectUrl: '/'
};

export default settingsConfig;
