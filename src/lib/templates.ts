import type { LandingTemplate } from "@/types/project";

export interface TemplateStyle {
  id: LandingTemplate;
  name: string;
  nameAr: string;
  desc: string;
  descFr: string;
  // Layout
  heroLayout: "split" | "centered" | "overlay" | "fullwidth";
  // Visual
  isDark: boolean;
  bgClass: string;
  cardClass: string;
  sectionAltClass: string;
  badgeClass: string;
  ctaClass: string;
  headingClass: string;
  borderRadius: string;
  // Hero specific
  heroExtraClass: string;
  heroImageClass: string;
  // Feature card style
  featureCardClass: string;
  testimonialCardClass: string;
  faqClass: string;
  // Override colors (applied as CSS vars)
  overrideColors?: {
    primary?: string;
    accent?: string;
    bg?: string;
    text?: string;
    cardBg?: string;
  };
  // Font
  fontClass?: string;
  // Special effects
  glowEffect?: boolean;
  glassmorphism?: boolean;
  neonBorders?: boolean;
  urgencyStyle?: "badge" | "banner" | "countdown" | "pulse";
}

export const TEMPLATE_STYLES: Record<LandingTemplate, TemplateStyle> = {
  elegant: {
    id: "elegant",
    name: "Élégant",
    nameAr: "أنيق",
    desc: "تصميم راقي وفاخر",
    descFr: "Design raffiné et luxueux",
    heroLayout: "split",
    isDark: false,
    bgClass: "bg-background",
    cardClass: "bg-card border border-border rounded-2xl shadow-sm",
    sectionAltClass: "bg-card/30",
    badgeClass: "rounded-full",
    ctaClass: "rounded-xl shadow-lg",
    headingClass: "tracking-tight",
    borderRadius: "rounded-2xl",
    heroExtraClass: "",
    heroImageClass: "rounded-2xl border border-border shadow-2xl",
    featureCardClass: "rounded-xl border border-border hover:border-primary/30 transition-all p-5",
    testimonialCardClass: "rounded-2xl bg-card border border-border p-5",
    faqClass: "border border-border rounded-xl",
    urgencyStyle: "badge",
  },
  bold: {
    id: "bold",
    name: "Audacieux",
    nameAr: "جريء",
    desc: "ألوان قوية وتأثير بصري عالي",
    descFr: "Couleurs fortes et impact visuel",
    heroLayout: "split",
    isDark: false,
    bgClass: "bg-background",
    cardClass: "bg-card border-2 border-border rounded-xl shadow-md",
    sectionAltClass: "bg-primary/5",
    badgeClass: "rounded-lg font-bold uppercase tracking-wide",
    ctaClass: "rounded-lg shadow-xl font-bold uppercase tracking-wider text-lg",
    headingClass: "font-extrabold uppercase tracking-wide",
    borderRadius: "rounded-xl",
    heroExtraClass: "py-20 md:py-32",
    heroImageClass: "rounded-xl border-2 border-primary/30 shadow-2xl",
    featureCardClass: "rounded-xl border-2 border-border hover:border-primary/50 transition-all p-6 hover:shadow-lg",
    testimonialCardClass: "rounded-xl bg-card border-2 border-border p-6",
    faqClass: "border-2 border-border rounded-xl",
    urgencyStyle: "banner",
  },
  minimal: {
    id: "minimal",
    name: "Minimal",
    nameAr: "بسيط",
    desc: "نظيف وعصري",
    descFr: "Propre et moderne",
    heroLayout: "centered",
    isDark: false,
    bgClass: "bg-background",
    cardClass: "bg-transparent border-0 p-0",
    sectionAltClass: "bg-muted/30",
    badgeClass: "rounded-full bg-muted text-muted-foreground border-0",
    ctaClass: "rounded-full",
    headingClass: "font-light tracking-tight",
    borderRadius: "rounded-full",
    heroExtraClass: "text-center py-20 md:py-28",
    heroImageClass: "rounded-3xl shadow-sm",
    featureCardClass: "p-6 border-b border-border last:border-0 rounded-none",
    testimonialCardClass: "bg-transparent p-6 border-b border-border",
    faqClass: "border-b border-border",
    urgencyStyle: "badge",
  },
  suspended: {
    id: "suspended",
    name: "Suspendu",
    nameAr: "معلّق",
    desc: "تأثير عائم إبداعي",
    descFr: "Effet flottant créatif",
    heroLayout: "centered",
    isDark: false,
    bgClass: "bg-background",
    cardClass: "bg-card border border-border rounded-3xl shadow-xl hover:shadow-2xl transition-shadow",
    sectionAltClass: "bg-gradient-to-b from-card/50 to-background",
    badgeClass: "rounded-full shadow-md",
    ctaClass: "rounded-2xl shadow-2xl hover:-translate-y-1 transition-transform",
    headingClass: "tracking-tight",
    borderRadius: "rounded-3xl",
    heroExtraClass: "py-24 md:py-36",
    heroImageClass: "rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-2 transition-transform duration-500",
    featureCardClass: "rounded-2xl bg-card border border-border shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all p-6",
    testimonialCardClass: "rounded-2xl bg-card border border-border shadow-lg p-5",
    faqClass: "border border-border rounded-2xl shadow-sm",
    urgencyStyle: "badge",
  },
  luxury: {
    id: "luxury",
    name: "Luxe",
    nameAr: "فاخر",
    desc: "تصميم فاخر بألوان ذهبية",
    descFr: "Design luxueux avec accents dorés",
    heroLayout: "overlay",
    isDark: true,
    bgClass: "bg-[#0a0a0f] text-white",
    cardClass: "bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl",
    sectionAltClass: "bg-white/[0.02]",
    badgeClass: "rounded-full bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-amber-300 border border-amber-500/30",
    ctaClass: "rounded-xl bg-gradient-to-r from-amber-500 to-yellow-600 text-black font-bold shadow-[0_0_30px_rgba(245,158,11,0.3)]",
    headingClass: "tracking-tight bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-200 bg-clip-text text-transparent",
    borderRadius: "rounded-2xl",
    heroExtraClass: "py-24 md:py-36 bg-gradient-to-br from-[#0a0a0f] via-[#1a1020] to-[#0a0a0f]",
    heroImageClass: "rounded-2xl border border-amber-500/20 shadow-[0_25px_60px_rgba(245,158,11,0.15)]",
    featureCardClass: "rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-6 hover:border-amber-500/30 transition-all",
    testimonialCardClass: "rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 p-5",
    faqClass: "border border-white/10 rounded-2xl bg-white/5 backdrop-blur",
    overrideColors: { primary: "#f59e0b", accent: "#eab308" },
    glassmorphism: true,
    glowEffect: true,
    urgencyStyle: "badge",
  },
  fashion: {
    id: "fashion",
    name: "Mode",
    nameAr: "أزياء",
    desc: "تصميم مجلة عصرية",
    descFr: "Style magazine de mode",
    heroLayout: "fullwidth",
    isDark: false,
    bgClass: "bg-[#faf9f7] text-[#1a1a1a]",
    cardClass: "bg-white border-0 shadow-none",
    sectionAltClass: "bg-[#f0eeeb]",
    badgeClass: "rounded-none uppercase tracking-[0.3em] text-xs font-light border border-current",
    ctaClass: "rounded-none uppercase tracking-[0.2em] font-light border-2 bg-[#1a1a1a] text-white hover:bg-transparent hover:text-[#1a1a1a] transition-all",
    headingClass: "font-light tracking-[0.05em] uppercase",
    borderRadius: "rounded-none",
    heroExtraClass: "py-0 md:py-0",
    heroImageClass: "rounded-none aspect-[3/4] object-cover",
    featureCardClass: "p-8 border-b border-[#e5e3e0] last:border-0 rounded-none",
    testimonialCardClass: "bg-transparent p-8 border-l-2 border-[#1a1a1a]",
    faqClass: "border-b border-[#e5e3e0]",
    fontClass: "font-serif",
    urgencyStyle: "badge",
  },
  tech: {
    id: "tech",
    name: "Tech",
    nameAr: "تقني",
    desc: "تصميم مستقبلي للأجهزة",
    descFr: "Design futuriste pour gadgets",
    heroLayout: "split",
    isDark: true,
    bgClass: "bg-[#0c0c14] text-white",
    cardClass: "bg-[#12121f] border border-[#1e1e35] rounded-xl",
    sectionAltClass: "bg-[#0e0e1a]",
    badgeClass: "rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-xs",
    ctaClass: "rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 shadow-[0_0_25px_rgba(6,182,212,0.3)] font-medium",
    headingClass: "tracking-tight font-bold",
    borderRadius: "rounded-xl",
    heroExtraClass: "py-20 md:py-28 bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.08),_transparent_60%)]",
    heroImageClass: "rounded-xl border border-cyan-500/20 shadow-[0_20px_50px_rgba(6,182,212,0.1)]",
    featureCardClass: "rounded-xl bg-[#12121f] border border-[#1e1e35] p-6 hover:border-cyan-500/30 transition-all group",
    testimonialCardClass: "rounded-xl bg-[#12121f] border border-[#1e1e35] p-5",
    faqClass: "border border-[#1e1e35] rounded-xl bg-[#12121f]",
    overrideColors: { primary: "#06b6d4", accent: "#3b82f6" },
    neonBorders: true,
    urgencyStyle: "badge",
  },
  flashsale: {
    id: "flashsale",
    name: "Flash Sale",
    nameAr: "تخفيضات",
    desc: "عروض وتخفيضات مع عداد تنازلي",
    descFr: "Promos avec compte à rebours",
    heroLayout: "split",
    isDark: false,
    bgClass: "bg-white text-[#1a1a1a]",
    cardClass: "bg-white border-2 border-red-100 rounded-2xl shadow-md",
    sectionAltClass: "bg-red-50/50",
    badgeClass: "rounded-lg bg-red-600 text-white font-bold animate-pulse",
    ctaClass: "rounded-xl bg-gradient-to-r from-red-600 to-orange-500 text-white font-bold text-lg shadow-xl shadow-red-500/25 hover:scale-105 transition-transform",
    headingClass: "font-extrabold",
    borderRadius: "rounded-2xl",
    heroExtraClass: "py-16 md:py-24 bg-gradient-to-br from-red-50 to-orange-50",
    heroImageClass: "rounded-2xl border-2 border-red-200 shadow-xl",
    featureCardClass: "rounded-xl bg-white border-2 border-red-100 p-5 hover:border-red-300 transition-all",
    testimonialCardClass: "rounded-xl bg-white border-2 border-red-100 p-5",
    faqClass: "border-2 border-red-100 rounded-xl",
    overrideColors: { primary: "#dc2626", accent: "#ea580c" },
    urgencyStyle: "pulse",
  },
  neon: {
    id: "neon",
    name: "Néon",
    nameAr: "نيون",
    desc: "تأثيرات نيون متوهجة",
    descFr: "Effets néon lumineux",
    heroLayout: "centered",
    isDark: true,
    bgClass: "bg-[#050510] text-white",
    cardClass: "bg-[#0a0a1f]/80 backdrop-blur border border-purple-500/20 rounded-2xl shadow-[0_0_15px_rgba(168,85,247,0.1)]",
    sectionAltClass: "bg-[#0a0a1a]",
    badgeClass: "rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/40 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    ctaClass: "rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 shadow-[0_0_30px_rgba(168,85,247,0.4)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] transition-shadow",
    headingClass: "tracking-tight font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent",
    borderRadius: "rounded-2xl",
    heroExtraClass: "py-24 md:py-36 bg-[radial-gradient(ellipse_at_center,_rgba(168,85,247,0.08),_transparent_60%)]",
    heroImageClass: "rounded-2xl border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)]",
    featureCardClass: "rounded-2xl bg-[#0a0a1f]/80 backdrop-blur border border-purple-500/20 p-6 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all",
    testimonialCardClass: "rounded-2xl bg-[#0a0a1f]/80 backdrop-blur border border-purple-500/20 p-5",
    faqClass: "border border-purple-500/20 rounded-2xl bg-[#0a0a1f]/80 backdrop-blur",
    overrideColors: { primary: "#a855f7", accent: "#ec4899" },
    glowEffect: true,
    neonBorders: true,
    urgencyStyle: "badge",
  },
  editorial: {
    id: "editorial",
    name: "Éditorial",
    nameAr: "تحريري",
    desc: "تصميم صحفي احترافي",
    descFr: "Style journal professionnel",
    heroLayout: "split",
    isDark: false,
    bgClass: "bg-[#fafaf8] text-[#2a2a2a]",
    cardClass: "bg-white border border-[#e8e8e4] rounded-sm shadow-none",
    sectionAltClass: "bg-[#f2f2ee]",
    badgeClass: "rounded-sm bg-[#2a2a2a] text-white text-xs uppercase tracking-[0.2em] font-normal",
    ctaClass: "rounded-sm bg-[#2a2a2a] text-white hover:bg-[#444] uppercase tracking-widest text-sm font-normal",
    headingClass: "font-serif font-normal tracking-normal leading-tight",
    borderRadius: "rounded-sm",
    heroExtraClass: "py-16 md:py-24 border-b-2 border-[#2a2a2a]",
    heroImageClass: "rounded-sm border border-[#e8e8e4]",
    featureCardClass: "p-6 border border-[#e8e8e4] rounded-sm hover:bg-[#f8f8f5] transition-colors",
    testimonialCardClass: "bg-white p-6 border border-[#e8e8e4] rounded-sm",
    faqClass: "border border-[#e8e8e4] rounded-sm",
    fontClass: "font-serif",
    urgencyStyle: "badge",
  },
};

export const TEMPLATE_LIST = Object.values(TEMPLATE_STYLES);
