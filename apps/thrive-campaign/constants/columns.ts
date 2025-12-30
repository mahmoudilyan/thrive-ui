export interface ColumnOption {
  id: string;
  name: string;
  label: string;
  group: string;
  isFixed?: boolean;
  isDisabled?: boolean;
  width?: number;
}

export const DEFAULT_COLUMNS: ColumnOption[] = [
  // Personal Data Group
  { id: '719', name: 'first_name', label: 'First Name', group: 'Personal Data', width: 150 },
  { id: '164333', name: 'full_name', label: 'Full Name', group: 'Personal Data', isFixed: true, width: 200 },
  { id: '176', name: 'email', label: 'Email Address', group: 'Personal Data', isDisabled: true, width: 250 },
  { id: '720', name: 'last_name', label: 'Last Name', group: 'Personal Data', width: 150 },
  { id: '6734', name: 'phone', label: 'Phone Number', group: 'Personal Data', isDisabled: true, width: 180 },
  { id: '164334', name: 'work_phone', label: 'Work Phone', group: 'Personal Data', width: 180 },
  { id: '164335', name: 'address1', label: 'Address 1', group: 'Personal Data', width: 200 },
  { id: '164336', name: 'address2', label: 'Address 2', group: 'Personal Data', width: 200 },
  { id: '164337', name: 'country', label: 'Country', group: 'Personal Data', width: 150 },
  { id: '164338', name: 'state', label: 'State', group: 'Personal Data', width: 150 },
  { id: '164339', name: 'city', label: 'City', group: 'Personal Data', width: 150 },
  { id: '244471', name: 'zip', label: 'Zip Code', group: 'Personal Data', width: 120 },
  { id: '164340', name: 'title', label: 'Title', group: 'Personal Data', width: 150 },
  { id: '164341', name: 'website', label: 'Website', group: 'Personal Data', width: 200 },
  { id: '164342', name: 'dob', label: 'Date of Birth', group: 'Personal Data', width: 150 },
  { id: '164343', name: 'gender', label: 'Gender', group: 'Personal Data', width: 120 },
  { id: '164344', name: 'comments', label: 'Comments', group: 'Personal Data', width: 250 },

  // Social Data Group
  { id: '164345', name: 'linkedin', label: 'LinkedIn', group: 'Social Data', width: 180 },
  { id: '164346', name: 'twitter', label: 'Twitter', group: 'Social Data', width: 180 },
  { id: '164347', name: 'facebook', label: 'Facebook', group: 'Social Data', width: 180 },
  { id: '164348', name: 'instagram', label: 'Instagram', group: 'Social Data', width: 180 },
  { id: '164349', name: 'pinterest', label: 'Pinterest', group: 'Social Data', width: 180 },
  { id: '164350', name: 'youtube', label: 'Youtube', group: 'Social Data', width: 180 },
  { id: '164351', name: 'google_my_business', label: 'Google My Business', group: 'Social Data', width: 200 },

  // Company Data Group
  { id: '164352', name: 'company_name', label: 'Company Name', group: 'Company Data', width: 200, isFixed: true },
  { id: '164353', name: 'company_address', label: 'Company Address', group: 'Company Data', width: 250 },
  { id: '164354', name: 'company_phone', label: 'Company Phone', group: 'Company Data', width: 180 },
  { id: '164355', name: 'company_website', label: 'Company Website', group: 'Company Data', width: 200, isFixed: true },
  { id: '164356', name: 'year_founded', label: 'Year Founded', group: 'Company Data', width: 150 },
  { id: '164357', name: 'employees_count', label: 'Number Of Employees', group: 'Company Data', width: 200 },
  { id: '164358', name: 'annual_revenue', label: 'Annual Revenue', group: 'Company Data', width: 180 },
  { id: '164359', name: 'industry', label: 'Industry', group: 'Company Data', width: 180 },

  // Lead Data Group
  { id: 'contactid', name: 'contact_id', label: 'Contact ID', group: 'Lead Data', width: 150 },
  { id: 'leadscore', name: 'lead_score', label: 'Lead Score', group: 'Lead Data', width: 150, isFixed: true },
  { id: 'leadstatus', name: 'lead_status', label: 'Lead Status', group: 'Lead Data', width: 180, isFixed: true },
  { id: 'assignedto', name: 'assigned_to', label: 'Assigned To', group: 'Lead Data', width: 180 },
  { id: 'tags', name: 'tags', label: 'Tags', group: 'Lead Data', width: 180 },
];
