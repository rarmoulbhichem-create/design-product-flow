// Project types for LandPage AI

export interface ProductData {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  shortDescription: string;
  longDescription: string;
  targetAudience: string;
  specifications: { label: string; value: string }[];
  tags: string[];
}

export interface PricingData {
  price: number;
  originalPrice: number;
  currency: string;
  discountPercent: number;
  shippingInfo: string;
  guarantee: string;
}

export interface HeroData {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaSubtext: string;
  badge: string;
}

export interface TestimonialData {
  name: string;
  location: string;
  rating: number;
  text: string;
  verified: boolean;
  date: string;
}

export interface BenefitData {
  icon: string;
  title: string;
  description: string;
}

export interface FeatureData {
  title: string;
  description: string;
}

export interface FaqData {
  question: string;
  answer: string;
}

export interface LandingPageData {
  hero: HeroData;
  trustBadges: string[];
  benefits: BenefitData[];
  socialProof: {
    rating: number;
    reviewCount: number;
    satisfactionRate: number;
  };
  testimonials: TestimonialData[];
  features: FeatureData[];
  faq: FaqData[];
  urgency: {
    text: string;
    subtext: string;
    stockText: string;
  };
  finalCta: {
    headline: string;
    subheadline: string;
    buttonText: string;
    guaranteeText: string;
  };
}

export interface DesignData {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  mood: string;
}

export interface SeoData {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  keywords: string[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
}

export interface GeneratedProject {
  product: ProductData;
  pricing: PricingData;
  landingPage: LandingPageData;
  seo: SeoData;
  design: DesignData;
  productImageUrl: string;
  generatedImages: GeneratedImage[];
  template: LandingTemplate;
}

export type LandingTemplate = "suspended" | "elegant" | "bold" | "minimal";

export interface UploadedImage {
  id: string;
  url: string;
  name: string;
  file?: File;
}
