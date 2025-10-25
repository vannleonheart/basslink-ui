import CurrencyField from '@/components/forms/fields/CurrencyField';
import { TransferTypes } from '@/data/static-data';
import { RemittanceFilter } from '@/types/component';
import { Button, MenuItem, TextField, Typography } from '@mui/material';

type FilterProps = {
	filter: RemittanceFilter;
	setFilter: (filter: RemittanceFilter) => void;
};

export default function Filter({ filter, setFilter }: FilterProps) {
	return (
		<div className="w-full flex flex-col gap-20 border px-12 py-12 rounded-lg mb-8 bg-gray-50">
			<div className="w-full grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16">
				<TextField
					select
					value={filter.type}
					onChange={(e) => setFilter({ ...filter, type: e.target.value })}
					className="flex-1 w-full"
				>
					<MenuItem value="all">Semua Jenis Transaksi</MenuItem>
					{Object.keys(TransferTypes).map((key) => (
						<MenuItem
							key={'tt-' + key}
							value={key}
						>
							{TransferTypes[key as keyof typeof TransferTypes]}
						</MenuItem>
					))}
				</TextField>
				<TextField
					fullWidth
					placeholder="Cari no transaksi, nama pengirim atau penerima"
					value={filter.search}
					onChange={(e) => setFilter({ ...filter, search: e.target.value })}
				/>
			</div>
			<div className="w-full grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-16 md:items-end">
				<div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
					<div className="w-full flex flex-col gap-4">
						<Typography>Dari</Typography>
						<TextField
							type="date"
							fullWidth
							value={filter.start}
							onChange={(e) => setFilter({ ...filter, start: e.target.value })}
							slotProps={{
								inputLabel: { shrink: true }
							}}
						/>
					</div>
					<div className="w-full flex flex-col gap-4">
						<Typography>Hingga</Typography>
						<TextField
							type="date"
							value={filter.end}
							fullWidth
							onChange={(e) => setFilter({ ...filter, end: e.target.value })}
							slotProps={{
								inputLabel: { shrink: true }
							}}
						/>
					</div>
				</div>
				<div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
					<div className="w-full flex flex-col gap-4">
						<Typography>Min</Typography>
						<CurrencyField
							fullWidth
							value={filter.min}
							onChange={(e) => setFilter({ ...filter, min: e.target.value })}
							slotProps={{
								inputLabel: { shrink: true }
							}}
						/>
					</div>
					<div className="w-full flex flex-col gap-4">
						<Typography>Max</Typography>
						<CurrencyField
							value={filter.max}
							fullWidth
							onChange={(e) => setFilter({ ...filter, max: e.target.value })}
							slotProps={{
								inputLabel: { shrink: true }
							}}
						/>
					</div>
				</div>
				<div className="w-full flex flex-col gap-4 md:flex-row md:items-center md:gap-16">
					<Button
						fullWidth
						variant="contained"
						color="secondary"
						onClick={() =>
							setFilter({
								type: 'all',
								status: 'all',
								search: '',
								start: '',
								end: '',
								min: '',
								max: ''
							})
						}
					>
						Reset
					</Button>
				</div>
			</div>
		</div>
	);
}
