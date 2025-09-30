import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { AgentCompanyAccount } from '@/types/entity';

const CompanyAccountModel = (data: PartialDeep<AgentCompanyAccount>): AgentCompanyAccount =>
	_.defaults(data || {}, {
		id: '',
		agent_id: '',
		agent_company_id: '',
		account_type: '',
		account_no: '',
		bank_country: '',
		bank_name: '',
		bank_swift_code: '',
		bank_address: '',
		currency: '',
		network: '',
		label: ''
	});

export default CompanyAccountModel;
