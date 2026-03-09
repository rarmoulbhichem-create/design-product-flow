// Project types for LandPage AI

export type ProductType = "physical" | "digital" | "service";

export type Sector = 
  | "fashion" 
  | "tech" 
  | "beauty" 
  | "food" 
  | "home" 
  | "sports" 
  | "education" 
  | "health" 
  | "other";

export type Objective = "direct_sale" | "leads" | "preorder" | "awareness";

export type VisualStyle = "studio" | "luxe" | "minimalist" | "lifestyle";

export type AspectRatio = "1:1" | "16:9" | "9:16";

export type LandingSection = 
  | "hero"
  | "benefits"
  | "gallery"
  | "testimonials"
  | "pricing"
  | "faq"
  | "cta"
  | "footer";

export interface ProjectInfo {
  name: string;
  productType: ProductType;
  sector: Sector;
  targetAudience: string;
  objective: Objective;
  productUrl?: string;
}

export interface ProjectImages {
  uploaded: UploadedImage[];
  generated: GeneratedImage[];
  selected: string[];
}

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  isPrimary: boolean;
  file?: File;
}

export interface GeneratedImage {
  id: string;
  url: string;
  style: VisualStyle;
  variant: number;
  sourceImageId: string;
}

export interface VisualStyleConfig {
  style: VisualStyle;
  lighting: "natural" | "studio" | "dramatic" | "soft";
  aspectRatio: AspectRatio;
  quality: "hd" | "4k";
}

export interface BrandIdentity {
  logo?: string;
  primaryColor: string;
  palette: string[];
  typography: {
    heading: string;
    body: string;
  };
}

export interface LandingPageContent {
  hero: {
    title: string;
    subtitle: string;
    ctaText: string;
    image: string;
  };
  benefits: {
    title: string;
    items: { icon: string; title: string; description: string }[];
  };
  gallery: {
    images: string[];
  };
  testimonials: {
    items: { name: string; role: string; content: string; avatar?: string }[];
  };
  pricing: {
    title: string;
    price: string;
    originalPrice?: string;
    features: string[];
    ctaText: string;
  };
  faq: {
    items: { question: string; answer: string }[];
  };
  cta: {
    title: string;
    subtitle: string;
    buttonText: string;
  };
  footer: {
    companyName: string;
    links: { label: string; url: string }[];
  };
}

export interface Project {
  id: string;
  userId: string;
  info: ProjectInfo;
  images: ProjectImages;
  visualStyle: VisualStyleConfig;
  brandIdentity: BrandIdentity;
  sections: LandingSection[];
  content: LandingPageContent;
  status: "draft" | "generating" | "ready" | "exported";
  createdAt: string;
  updatedAt: string;
}

export interface WizardStep {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}
