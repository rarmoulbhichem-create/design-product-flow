import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { useProjects } from "@/hooks/useProjects";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, Shield, Zap, Heart, Check, ChevronDown, ChevronUp,
  Truck, Lock, RefreshCw, Headphones, ArrowLeft, Download, Save,
  Monitor, Smartphone, Palette, Pencil, Eye, Undo2, Redo2,
  Clock, Flame, Settings,
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { LandingTemplate } from "@/types/project";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";
import { useLanguage } from "@/contexts/LanguageContext";
import { TEMPLATE_STYLES, TEMPLATE_LIST, type TemplateStyle } from "@/lib/templates";
import { TemplatePicker } from "./TemplatePicker";
import { ScrollReveal } from "./ScrollReveal";
import { WhatsAppButton } from "./WhatsAppButton";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Label } from "./ui/label";

const ICON_MAP: Record<string, React.ElementType> = {
  Star, Shield, Zap, Heart, Check, Truck, Lock, RefreshCw, Headphones,
};

// UI translations
const UI_TEXT = {
  ar: {
    new: "جديد",
    edit: "تحرير",
    preview: "معاينة",
    export: "تصدير",
    editModeBanner: "وضع التحرير — انقر على أي نص أو صورة لتعديله",
    whyChoose: (name: string) => `لماذا تختار ${name}؟`,
    productDesc: "وصف المنتج",
    specifications: "المواصفات",
    features: "المميزات",
    testimonials: "ماذا يقول عملاؤنا",
    basedOn: (count: string) => `بناءً على ${count} تقييم`,
    reviews: "تقييم",
    satisfied: "عملاء راضون",
    verified: "موثّق",
    faq: "الأسئلة الشائعة",
    readyToOrder: "هل أنت مستعد للطلب؟",
    dontMiss: "لا تفوّت هذا العرض الاستثنائي.",
    getItNow: "احصل عليه الآن",
    allRights: (brand: string) => `© 2024 ${brand}. جميع الحقوق محفوظة.`,
    currency: "دج",
    moreTemplates: "المزيد",
  },
  fr: {
    new: "Nouveau",
    edit: "Modifier",
    preview: "Aperçu",
    export: "Exporter",
    editModeBanner: "Mode édition — Cliquez sur n'importe quel texte ou image pour le modifier",
    whyChoose: (name: string) => `Pourquoi choisir ${name} ?`,
    productDesc: "Description du produit",
    specifications: "Caractéristiques",
    features: "Fonctionnalités",
    testimonials: "Ce que disent nos clients",
    basedOn: (count: string) => `Basé sur ${count} avis`,
    reviews: "avis",
    satisfied: "clients satisfaits",
    verified: "Vérifié",
    faq: "Questions fréquentes",
    readyToOrder: "Prêt à commander ?",
    dontMiss: "Ne manquez pas cette offre exceptionnelle.",
    getItNow: "Obtenez-le maintenant",
    allRights: (brand: string) => `© 2024 ${brand}. Tous droits réservés.`,
    currency: "DA",
    moreTemplates: "Plus",
  },
};

function StarRating({ rating, style }: { rating: number; style?: TemplateStyle }) {
  const starColor = style?.isDark ? "fill-amber-400 text-amber-400" : "fill-yellow-400 text-yellow-400";
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={cn("w-4 h-4", i <= rating ? starColor : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );
}

function formatPrice(price: number, currency: string) {
  if (currency === "DZD") return `${price.toLocaleString("ar-DZ")} دج`;
  return `${price}€`;
}

function CountdownTimer() {
  const [time, setTime] = useState({ h: 2, m: 47, s: 33 });
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="flex items-center justify-center gap-2 text-2xl font-mono font-bold">
      <div className="bg-red-600 text-white px-3 py-2 rounded-lg">{pad(time.h)}</div>
      <span className="text-red-500">:</span>
      <div className="bg-red-600 text-white px-3 py-2 rounded-lg">{pad(time.m)}</div>
      <span className="text-red-500">:</span>
      <div className="bg-red-600 text-white px-3 py-2 rounded-lg">{pad(time.s)}</div>
    </div>
  );
}

export function LandingPreview() {
  const { generatedProject, setCurrentView, setSelectedTemplate, resetApp, updateGeneratedProject, selectedLanguage, undo, redo, canUndo, canRedo } = useApp();
  const { lang } = useLanguage();
  const { saveProject } = useProjects();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [editMode, setEditMode] = useState(false);
  const [savedProjectId, setSavedProjectId] = useState<string | null>(null);

  const t = UI_TEXT[lang];
  const handleSave = async () => {
    if (!generatedProject) return;
    const id = await saveProject(generatedProject, undefined, savedProjectId || undefined);
    if (id) setSavedProjectId(id);
  };

  if (!generatedProject) return null;

  const { product, pricing, landingPage, design, productImageUrl, generatedImages = [] } = generatedProject;
  const tmpl = TEMPLATE_STYLES[generatedProject.template] || TEMPLATE_STYLES.elegant;

  const heroImage = generatedImages[0]?.url || productImageUrl;
  const detailImage = generatedImages[1]?.url || productImageUrl;
  const currency = pricing?.currency || "DZD";

  const primaryColor = tmpl.overrideColors?.primary || design?.primaryColor || "#7c3aed";
  const accentColor = tmpl.overrideColors?.accent || design?.accentColor || "#06b6d4";

  // Helpers for updating nested fields
  const updateProduct = (patch: Partial<typeof product>) =>
    updateGeneratedProject(p => ({ ...p, product: { ...p.product, ...patch } }));
  const updatePricing = (patch: Partial<typeof pricing>) =>
    updateGeneratedProject(p => ({ ...p, pricing: { ...p.pricing, ...patch } }));
  const updateHero = (patch: Partial<typeof landingPage.hero>) =>
    updateGeneratedProject(p => ({ ...p, landingPage: { ...p.landingPage, hero: { ...p.landingPage.hero, ...patch } } }));
  const updateBenefit = (i: number, patch: Partial<typeof landingPage.benefits[0]>) =>
    updateGeneratedProject(p => ({
      ...p, landingPage: { ...p.landingPage, benefits: p.landingPage.benefits.map((b, idx) => idx === i ? { ...b, ...patch } : b) }
    }));
  const updateFeature = (i: number, patch: Partial<typeof landingPage.features[0]>) =>
    updateGeneratedProject(p => ({
      ...p, landingPage: { ...p.landingPage, features: p.landingPage.features.map((f, idx) => idx === i ? { ...f, ...patch } : f) }
    }));
  const updateTestimonial = (i: number, patch: Partial<typeof landingPage.testimonials[0]>) =>
    updateGeneratedProject(p => ({
      ...p, landingPage: { ...p.landingPage, testimonials: p.landingPage.testimonials.map((t, idx) => idx === i ? { ...t, ...patch } : t) }
    }));
  const updateFaq = (i: number, patch: Partial<typeof landingPage.faq[0]>) =>
    updateGeneratedProject(p => ({
      ...p, landingPage: { ...p.landingPage, faq: p.landingPage.faq.map((f, idx) => idx === i ? { ...f, ...patch } : f) }
    }));
  const updateFinalCta = (patch: Partial<NonNullable<typeof landingPage.finalCta>>) =>
    updateGeneratedProject(p => ({ ...p, landingPage: { ...p.landingPage, finalCta: { ...p.landingPage.finalCta, ...patch } } }));
  const updateImage = (index: number, url: string) =>
    updateGeneratedProject(p => {
      if (index === -1) return { ...p, productImageUrl: url };
      const imgs = [...(p.generatedImages || [])];
      if (imgs[index]) imgs[index] = { ...imgs[index], url };
      return { ...p, generatedImages: imgs };
    });
  const updateSpec = (i: number, field: "label" | "value", val: string) =>
    updateGeneratedProject(p => ({
      ...p, product: { ...p.product, specifications: p.product.specifications.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }
    }));

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { resetApp(); setCurrentView("upload"); }}>
            <ArrowLeft className="w-4 h-4 ml-1" /> {t.new}
          </Button>
          <div className="h-6 w-px bg-border" />
          <TemplatePicker
            current={generatedProject.template}
            onSelect={setSelectedTemplate}
            lang={lang}
          />
        </div>
        <div className="flex items-center gap-2">
          {editMode && (
            <>
              <Button variant="outline" size="sm" onClick={undo} disabled={!canUndo} title="Undo">
                <Undo2 className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={redo} disabled={!canRedo} title="Redo">
                <Redo2 className="w-4 h-4" />
              </Button>
              <div className="h-6 w-px bg-border" />
            </>
          )}
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="gap-1.5"
          >
            {editMode ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {editMode ? t.preview : t.edit}
          </Button>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button variant={viewMode === "desktop" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("desktop")} className="rounded-none">
              <Monitor className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "mobile" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("mobile")} className="rounded-none">
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Settings className="w-4 h-4" /> {lang === "fr" ? "Paramètres" : "إعدادات"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{lang === "fr" ? "Paramètres du projet" : "إعدادات المشروع"}</DialogTitle>
              </DialogHeader>
              <div className="space-y-5 pt-2 max-h-[60vh] overflow-y-auto pr-1">
                {/* Store Name */}
                <div className="space-y-2">
                  <Label>{lang === "fr" ? "Nom de la boutique" : "اسم المتجر"}</Label>
                  <Input
                    placeholder={lang === "fr" ? "Ex: Ma Boutique DZ" : "مثال: متجري"}
                    value={generatedProject.storeSettings?.storeName || ""}
                    onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, storeName: e.target.value } }))}
                  />
                </div>

                {/* Store Logo */}
                <div className="space-y-2">
                  <Label>{lang === "fr" ? "Logo de la boutique (URL)" : "شعار المتجر (رابط)"}</Label>
                  <Input
                    placeholder="https://example.com/logo.png"
                    value={generatedProject.storeSettings?.logoUrl || ""}
                    onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, logoUrl: e.target.value } }))}
                    dir="ltr"
                  />
                  {generatedProject.storeSettings?.logoUrl && (
                    <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
                      <img src={generatedProject.storeSettings.logoUrl} alt="Logo" className="w-10 h-10 object-contain rounded" onError={e => (e.currentTarget.style.display = "none")} />
                      <span className="text-xs text-muted-foreground">{lang === "fr" ? "Aperçu du logo" : "معاينة الشعار"}</span>
                    </div>
                  )}
                </div>

                {/* WhatsApp */}
                <div className="space-y-2">
                  <Label>{lang === "fr" ? "Numéro WhatsApp du vendeur" : "رقم WhatsApp للبائع"}</Label>
                  <Input
                    placeholder={lang === "fr" ? "Ex: +213 555 123 456" : "مثال: 213555123456+"}
                    value={generatedProject.whatsappNumber || ""}
                    onChange={e => updateGeneratedProject(p => ({ ...p, whatsappNumber: e.target.value }))}
                    dir="ltr"
                  />
                  <p className="text-xs text-muted-foreground">
                    {lang === "fr"
                      ? "Inclure l'indicatif pays (ex: +213 pour l'Algérie)."
                      : "أضف رمز البلد (مثال: 213+ للجزائر)."}
                  </p>
                </div>

                {/* Custom Colors */}
                <div className="space-y-2">
                  <Label className="font-semibold">{lang === "fr" ? "Couleurs personnalisées" : "ألوان مخصصة"}</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{lang === "fr" ? "Couleur principale" : "اللون الرئيسي"}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={generatedProject.storeSettings?.customPrimaryColor || design?.primaryColor || "#7c3aed"}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customPrimaryColor: e.target.value } }))}
                          className="w-8 h-8 rounded cursor-pointer border border-border"
                        />
                        <Input
                          value={generatedProject.storeSettings?.customPrimaryColor || ""}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customPrimaryColor: e.target.value } }))}
                          placeholder={design?.primaryColor || "#7c3aed"}
                          className="text-xs h-8"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{lang === "fr" ? "Couleur d'accent" : "لون التمييز"}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={generatedProject.storeSettings?.customAccentColor || design?.accentColor || "#06b6d4"}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customAccentColor: e.target.value } }))}
                          className="w-8 h-8 rounded cursor-pointer border border-border"
                        />
                        <Input
                          value={generatedProject.storeSettings?.customAccentColor || ""}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customAccentColor: e.target.value } }))}
                          placeholder={design?.accentColor || "#06b6d4"}
                          className="text-xs h-8"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{lang === "fr" ? "Arrière-plan" : "لون الخلفية"}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={generatedProject.storeSettings?.customBackgroundColor || "#ffffff"}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customBackgroundColor: e.target.value } }))}
                          className="w-8 h-8 rounded cursor-pointer border border-border"
                        />
                        <Input
                          value={generatedProject.storeSettings?.customBackgroundColor || ""}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customBackgroundColor: e.target.value } }))}
                          placeholder="#ffffff"
                          className="text-xs h-8"
                          dir="ltr"
                        />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{lang === "fr" ? "Texte" : "لون النص"}</Label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={generatedProject.storeSettings?.customTextColor || "#1a1a1a"}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customTextColor: e.target.value } }))}
                          className="w-8 h-8 rounded cursor-pointer border border-border"
                        />
                        <Input
                          value={generatedProject.storeSettings?.customTextColor || ""}
                          onChange={e => updateGeneratedProject(p => ({ ...p, storeSettings: { ...p.storeSettings, customTextColor: e.target.value } }))}
                          placeholder="#1a1a1a"
                          className="text-xs h-8"
                          dir="ltr"
                        />
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs"
                    onClick={() => updateGeneratedProject(p => ({
                      ...p,
                      storeSettings: {
                        ...p.storeSettings,
                        customPrimaryColor: undefined,
                        customAccentColor: undefined,
                        customBackgroundColor: undefined,
                        customTextColor: undefined,
                      }
                    }))}
                  >
                    {lang === "fr" ? "Réinitialiser les couleurs" : "إعادة تعيين الألوان"}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleSave}>
            <Save className="w-4 h-4" /> {lang === "fr" ? "Sauvegarder" : "حفظ"}
          </Button>
          <Button className="btn-gradient gap-2" size="sm" onClick={() => setCurrentView("export")}>
            <Download className="w-4 h-4" /> {t.export}
          </Button>
        </div>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-sm text-primary font-medium">
          <Pencil className="w-3.5 h-3.5 inline ml-1" />
          {t.editModeBanner}
        </div>
      )}

      {/* Landing Page Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={generatedProject.template}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className={cn(
            "mx-auto transition-all duration-500",
            viewMode === "mobile" ? "max-w-[390px]" : "max-w-full",
            tmpl.bgClass,
            tmpl.fontClass,
          )} dir={selectedLanguage === "fr" ? "ltr" : "rtl"}>

        {/* HERO */}
        <section className={cn("relative overflow-hidden", tmpl.heroExtraClass || "py-16 md:py-24")}>
          {!tmpl.isDark && (
            <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />
          )}
          <div className="relative container mx-auto px-4">
            {/* Flash sale countdown */}
            {tmpl.urgencyStyle === "pulse" && landingPage.urgency && (
              <div className="mb-8 text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg font-bold animate-pulse">
                  <Flame className="w-5 h-5" />
                  {landingPage.urgency.text}
                  <Flame className="w-5 h-5" />
                </div>
                <CountdownTimer />
              </div>
            )}

            {/* Hero content - varies by layout */}
            {tmpl.heroLayout === "fullwidth" ? (
              // Fashion / fullwidth: large image with overlay text
              <div className="relative">
                <EditableImage
                  src={heroImage}
                  alt={product.name}
                  editMode={editMode}
                  onChange={url => updateImage(0, url)}
                  className="w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden"
                  imgClassName="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                  <div className="p-8 md:p-16 text-white max-w-2xl space-y-4">
                    {landingPage.hero.badge && (
                      <span className={cn("inline-block px-3 py-1 text-sm", tmpl.badgeClass)}>
                        <EditableText value={landingPage.hero.badge} onChange={v => updateHero({ badge: v })} editMode={editMode} />
                      </span>
                    )}
                    <EditableText
                      value={landingPage.hero.headline}
                      onChange={v => updateHero({ headline: v })}
                      editMode={editMode}
                      as="h1"
                      className={cn("text-3xl md:text-5xl lg:text-6xl leading-tight", tmpl.headingClass)}
                    />
                    <div className="flex items-baseline gap-3">
                      <span className="text-3xl font-bold">{formatPrice(pricing.price, currency)}</span>
                      {pricing.originalPrice > pricing.price && (
                        <span className="text-xl text-white/60 line-through">{formatPrice(pricing.originalPrice, currency)}</span>
                      )}
                    </div>
                    <Button size="lg" className={cn("text-lg px-8 py-6", tmpl.ctaClass)}>
                      <EditableText value={landingPage.hero.ctaText} onChange={v => updateHero({ ctaText: v })} editMode={editMode} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : tmpl.heroLayout === "centered" ? (
              // Centered layout
              <div className="text-center space-y-8 max-w-4xl mx-auto">
                {landingPage.hero.badge && (
                  <Badge className={cn("text-sm px-4 py-1", tmpl.badgeClass)} style={!tmpl.isDark ? { backgroundColor: `${primaryColor}20`, color: primaryColor, border: `1px solid ${primaryColor}40` } : undefined}>
                    <EditableText value={landingPage.hero.badge} onChange={v => updateHero({ badge: v })} editMode={editMode} />
                  </Badge>
                )}
                <EditableText
                  value={landingPage.hero.headline}
                  onChange={v => updateHero({ headline: v })}
                  editMode={editMode}
                  as="h1"
                  className={cn("text-3xl md:text-5xl lg:text-7xl leading-tight", tmpl.headingClass)}
                />
                <EditableText
                  value={landingPage.hero.subheadline}
                  onChange={v => updateHero({ subheadline: v })}
                  editMode={editMode}
                  as="p"
                  multiline
                  className={cn("text-lg md:text-xl max-w-2xl mx-auto", tmpl.isDark ? "text-white/60" : "text-muted-foreground")}
                />
                <div className="space-y-4">
                  <div className="flex items-baseline gap-3 justify-center">
                    <span className="text-4xl md:text-5xl font-bold" style={{ color: primaryColor }}>
                      {formatPrice(pricing.price, currency)}
                    </span>
                    {pricing.originalPrice > pricing.price && (
                      <span className={cn("text-xl line-through", tmpl.isDark ? "text-white/40" : "text-muted-foreground")}>{formatPrice(pricing.originalPrice, currency)}</span>
                    )}
                    {pricing.discountPercent > 0 && <Badge variant="destructive">-{pricing.discountPercent}%</Badge>}
                  </div>
                  <Button size="lg" className={cn("text-lg px-8 py-6", tmpl.ctaClass)} style={!tmpl.ctaClass.includes("bg-") ? { background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` } : undefined}>
                    <EditableText value={landingPage.hero.ctaText} onChange={v => updateHero({ ctaText: v })} editMode={editMode} />
                  </Button>
                </div>
                <div className="flex justify-center pt-4">
                  <EditableImage
                    src={heroImage}
                    alt={product.name}
                    editMode={editMode}
                    onChange={url => updateImage(0, url)}
                    className={cn("relative w-full max-w-lg aspect-square overflow-hidden", tmpl.heroImageClass)}
                  />
                </div>
              </div>
            ) : tmpl.heroLayout === "overlay" ? (
              // Overlay: image as background
              <div className="relative min-h-[70vh] flex items-center">
                <div className="absolute inset-0 rounded-3xl overflow-hidden opacity-30">
                  <img src={heroImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent rounded-3xl" />
                <div className={cn("relative z-10 max-w-xl space-y-6 p-8 md:p-16", selectedLanguage === "fr" ? "text-left" : "text-right")}>
                  {landingPage.hero.badge && (
                    <span className={cn("inline-block px-4 py-1.5 text-sm", tmpl.badgeClass)}>
                      <EditableText value={landingPage.hero.badge} onChange={v => updateHero({ badge: v })} editMode={editMode} />
                    </span>
                  )}
                  <EditableText
                    value={landingPage.hero.headline}
                    onChange={v => updateHero({ headline: v })}
                    editMode={editMode}
                    as="h1"
                    className={cn("text-3xl md:text-5xl lg:text-6xl leading-tight text-white", tmpl.headingClass)}
                  />
                  <EditableText
                    value={landingPage.hero.subheadline}
                    onChange={v => updateHero({ subheadline: v })}
                    editMode={editMode}
                    as="p"
                    multiline
                    className="text-lg text-white/70 max-w-lg"
                  />
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold" style={{ color: primaryColor }}>{formatPrice(pricing.price, currency)}</span>
                      {pricing.originalPrice > pricing.price && (
                        <span className="text-xl text-white/40 line-through">{formatPrice(pricing.originalPrice, currency)}</span>
                      )}
                      {pricing.discountPercent > 0 && <Badge variant="destructive">-{pricing.discountPercent}%</Badge>}
                    </div>
                    <Button size="lg" className={cn("text-lg px-8 py-6", tmpl.ctaClass)}>
                      <EditableText value={landingPage.hero.ctaText} onChange={v => updateHero({ ctaText: v })} editMode={editMode} />
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              // Split layout (default)
              <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
                <div className={cn("flex-1 text-center space-y-6", selectedLanguage === "fr" ? "md:text-left" : "md:text-right")}>
                  {landingPage.hero.badge && (
                    <Badge className={cn("text-sm px-4 py-1", tmpl.badgeClass)} style={!tmpl.isDark ? { backgroundColor: `${primaryColor}20`, color: primaryColor, border: `1px solid ${primaryColor}40` } : undefined}>
                      <EditableText value={landingPage.hero.badge} onChange={v => updateHero({ badge: v })} editMode={editMode} />
                    </Badge>
                  )}
                  <EditableText
                    value={landingPage.hero.headline}
                    onChange={v => updateHero({ headline: v })}
                    editMode={editMode}
                    as="h1"
                    className={cn("text-3xl md:text-5xl lg:text-6xl leading-tight", tmpl.headingClass)}
                  />
                  <EditableText
                    value={landingPage.hero.subheadline}
                    onChange={v => updateHero({ subheadline: v })}
                    editMode={editMode}
                    as="p"
                    multiline
                    className={cn("text-lg md:text-xl max-w-lg", tmpl.isDark ? "text-white/60" : "text-muted-foreground")}
                  />
                  <div className="space-y-3">
                    <div className="flex items-baseline gap-3 justify-center md:justify-start">
                      <EditableText
                        value={String(pricing.price)}
                        onChange={v => updatePricing({ price: Number(v) || 0 })}
                        editMode={editMode}
                        as="span"
                        type="number"
                        className="text-4xl font-bold"
                        style={{ color: primaryColor }}
                      />
                      {!editMode && <span className="text-4xl font-bold" style={{ color: primaryColor }}> {currency === "DZD" ? "دج" : "€"}</span>}
                      {pricing.originalPrice > pricing.price && (
                        <EditableText
                          value={String(pricing.originalPrice)}
                          onChange={v => updatePricing({ originalPrice: Number(v) || 0 })}
                          editMode={editMode}
                          as="span"
                          type="number"
                          className={cn("text-xl line-through", tmpl.isDark ? "text-white/40" : "text-muted-foreground")}
                        />
                      )}
                      {pricing.discountPercent > 0 && <Badge variant="destructive">-{pricing.discountPercent}%</Badge>}
                    </div>
                    <Button size="lg" className={cn("text-lg px-8 py-6", tmpl.ctaClass)} style={!tmpl.ctaClass.includes("bg-") ? { background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` } : undefined}>
                      <EditableText value={landingPage.hero.ctaText} onChange={v => updateHero({ ctaText: v })} editMode={editMode} />
                    </Button>
                    {landingPage.hero.ctaSubtext && (
                      <EditableText value={landingPage.hero.ctaSubtext} onChange={v => updateHero({ ctaSubtext: v })} editMode={editMode} as="p" className={cn("text-sm", tmpl.isDark ? "text-white/50" : "text-muted-foreground")} />
                    )}
                  </div>
                </div>
                <div className="flex-1 flex justify-center">
                  <EditableImage
                    src={heroImage}
                    alt={product.name}
                    editMode={editMode}
                    onChange={url => updateImage(0, url)}
                    className={cn("relative w-full max-w-md aspect-square overflow-hidden", tmpl.heroImageClass)}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {/* TRUST BADGES */}
        <ScrollReveal>
        <section className={cn("py-6 border-y", tmpl.isDark ? "border-white/10 bg-white/[0.02]" : "border-border bg-card/50")}>
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {(landingPage.trustBadges || []).map((badge, i) => {
                const icons = [Truck, Lock, RefreshCw, Headphones];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className={cn("flex items-center gap-2 text-sm", tmpl.isDark ? "text-white/60" : "text-muted-foreground")}>
                    <Icon className="w-4 h-4" style={{ color: primaryColor }} />
                    <EditableText
                      value={badge}
                      onChange={v => updateGeneratedProject(p => ({
                        ...p, landingPage: { ...p.landingPage, trustBadges: p.landingPage.trustBadges.map((b, idx) => idx === i ? v : b) }
                      }))}
                      editMode={editMode}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* SOCIAL PROOF */}
        {landingPage.socialProof && (
          <section className={cn("py-12", tmpl.sectionAltClass)}>
            <div className="container mx-auto px-4 text-center">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <StarRating rating={Math.round(landingPage.socialProof.rating)} style={tmpl} />
                    <span className="font-bold mr-1">{landingPage.socialProof.rating}/5</span>
                  </div>
                  <p className={cn("text-sm", tmpl.isDark ? "text-white/50" : "text-muted-foreground")}>{landingPage.socialProof.reviewCount.toLocaleString("ar-DZ")} {t.reviews}</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ color: primaryColor }}>{landingPage.socialProof.satisfactionRate}%</p>
                  <p className={cn("text-sm", tmpl.isDark ? "text-white/50" : "text-muted-foreground")}>{t.satisfied}</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BENEFITS */}
        <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-12", tmpl.headingClass && !tmpl.headingClass.includes("bg-clip") ? tmpl.headingClass : "")}>
              {t.whyChoose(product.name)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(landingPage.benefits || []).map((benefit, i) => {
                const Icon = ICON_MAP[benefit.icon] || Star;
                return (
                  <ScrollReveal key={i} delay={i * 0.1}>
                  <div className={cn("text-center", tmpl.featureCardClass)}>
                    <div className="space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center" style={{ backgroundColor: tmpl.isDark ? `${primaryColor}20` : `${primaryColor}15` }}>
                        <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                      </div>
                      <EditableText value={benefit.title} onChange={v => updateBenefit(i, { title: v })} editMode={editMode} as="h3" className="font-semibold" />
                      <EditableText value={benefit.description} onChange={v => updateBenefit(i, { description: v })} editMode={editMode} as="p" className={cn("text-sm", tmpl.isDark ? "text-white/60" : "text-muted-foreground")} multiline />
                    </div>
                  </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* PRODUCT DETAILS + GALLERY */}
        <section className={cn("py-16 md:py-20", tmpl.sectionAltClass)}>
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <h2 className={cn("text-2xl md:text-3xl font-bold mb-6", tmpl.headingClass && !tmpl.headingClass.includes("bg-clip") ? tmpl.headingClass : "")}>{t.productDesc}</h2>
                <EditableText value={product.longDescription} onChange={v => updateProduct({ longDescription: v })} editMode={editMode} as="p" multiline className={cn("leading-relaxed mb-8", tmpl.isDark ? "text-white/70" : "text-muted-foreground")} />
                <h3 className="text-xl font-semibold mb-4">{t.specifications}</h3>
                <div className="space-y-3">
                  {(product.specifications || []).map((spec, i) => (
                    <div key={i} className={cn("flex justify-between py-2 border-b last:border-0", tmpl.isDark ? "border-white/10" : "border-border")}>
                      <EditableText value={spec.label} onChange={v => updateSpec(i, "label", v)} editMode={editMode} as="span" className={tmpl.isDark ? "text-white/60" : "text-muted-foreground"} />
                      <EditableText value={spec.value} onChange={v => updateSpec(i, "value", v)} editMode={editMode} as="span" className="font-medium" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 space-y-4">
                <EditableImage
                  src={detailImage}
                  alt={product.name}
                  editMode={editMode}
                  onChange={url => updateImage(1, url)}
                  className={cn("overflow-hidden", tmpl.heroImageClass)}
                  imgClassName="w-full aspect-square object-cover"
                />
                {(generatedImages.length > 0 || productImageUrl) && (
                  <div className="grid grid-cols-3 gap-3">
                    {[productImageUrl, ...generatedImages.map(img => img.url)].filter(Boolean).slice(0, 3).map((imgUrl, i) => (
                      <EditableImage
                        key={i}
                        src={imgUrl!}
                        alt={`${product.name} ${i + 1}`}
                        editMode={editMode}
                        onChange={url => updateImage(i === 0 ? -1 : i - 1, url)}
                        className={cn("overflow-hidden aspect-square", tmpl.borderRadius, tmpl.isDark ? "border border-white/10" : "border border-border")}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <ScrollReveal>
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-12", tmpl.headingClass && !tmpl.headingClass.includes("bg-clip") ? tmpl.headingClass : "")}>{t.features}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(landingPage.features || []).map((feature, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                <div className={tmpl.featureCardClass}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: tmpl.isDark ? `${primaryColor}20` : `${primaryColor}15` }}>
                      <Check className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <EditableText value={feature.title} onChange={v => updateFeature(i, { title: v })} editMode={editMode} as="h3" className="font-semibold mb-1" />
                      <EditableText value={feature.description} onChange={v => updateFeature(i, { description: v })} editMode={editMode} as="p" className={cn("text-sm", tmpl.isDark ? "text-white/60" : "text-muted-foreground")} multiline />
                    </div>
                  </div>
                </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>

        <ScrollReveal>
        <section className={cn("py-16 md:py-20", tmpl.sectionAltClass)}>
          <div className="container mx-auto px-4">
            <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-4", tmpl.headingClass && !tmpl.headingClass.includes("bg-clip") ? tmpl.headingClass : "")}>{t.testimonials}</h2>
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2">
                <StarRating rating={5} style={tmpl} />
                <span className={cn("text-sm", tmpl.isDark ? "text-white/50" : "text-muted-foreground")}>
                  {t.basedOn(landingPage.socialProof?.reviewCount?.toLocaleString("ar-DZ") || "0")}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(landingPage.testimonials || []).map((testimonial, i) => (
                <div key={i} className={tmpl.testimonialCardClass}>
                  <div className="space-y-3">
                    <StarRating rating={testimonial.rating} style={tmpl} />
                    <EditableText value={testimonial.text} onChange={v => updateTestimonial(i, { text: v })} editMode={editMode} as="p" className="text-sm" multiline />
                    <div className={cn("flex items-center justify-between pt-2 border-t", tmpl.isDark ? "border-white/10" : "border-border")}>
                      <div>
                        <EditableText value={testimonial.name} onChange={v => updateTestimonial(i, { name: v })} editMode={editMode} as="p" className="font-medium text-sm" />
                        <EditableText value={testimonial.location} onChange={v => updateTestimonial(i, { location: v })} editMode={editMode} as="p" className={cn("text-xs", tmpl.isDark ? "text-white/50" : "text-muted-foreground")} />
                      </div>
                      {testimonial.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 ml-1" /> {t.verified}
                        </Badge>
                      )}
                    </div>
                    <p className={cn("text-xs", tmpl.isDark ? "text-white/40" : "text-muted-foreground")}>{testimonial.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* PRICING CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <div className={cn("max-w-2xl mx-auto overflow-hidden text-center p-8 md:p-12 space-y-6", tmpl.cardClass)} style={!tmpl.isDark ? { borderColor: `${primaryColor}30` } : undefined}>
              {landingPage.urgency && (
                <Badge variant="destructive" className={cn("text-sm px-4 py-1", tmpl.urgencyStyle === "pulse" ? "animate-pulse" : "")}>
                  {landingPage.urgency.text}
                </Badge>
              )}
              {tmpl.urgencyStyle === "pulse" && <CountdownTimer />}
              <EditableText value={product.name} onChange={v => updateProduct({ name: v })} editMode={editMode} as="h2" className="text-3xl font-bold" />
              <EditableText value={product.shortDescription} onChange={v => updateProduct({ shortDescription: v })} editMode={editMode} as="p" className={tmpl.isDark ? "text-white/60" : "text-muted-foreground"} multiline />
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-5xl font-bold" style={{ color: primaryColor }}>{formatPrice(pricing.price, currency)}</span>
                {pricing.originalPrice > pricing.price && (
                  <span className={cn("text-2xl line-through", tmpl.isDark ? "text-white/40" : "text-muted-foreground")}>{formatPrice(pricing.originalPrice, currency)}</span>
                )}
              </div>
              <EditableText value={pricing.shippingInfo} onChange={v => updatePricing({ shippingInfo: v })} editMode={editMode} as="p" className={cn("text-sm", tmpl.isDark ? "text-white/50" : "text-muted-foreground")} />
              <Button size="lg" className={cn("text-lg px-12 py-6 w-full md:w-auto", tmpl.ctaClass)} style={!tmpl.ctaClass.includes("bg-") ? { background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` } : undefined}>
                <EditableText value={landingPage.hero.ctaText} onChange={v => updateHero({ ctaText: v })} editMode={editMode} />
              </Button>
              <p className={cn("text-sm flex items-center justify-center gap-2", tmpl.isDark ? "text-white/50" : "text-muted-foreground")}>
                <Shield className="w-4 h-4" />
                <EditableText value={pricing.guarantee} onChange={v => updatePricing({ guarantee: v })} editMode={editMode} />
              </p>
              {landingPage.urgency?.stockText && (
                <p className="text-sm font-medium" style={{ color: primaryColor }}>{landingPage.urgency.stockText}</p>
              )}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <ScrollReveal>
        <section className={cn("py-16 md:py-20", tmpl.sectionAltClass)}>
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className={cn("text-2xl md:text-3xl font-bold text-center mb-12", tmpl.headingClass && !tmpl.headingClass.includes("bg-clip") ? tmpl.headingClass : "")}>{t.faq}</h2>
            <div className="space-y-3">
              {(landingPage.faq || []).map((item, i) => (
                <div key={i} className={cn("overflow-hidden", tmpl.faqClass)}>
                  <button
                    onClick={() => !editMode && setOpenFaq(openFaq === i ? null : i)}
                    className={cn(
                      "w-full flex items-center justify-between p-5 transition-colors",
                      tmpl.isDark ? "hover:bg-white/5" : "hover:bg-card/50",
                      selectedLanguage === "fr" ? "text-left" : "text-right"
                    )}
                  >
                    <EditableText value={item.question} onChange={v => updateFaq(i, { question: v })} editMode={editMode} as="span" className="font-medium pl-4" />
                    {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </button>
                  {(openFaq === i || editMode) && (
                    <div className={cn("px-5 pb-5 text-sm animate-fade-in", tmpl.isDark ? "text-white/60" : "text-muted-foreground")}>
                      <EditableText value={item.answer} onChange={v => updateFaq(i, { answer: v })} editMode={editMode} as="div" multiline />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        </ScrollReveal>

        {/* FINAL CTA */}
        <ScrollReveal>
        <section className="py-16 md:py-24 relative overflow-hidden">
          {!tmpl.isDark && <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />}
          {tmpl.isDark && <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />}
          <div className="relative container mx-auto px-4 text-center space-y-6">
            <EditableText
              value={landingPage.finalCta?.headline || t.readyToOrder}
              onChange={v => updateFinalCta({ headline: v })}
              editMode={editMode}
              as="h2"
              className={cn("text-3xl md:text-4xl font-bold", tmpl.headingClass && !tmpl.headingClass.includes("bg-clip") ? tmpl.headingClass : "")}
            />
            <EditableText
              value={landingPage.finalCta?.subheadline || t.dontMiss}
              onChange={v => updateFinalCta({ subheadline: v })}
              editMode={editMode}
              as="p"
              className={cn("text-lg max-w-xl mx-auto", tmpl.isDark ? "text-white/60" : "text-muted-foreground")}
              multiline
            />
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" className={cn("text-lg px-12 py-6", tmpl.ctaClass)} style={!tmpl.ctaClass.includes("bg-") ? { background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` } : undefined}>
                <EditableText
                  value={landingPage.finalCta?.buttonText || landingPage.hero.ctaText}
                  onChange={v => updateFinalCta({ buttonText: v })}
                  editMode={editMode}
                />
              </Button>
              <WhatsAppButton
                productName={product.name}
                price={pricing.price}
                currency={pricing.currency}
                inline
                label={selectedLanguage === "fr" ? "Commander via WhatsApp" : "اطلب عبر WhatsApp"}
                phoneNumber={generatedProject.whatsappNumber}
              />
            </div>
            <EditableText
              value={landingPage.finalCta?.guaranteeText || pricing.guarantee}
              onChange={v => updateFinalCta({ guaranteeText: v })}
              editMode={editMode}
              as="p"
              className={cn("text-sm", tmpl.isDark ? "text-white/50" : "text-muted-foreground")}
            />
          </div>
        </section>
        </ScrollReveal>

        {/* FOOTER */}
        <footer className={cn("py-8 border-t text-center", tmpl.isDark ? "border-white/10" : "border-border")}>
          <p className={cn("text-sm", tmpl.isDark ? "text-white/40" : "text-muted-foreground")}>
            {t.allRights(product.brand || product.name)}
          </p>
        </footer>

        {/* Floating WhatsApp Button */}
        <WhatsAppButton
          productName={product.name}
          price={pricing.price}
          currency={pricing.currency}
          label={selectedLanguage === "fr" ? "Commander" : "اطلب الآن"}
          phoneNumber={generatedProject.whatsappNumber}
        />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
