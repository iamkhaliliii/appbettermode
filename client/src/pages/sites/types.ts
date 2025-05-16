export interface Site {
  id: string;
  name: string;
  subdomain?: string | null;
  ownerId?: string;
  createdAt: string;
  updatedAt?: string | null;
  state?: string;
}

export interface SiteCreationFormInputs {
  name: string;
  subdomain?: string;
}

export interface SiteCardProps {
  site: Site;
  onClick?: () => void;
} 