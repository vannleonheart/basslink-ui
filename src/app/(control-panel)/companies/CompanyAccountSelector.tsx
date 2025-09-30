import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import Button from '@mui/material/Button';
import clsx from 'clsx';
import FormHelperText from '@mui/material/FormHelperText';
import CompanyAccountInput from './CompanyAccountInput';
import { AgentCompanyAccount } from '@/types/entity';
import React from 'react';
import CompanyAccountModel from './CompanyAccountModel';

type CompanyAccountFormProps = {
	value: AgentCompanyAccount[] | undefined;
	onChange: (T: AgentCompanyAccount[]) => void;
	className?: string;
	error?: boolean;
	helperText?: string;
	ref?: React.Ref<HTMLDivElement>;
};

function CompanyAccountSelector(props: CompanyAccountFormProps) {
	const { value, onChange, className, error, helperText, ref } = props;

	return (
		<div
			className={clsx('w-full', className)}
			ref={ref}
		>
			{error && helperText && <FormHelperText error={error}>{helperText}</FormHelperText>}

			{value?.map((item, index) => (
				<div
					key={index}
					className="mb-20"
				>
					<h4 className="font-bold mb-12">Account {index + 1}</h4>
					<CompanyAccountInput
						id={'form-company-account-' + index}
						value={item}
						onChange={(val) => {
							onChange(value.map((_item, _index) => (index === _index ? val : _item)));
						}}
						onRemove={() => {
							onChange(value.filter((_item, _index) => index !== _index));
						}}
						hideRemove={value.length === 1}
					/>
				</div>
			))}
			<Button
				className="group inline-flex items-center mt-2 -ml-4 py-2 px-4 rounded cursor-pointer"
				onClick={() => onChange([...value, CompanyAccountModel({})])}
			>
				<FuseSvgIcon size={20}>heroicons-solid:plus-circle</FuseSvgIcon>

				<span className="ml-8 font-medium text-secondary group-hover:underline">Add new account</span>
			</Button>
		</div>
	);
}

export default CompanyAccountSelector;
