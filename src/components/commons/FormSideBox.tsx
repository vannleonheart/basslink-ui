import Box from '@mui/material/Box';

export default function FormSideBox() {
	return (
		<Box
			className="relative hidden h-full flex-auto items-center justify-center overflow-hidden p-64 md:flex lg:px-112"
			sx={{ backgroundColor: 'primary.dark', color: 'primary.contrastText' }}
		>
			<svg
				className="pointer-events-none absolute inset-0"
				viewBox="0 0 960 540"
				width="100%"
				height="100%"
				preserveAspectRatio="xMidYMax slice"
				xmlns="http://www.w3.org/2000/svg"
			>
				<Box
					component="g"
					className="opacity-5"
					fill="none"
					stroke="currentColor"
					strokeWidth="100"
				>
					<circle
						r="234"
						cx="196"
						cy="23"
					/>
					<circle
						r="234"
						cx="790"
						cy="491"
					/>
				</Box>
			</svg>
			<Box
				component="svg"
				className="absolute -right-64 -top-64 opacity-20"
				sx={{ color: 'primary.light' }}
				viewBox="0 0 220 192"
				width="220px"
				height="192px"
				fill="none"
			>
				<defs>
					<pattern
						id="837c3e70-6c3a-44e6-8854-cc48c737b659"
						x="0"
						y="0"
						width="20"
						height="20"
						patternUnits="userSpaceOnUse"
					>
						<rect
							x="0"
							y="0"
							width="4"
							height="4"
							fill="currentColor"
						/>
					</pattern>
				</defs>
				<rect
					width="220"
					height="192"
					fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
				/>
			</Box>

			<div className="relative z-10 w-full max-w-2xl">
				<div className="text-7xl font-bold leading-none text-gray-100">
					<div>
						<span>BRICS</span>
						<span>Link</span>
					</div>
				</div>
				<div className="mt-24 text-lg leading-6 tracking-wide text-gray-400">
					Connecting businesses beyond borders, <br />
					across continents. <br />
					<span className="block font-medium text-xl mt-12 tracking-wide">Safe, secure, easy and reliable.</span>
				</div>
			</div>
		</Box>
	);
}
