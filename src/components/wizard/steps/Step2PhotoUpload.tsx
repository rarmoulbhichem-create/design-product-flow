import { useCallback, useState, useEffect } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Upload, X, Star, Image as ImageIcon, Loader2, Sparkles, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedImage } from "@/types/project";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AI_STEPS = [
  "Analyse de l'image...",
  "Identification du produit...",
  "Génération du contenu marketing...",
  "Création des visuels optimisés...",
  "Assemblage de la landing page...",
];

export function Step2PhotoUpload() {
  const { 
    images, 
    updateImages, 
    updateContent, 
    updateBrandIdentity,
    updateProjectInfo,
    setIsGenerating,
    isGenerating 
  } = useWizard();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [currentAiStep, setCurrentAiStep] = useState(0);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      
      const files = Array.from(e.dataTransfer.files).filter((file) =>
        file.type.startsWith("image/")
      );
      
      await processFiles(files);
    },
    [images.uploaded]
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files ? Array.from(e.target.files) : [];
      await processFiles(files);
    },
    [images.uploaded]
  );

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix to get just the base64
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
    });
  };

  const analyzeProductWithAI = async (imageBase64: string) => {
    setIsGenerating(true);
    setAiProgress(0);
    setCurrentAiStep(0);
    setAiError(null);
    setAiAnalysisComplete(false);

    try {
      // Step 1: Analyze product
      setCurrentAiStep(0);
      setAiProgress(10);

      const analyzeResponse = await supabase.functions.invoke('analyze-product', {
        body: { imageBase64 }
      });

      if (analyzeResponse.error) {
        throw new Error(analyzeResponse.error.message || "Erreur d'analyse");
      }

      const analysis = analyzeResponse.data;
      
      setCurrentAiStep(1);
      setAiProgress(30);

      // Update project info with analysis
      if (analysis.productAnalysis) {
        updateProjectInfo({
          productType: analysis.productAnalysis.type?.includes('digital') ? 'digital' : 
                       analysis.productAnalysis.type?.includes('service') ? 'service' : 'physical',
          targetAudience: analysis.productAnalysis.targetAudience,
        });
      }

      setCurrentAiStep(2);
      setAiProgress(50);

      // Update brand identity with suggested colors
      if (analysis.suggestedColors) {
        updateBrandIdentity({
          primaryColor: analysis.suggestedColors.primary,
          palette: [
            analysis.suggestedColors.primary,
            analysis.suggestedColors.secondary,
            analysis.suggestedColors.accent,
          ],
        });
      }

      // Update landing page content
      if (analysis.landingPageContent) {
        updateContent({
          hero: analysis.landingPageContent.hero,
          benefits: {
            title: "Pourquoi choisir notre produit",
            items: analysis.landingPageContent.benefits || [],
          },
          testimonials: {
            items: analysis.landingPageContent.testimonials || [],
          },
          faq: {
            items: analysis.landingPageContent.faq || [],
          },
          pricing: analysis.landingPageContent.pricing,
          cta: analysis.landingPageContent.cta,
        });
      }

      setCurrentAiStep(3);
      setAiProgress(70);

      // Step 2: Generate optimized images
      const imagePrompts = analysis.imagePrompts || [
        "Professional product photography with studio lighting",
        "Lifestyle scene showing the product in use",
        "Hero banner image with elegant composition"
      ];

      const generateResponse = await supabase.functions.invoke('generate-product-images', {
        body: { 
          imageBase64,
          prompts: imagePrompts,
          style: 'studio'
        }
      });

      setCurrentAiStep(4);
      setAiProgress(90);

      if (generateResponse.data?.images) {
        const generatedImages = generateResponse.data.images.map((img: any, index: number) => ({
          id: img.id || `gen-${Date.now()}-${index}`,
          url: img.url,
          style: 'studio' as const,
          variant: index + 1,
          sourceImageId: images.uploaded[0]?.id || 'original',
        }));

        updateImages({
          generated: generatedImages,
          selected: generatedImages.map((img: any) => img.id),
        });
      }

      setAiProgress(100);
      setAiAnalysisComplete(true);
      toast.success("Landing page générée avec succès !");

    } catch (error) {
      console.error("AI analysis error:", error);
      setAiError(error instanceof Error ? error.message : "Erreur lors de l'analyse");
      toast.error("Erreur lors de la génération IA");
    } finally {
      setIsGenerating(false);
    }
  };

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    const newImages: UploadedImage[] = await Promise.all(
      files.slice(0, 10 - images.uploaded.length).map(async (file, index) => {
        const url = URL.createObjectURL(file);
        return {
          id: `img-${Date.now()}-${index}`,
          url,
          name: file.name,
          isPrimary: images.uploaded.length === 0 && index === 0,
          file, // Keep reference to original file
        };
      })
    );

    updateImages({
      uploaded: [...images.uploaded, ...newImages],
    });
    
    setIsUploading(false);

    // Auto-trigger AI analysis for the primary image
    if (newImages.length > 0 && newImages[0].isPrimary) {
      const primaryFile = files[0];
      const base64 = await fileToBase64(primaryFile);
      await analyzeProductWithAI(base64);
    }
  };

  const removeImage = (id: string) => {
    const filtered = images.uploaded.filter((img) => img.id !== id);
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    updateImages({ uploaded: filtered });
    
    // Reset AI state if all images removed
    if (filtered.length === 0) {
      setAiAnalysisComplete(false);
      setAiProgress(0);
    }
  };

  const setPrimaryImage = (id: string) => {
    const updated = images.uploaded.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    updateImages({ uploaded: updated });
  };

  const retryAnalysis = async () => {
    const primaryImage = images.uploaded.find(img => img.isPrimary);
    if (primaryImage && (primaryImage as any).file) {
      const base64 = await fileToBase64((primaryImage as any).file);
      await analyzeProductWithAI(base64);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Import des photos</h2>
        <p className="text-muted-foreground mt-1">
          Uploadez une photo de votre produit — l'IA génère automatiquement votre landing page
        </p>
      </div>

      {/* AI Generation Progress */}
      {isGenerating && (
        <Card className="glass-card border-primary/50">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary animate-pulse" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">Génération IA en cours...</h3>
                <p className="text-sm text-muted-foreground">
                  {AI_STEPS[currentAiStep]}
                </p>
              </div>
            </div>
            <Progress value={aiProgress} className="h-2" />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Étape {currentAiStep + 1}/{AI_STEPS.length}</span>
              <span>{aiProgress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Analysis Complete */}
      {aiAnalysisComplete && !isGenerating && (
        <Card className="glass-card border-green-500/50 bg-green-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-green-400">Landing page générée !</h3>
                <p className="text-sm text-muted-foreground">
                  L'IA a analysé votre produit et créé le contenu marketing. 
                  Continuez pour personnaliser le style et exporter.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* AI Error */}
      {aiError && !isGenerating && (
        <Card className="glass-card border-destructive/50 bg-destructive/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-destructive" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-destructive">Erreur de génération</h3>
                <p className="text-sm text-muted-foreground">{aiError}</p>
              </div>
              <Button variant="outline" onClick={retryAnalysis}>
                Réessayer
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Drop zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          (images.uploaded.length >= 10 || isGenerating) && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <CardContent className="flex flex-col items-center justify-center py-12">
          <input
            type="file"
            id="photo-upload"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
            disabled={images.uploaded.length >= 10 || isGenerating}
          />
          <label
            htmlFor="photo-upload"
            className="flex flex-col items-center cursor-pointer"
          >
            {isUploading ? (
              <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
            ) : (
              <div className="p-4 rounded-full bg-primary/10 mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
            )}
            <p className="text-lg font-medium">
              {isDragging
                ? "Déposez vos images ici"
                : "Glissez-déposez vos images"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              ou cliquez pour sélectionner
            </p>
            <div className="mt-4 flex items-center gap-2 text-primary">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">
                L'IA génère automatiquement votre landing page
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG, WEBP • Max 10 images • 20MB par image
            </p>
          </label>
        </CardContent>
      </Card>

      {/* Uploaded images grid */}
      {images.uploaded.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">
              Images uploadées ({images.uploaded.length}/10)
            </h3>
            <p className="text-sm text-muted-foreground">
              <Star className="w-4 h-4 inline mr-1 text-yellow-500" />
              = Image principale
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {images.uploaded.map((image) => (
              <div
                key={image.id}
                className={cn(
                  "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  image.isPrimary
                    ? "border-yellow-500 ring-2 ring-yellow-500/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {!image.isPrimary && (
                    <Button
                      size="icon"
                      variant="secondary"
                      className="h-8 w-8"
                      onClick={() => setPrimaryImage(image.id)}
                      title="Définir comme image principale"
                    >
                      <Star className="w-4 h-4" />
                    </Button>
                  )}
                  <Button
                    size="icon"
                    variant="destructive"
                    className="h-8 w-8"
                    onClick={() => removeImage(image.id)}
                    title="Supprimer"
                    disabled={isGenerating}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Primary badge */}
                {image.isPrimary && (
                  <div className="absolute top-2 left-2 bg-yellow-500 text-black text-xs font-medium px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    Principal
                  </div>
                )}
              </div>
            ))}

            {/* Add more placeholder */}
            {images.uploaded.length < 10 && !isGenerating && (
              <label
                htmlFor="photo-upload"
                className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors"
              >
                <ImageIcon className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-xs text-muted-foreground">Ajouter</span>
              </label>
            )}
          </div>
        </div>
      )}

      {/* AI-Generated Images Preview */}
      {images.generated.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" />
            Visuels générés par l'IA ({images.generated.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.generated.slice(0, 4).map((image) => (
              <div
                key={image.id}
                className="aspect-square rounded-lg overflow-hidden border border-primary/30"
              >
                <img
                  src={image.url}
                  alt={`Generated ${image.variant}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips */}
      <Card className="bg-secondary/50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">✨ Comment ça marche</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Uploadez une photo de votre produit</li>
            <li>• L'IA analyse automatiquement l'image</li>
            <li>• Génération du contenu marketing (titres, descriptions, FAQ...)</li>
            <li>• Création de visuels optimisés pour votre landing page</li>
            <li>• Export WordPress en un clic</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
