import Typography from '@mui/material/Typography';
import { motion } from 'motion/react';

function ProductHeader() {
	return (
		<div className="w-full space-y-8 flex flex-col flex-1 items-center justify-between sm:flex-row sm:space-y-0 p-24 md:py-32 md:px-0">
			<div className="flex flex-col items-start space-y-8 sm:space-y-0 w-full sm:max-w-full min-w-0">
				<div className="flex items-center max-w-full space-x-12">
					<motion.div
						className="flex flex-col min-w-0"
						initial={{ x: -20 }}
						animate={{ x: 0, transition: { delay: 0.3 } }}
					>
						<Typography className="text-15 sm:text-2xl truncate font-semibold">Edit Deal</Typography>
						<Typography
							variant="caption"
							className="font-medium"
						>
							Please fill in the information below with the valid data. Any invalid data will result in
							the transfer being failed.
						</Typography>
					</motion.div>
				</div>
			</div>
			<motion.div
				className="flex flex-1 w-full"
				initial={{ opacity: 0, x: 20 }}
				animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
			></motion.div>
		</div>
	);
}

export default ProductHeader;
