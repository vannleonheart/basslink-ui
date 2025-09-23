import { Deal } from '@/types';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import { ExpandMoreRounded } from '@mui/icons-material';

export default function FileList({ deal }: { deal: Deal }) {
	return deal.files && deal.files.length > 0 ? (
		<Accordion
			style={{
				width: '100%',
				backgroundColor: 'transparent',
				border: 'none',
				borderRadius: '0',
				boxShadow: 'none'
			}}
		>
			<AccordionSummary
				expandIcon={<ExpandMoreRounded />}
				className="px-0"
			>
				<h4 className="text-lg font-semibold text-gray-700">{deal.files.length} Files</h4>
			</AccordionSummary>
			<AccordionDetails className="px-0">
				<div className="flex gap-12">
					{deal.files.map((file, index) => {
						const name = file.filename.split('/').pop();
						const fileType = file.filename.split('.').pop();
						return (
							<div
								key={index}
								className="border border-gray-500 rounded-lg shadow"
							>
								<div className="flex items-center justify-between gap-8 capitalize">
									{fileType && (
										<div className="p-8 bg-gray-700 text-white rounded-l-lg">
											{fileType.toUpperCase()}
										</div>
									)}
									<div className="p-8 pr-12">
										<a
											href={'https://bricslink.sgp1.cdn.digitaloceanspaces.com/' + file.filename}
											target="_blank"
											rel="noreferrer"
											className="text-blue-500 bg-transparent no-underline"
										>
											{name.length > 30 ? name.slice(0, 20) + '...' + name.slice(-10) : name}
										</a>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</AccordionDetails>
		</Accordion>
	) : (
		<div className="text-gray-500">No files uploaded</div>
	);
}
