import { useWizard } from "@/contexts/WizardContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, Laptop, Briefcase, ShoppingCart, Users, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { ProductType, Sector, Objective } from "@/types/project";

const PRODUCT_TYPES: { value: ProductType; label: string; icon: typeof Package }[] = [
  { value: "physical", label: "Produit physique", icon: Package },
  { value: "digital", label: "Produit digital", icon: Laptop },
  { value: "service", label: "Service", icon: Briefcase },
];

const SECTORS: { value: Sector; label: string }[] = [
  { value: "fashion", label: "Mode & Accessoires" },
  { value: "tech", label: "Tech & Électronique" },
  { value: "beauty", label: "Beauté & Cosmétiques" },
  { value: "food", label: "Food & Boissons" },
  { value: "home", label: "Maison & Déco" },
  { value: "sports", label: "Sports & Loisirs" },
  { value: "education", label: "Éducation & Formation" },
  { value: "health", label: "Santé & Bien-être" },
  { value: "other", label: "Autre" },
];

const OBJECTIVES: { value: Objective; label: string; description: string }[] = [
  { value: "direct_sale", label: "Vente directe", description: "Vendre le produit immédiatement" },
  { value: "leads", label: "Génération de leads", description: "Collecter des contacts" },
  { value: "preorder", label: "Précommande", description: "Lancer un nouveau produit" },
  { value: "awareness", label: "Notoriété", description: "Faire connaître la marque" },
];

export function Step1ProjectInfo() {
  const { projectInfo, updateProjectInfo } = useWizard();

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Informations du projet</h2>
        <p className="text-muted-foreground mt-1">
          Décrivez votre produit pour personnaliser votre landing page
        </p>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="project-name">Nom du projet *</Label>
        <Input
          id="project-name"
          placeholder="Ex: Lancement Sneakers 2024"
          value={projectInfo.name || ""}
          onChange={(e) => updateProjectInfo({ name: e.target.value })}
          className="bg-secondary border-border"
        />
      </div>

      {/* Product Type */}
      <div className="space-y-3">
        <Label>Type de produit *</Label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PRODUCT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = projectInfo.productType === type.value;
            return (
              <Card
                key={type.value}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:border-primary/50",
                  isSelected && "gradient-border glow"
                )}
                onClick={() => updateProjectInfo({ productType: type.value })}
              >
                <CardContent className="flex items-center gap-3 p-4">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary/20" : "bg-muted"
                    )}
                  >
                    <Icon className={cn("w-5 h-5", isSelected && "text-primary")} />
                  </div>
                  <span className="font-medium">{type.label}</span>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Sector */}
      <div className="space-y-2">
        <Label>Secteur d'activité *</Label>
        <Select
          value={projectInfo.sector}
          onValueChange={(value: Sector) => updateProjectInfo({ sector: value })}
        >
          <SelectTrigger className="bg-secondary border-border">
            <SelectValue placeholder="Sélectionnez un secteur" />
          </SelectTrigger>
          <SelectContent>
            {SECTORS.map((sector) => (
              <SelectItem key={sector.value} value={sector.value}>
                {sector.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Target Audience */}
      <div className="space-y-2">
        <Label htmlFor="target-audience" className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Public cible
        </Label>
        <Textarea
          id="target-audience"
          placeholder="Ex: Femmes 25-35 ans, passionnées de mode, urbaines..."
          value={projectInfo.targetAudience || ""}
          onChange={(e) => updateProjectInfo({ targetAudience: e.target.value })}
          className="bg-secondary border-border resize-none"
          rows={2}
        />
      </div>

      {/* Objective */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2">
          <Target className="w-4 h-4" />
          Objectif de la landing page
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {OBJECTIVES.map((obj) => {
            const isSelected = projectInfo.objective === obj.value;
            return (
              <Card
                key={obj.value}
                className={cn(
                  "cursor-pointer transition-all duration-300 hover:border-primary/50",
                  isSelected && "gradient-border"
                )}
                onClick={() => updateProjectInfo({ objective: obj.value })}
              >
                <CardContent className="p-4">
                  <p className="font-medium">{obj.label}</p>
                  <p className="text-sm text-muted-foreground">{obj.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Product URL (optional) */}
      <div className="space-y-2">
        <Label htmlFor="product-url" className="flex items-center gap-2">
          <ShoppingCart className="w-4 h-4" />
          URL du produit existant (optionnel)
        </Label>
        <Input
          id="product-url"
          type="url"
          placeholder="https://..."
          value={projectInfo.productUrl || ""}
          onChange={(e) => updateProjectInfo({ productUrl: e.target.value })}
          className="bg-secondary border-border"
        />
        <p className="text-xs text-muted-foreground">
          Si vous avez déjà une page produit, nous pouvons en extraire des informations
        </p>
      </div>
    </div>
  );
}
