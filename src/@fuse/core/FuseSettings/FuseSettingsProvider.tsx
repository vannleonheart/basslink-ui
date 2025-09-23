import { useState, ReactNode, useMemo, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { defaultSettings, getParsedQuerySettings } from '@fuse/default-settings';
import settingsConfig from 'src/configs/settingsConfig';
import themeLayoutConfigs from 'src/components/theme-layouts/themeLayoutConfigs';
import { FuseSettingsConfigType, FuseThemesType } from '@fuse/core/FuseSettings/FuseSettings';
import { PartialDeep } from 'type-fest';
import FuseSettingsContext from './FuseSettingsContext';

const getInitialSettings = (): FuseSettingsConfigType => {
	const defaultLayoutStyle = settingsConfig.layout?.style || 'layout1';
	const layout = {
		style: defaultLayoutStyle,
		config: themeLayoutConfigs[defaultLayoutStyle]?.defaults
	};
	return _.merge({}, defaultSettings, { layout }, settingsConfig, getParsedQuerySettings());
};

const initialSettings = getInitialSettings();

const generateSettings = (
	_defaultSettings: FuseSettingsConfigType,
	_newSettings: PartialDeep<FuseSettingsConfigType>
) => {
	return _.merge(
		{},
		_defaultSettings,
		{ layout: { config: themeLayoutConfigs[_newSettings?.layout?.style]?.defaults } },
		_newSettings
	);
};

export function FuseSettingsProvider({ children }: { children: ReactNode }) {
	const calculateSettings = useCallback(() => {
		const defaultSettings = _.merge({}, initialSettings);
		return _.merge({}, defaultSettings);
	}, []);
	const [data, setData] = useState<FuseSettingsConfigType>(calculateSettings());

	useEffect(() => {
		const newSettings = calculateSettings();

		if (!_.isEqual(data, newSettings)) {
			setData(newSettings);
		}
	}, [calculateSettings]);

	const setSettings = useCallback(
		(newSettings: Partial<FuseSettingsConfigType>) => {
			const _settings = generateSettings(data, newSettings);

			if (!_.isEqual(_settings, data)) {
				setData(_.merge({}, _settings));
			}

			return _settings;
		},
		[data]
	);

	const changeTheme = useCallback(
		(newTheme: FuseThemesType) => {
			const { navbar, footer, toolbar, main } = newTheme;

			const newSettings: FuseSettingsConfigType = {
				...data,
				theme: {
					main,
					navbar,
					toolbar,
					footer
				}
			};

			setSettings(newSettings);
		},
		[data, setSettings]
	);

	return (
		<FuseSettingsContext
			value={useMemo(
				() => ({
					data,
					setSettings,
					changeTheme
				}),
				[data, setSettings]
			)}
		>
			{children}
		</FuseSettingsContext>
	);
}

export default FuseSettingsProvider;
