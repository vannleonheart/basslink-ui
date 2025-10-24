export const Gender = {
	male: 'Laki-laki',
	female: 'Perempuan'
};

export const UserTypes = {
	individual: 'Perorangan',
	institution: 'Institusi'
};

export const IdentityTypes = {
	individual: {
		national_id: 'KTP',
		passport: 'Paspor',
		driver_license: 'SIM',
		social_security: 'Kartu Jaminan Sosial',
		work_permit: 'Izin Kerja',
		green_card: 'Kartu Hijau',
		permanent_resident_card: 'Kartu Penduduk Tetap',
		other: 'Lainnya'
	},
	institution: {
		business_license: 'Nomor Induk Berusaha (NIB)',
		trading_business_license: 'Surat Izin Usaha Perdagangan (SIUP)',
		tax_identification_number: 'NPWP Perusahaan',
		company_registration_number: 'Nomor Induk Perusahaan (NIP)',
		organization_certificate: 'Akta Pendirian Perusahaan',
		bank_account_statement: 'Rekening Koran Perusahaan',
		other: 'Lainnya'
	}
};

export const Occupations = {
	individual: {
		private_sector_employee: 'Karyawan Sektor Swasta',
		government_employee: 'Aparatur Sipil Negara',
		self_employed: 'Wiraswasta',
		police_military: 'Polisi/Militer',
		unemployed: 'Tidak Bekerja',
		student: 'Pelajar/Mahasiswa',
		retired: 'Pensiunan',
		homemaker: 'Ibu Rumah Tangga',
		business: 'Pemilik Usaha',
		other: 'Lainnya'
	},
	institution: {
		micro_small_medium_enterprise: 'Usaha Mikro, Kecil dan Menengah',
		financial_institution: 'Lembaga Keuangan dan Perbankan',
		trade_company: 'Perusahaan Perdagangan',
		logistics_company: 'Perusahaan Logistik',
		manufacturing_company: 'Perusahaan Manufaktur',
		service_provider: 'Penyedia Jasa',
		government_agency: 'Instansi Pemerintah',
		non_profit_organization: 'Organisasi Nirlaba',
		educational_institution: 'Lembaga Pendidikan',
		other: 'Lainnya'
	}
};

export const DocumentTypes = {
	self_photo: 'Foto Diri',
	national_id: 'KTP',
	passport: 'Paspor',
	driver_license: 'SIM',
	social_security: 'Kartu Jaminan Sosial',
	work_permit: 'Izin Kerja',
	green_card: 'Kartu Hijau',
	permanent_resident_card: 'Kartu Penduduk Tetap',
	birth_certificate: 'Akta Lahir',
	marriage_certificate: 'Akta Nikah',
	utility_bill: 'Tagihan Utilitas',
	bank_statement: 'Rekening Koran',
	salary_slip: 'Slip Gaji',
	tax_document: 'NPWP/Dokumen Pajak',
	insurance_document: 'Dokumen Asuransi',
	property_deed: 'Akta Properti',
	vehicle_registration: 'BPKB/STNK',
	academic_transcript: 'Transkrip Akademik',
	diploma: 'Ijazah',
	employment_letter: 'Surat Keterangan Kerja',
	reference_letter: 'Surat Referensi',
	trading_business_license: 'Surat Izin Usaha Perdagangan',
	other: 'Lainnya'
};

export const RelationshipTypes = {
	family: 'Keluarga',
	friend: 'Teman',
	acquaintance: 'Kenalan',
	colleague: 'Rekan Kerja',
	business_partner: 'Rekan Bisnis',
	other: 'Lainnya'
};

export const TransferTypes = {
	domestic: 'Domestik',
	international: 'Internasional'
};

export const TransferPurposes = {
	personal: 'Pribadi',
	business: 'Bisnis',
	gift: 'Hadiah',
	donation: 'Donasi',
	family_support: 'Dukungan Keluarga',
	investment: 'Investasi',
	travel: 'Perjalanan',
	education: 'Pendidikan',
	medical: 'Medis',
	real_estate: 'Properti',
	loan_repayment: 'Pembayaran Pinjaman',
	other: 'Lainnya'
};

export const FundSources = {
	salary: 'Gaji',
	business_income: 'Pendapatan Bisnis',
	savings: 'Tabungan',
	gift: 'Hadiah',
	donation: 'Donasi',
	inheritance: 'Warisan',
	loan: 'Pinjaman',
	investment_income: 'Pendapatan Investasi',
	sale_of_property: 'Penjualan Properti',
	sale_of_assets: 'Penjualan Aset',
	stock_dividends: 'Dividen Saham',
	retirement_funds: 'Dana Pensiun',
	other: 'Lainnya'
};

export const RemittanceStatuses = {
	all: 'Semua Status',
	new: 'Baru',
	approved: 'Disetujui',
	processing: 'Sedang Diproses',
	completed: 'Selesai',
	failed: 'Gagal'
};

export const RemittanceSubmissionStatuses = {
	all: 'Semua Status',
	submitted: 'Diajukan',
	under_review: 'Dalam Peninjauan',
};

export const PaymentMethods = {
	cash: 'Tunai',
	bank_transfer: 'Transfer Bank',
	credit_card: 'Kartu Kredit',
	debit_card: 'Kartu Debit',
	e_wallet: 'Dompet Digital',
	other: 'Lainnya'
};

export const Services = {
	international_remittance: 'Pengiriman Uang Internasional',
	local_remittance: 'Pengiriman Uang Lokal',
	currency_exchange: 'Penukaran Mata Uang',
	corporate_solutions: 'Solusi Korporat',
	consultation_services: 'Layanan Konsultasi',
	other: 'Lainnya'
};

export const AccountTypes = {
	bank_account: 'Rekening Bank',
	ewallet: 'Dompet Digital'
};
