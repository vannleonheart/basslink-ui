import { SxProps } from '@mui/system';
import { FuseNavBadgeType } from './FuseNavBadgeType';
import { AuthType } from '@/types';

export type FuseNavItemType = {
	id: string;
	title?: string;
	translate?: string;
	auth?: AuthType;
	subtitle?: string;
	icon?: string;
	iconClass?: string;
	url?: string;
	target?: string;
	type?: string;
	sx?: SxProps;
	disabled?: boolean;
	active?: boolean;
	exact?: boolean;
	end?: boolean;
	badge?: FuseNavBadgeType;
	children?: FuseNavItemType[];
	hasPermission?: boolean;
};

export type FuseFlatNavItemType = Omit<FuseNavItemType, 'children' | 'sx'> & { children?: string[]; order: string };
