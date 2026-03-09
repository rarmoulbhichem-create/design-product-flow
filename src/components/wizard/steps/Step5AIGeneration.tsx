import { useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sparkles, RefreshCw, Check, ImagePlus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const GENERATION_STEPS = [
  "Analyse de l'image...",
  "Suppression du fond...",
  "Application du style...",
  "Génération des variantes...",
  "Finalisation...",
];

export function Step5AIGeneration() {
  const { images, visualStyle, updateImages, isGenerating, setIsGenerating } = useWizard();
  const [progress, setProgress] = useState(0);
  const [currentGenerationStep, setCurrentGenerationStep] = useState(0);
  const [generationComplete, setGenerationComplete] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setProgress(0);
    setCurrentGenerationStep(0);
    setGenerationComplete(false);

    // Simulate generation process
    for (let i = 0; i < GENERATION_STEPS.length; i++) {
      setCurrentGenerationStep(i);
      setProgress((i + 1) * 20);
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    // Generate mock images based on uploaded images
    const mockGeneratedImages = images.uploaded.flatMap((uploadedImg, imgIndex) =>
      Array.from({ length: 3 }, (_, variantIndex) => ({
        id: `gen-${imgIndex}-${variantIndex}`,
        url: uploadedImg.url, // In production, this would be the AI-generated image URL
        style: visualStyle.style || "studio",
        variant: variantIndex + 1,
        sourceImageId: uploadedImg.id,
      }))
    );

    updateImages({
      generated: mockGeneratedImages,
      selected: mockGeneratedImages.slice(0, 3).map((img) => img.id),
    });

    setIsGenerating(false);
    setGenerationComplete(true);
  };

  const toggleImageSelection = (imageId: string) => {
    const isSelected = images.selected.includes(imageId);
    if (isSelected) {
      updateImages({
        selected: images.selected.filter((id) => id !== imageId),
      });
    } else {
      updateImages({
        selected: [...images.selected, imageId],
      });
    }
  };

  const regenerateImage = async (imageId: string) => {
    // In production, this would call the AI to regenerate a specific image
    console.log("Regenerating image:", imageId);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Génération IA</h2>
        <p className="text-muted-foreground mt-1">
          L'IA va transformer vos photos en visuels marketing professionnels
        </p>
      </div>

      {/* Generation Controls */}
      {!generationComplete && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            {!isGenerating ? (
              <>
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Prêt à générer</h3>
                <p className="text-muted-foreground mb-6">
                  {images.uploaded.length} image(s) • Style {visualStyle.style} • {visualStyle.lighting}
                </p>
                <Button onClick={handleGenerate} className="btn-gradient gap-2" size="lg">
                  <Sparkles className="w-5 h-5" />
                  Générer les visuels
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  ~{images.uploaded.length * 3} variantes seront générées
                </p>
              </>
            ) : (
              <>
                <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-6" />
                <h3 className="text-xl font-semibold mb-2">Génération en cours...</h3>
                <p className="text-muted-foreground mb-4">
                  {GENERATION_STEPS[currentGenerationStep]}
                </p>
                <div className="max-w-md mx-auto">
                  <Progress value={progress} className="h-2" />
                  <p className="text-sm text-muted-foreground mt-2">{progress}%</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Generated Images Gallery */}
      {generationComplete && images.generated.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Visuels générés</h3>
              <p className="text-sm text-muted-foreground">
                {images.selected.length} image(s) sélectionnée(s)
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleGenerate}
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Tout régénérer
            </Button>
          </div>

          {/* Group by source image */}
          {images.uploaded.map((uploadedImg) => (
            <div key={uploadedImg.id} className="space-y-3">
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <ImagePlus className="w-4 h-4" />
                Variantes de "{uploadedImg.name}"
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {images.generated
                  .filter((img) => img.sourceImageId === uploadedImg.id)
                  .map((generatedImg) => {
                    const isSelected = images.selected.includes(generatedImg.id);
                    return (
                      <div
                        key={generatedImg.id}
                        className={cn(
                          "relative group aspect-square rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
                          isSelected
                            ? "border-primary ring-2 ring-primary/20"
                            : "border-border hover:border-primary/50"
                        )}
                        onClick={() => toggleImageSelection(generatedImg.id)}
                      >
                        <img
                          src={generatedImg.url}
                          alt={`Variante ${generatedImg.variant}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 left-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        )}

                        {/* Variant number */}
                        <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm text-xs px-2 py-0.5 rounded">
                          V{generatedImg.variant}
                        </div>

                        {/* Regenerate button */}
                        <button
                          className="absolute top-2 right-2 w-8 h-8 bg-background/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            regenerateImage(generatedImg.id);
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}

          {/* Selection hint */}
          <Card className="bg-secondary/50">
            <CardContent className="p-4 flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <div>
                <h4 className="font-medium">Sélectionnez vos favoris</h4>
                <p className="text-sm text-muted-foreground">
                  Cliquez sur les images que vous souhaitez utiliser dans votre landing page.
                  Vous pouvez en sélectionner autant que vous voulez.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
