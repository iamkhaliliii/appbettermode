export interface Site {
  id: string;
  name: string;
  subdomain?: string | null;
  role: string;
  createdAt: string;
  status: 'active' | 'inactive' | 'pending';
  memberCount?: number;
  lastActivityAt?: string;
}

export interface SiteCreationFormInputs {
  name: string;
  subdomain?: string;
}

export interface SiteCardProps {
  site: Site;
  onClick?: () => void;
} 