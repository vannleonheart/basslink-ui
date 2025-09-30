import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import _ from 'lodash';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Alert, Checkbox, FormControl, FormControlLabel } from '@mui/material';
import { CreateCustomerFormData, Currency, Disbursement } from '@/types/entity';
import { useRouter } from 'next/navigation';
import MenuItem from '@mui/material/MenuItem';
import { CountryCodeList } from '@/data/country-code';
import { clientCreateDealSendMoney, clientUpdateDealSendMoney, clientUploadFiles } from '@/utils/apiCall';
import { useSession } from 'next-auth/react';
import { useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import FuseSvgIcon from '@fuse/core/FuseSvgIcon';
import { lighten } from '@mui/material/styles';
import UploadedFileItem from '@/components/forms/fields/UploadedFileItem';
import apiService from '@/store/apiService';
import getErrorMessage from '@/data/errors';
import CurrencyField from './fields/CurrencyField';
import FileUploadInput from './fields/FileUploadInput';
import { useAppDispatch } from '@/store/hooks';
import { openDialog } from '@fuse/core/FuseDialog/fuseDialogSlice';
import ContactListDialog from '@/app/(control-panel)/deals/ContactListDialog';

const schema = z.object({
    
});

export default function NewCustomerForm({
    disbursement,
    fetch
}: {
    disbursement?: Disbursement;
    fetch?: () => void;
}) {
    const { control, formState, handleSubmit, setError, getValues, setValue } = useForm<CreateCustomerFormData>({
        mode: 'onChange',
        resolver: zodResolver(schema),
        defaultValues: {
            contact_type: '',
            contact_name: '',
            contact_gender: '',
            contact_birthdate: '',
            contact_citizenship: '',
            contact_country: '',
            contact_region: '',
            contact_city: '',
            contact_address: '',
            contact_email: '',
            contact_phone_code: '',
            contact_phone_no: '',
            contact_occupation: '',
            contact_identity_type: '',
            contact_identity_no: '',
            contact_portrait_image: '',
            contact_identity_image: '',
            contact_notes: '',
        }
    });
    const { isValid, dirtyFields, errors } = formState;
    const router = useRouter();
    const { data } = useSession() ?? {};
    const { accessToken } = data ?? {};
    const [submitting, setSubmitting] = useState(false);
    const [uploading, setUploading] = useState(false);
    const { data: currenciesData } = apiService.useGetCurrenciesQuery({});
    const currencies = useMemo(() => (currenciesData ?? []) as Currency[], [currenciesData]);
    const dispatch = useAppDispatch();

    async function onSubmit(formData: CreateCustomerFormData) {
        try {
            if (submitting) {
                return;
            }

            setSubmitting(true);

            let message = '';

            if (!disbursement) {
                const result = await clientCreateDealSendMoney(formData, accessToken);

                if (result?.status === 'success') {
                    if (fetch) {
                        fetch();
                    }

                    router.push('/deals');
                    return;
                }

                message = result?.message;
            } else {
                const result = await clientUpdateDealSendMoney(disbursement.id, formData, accessToken);

                if (result?.status === 'success') {
                    if (fetch) {
                        fetch();
                    }

                    router.push(`/disbursements/${disbursement.id}`);
                    return;
                }

                message = result?.message;
            }

            setSubmitting(false);
            setError('root', { type: 'manual', message });
            return false;
        } catch (error) {
            const { message, data } = error;

            setSubmitting(false);

            if (!data) {
                setError('root', { type: 'manual', message });
            } else {
                setError('root', { type: 'manual', message: data?.message });
            }

            return false;
        }
    }

    const selectBeneficiaryFromContact = () => {
        dispatch(
            openDialog({
                fullWidth: true,
                children: (
                    <ContactListDialog
                        onSelect={(contact: ClientContact) => {
                            setValue('receiver_name', contact.name ?? '');
                            setValue('receiver_country', contact.country ?? '');
                            setValue('receiver_address', contact.address ?? '');
                            setValue('receiver_bank_country', contact.bank_country ?? '');
                            setValue('receiver_bank_address', contact.bank_address ?? '');
                            setValue('receiver_bank_swift_code', contact.bank_swift_code ?? '');
                            setValue('receiver_bank_name', contact.bank_name ?? '');
                            setValue('receiver_bank_account_no', contact.bank_account_no ?? '');
                        }}
                    />
                )
            })
        );
    };

    const countryList = CountryCodeList.sort((a, b) => a.name.localeCompare(b.name));

    return (
        <form
            name="disbursementForm"
            noValidate
            className="mt-32 flex w-full flex-col justify-center"
            onSubmit={handleSubmit(onSubmit)}
        >
            {errors?.root?.message && (
                <Alert
                    className="mb-32"
                    severity="error"
                    sx={(theme) => ({
                        backgroundColor: theme.palette.error.light,
                        color: theme.palette.error.dark
                    })}
                >
                    {errors?.root?.message}
                </Alert>
            )}
            <div className="flex flex-col items-center justify-center gap-20">              
                <div className="w-full p-24 bg-white shadow-2 rounded">
                    <div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
                        <h4 className="font-bold">Who are you sending to ?</h4>
                        <div>
                            <Button
                                variant="text"
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    selectBeneficiaryFromContact();
                                }}
                            >
                                Select from contact
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="beneficiary_type"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Beneficiary Type"
                                    error={!!errors.beneficiary_type}
                                    helperText={errors?.beneficiary_type?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem
                                        key={'beneficiary-type-individual'}
                                        value="individual"
                                    >
                                        Individual
                                    </MenuItem>
                                    <MenuItem
                                        key={'beneficiary-type-institutional'}
                                        value="institutional"
                                    >
                                        Institutional
                                    </MenuItem>
                                </TextField>
                            )}
                        />
                        <Controller
                            name="beneficiary_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Beneficiary Name"
                                    type="text"
                                    error={!!errors.beneficiary_name}
                                    helperText={errors?.beneficiary_name?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="beneficiary_relationship"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Beneficiary Relationship"
                                    error={!!errors.beneficiary_relationship}
                                    helperText={errors?.beneficiary_relationship?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem
                                        key={'beneficiary-relationship-family'}
                                        value="family"
                                    >
                                        Family
                                    </MenuItem>
                                    <MenuItem
                                        key={'beneficiary-relationship-friend'}
                                        value="friend"
                                    >
                                        Friend
                                    </MenuItem>
                                    <MenuItem
                                        key={'beneficiary-relationship-business-partner'}
                                        value="business_partner"
                                    >
                                        Business Partner
                                    </MenuItem>
                                    <MenuItem
                                        key={'beneficiary-relationship-business-other'}
                                        value="other"
                                    >
                                        Other
                                    </MenuItem>
                                </TextField>
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="beneficiary_gender"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Gender"
                                    error={!!errors.beneficiary_gender}
                                    helperText={errors?.beneficiary_gender?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem
                                        key={'gender-male'}
                                        value="male"
                                    >
                                        Male
                                    </MenuItem>
                                    <MenuItem
                                        key={'gender-female'}
                                        value="female"
                                    >
                                        Female
                                    </MenuItem>
                                </TextField>
                            )}
                        />
                        <Controller
                            name="beneficiary_birthdate"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Birth Date"
                                    type="date"
                                    error={!!errors.beneficiary_birthdate}
                                    helperText={errors?.beneficiary_birthdate?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="beneficiary_citizenship"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Citizenship"
                                    error={!!errors.beneficiary_citizenship}
                                    helperText={errors?.beneficiary_citizenship?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    select
                                >
                                    {countryList.map((country) => (
                                        <MenuItem
                                            key={`beneficiary_citizenship_${country.code}`}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="beneficiary_identity_type"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Identity Type"
                                    error={!!errors.beneficiary_identity_type}
                                    helperText={errors?.beneficiary_identity_type?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    select
                                >
                                    <MenuItem
                                        key={'identity-type-national-id'}
                                        value="national_id"
                                    >
                                        National ID
                                    </MenuItem>
                                    <MenuItem
                                        key={'identity-type-passport'}
                                        value="passport"
                                    >
                                        Passport
                                    </MenuItem>
                                    <MenuItem
                                        key={'identity-type-other'}
                                        value="other"
                                    >
                                        Other
                                    </MenuItem>
                                </TextField>
                            )}
                        />
                        <Controller
                            name="beneficiary_identity_no"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Identity Number"
                                    error={!!errors.beneficiary_identity_no}
                                    helperText={errors?.beneficiary_identity_no?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="beneficiary_occupation"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Occupation"
                                    error={!!errors.beneficiary_occupation}
                                    helperText={errors?.beneficiary_occupation?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="beneficiary_country"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Country"
                                    error={!!errors.beneficiary_country}
                                    helperText={errors?.beneficiary_country?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    select
                                >
                                    {countryList.map((country) => (
                                        <MenuItem
                                            key={`receiver_country_${country.code}`}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="beneficiary_region"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Region"
                                    error={!!errors.beneficiary_region}
                                    helperText={errors?.beneficiary_region?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="beneficiary_city"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="City"
                                    error={!!errors.beneficiary_city}
                                    helperText={errors?.beneficiary_city?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="beneficiary_address"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Address"
                                type="text"
                                error={!!errors.beneficiary_address}
                                helperText={errors?.beneficiary_address?.message}
                                variant="outlined"
                                required
                                fullWidth
                                multiline
                                minRows={3}
                                maxRows={5}
                                className="mb-12"
                            />
                        )}
                    />
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="beneficiary_email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    type="email"
                                    error={!!errors.beneficiary_email}
                                    helperText={errors?.beneficiary_email?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="beneficiary_phone_code"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone Code"
                                    type="tel"
                                    error={!!errors.beneficiary_phone_code}
                                    helperText={errors?.beneficiary_phone_code?.message}
                                    variant="outlined"
                                    fullWidth
                                    select
                                >
                                    {countryList.map((country) => (
                                        <MenuItem
                                            key={`beneficiary_phone_code${country.code}`}
                                            value={country.dial_code}
                                        >
                                            {country.name} ({country.dial_code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="beneficiary_phone_no"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone Number"
                                    type="tel"
                                    error={!!errors.beneficiary_phone_no}
                                    helperText={errors?.beneficiary_phone_no?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="beneficiary_notes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Notes"
                                error={!!errors.beneficiary_notes}
                                helperText={errors?.beneficiary_notes?.message}
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={3}
                                maxRows={5}
                                className="mb-12"
                            />
                        )}
                    />
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="beneficiary_portrait_image"
                            control={control}
                            render={({ field }) => (
                                <FileUploadInput
                                    {...field}
                                    label="Portrait Image"
                                    error={!!errors.beneficiary_portrait_image}
                                    helperText={errors?.beneficiary_portrait_image?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="beneficiary_identity_image"
                            control={control}
                            render={({ field }) => (
                                <FileUploadInput
                                    {...field}
                                    label="Identity Image"
                                    error={!!errors.beneficiary_identity_image}
                                    helperText={errors?.beneficiary_identity_image?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="beneficiary_update"
                        control={control}
                        render={({ field }) => (
                            <FormControl>
                                <FormControlLabel
                                    label="Save/update beneficiary details for future transactions"
                                    control={
                                        <Checkbox
                                            size="small"
                                            {...field}
                                        />
                                    }
                                />
                            </FormControl>
                        )}
                    />
                </div>
                <div className="w-full p-24 bg-white shadow-2 rounded">
                    <div className="mb-24 flex flex-col items-start justify-start gap-12 md:flex-row md:items-center md:justify-between">
                        <h4 className="font-bold">To which account the disbursement will be made ?</h4>
                        <div>
                            <Button
                                variant="text"
                                size="small"
                                color="primary"
                                onClick={(e) => {
                                    e.preventDefault();
                                    selectBeneficiaryFromContact();
                                }}
                            >
                                Select from contact bank accounts
                            </Button>
                        </div>
                    </div>
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="bank_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Bank name"
                                    autoFocus
                                    type="text"
                                    error={!!errors.bank_name}
                                    helperText={errors?.bank_name?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="bank_account_no"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Bank account number (IBAN)"
                                    autoFocus
                                    type="text"
                                    error={!!errors.bank_account_no}
                                    helperText={errors?.bank_account_no?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="bank_account_name"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Bank account name"
                                    autoFocus
                                    type="text"
                                    error={!!errors.bank_account_name}
                                    helperText={errors?.bank_account_name?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="bank_country"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Bank Country"
                                    autoFocus
                                    error={!!errors.bank_country}
                                    helperText={errors?.bank_country?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    select
                                >
                                    {countryList.map((country) => (
                                        <MenuItem
                                            key={`receiver_bank_country_${country.code}`}
                                            value={country.code}
                                        >
                                            {country.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="bank_code"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Bank code"
                                    autoFocus
                                    type="text"
                                    error={!!errors.bank_code}
                                    helperText={errors?.bank_code?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="bank_swift_code"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Bank SWIFT code"
                                    autoFocus
                                    type="text"
                                    error={!!errors.bank_swift_code}
                                    helperText={errors?.bank_swift_code?.message}
                                    variant="outlined"
                                    required
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="bank_address"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Bank address"
                                error={!!errors.bank_address}
                                helperText={errors?.bank_address?.message}
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={3}
                                maxRows={5}
                                className="mb-12"
                            />
                        )}
                    />
                    <div className="flex flex-col items-start justify-between gap-12 md:flex-row mb-12">
                        <Controller
                            name="bank_email"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Email"
                                    type="email"
                                    error={!!errors.bank_email}
                                    helperText={errors?.bank_email?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="bank_website"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Website"
                                    type="url"
                                    error={!!errors.bank_website}
                                    helperText={errors?.bank_website?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                        <Controller
                            name="bank_phone_code"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone Code"
                                    type="tel"
                                    error={!!errors.bank_phone_code}
                                    helperText={errors?.bank_phone_code?.message}
                                    variant="outlined"
                                    fullWidth
                                    select
                                >
                                    {countryList.map((country) => (
                                        <MenuItem
                                            key={`beneficiary_phone_code${country.code}`}
                                            value={country.dial_code}
                                        >
                                            {country.name} ({country.dial_code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        />
                        <Controller
                            name="beneficiary_phone_no"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    label="Phone Number"
                                    type="tel"
                                    error={!!errors.beneficiary_phone_no}
                                    helperText={errors?.beneficiary_phone_no?.message}
                                    variant="outlined"
                                    fullWidth
                                />
                            )}
                        />
                    </div>
                    <Controller
                        name="bank_notes"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                label="Bank notes"
                                error={!!errors.bank_notes}
                                helperText={errors?.bank_notes?.message}
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={3}
                                maxRows={5}
                                className="mb-12"
                            />
                        )}
                    />
                    <Controller
                        name="bank_update"
                        control={control}
                        render={({ field }) => (
                            <FormControl>
                                <FormControlLabel
                                    label="Save/update bank details for future transactions"
                                    control={
                                        <Checkbox
                                            size="small"
                                            {...field}
                                        />
                                    }
                                />
                            </FormControl>
                        )}
                    />
                </div>
            </div>
            <Button
                variant="contained"
                color="secondary"
                className="mt-24 w-full shadow-2"
                aria-label="Submit"
                disabled={_.isEmpty(dirtyFields) || !isValid || submitting || uploading}
                type="submit"
                size="large"
            >
                {submitting ? 'Submitting...' : 'Submit'}
            </Button>
        </form>
    );
}
