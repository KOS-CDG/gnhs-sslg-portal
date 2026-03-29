export type OrgStatus = 'accredited' | 'pending' | 'expired';

export interface OrgOfficer {
  name: string;
  position: string;
}

export interface StudentOrganization {
  id: string;
  name: string;
  logoUrl: string;
  description: string;
  officers: OrgOfficer[];
  status: OrgStatus;
  accreditedYear: number;
  renewalDate: Date;
  documentUrls: string[];
}
