import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Image from 'next/image';

const Root = styled('div')(({ theme }) => ({
	'& > .logo-icon': {
		transition: theme.transitions.create(['width', 'height'], {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	},
	'& > .badge': {
		transition: theme.transitions.create('opacity', {
			duration: theme.transitions.duration.shortest,
			easing: theme.transitions.easing.easeInOut
		})
	}
}));

/**
 * The logo component.
 */
function Logo() {
	return (
		<Root className="flex flex-1 items-center space-x-12">
			<div className="flex flex-1 items-center space-x-8 px-10">
				<Image
					className="logo-icon bg-white rounded-full"
					src="/assets/images/logo/basslink-logo.png"
					width={28}
					height={28}
					alt="basslink-logo"
				/>
				<div className="logo-text flex flex-row flex-auto gap-2">
					<Typography className="text-xl tracking-light font-semibold leading-none">BASS</Typography>
					<Typography
						className="text-xl tracking-light font-semibold leading-none"
						color="primary"
						sx={{
							color: '#82d7f7'
						}}
					>
						LINK
					</Typography>
				</div>
			</div>
		</Root>
	);
}

export default Logo;
