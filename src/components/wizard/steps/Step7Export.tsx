import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Monitor,
  Tablet,
  Smartphone,
  Download,
  FileCode,
  Package,
  Gauge,
  Search,
  CheckCircle2,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DeviceView = "desktop" | "tablet" | "mobile";

const DEVICE_WIDTHS: Record<DeviceView, string> = {
  desktop: "w-full",
  tablet: "max-w-[768px]",
  mobile: "max-w-[375px]",
};

export function Step7Export() {
  const { content, brandIdentity, sections, images } = useWizard();
  const [activeDevice, setActiveDevice] = useState<DeviceView>("desktop");
  const [isExporting, setIsExporting] = useState(false);
  const [exportType, setExportType] = useState<"zip" | "wordpress" | null>(null);

  const handleExport = async (type: "zip" | "wordpress") => {
    setIsExporting(true);
    setExportType(type);
    
    // Simulate export process
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // In production, this would generate the actual files
    console.log("Exporting as:", type);
    
    setIsExporting(false);
    setExportType(null);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Preview & Export</h2>
        <p className="text-muted-foreground mt-1">
          Vérifiez votre landing page et exportez-la
        </p>
      </div>

      {/* Device Preview Tabs */}
      <div className="flex items-center justify-center gap-2 p-1 bg-secondary rounded-lg w-fit mx-auto">
        {[
          { value: "desktop" as const, icon: Monitor, label: "Desktop" },
          { value: "tablet" as const, icon: Tablet, label: "Tablette" },
          { value: "mobile" as const, icon: Smartphone, label: "Mobile" },
        ].map((device) => {
          const Icon = device.icon;
          return (
            <button
              key={device.value}
              onClick={() => setActiveDevice(device.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
                activeDevice === device.value
                  ? "bg-background shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{device.label}</span>
            </button>
          );
        })}
      </div>

      {/* Preview Frame */}
      <Card className="overflow-hidden">
        <div className="bg-muted p-2 flex items-center gap-2">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-destructive/60" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <div className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="flex-1 text-center text-xs text-muted-foreground">
            preview.landpage-ai.com
          </div>
        </div>
        <div className="bg-background p-4 flex justify-center">
          <div
            className={cn(
              "transition-all duration-300 rounded-lg overflow-hidden border shadow-lg",
              DEVICE_WIDTHS[activeDevice]
            )}
          >
            {/* Mock Landing Page Preview */}
            <div className="bg-card">
              {/* Hero Preview */}
              <div
                className="p-8 text-center"
                style={{
                  background: `linear-gradient(135deg, ${brandIdentity.primaryColor}20 0%, transparent 100%)`,
                }}
              >
                {brandIdentity.logo && (
                  <img
                    src={brandIdentity.logo}
                    alt="Logo"
                    className="h-12 mx-auto mb-6 object-contain"
                  />
                )}
                <h1 className="text-2xl md:text-4xl font-bold mb-4">
                  {content.hero?.title || "Titre Principal"}
                </h1>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {content.hero?.subtitle || "Votre sous-titre accrocheur"}
                </p>
                <Button className="btn-gradient">
                  {content.hero?.ctaText || "Commander"}
                </Button>
              </div>

              {/* Benefits Preview */}
              {sections.includes("benefits") && content.benefits?.items && (
                <div className="p-8 border-t">
                  <h2 className="text-xl font-bold text-center mb-6">
                    {content.benefits.title}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {content.benefits.items.slice(0, 3).map((item, i) => (
                      <div key={i} className="text-center p-4">
                        <div className="text-2xl mb-2">{item.icon}</div>
                        <h3 className="font-medium">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* More sections indicator */}
              <div className="p-4 text-center text-sm text-muted-foreground border-t">
                + {sections.length - 2} autres sections
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Performance Scores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
              <Gauge className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">PageSpeed Score</p>
              <p className="text-3xl font-bold text-green-500">92</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">SEO Score</p>
              <p className="text-3xl font-bold text-primary">88</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Tabs defaultValue="zip" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zip">Export ZIP</TabsTrigger>
          <TabsTrigger value="wordpress">WordPress</TabsTrigger>
        </TabsList>

        <TabsContent value="zip" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <FileCode className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1">Export HTML/CSS</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Téléchargez un fichier ZIP contenant votre landing page complète
                  </p>
                  <ul className="space-y-2 mb-4">
                    {["index.html optimisé", "style.css minifié", "Images compressées", "Fichiers responsive"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => handleExport("zip")}
                    disabled={isExporting}
                    className="gap-2"
                  >
                    {isExporting && exportType === "zip" ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Génération...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Télécharger le ZIP
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wordpress" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Package className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 flex items-center gap-2">
                    Plugin WordPress
                    <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">Pro</span>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Plugin installable directement sur votre site WordPress
                  </p>
                  <ul className="space-y-2 mb-4">
                    {[
                      "Compatible Gutenberg",
                      "Compatible Elementor",
                      "Intégration WooCommerce",
                      "Mise à jour automatique",
                    ].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleExport("wordpress")}
                      disabled={isExporting}
                      className="btn-gradient gap-2"
                    >
                      {isExporting && exportType === "wordpress" ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Génération...
                        </>
                      ) : (
                        <>
                          <Download className="w-4 h-4" />
                          Télécharger le plugin
                        </>
                      )}
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <ExternalLink className="w-4 h-4" />
                      Guide d'installation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
