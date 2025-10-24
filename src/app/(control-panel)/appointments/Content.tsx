import CopyButton from '@/components/commons/CopyButton';
import Empty from '@/components/commons/Empty';
import StatusLabel from '@/components/commons/StatusLabel';
import { Services } from '@/data/static-data';
import apiService from '@/store/apiService';
import { Appointment } from '@/types/entity';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Typography } from '@mui/material';
import { useSession } from 'next-auth/react';
import { useMemo } from 'react';

export default function Content() {
	const {
		data: { accessToken, side }
	} = useSession();
	const { data: appointmentsData } = apiService.useGetAppointmentsQuery(
		{
			side,
			accessToken
		},
		{
			skip: !accessToken // Skip the query if accessToken is not available
		}
	);
	const appointments: Appointment[] = useMemo(() => {
		return (appointmentsData ?? []) as Appointment[];
	}, [appointmentsData]);

	return (
		<div className="py-20 flex flex-col gap-16">
			{appointments.length > 0 ? (
				appointments.map((appointment) => (
					<AppointmentItem
						key={appointment.id}
						appointment={appointment}
					/>
				))
			) : (
				<Empty text="Tidak ada janji temu" />
			)}
		</div>
	);
}

function AppointmentItem({ appointment }: { appointment: Appointment }) {
	return (
		<Accordion disableGutters>
			<AccordionSummary expandIcon={<FuseSvgIcon>heroicons-outline:chevron-down</FuseSvgIcon>}>
				<div className="flex items-center gap-28 flex-col md:flex-row w-full">
					<div className="flex gap-8 items-center">
						<FuseSvgIcon size={16}>heroicons-outline:information-circle</FuseSvgIcon>
						<Typography>{appointment.id}</Typography>
					</div>
					<div className="flex gap-8 items-center">
						<FuseSvgIcon size={16}>heroicons-outline:user</FuseSvgIcon>
						<Typography>{appointment.name}</Typography>
					</div>
					<div className="flex gap-8 items-center">
						<FuseSvgIcon size={16}>heroicons-outline:calendar</FuseSvgIcon>
						<Typography>{appointment.date}</Typography>
					</div>
					<div className="flex gap-8 items-center">
						<FuseSvgIcon size={16}>heroicons-outline:clock</FuseSvgIcon>
						<Typography>{appointment.time}</Typography>
					</div>
				</div>
			</AccordionSummary>
			<AccordionDetails>
				<Box className="flex flex-col bg-gray-100 p-16 rounded border border-gray-300">
					<div className="flex flex-col gap-28 md:flex-row">
						<div className="w-full md:w-3/5 flex flex-col gap-20">
							<div className="flex items-center gap-12 justify-between flex-col md:flex-row">
								<Typography
									component="div"
									fontWeight="medium"
								>
									Status
								</Typography>
								<Typography component="div">
									<StatusLabel
										size="small"
										status={appointment.status}
									/>
								</Typography>
							</div>
							<div className="flex items-center gap-12 justify-between flex-col md:flex-row">
								<Typography
									component="div"
									fontWeight="medium"
								>
									Perusahaan/Institusi
								</Typography>
								<Typography component="div">{appointment.company ?? 'N/A'}</Typography>
							</div>
							<div className="flex items-center gap-12 justify-between flex-col md:flex-row">
								<Typography
									component="div"
									fontWeight="medium"
								>
									Email
								</Typography>
								<div className="flex items-center gap-8">
									<Typography component="div">{appointment.email}</Typography>
									<CopyButton
										value={appointment.email}
										size="small"
									/>
								</div>
							</div>
							<div className="flex items-center gap-12 justify-between flex-col md:flex-row">
								<Typography
									component="div"
									fontWeight="medium"
								>
									No. Telepon
								</Typography>
								<div className="flex items-center gap-8">
									<Typography component="div">{appointment.phone}</Typography>
									<CopyButton
										value={appointment.phone}
										size="small"
									/>
								</div>
							</div>
							<div className="flex items-center gap-12 justify-between flex-col md:flex-row">
								<Typography
									component="div"
									fontWeight="medium"
								>
									Layanan yang dibutuhkan
								</Typography>
								<Typography component="div">
									{Services[appointment.service_type] ?? appointment.service_type}
								</Typography>
							</div>
						</div>
						<Divider
							orientation="vertical"
							flexItem
							className="hidden md:block"
						/>
						<div className="w-full md:w-2/5 flex flex-col gap-12 mt-16 md:mt-0">
							<div className="w-full flex gap-4 items-center justify-center md:justify-start">
								<FuseSvgIcon size={16}>heroicons-solid:pencil-square</FuseSvgIcon>
								<Typography>
									<strong>Catatan:</strong>
								</Typography>
							</div>
							<Typography>{appointment.notes ?? 'Tidak ada catatan'}</Typography>
						</div>
					</div>
				</Box>
			</AccordionDetails>
		</Accordion>
	);
}
