'use client';

import _ from 'lodash';
import React, { useEffect, useMemo } from 'react';
import { FuseSettingsConfigType } from '@fuse/core/FuseSettings/FuseSettings';
import { themeLayoutsType } from 'src/components/theme-layouts/themeLayouts';
import usePathname from '@fuse/hooks/usePathname';
import useFuseSettings from '@fuse/core/FuseSettings/hooks/useFuseSettings';
import FuseLayoutSettingsContext from './FuseLayoutSettingsContext';

export type FuseLayoutProps = {
	layouts: themeLayoutsType;
	children?: React.ReactNode;
	settings?: FuseSettingsConfigType['layout'];
};

function FuseLayout(props: FuseLayoutProps) {
	const { layouts, children, settings: forcedSettings } = props;
	const { data: current } = useFuseSettings();
	const currentLayoutSetting = useMemo(() => current.layout, [current]);
	const pathname = usePathname();
	const layoutSetting = useMemo(
		() => _.merge({}, currentLayoutSetting, forcedSettings),
		[currentLayoutSetting, forcedSettings]
	);
	const layoutStyle = useMemo(() => layoutSetting.style, [layoutSetting]);

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [pathname]);

	return (
		<FuseLayoutSettingsContext value={layoutSetting}>
			{useMemo(() => {
				return Object.entries(layouts).map(([key, Layout]) => {
					if (key === layoutStyle) {
						return (
							<React.Fragment key={key}>
								<Layout>{children}</Layout>
							</React.Fragment>
						);
					}

					return null;
				});
			}, [layoutStyle, layouts, children])}
		</FuseLayoutSettingsContext>
	);
}

export default FuseLayout;
