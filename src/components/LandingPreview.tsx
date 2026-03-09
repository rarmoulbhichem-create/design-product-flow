import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Star, Shield, Zap, Heart, Check, ChevronDown, ChevronUp,
  Truck, Lock, RefreshCw, Headphones, ArrowLeft, Download,
  Monitor, Smartphone, Palette, Eye,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { LandingTemplate } from "@/types/project";

const ICON_MAP: Record<string, React.ElementType> = {
  Star, Shield, Zap, Heart, Check, Truck, Lock, RefreshCw, Headphones,
};

const TEMPLATES: { id: LandingTemplate; name: string; desc: string }[] = [
  { id: "elegant", name: "Élégant", desc: "Design raffiné et premium" },
  { id: "bold", name: "Audacieux", desc: "Couleurs vives, impact visuel" },
  { id: "minimal", name: "Minimal", desc: "Épuré et moderne" },
  { id: "suspended", name: "Suspendu", desc: "Effet flottant créatif" },
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

export function LandingPreview() {
  const { generatedProject, setCurrentView, setSelectedTemplate, resetApp } = useApp();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

  if (!generatedProject) return null;

  const { product, pricing, landingPage, design, productImageUrl, generatedImages = [] } = generatedProject;
  
  // Use generated images for different sections, fallback to original
  const heroImage = generatedImages[0]?.url || productImageUrl;
  const detailImage = generatedImages[1]?.url || productImageUrl;
  const galleryImage = generatedImages[2]?.url || productImageUrl;

  const primaryColor = design?.primaryColor || "#7c3aed";
  const accentColor = design?.accentColor || "#06b6d4";

  return (
    <div className="animate-fade-in">
      {/* Toolbar */}
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => { resetApp(); setCurrentView("upload"); }}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Nouveau
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
                <Palette className="w-3 h-3 mr-1" />
                {t.name}
              </Button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <Button
              variant={viewMode === "desktop" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("desktop")}
              className="rounded-none"
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "mobile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("mobile")}
              className="rounded-none"
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
          <Button className="btn-gradient gap-2" size="sm" onClick={() => setCurrentView("export")}>
            <Download className="w-4 h-4" /> Exporter
          </Button>
        </div>
      </div>

      {/* Landing Page Content */}
      <div className={cn(
        "mx-auto transition-all duration-500",
        viewMode === "mobile" ? "max-w-[390px]" : "max-w-full"
      )}>
        {/* HERO */}
        <section className="relative overflow-hidden py-16 md:py-24">
          <div className="absolute inset-0 opacity-10" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }} />
          <div className="relative container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-16">
              <div className="flex-1 text-center md:text-left space-y-6">
                {landingPage.hero.badge && (
                  <Badge className="text-sm px-4 py-1" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor, border: `1px solid ${primaryColor}40` }}>
                    {landingPage.hero.badge}
                  </Badge>
                )}
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  {landingPage.hero.headline}
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-lg">
                  {landingPage.hero.subheadline}
                </p>
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-bold" style={{ color: primaryColor }}>
                      {pricing.price}€
                    </span>
                    {pricing.originalPrice > pricing.price && (
                      <span className="text-xl text-muted-foreground line-through">
                        {pricing.originalPrice}€
                      </span>
                    )}
                    {pricing.discountPercent > 0 && (
                      <Badge variant="destructive">-{pricing.discountPercent}%</Badge>
                    )}
                  </div>
                  <Button size="lg" className="text-lg px-8 py-6" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
                    {landingPage.hero.ctaText}
                  </Button>
                  {landingPage.hero.ctaSubtext && (
                    <p className="text-sm text-muted-foreground">{landingPage.hero.ctaSubtext}</p>
                  )}
                </div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-border shadow-2xl" style={{ boxShadow: `0 25px 60px ${primaryColor}20` }}>
                  <img src={productImageUrl} alt={product.name} className="w-full h-full object-cover" />
                </div>
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
                    <span>{badge}</span>
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
                    <span className="font-bold ml-1">{landingPage.socialProof.rating}/5</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{landingPage.socialProof.reviewCount.toLocaleString()} avis</p>
                </div>
                <div>
                  <p className="text-3xl font-bold" style={{ color: primaryColor }}>{landingPage.socialProof.satisfactionRate}%</p>
                  <p className="text-sm text-muted-foreground">Clients satisfaits</p>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* BENEFITS */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
              Pourquoi choisir {product.name} ?
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
                      <h3 className="font-semibold">{benefit.title}</h3>
                      <p className="text-sm text-muted-foreground">{benefit.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* PRODUCT DETAILS */}
        <section className="py-16 md:py-20 bg-card/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-12 items-start">
              <div className="flex-1">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">Description du produit</h2>
                <p className="text-muted-foreground leading-relaxed mb-8">{product.longDescription}</p>
                <h3 className="text-xl font-semibold mb-4">Spécifications</h3>
                <div className="space-y-3">
                  {(product.specifications || []).map((spec, i) => (
                    <div key={i} className="flex justify-between py-2 border-b border-border last:border-0">
                      <span className="text-muted-foreground">{spec.label}</span>
                      <span className="font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1">
                <div className="rounded-2xl overflow-hidden border border-border">
                  <img src={productImageUrl} alt={product.name} className="w-full aspect-square object-cover" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-16 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Caractéristiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(landingPage.features || []).map((feature, i) => (
                <div key={i} className="p-5 rounded-xl border border-border hover:border-primary/30 transition-all">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: `${primaryColor}15` }}>
                      <Check className="w-4 h-4" style={{ color: primaryColor }} />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">Ce que disent nos clients</h2>
            <div className="flex justify-center mb-12">
              <div className="flex items-center gap-2">
                <StarRating rating={5} />
                <span className="text-sm text-muted-foreground">
                  Basé sur {landingPage.socialProof?.reviewCount?.toLocaleString()} avis
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {(landingPage.testimonials || []).map((t, i) => (
                <Card key={i} className="p-5">
                  <CardContent className="p-0 space-y-3">
                    <StarRating rating={t.rating} />
                    <p className="text-sm">{t.text}</p>
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                      <div>
                        <p className="font-medium text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                      </div>
                      {t.verified && (
                        <Badge variant="secondary" className="text-xs">
                          <Check className="w-3 h-3 mr-1" /> Vérifié
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
                <h2 className="text-3xl font-bold">{product.name}</h2>
                <p className="text-muted-foreground">{product.shortDescription}</p>
                <div className="flex items-baseline justify-center gap-3">
                  <span className="text-5xl font-bold" style={{ color: primaryColor }}>
                    {pricing.price}€
                  </span>
                  {pricing.originalPrice > pricing.price && (
                    <span className="text-2xl text-muted-foreground line-through">{pricing.originalPrice}€</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{pricing.shippingInfo}</p>
                <Button size="lg" className="text-lg px-12 py-6 w-full md:w-auto" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
                  {landingPage.hero.ctaText}
                </Button>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Shield className="w-4 h-4" /> {pricing.guarantee}
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
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Questions fréquentes</h2>
            <div className="space-y-3">
              {(landingPage.faq || []).map((item, i) => (
                <div key={i} className="border border-border rounded-xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-card/50 transition-colors"
                  >
                    <span className="font-medium pr-4">{item.question}</span>
                    {openFaq === i ? <ChevronUp className="w-5 h-5 shrink-0" /> : <ChevronDown className="w-5 h-5 shrink-0" />}
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-muted-foreground text-sm animate-fade-in">
                      {item.answer}
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
            <h2 className="text-3xl md:text-4xl font-bold">
              {landingPage.finalCta?.headline || "Prêt à commander ?"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              {landingPage.finalCta?.subheadline || "Ne manquez pas cette offre exceptionnelle."}
            </p>
            <Button size="lg" className="text-lg px-12 py-6" style={{ background: `linear-gradient(135deg, ${primaryColor}, ${accentColor})` }}>
              {landingPage.finalCta?.buttonText || landingPage.hero.ctaText}
            </Button>
            <p className="text-sm text-muted-foreground">
              {landingPage.finalCta?.guaranteeText || pricing.guarantee}
            </p>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 {product.brand || product.name}. Tous droits réservés.
          </p>
        </footer>
      </div>
    </div>
  );
}
