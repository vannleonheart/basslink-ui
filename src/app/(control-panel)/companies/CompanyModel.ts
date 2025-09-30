import _ from 'lodash';
import { PartialDeep } from 'type-fest';
import { AgentCompany } from '@/types/entity';
import CompanyAccountModel from '@/app/(control-panel)/companies/CompanyAccountModel';

const CompanyModel = (data: PartialDeep<AgentCompany>): AgentCompany =>
	_.defaults(data || {}, {
		id: '',
		agent_id: '',
		name: '',
		country: '',
		city: '',
		address: '',
		created: '',
		accounts: [CompanyAccountModel(null)]
	});

export default CompanyModel;
