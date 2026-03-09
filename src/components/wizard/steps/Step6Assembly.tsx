import { useWizard } from "@/contexts/WizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Image,
  Award,
  Images,
  MessageSquareQuote,
  Tag,
  HelpCircle,
  MousePointerClick,
  Layout,
  Sparkles,
  Loader2,
  GripVertical,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { LandingSection } from "@/types/project";

const SECTIONS_CONFIG: {
  id: LandingSection;
  label: string;
  description: string;
  icon: typeof Image;
  required?: boolean;
}[] = [
  { id: "hero", label: "Hero", description: "Image principale + titre + CTA", icon: Image, required: true },
  { id: "benefits", label: "Bénéfices", description: "3-6 avantages produit", icon: Award },
  { id: "gallery", label: "Galerie", description: "Photos produit", icon: Images },
  { id: "testimonials", label: "Témoignages", description: "Avis clients", icon: MessageSquareQuote },
  { id: "pricing", label: "Prix", description: "Offre et tarif", icon: Tag },
  { id: "faq", label: "FAQ", description: "Questions fréquentes", icon: HelpCircle },
  { id: "cta", label: "CTA Final", description: "Appel à l'action", icon: MousePointerClick },
  { id: "footer", label: "Footer", description: "Liens et contact", icon: Layout },
];

export function Step6Assembly() {
  const { sections, updateSections, content, updateContent, brandIdentity, isGenerating, setIsGenerating } = useWizard();

  const toggleSection = (sectionId: LandingSection) => {
    const config = SECTIONS_CONFIG.find((s) => s.id === sectionId);
    if (config?.required) return;

    if (sections.includes(sectionId)) {
      updateSections(sections.filter((s) => s !== sectionId));
    } else {
      updateSections([...sections, sectionId]);
    }
  };

  const generateCopywriting = async () => {
    setIsGenerating(true);
    
    // Simulate AI copywriting generation
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    updateContent({
      hero: {
        title: "Découvrez l'Excellence",
        subtitle: "Un produit révolutionnaire qui transforme votre quotidien",
        ctaText: "Commander maintenant",
        image: "",
      },
      benefits: {
        title: "Pourquoi choisir notre produit ?",
        items: [
          { icon: "⚡", title: "Rapide", description: "Performance optimale en toutes circonstances" },
          { icon: "🛡️", title: "Fiable", description: "Conçu pour durer avec des matériaux premium" },
          { icon: "🎯", title: "Précis", description: "Une attention aux détails incomparable" },
        ],
      },
      testimonials: {
        items: [
          { name: "Marie D.", role: "Cliente vérifiée", content: "Absolument incroyable ! Je recommande à 100%." },
          { name: "Jean P.", role: "Acheteur régulier", content: "La qualité est au rendez-vous, livraison rapide." },
        ],
      },
      pricing: {
        title: "Offre Spéciale",
        price: "99€",
        originalPrice: "149€",
        features: ["Livraison gratuite", "Garantie 2 ans", "Support prioritaire"],
        ctaText: "Profiter de l'offre",
      },
      faq: {
        items: [
          { question: "Quelle est la politique de retour ?", answer: "Retour gratuit sous 30 jours." },
          { question: "Livrez-vous à l'international ?", answer: "Oui, nous livrons dans le monde entier." },
        ],
      },
      cta: {
        title: "Prêt à commencer ?",
        subtitle: "Rejoignez des milliers de clients satisfaits",
        buttonText: "Je commande",
      },
      footer: {
        companyName: "Votre Marque",
        links: [
          { label: "Mentions légales", url: "#" },
          { label: "Contact", url: "#" },
        ],
      },
    });
    
    setIsGenerating(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Assemblage de la landing page</h2>
        <p className="text-muted-foreground mt-1">
          Sélectionnez les sections et personnalisez le contenu
        </p>
      </div>

      <Tabs defaultValue="sections" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sections">Sections</TabsTrigger>
          <TabsTrigger value="content">Contenu</TabsTrigger>
        </TabsList>

        <TabsContent value="sections" className="space-y-4 mt-4">
          {/* Section Selection */}
          <div className="grid gap-3">
            {SECTIONS_CONFIG.map((section) => {
              const Icon = section.icon;
              const isEnabled = sections.includes(section.id);
              return (
                <Card
                  key={section.id}
                  className={cn(
                    "transition-all",
                    isEnabled ? "border-primary/50" : "opacity-60"
                  )}
                >
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-4">
                      <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                      <div className={cn(
                        "p-2 rounded-lg",
                        isEnabled ? "bg-primary/10" : "bg-muted"
                      )}>
                        <Icon className={cn("w-5 h-5", isEnabled && "text-primary")} />
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {section.label}
                          {section.required && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
                              Requis
                            </span>
                          )}
                        </p>
                        <p className="text-sm text-muted-foreground">{section.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={isEnabled}
                      onCheckedChange={() => toggleSection(section.id)}
                      disabled={section.required}
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Generate Copywriting */}
          <Card className="bg-secondary/50">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-10 h-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Générer le contenu automatiquement</h3>
              <p className="text-sm text-muted-foreground mb-4">
                L'IA créera des textes optimisés pour la conversion
              </p>
              <Button
                onClick={generateCopywriting}
                disabled={isGenerating}
                className="btn-gradient gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Génération...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Générer le copywriting
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6 mt-4">
          {/* Hero Content */}
          {sections.includes("hero") && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Section Hero
                </h3>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="hero-title">Titre principal</Label>
                    <Input
                      id="hero-title"
                      value={content.hero?.title || ""}
                      onChange={(e) =>
                        updateContent({
                          hero: { ...content.hero!, title: e.target.value },
                        })
                      }
                      placeholder="Votre titre accrocheur"
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-subtitle">Sous-titre</Label>
                    <Textarea
                      id="hero-subtitle"
                      value={content.hero?.subtitle || ""}
                      onChange={(e) =>
                        updateContent({
                          hero: { ...content.hero!, subtitle: e.target.value },
                        })
                      }
                      placeholder="Description courte"
                      className="bg-secondary resize-none"
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label htmlFor="hero-cta">Texte du bouton</Label>
                    <Input
                      id="hero-cta"
                      value={content.hero?.ctaText || ""}
                      onChange={(e) =>
                        updateContent({
                          hero: { ...content.hero!, ctaText: e.target.value },
                        })
                      }
                      placeholder="Commander maintenant"
                      className="bg-secondary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pricing Content */}
          {sections.includes("pricing") && (
            <Card>
              <CardContent className="p-6 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  Section Prix
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Prix actuel</Label>
                    <Input
                      id="price"
                      value={content.pricing?.price || ""}
                      onChange={(e) =>
                        updateContent({
                          pricing: { ...content.pricing!, price: e.target.value },
                        })
                      }
                      placeholder="99€"
                      className="bg-secondary"
                    />
                  </div>
                  <div>
                    <Label htmlFor="original-price">Prix barré (optionnel)</Label>
                    <Input
                      id="original-price"
                      value={content.pricing?.originalPrice || ""}
                      onChange={(e) =>
                        updateContent({
                          pricing: { ...content.pricing!, originalPrice: e.target.value },
                        })
                      }
                      placeholder="149€"
                      className="bg-secondary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Preview Card */}
          <Card className="overflow-hidden">
            <div
              className="h-2"
              style={{ backgroundColor: brandIdentity.primaryColor }}
            />
            <CardContent className="p-6">
              <h4 className="font-medium mb-2">Aperçu rapide</h4>
              <div className="bg-secondary rounded-lg p-4 space-y-2">
                <p className="text-lg font-bold">{content.hero?.title || "Titre à définir"}</p>
                <p className="text-sm text-muted-foreground">
                  {content.hero?.subtitle || "Sous-titre à définir"}
                </p>
                <Button size="sm" className="btn-gradient">
                  {content.hero?.ctaText || "CTA"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
