export interface Site {
  id: string;
  name: string;
  subdomain?: string | null;
  ownerId?: string;
  createdAt: string;
  updatedAt?: string | null;
  /** @deprecated Use status instead */
  state?: string;
  status: string;
  logo_url?: string | null;
  primary_color?: string | null;
  brand_colors?: any | null;
}

export interface BrandLogo {
  type: string;
  theme?: string;
  url: string;
  format: string;
  width?: number;
  height?: number;
  background?: string;
}

export interface BrandColor {
  hex: string;
  type: string;
  brightness?: number;
}

export interface CompanyInfo {
  name: string;
  description: string;
  industry?: string;
  location?: string;
}

export interface BrandPreview {
  name?: string;
  description?: string;
  logos: BrandLogo[];
  colors: BrandColor[];
  companyInfo?: CompanyInfo;
  loading: boolean;
  error: string | null;
}

export interface SiteCreationFormInputs {
  name: string;
  subdomain?: string;
  domain?: string;
  selectedLogo?: string;
  selectedColor?: string;
}

export interface SiteCardProps {
  site: Site;
  onClick?: () => void;
} 