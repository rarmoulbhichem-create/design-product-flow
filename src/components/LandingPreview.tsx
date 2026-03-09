import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, Shield, Zap, Heart, Check, ChevronDown, ChevronUp,
  Truck, Lock, RefreshCw, Headphones, ArrowLeft, Download,
  Monitor, Smartphone, Palette, Pencil, Eye,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LandingTemplate } from "@/types/project";
import { EditableText } from "./EditableText";
import { EditableImage } from "./EditableImage";

const ICON_MAP: Record<string, React.ElementType> = {
  Star, Shield, Zap, Heart, Check, Truck, Lock, RefreshCw, Headphones,
};

const TEMPLATES: { id: LandingTemplate; name: string; desc: string }[] = [
  { id: "elegant", name: "أنيق", desc: "تصميم راقي وفاخر" },
  { id: "bold", name: "جريء", desc: "ألوان قوية وتأثير بصري" },
  { id: "minimal", name: "بسيط", desc: "نظيف وعصري" },
  { id: "suspended", name: "معلّق", desc: "تأثير عائم إبداعي" },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          className={cn("w-4 h-4", i <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground/30")}
        />
      ))}
    </div>
  );
}

function formatPrice(price: number, currency: string) {
  if (currency === "DZD") return `${price.toLocaleString("ar-DZ")} دج`;
  return `${price}€`;
}

export function LandingPreview() {
  const { generatedProject, setCurrentView, setSelectedTemplate, resetApp, updateGeneratedProject, selectedLanguage } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [editMode, setEditMode] = useState(false);

  if (!generatedProject) return null;

  const { product, pricing, landingPage, design, productImageUrl, generatedImages = [] } = generatedProject;

  const heroImage = generatedImages[0]?.url || productImageUrl;
  const detailImage = generatedImages[1]?.url || productImageUrl;
  const currency = pricing?.currency || "DZD";

  const primaryColor = design?.primaryColor || "#7c3aed";
  const accentColor = design?.accentColor || "#06b6d4";

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
            <ArrowLeft className="w-4 h-4 ml-1" /> جديد
          </Button>
          <div className="h-6 w-px bg-border" />
          <div className="flex gap-1">
            {TEMPLATES.map(t => (
              <Button
                key={t.id}
                variant={generatedProject.template === t.id ? "default" : "ghost"}
                size="sm"
                onClick={() => setSelectedTemplate(t.id)}
                className="text-xs"
              >
                <Palette className="w-3 h-3 ml-1" />
                {t.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Edit mode toggle */}
          <Button
            variant={editMode ? "default" : "outline"}
            size="sm"
            onClick={() => setEditMode(!editMode)}
            className="gap-1.5"
          >
            {editMode ? <Eye className="w-4 h-4" /> : <Pencil className="w-4 h-4" />}
            {editMode ? "معاينة" : "تحرير"}
          </Button>
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button variant={viewMode === "desktop" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("desktop")} className="rounded-none">
              <Monitor className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "mobile" ? "secondary" : "ghost"} size="sm" onClick={() => setViewMode("mobile")} className="rounded-none">
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button className="btn-gradient gap-2" size="sm" onClick={() => setCurrentView("export")}>
            <Download className="w-4 h-4" /> تصدير
          </Button>
        </div>
      </div>

      {/* Edit mode banner */}
      {editMode && (
        <div className="bg-primary/10 border-b border-primary/20 px-4 py-2 text-center text-sm text-primary font-medium">
          <Pencil className="w-3.5 h-3.5 inline ml-1" />
          وضع التحرير — انقر على أي نص أو صورة لتعديله
        </div>
      )}

      {/* Landing Page Content - RTL Arabic */}
      <div className={cn(
        "mx-auto transition-all duration-500",
        viewMode === "mobile" ? "max-w-[390px]" : "max-w-full"
      )} dir="rtl">

        {/* HERO */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />
          <div className="relative container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-right space-y-6">
                {landingPage.hero.badge && (
                  <Badge className="text-sm px-4 py-1" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor, border: `1px solid ${primaryColor}40` }}>
                    <EditableText value={landingPage.hero.badge} onChange={v => updateHero({ badge: v })} editMode={editMode} />
                  </Badge>
                )}
                <EditableText
                  value={landingPage.hero.headline}
                  onChange={v => updateHero({ headline: v })}
                  editMode={editMode}
                  as="h1"
                  className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight"
                />
                <EditableText
                  value={landingPage.hero.subheadline}
                  onChange={v => updateHero({ subheadline: v })}
                  editMode={editMode}
                  as="p"
                  multiline
                  className="text-lg md:text-xl text-muted-foreground max-w-lg"
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
                        className="text-xl text-muted-foreground line-through"
                      />
                    )}
                    {pricing.discountPercent > 0 && (
                      <Badge variant="destructive">-{pricing.discountPercent}%</Badge>
                    )}
                  </div>
                  <Button size="lg" className="text-lg px-8 py-6" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
                    <EditableText value={landingPage.hero.ctaText} onChange={v => updateHero({ ctaText: v })} editMode={editMode} />
                  </Button>
                  {landingPage.hero.ctaSubtext && (
                    <EditableText value={landingPage.hero.ctaSubtext} onChange={v => updateHero({ ctaSubtext: v })} editMode={editMode} as="p" className="text-sm text-muted-foreground" />
                  )}
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <EditableImage
                  src={heroImage}
                  alt={product.name}
                  editMode={editMode}
                  onChange={url => updateImage(0, url)}
                  className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-border shadow-2xl"
                  style={{ boxShadow: `0 25px 60px ${primaryColor}20` }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BADGES */}
        <section className="py-6 border-y border-border bg-card/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-6 md:gap-12">
              {(landingPage.trustBadges || []).map((badge, i) => {
                const icons = [Truck, Lock, RefreshCw, Headphones];
                const Icon = icons[i % icons.length];
                return (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
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

        {/* SOCIAL PROOF */}
        {landingPage.socialProof && (
          <section className="py-12 bg-card/30">
            <div className="container mx-auto px-4 text-center">
              <div className="flex flex-wrap justify-center gap-8 md:gap-16">
                <div>
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <StarRating rating={Math.round(landingPage.socialProof.rating)} />
                    <span className="font-bold mr-1">{landingPage.socialProof.rating}/5</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{landingPage.socialProof.reviewCount.toLocaleString("ar-DZ")} تقييم</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ color: primaryColor }}>{landingPage.socialProof.satisfactionRate}%</p>
                  <p className="text-sm text-muted-foreground">عملاء راضون</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BENEFITS */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              لماذا تختار {product.name}؟
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(landingPage.benefits || []).map((benefit, i) => {
                const Icon = ICON_MAP[benefit.icon] || Star;
                return (
                  <Card key={i} className="text-center p-6 hover:border-primary/50 transition-all hover:-translate-y-1">
                    <CardContent className="p-0 space-y-3">
                      <div className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center" style={{ backgroundColor: `${primaryColor}15` }}>
                        <Icon className="w-6 h-6" style={{ color: primaryColor }} />
                      </div>
                      <EditableText value={benefit.title} onChange={v => updateBenefit(i, { title: v })} editMode={editMode} as="h3" className="font-semibold" />
                      <EditableText value={benefit.description} onChange={v => updateBenefit(i, { description: v })} editMode={editMode} as="p" className="text-sm text-muted-foreground" multiline />
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRODUCT DETAILS + GALLERY */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">وصف المنتج</h2>
                <EditableText value={product.longDescription} onChange={v => updateProduct({ longDescription: v })} editMode={editMode} as="p" multiline className="text-muted-foreground leading-relaxed mb-8" />
                <h3 className="text-xl font-semibold mb-4">المواصفات</h3>
                <div className="space-y-3">
                  {(product.specifications || []).map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
                      <EditableText value={spec.label} onChange={v => updateSpec(i, "label", v)} editMode={editMode} as="span" className="text-muted-foreground" />
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
                  className="rounded-2xl overflow-hidden border border-border"
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
                        className="rounded-xl overflow-hidden border border-border aspect-square"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">المميزات</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(landingPage.features || []).map((feature, i) => (
                <div key={i} className="p-5 rounded-xl border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Check className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <EditableText value={feature.title} onChange={v => updateFeature(i, { title: v })} editMode={editMode} as="h3" className="font-semibold mb-1" />
                      <EditableText value={feature.description} onChange={v => updateFeature(i, { description: v })} editMode={editMode} as="p" className="text-sm text-muted-foreground" multiline />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">ماذا يقول عملاؤنا</h2>
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2">
                <StarRating rating={5} />
                <span className="text-sm text-muted-foreground">
                  بناءً على {landingPage.socialProof?.reviewCount?.toLocaleString("ar-DZ")} تقييم
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(landingPage.testimonials || []).map((t, i) => (
                <Card key={i} className="p-5">
                  <CardContent className="p-0 space-y-3">
                    <StarRating rating={t.rating} />
                    <EditableText value={t.text} onChange={v => updateTestimonial(i, { text: v })} editMode={editMode} as="p" className="text-sm" multiline />
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div>
                        <EditableText value={t.name} onChange={v => updateTestimonial(i, { name: v })} editMode={editMode} as="p" className="font-medium text-sm" />
                        <EditableText value={t.location} onChange={v => updateTestimonial(i, { location: v })} editMode={editMode} as="p" className="text-xs text-muted-foreground" />
                      </div>
                      {t.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 ml-1" /> موثّق
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{t.date}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING CTA */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <Card className="max-w-2xl mx-auto overflow-hidden" style={{ borderColor: `${primaryColor}30` }}>
              <CardContent className="p-8 md:p-12 text-center space-y-6">
                {landingPage.urgency && (
                  <Badge variant="destructive" className="text-sm px-4 py-1">
                    {landingPage.urgency.text}
                  </Badge>
                )}
                <EditableText value={product.name} onChange={v => updateProduct({ name: v })} editMode={editMode} as="h2" className="text-3xl font-bold" />
                <EditableText value={product.shortDescription} onChange={v => updateProduct({ shortDescription: v })} editMode={editMode} as="p" className="text-muted-foreground" multiline />
                <div className="flex items-baseline justify-center gap-3">
                  <EditableText
                    value={String(pricing.price)}
                    onChange={v => updatePricing({ price: Number(v) || 0 })}
                    editMode={editMode}
                    as="span"
                    type="number"
                    className="text-5xl font-bold"
                    style={{ color: primaryColor }}
                  />
                  {!editMode && <span className="text-5xl font-bold" style={{ color: primaryColor }}> {currency === "DZD" ? "دج" : "€"}</span>}
                  {pricing.originalPrice > pricing.price && (
                    <span className="text-2xl text-muted-foreground line-through">{formatPrice(pricing.originalPrice, currency)}</span>
                  )}
                </div>
                <EditableText value={pricing.shippingInfo} onChange={v => updatePricing({ shippingInfo: v })} editMode={editMode} as="p" className="text-sm text-muted-foreground" />
                <Button size="lg" className="text-lg px-12 py-6 w-full md:w-auto" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
                  <EditableText value={landingPage.hero.ctaText} onChange={v => updateHero({ ctaText: v })} editMode={editMode} />
                </Button>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" />
                  <EditableText value={pricing.guarantee} onChange={v => updatePricing({ guarantee: v })} editMode={editMode} />
                </p>
                {landingPage.urgency?.stockText && (
                  <p className="text-sm font-medium" style={{ color: primaryColor }}>{landingPage.urgency.stockText}</p>
                )}
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">الأسئلة الشائعة</h2>
            <div className="space-y-3">
              {(landingPage.faq || []).map((item, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => !editMode && setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-right hover:bg-card/50 transition-colors"
                  >
                    <EditableText value={item.question} onChange={v => updateFaq(i, { question: v })} editMode={editMode} as="span" className="font-medium pl-4" />
                    {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </button>
                  {(openFaq === i || editMode) && (
                    <div className="px-5 pb-5 text-muted-foreground text-sm animate-fade-in">
                      <EditableText value={item.answer} onChange={v => updateFaq(i, { answer: v })} editMode={editMode} as="div" multiline />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />
          <div className="relative container mx-auto px-4 text-center space-y-6">
            <EditableText
              value={landingPage.finalCta?.headline || "هل أنت مستعد للطلب؟"}
              onChange={v => updateFinalCta({ headline: v })}
              editMode={editMode}
              as="h2"
              className="text-3xl md:text-4xl font-bold"
            />
            <EditableText
              value={landingPage.finalCta?.subheadline || "لا تفوّت هذا العرض الاستثنائي."}
              onChange={v => updateFinalCta({ subheadline: v })}
              editMode={editMode}
              as="p"
              className="text-lg text-muted-foreground max-w-xl mx-auto"
              multiline
            />
            <Button size="lg" className="text-lg px-12 py-6" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
              <EditableText
                value={landingPage.finalCta?.buttonText || landingPage.hero.ctaText}
                onChange={v => updateFinalCta({ buttonText: v })}
                editMode={editMode}
              />
            </Button>
            <EditableText
              value={landingPage.finalCta?.guaranteeText || pricing.guarantee}
              onChange={v => updateFinalCta({ guaranteeText: v })}
              editMode={editMode}
              as="p"
              className="text-sm text-muted-foreground"
            />
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 {product.brand || product.name}. جميع الحقوق محفوظة.
          </p>
        </footer>
      </div>
    </div>
  );
}
