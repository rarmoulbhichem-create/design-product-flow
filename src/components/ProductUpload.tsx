import { useCallback, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, Sparkles, CheckCircle, AlertCircle, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GENERATION_STEPS = [
  { label: "Analyse du produit par l'IA...", progress: 10 },
  { label: "Identification des caractéristiques...", progress: 25 },
  { label: "Génération du contenu marketing...", progress: 40 },
  { label: "Création des images produit...", progress: 55 },
  { label: "Génération des visuels lifestyle...", progress: 70 },
  { label: "Assemblage de la landing page...", progress: 85 },
  { label: "Optimisation SEO & finalisation...", progress: 95 },
  { label: "Landing page générée !", progress: 100 },
];

export function ProductUpload() {
  const {
    setCurrentView,
    setGeneratedProject,
    setProductImage,
    setIsGenerating,
    setGenerationProgress,
    setGenerationStep,
    isGenerating,
    generationProgress,
    generationStep,
    selectedTemplate,
  } = useApp();

  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]);
      };
      reader.onerror = reject;
    });
  };

  const simulateProgress = () => {
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < GENERATION_STEPS.length - 1) {
        setGenerationStep(GENERATION_STEPS[stepIndex].label);
        setGenerationProgress(GENERATION_STEPS[stepIndex].progress);
        stepIndex++;
      } else {
        clearInterval(interval);
      }
    }, 3000);
    return interval;
  };

  const handleGenerate = async (file: File) => {
    setError(null);
    setIsGenerating(true);
    setCurrentView("generating");
    setGenerationProgress(5);
    setGenerationStep("Préparation de l'image...");

    const progressInterval = simulateProgress();

    try {
      const base64 = await fileToBase64(file);
      const url = URL.createObjectURL(file);
      setProductImage(url, base64);
      setPreviewUrl(url);

      // Step 1: Analyze product
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-product", {
        body: { imageBase64: base64 },
      });

      if (analysisError) throw new Error(analysisError.message || "Erreur d'analyse");
      if (analysisData?.error) throw new Error(analysisData.error);

      // Step 2: Generate images in parallel
      const { data: imageData } = await supabase.functions.invoke("generate-product-images", {
        body: {
          imageBase64: base64,
          productName: analysisData.product?.name,
          productCategory: analysisData.product?.category,
          designMood: analysisData.design?.mood,
          primaryColor: analysisData.design?.primaryColor,
        },
      });

      clearInterval(progressInterval);

      const generatedImages = imageData?.images || [];

      setGenerationProgress(100);
      setGenerationStep("Landing page générée !");

      setGeneratedProject({
        product: analysisData.product,
        pricing: analysisData.pricing,
        landingPage: analysisData.landingPage,
        seo: analysisData.seo,
        design: analysisData.design,
        productImageUrl: url,
        generatedImages,
        template: selectedTemplate,
      });

      setTimeout(() => {
        setIsGenerating(false);
        setCurrentView("preview");
        toast.success(`Landing page générée avec ${generatedImages.length} images !`);
      }, 800);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "Erreur inconnue");
      setIsGenerating(false);
      setCurrentView("upload");
      toast.error("Erreur lors de la génération");
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const file = Array.from(files).find(f => f.type.startsWith("image/"));
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    await handleGenerate(file);
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  if (isGenerating) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
        <div className="max-w-lg w-full space-y-8 text-center">
          {previewUrl && (
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
              <img src={previewUrl} alt="Product" className="w-full h-full object-cover" />
            </div>
          )}
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Génération en cours...</h2>
            <p className="text-muted-foreground">{generationStep}</p>
          </div>
          <div className="space-y-2">
            <Progress value={generationProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">{generationProgress}%</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground">
            {GENERATION_STEPS.map((step, i) => (
              <div key={i} className={cn(
                "flex items-center gap-2 p-2 rounded-lg transition-all",
                generationProgress >= step.progress ? "text-primary bg-primary/5" : "opacity-40"
              )}>
                {generationProgress >= step.progress ? (
                  <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <Loader2 className="w-3.5 h-3.5 shrink-0 animate-spin" />
                )}
                <span className="text-left">{step.label.replace("...", "")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>IA génère tout automatiquement</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            Uploadez une photo,{" "}
            <span className="gradient-text">obtenez votre landing page</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            L'IA analyse votre produit, génère le contenu, crée des images professionnelles 
            et assemble une page prête à vendre sur WordPress.
          </p>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">Erreur de génération</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setError(null)}>Réessayer</Button>
            </CardContent>
          </Card>
        )}

        <Card
          className={cn(
            "border-2 border-dashed transition-all duration-300 cursor-pointer group",
            isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50 hover:bg-primary/[0.02]"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <CardContent className="flex flex-col items-center justify-center py-16">
            <input type="file" id="photo-upload" accept="image/*" className="hidden" onChange={handleFileSelect} />
            <label htmlFor="photo-upload" className="flex flex-col items-center cursor-pointer">
              <div className="p-6 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/15 transition-colors">
                <Upload className="w-12 h-12 text-primary" />
              </div>
              <p className="text-xl font-semibold mb-2">
                {isDragging ? "Déposez votre image ici" : "Glissez-déposez votre image produit"}
              </p>
              <p className="text-muted-foreground mb-6">ou cliquez pour sélectionner</p>
              <Button className="btn-gradient gap-2" size="lg">
                <ImageIcon className="w-5 h-5" />
                Choisir une image
              </Button>
              <p className="text-xs text-muted-foreground mt-4">PNG, JPG, WEBP • Max 20MB</p>
            </label>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "🔍", title: "Analyse IA", desc: "Identification automatique du produit" },
            { icon: "🎨", title: "Images générées", desc: "Visuels professionnels créés par l'IA" },
            { icon: "🚀", title: "Export WordPress", desc: "Page prête à publier" },
          ].map(item => (
            <div key={item.title} className="p-4 rounded-xl bg-card border border-border">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="font-medium text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
