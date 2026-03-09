import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Palette, Type, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

const PRESET_COLORS = [
  "#7c3aed", // Purple
  "#2563eb", // Blue
  "#059669", // Green
  "#dc2626", // Red
  "#ea580c", // Orange
  "#ca8a04", // Yellow
  "#db2777", // Pink
  "#0891b2", // Cyan
  "#4f46e5", // Indigo
  "#000000", // Black
];

const TYPOGRAPHY_OPTIONS = [
  { heading: "Inter", body: "Inter", label: "Moderne" },
  { heading: "Playfair Display", body: "Lato", label: "Élégant" },
  { heading: "Montserrat", body: "Open Sans", label: "Corporate" },
  { heading: "Bebas Neue", body: "Roboto", label: "Bold" },
];

function generatePalette(primaryColor: string): string[] {
  // Simple palette generation based on the primary color
  // In production, this would use a more sophisticated algorithm
  const hex = primaryColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return [
    primaryColor,
    `#${Math.min(r + 40, 255).toString(16).padStart(2, "0")}${Math.min(g + 40, 255).toString(16).padStart(2, "0")}${Math.min(b + 40, 255).toString(16).padStart(2, "0")}`,
    `#${Math.max(r - 40, 0).toString(16).padStart(2, "0")}${Math.max(g - 40, 0).toString(16).padStart(2, "0")}${Math.max(b - 40, 0).toString(16).padStart(2, "0")}`,
    "#ffffff",
    "#1a1a2e",
  ];
}

export function Step4BrandIdentity() {
  const { brandIdentity, updateBrandIdentity } = useWizard();
  const [selectedTypography, setSelectedTypography] = useState(0);

  const handleColorChange = (color: string) => {
    const palette = generatePalette(color);
    updateBrandIdentity({ primaryColor: color, palette });
  };

  const handleTypographyChange = (index: number) => {
    setSelectedTypography(index);
    updateBrandIdentity({
      typography: {
        heading: TYPOGRAPHY_OPTIONS[index].heading,
        body: TYPOGRAPHY_OPTIONS[index].body,
      },
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Identité de marque</h2>
        <p className="text-muted-foreground mt-1">
          Personnalisez les couleurs et typographies de votre landing page
        </p>
      </div>

      {/* Logo Upload */}
      <div className="space-y-4">
        <Label className="text-base flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Logo (optionnel)
        </Label>
        <Card className="border-dashed">
          <CardContent className="p-6">
            <div className="flex items-center gap-6">
              {brandIdentity.logo ? (
                <div className="w-20 h-20 rounded-lg bg-secondary flex items-center justify-center overflow-hidden">
                  <img
                    src={brandIdentity.logo}
                    alt="Logo"
                    className="w-full h-full object-contain"
                  />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <input
                  type="file"
                  id="logo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      updateBrandIdentity({ logo: url });
                    }
                  }}
                />
                <label htmlFor="logo-upload">
                  <Button variant="outline" asChild>
                    <span className="cursor-pointer">
                      {brandIdentity.logo ? "Changer le logo" : "Uploader un logo"}
                    </span>
                  </Button>
                </label>
                <p className="text-xs text-muted-foreground mt-2">
                  PNG ou SVG transparent recommandé
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Color Selection */}
      <div className="space-y-4">
        <Label className="text-base flex items-center gap-2">
          <Palette className="w-4 h-4" />
          Couleur principale *
        </Label>
        <div className="flex flex-wrap gap-3">
          {PRESET_COLORS.map((color) => (
            <button
              key={color}
              className={cn(
                "w-10 h-10 rounded-full transition-transform hover:scale-110",
                brandIdentity.primaryColor === color && "ring-2 ring-offset-2 ring-offset-background ring-primary"
              )}
              style={{ backgroundColor: color }}
              onClick={() => handleColorChange(color)}
            />
          ))}
          <div className="relative">
            <Input
              type="color"
              value={brandIdentity.primaryColor || "#7c3aed"}
              onChange={(e) => handleColorChange(e.target.value)}
              className="w-10 h-10 p-0 rounded-full cursor-pointer overflow-hidden border-2"
            />
          </div>
        </div>

        {/* Generated Palette Preview */}
        {brandIdentity.palette && brandIdentity.palette.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm text-muted-foreground">Palette générée</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2"
                onClick={() => handleColorChange(brandIdentity.primaryColor || "#7c3aed")}
              >
                <RefreshCw className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex gap-2">
              {brandIdentity.palette.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-12 rounded-lg first:rounded-l-xl last:rounded-r-xl"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Typography Selection */}
      <div className="space-y-4">
        <Label className="text-base flex items-center gap-2">
          <Type className="w-4 h-4" />
          Typographies
        </Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {TYPOGRAPHY_OPTIONS.map((option, index) => (
            <Card
              key={index}
              className={cn(
                "cursor-pointer transition-all duration-300 hover:border-primary/50",
                selectedTypography === index && "border-primary bg-primary/5"
              )}
              onClick={() => handleTypographyChange(index)}
            >
              <CardContent className="p-4">
                <p className="text-xs text-muted-foreground mb-2">{option.label}</p>
                <p
                  className="text-xl font-bold mb-1"
                  style={{ fontFamily: option.heading }}
                >
                  Titre Principal
                </p>
                <p
                  className="text-sm text-muted-foreground"
                  style={{ fontFamily: option.body }}
                >
                  Texte de paragraphe avec la police {option.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Brand Guide Preview */}
      <Card className="overflow-hidden">
        <div
          className="h-3"
          style={{
            background: `linear-gradient(90deg, ${brandIdentity.palette?.join(", ") || brandIdentity.primaryColor})`,
          }}
        />
        <CardContent className="p-6">
          <h4 className="font-medium mb-4">Aperçu du brand guide</h4>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs text-muted-foreground mb-2">Couleur principale</p>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded"
                  style={{ backgroundColor: brandIdentity.primaryColor }}
                />
                <code className="text-sm">{brandIdentity.primaryColor}</code>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Typographies</p>
              <p className="text-sm">
                Titres: <span className="font-medium">{brandIdentity.typography?.heading || "Inter"}</span>
              </p>
              <p className="text-sm">
                Corps: <span className="font-medium">{brandIdentity.typography?.body || "Inter"}</span>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
