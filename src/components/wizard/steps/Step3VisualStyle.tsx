import { useWizard } from "@/contexts/WizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { VisualStyle, AspectRatio } from "@/types/project";
import { Camera, Crown, Minus, TreePine, Sun, Sparkles, Lightbulb, Zap } from "lucide-react";

const VISUAL_STYLES: {
  value: VisualStyle;
  label: string;
  description: string;
  icon: typeof Camera;
  preview: string;
}[] = [
  {
    value: "studio",
    label: "Studio",
    description: "Clean, professionnel, fond uni",
    icon: Camera,
    preview: "bg-gradient-to-br from-slate-100 to-slate-200",
  },
  {
    value: "luxe",
    label: "Luxe",
    description: "Élégant, premium, dorures",
    icon: Crown,
    preview: "bg-gradient-to-br from-amber-900/80 to-amber-700/60",
  },
  {
    value: "minimalist",
    label: "Minimaliste",
    description: "Épuré, espace blanc, simple",
    icon: Minus,
    preview: "bg-gradient-to-br from-white to-gray-50",
  },
  {
    value: "lifestyle",
    label: "Lifestyle",
    description: "Contexte de vie, ambiance",
    icon: TreePine,
    preview: "bg-gradient-to-br from-emerald-100 to-sky-100",
  },
];

const LIGHTING_OPTIONS = [
  { value: "natural", label: "Naturelle", icon: Sun, description: "Douce et réaliste" },
  { value: "studio", label: "Studio", icon: Lightbulb, description: "Contrôlée et uniforme" },
  { value: "dramatic", label: "Dramatique", icon: Zap, description: "Contrastes forts" },
  { value: "soft", label: "Douce", icon: Sparkles, description: "Ambiance tamisée" },
];

const ASPECT_RATIOS: { value: AspectRatio; label: string; visual: string }[] = [
  { value: "1:1", label: "Carré", visual: "aspect-square w-8" },
  { value: "16:9", label: "Paysage", visual: "aspect-video w-12" },
  { value: "9:16", label: "Portrait", visual: "aspect-[9/16] w-6" },
];

export function Step3VisualStyle() {
  const { visualStyle, updateVisualStyle } = useWizard();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Style visuel</h2>
        <p className="text-muted-foreground mt-1">
          Choisissez l'ambiance de vos visuels générés
        </p>
      </div>

      {/* Visual Style Selection */}
      <div className="space-y-4">
        <Label className="text-base">Style de mise en scène *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {VISUAL_STYLES.map((style) => {
            const Icon = style.icon;
            const isSelected = visualStyle.style === style.value;
            return (
              <Card
                key={style.value}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:border-primary/50 overflow-hidden",
                  isSelected && "gradient-border glow"
                )}
                onClick={() => updateVisualStyle({ style: style.value })}
              >
                {/* Preview area */}
                <div className={cn("h-24 relative", style.preview)}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-lg shadow-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-gray-700" />
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full">
                      Sélectionné
                    </div>
                  )}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium">{style.label}</h3>
                  <p className="text-sm text-muted-foreground">{style.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Lighting Selection */}
      <div className="space-y-4">
        <Label className="text-base">Éclairage</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {LIGHTING_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isSelected = visualStyle.lighting === option.value;
            return (
              <Card
                key={option.value}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:border-primary/50",
                  isSelected && "border-primary bg-primary/5"
                )}
                onClick={() =>
                  updateVisualStyle({ lighting: option.value as typeof visualStyle.lighting })
                }
              >
                <CardContent className="p-4 text-center">
                  <Icon
                    className={cn(
                      "w-6 h-6 mx-auto mb-2",
                      isSelected ? "text-primary" : "text-muted-foreground"
                    )}
                  />
                  <p className="font-medium text-sm">{option.label}</p>
                  <p className="text-xs text-muted-foreground">{option.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Aspect Ratio */}
      <div className="space-y-4">
        <Label className="text-base">Format d'image</Label>
        <RadioGroup
          value={visualStyle.aspectRatio}
          onValueChange={(value: AspectRatio) => updateVisualStyle({ aspectRatio: value })}
          className="flex gap-4"
        >
          {ASPECT_RATIOS.map((ratio) => (
            <div key={ratio.value} className="flex items-center space-x-2">
              <RadioGroupItem value={ratio.value} id={ratio.value} />
              <Label
                htmlFor={ratio.value}
                className="flex items-center gap-3 cursor-pointer"
              >
                <div
                  className={cn(
                    "border-2 rounded bg-muted",
                    ratio.visual,
                    visualStyle.aspectRatio === ratio.value
                      ? "border-primary"
                      : "border-border"
                  )}
                />
                <span>{ratio.label}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Quality Selection */}
      <div className="space-y-4">
        <Label className="text-base">Qualité</Label>
        <RadioGroup
          value={visualStyle.quality}
          onValueChange={(value: "hd" | "4k") => updateVisualStyle({ quality: value })}
          className="flex gap-6"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="hd" id="hd" />
            <Label htmlFor="hd" className="cursor-pointer">
              <span className="font-medium">HD</span>
              <span className="text-sm text-muted-foreground ml-2">(1920px)</span>
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4k" id="4k" />
            <Label htmlFor="4k" className="cursor-pointer flex items-center gap-2">
              <span className="font-medium">4K</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Pro</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Preview hint */}
      <Card className="bg-secondary/50">
        <CardContent className="p-4 flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-primary mt-0.5" />
          <div>
            <h4 className="font-medium">Aperçu des styles</h4>
            <p className="text-sm text-muted-foreground">
              À l'étape suivante, l'IA appliquera ce style à votre image principale pour vous montrer un aperçu avant la génération complète.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
