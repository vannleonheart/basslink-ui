import { Button, DialogContent } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { closeDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';

export default function DialogConfirm({ message, onConfirm }: { message: string; onConfirm: () => void }) {
	const dispatch = useDispatch();
	return (
		<React.Fragment>
			<DialogContent>
				<div className="flex items-center justify-start">
					<div className="flex flex-col items-center justify-start">
						<div className="mb-16">{message}</div>
						<div className="flex items-center justify-end gap-12">
							<Button
								variant="outlined"
								color="success"
								onClick={() => {
									onConfirm();
									dispatch(closeDialog());
								}}
							>
								Yes
							</Button>
							<Button
								variant="outlined"
								onClick={() => dispatch(closeDialog())}
							>
								No
							</Button>
						</div>
					</div>
				</div>
			</DialogContent>
		</React.Fragment>
	);
}
