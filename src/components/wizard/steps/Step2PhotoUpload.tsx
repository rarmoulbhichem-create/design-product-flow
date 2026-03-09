import { useCallback, useState } from "react";
import { useWizard } from "@/contexts/WizardContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Star, Image as ImageIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { UploadedImage } from "@/types/project";

export function Step2PhotoUpload() {
  const { images, updateImages } = useWizard();
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

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

  const processFiles = async (files: File[]) => {
    if (files.length === 0) return;
    
    setIsUploading(true);
    
    const newImages: UploadedImage[] = await Promise.all(
      files.slice(0, 10 - images.uploaded.length).map(async (file, index) => {
        // Create a local URL for preview
        const url = URL.createObjectURL(file);
        return {
          id: `img-${Date.now()}-${index}`,
          url,
          name: file.name,
          isPrimary: images.uploaded.length === 0 && index === 0,
        };
      })
    );

    updateImages({
      uploaded: [...images.uploaded, ...newImages],
    });
    
    setIsUploading(false);
  };

  const removeImage = (id: string) => {
    const filtered = images.uploaded.filter((img) => img.id !== id);
    // If we removed the primary image, make the first one primary
    if (filtered.length > 0 && !filtered.some((img) => img.isPrimary)) {
      filtered[0].isPrimary = true;
    }
    updateImages({ uploaded: filtered });
  };

  const setPrimaryImage = (id: string) => {
    const updated = images.uploaded.map((img) => ({
      ...img,
      isPrimary: img.id === id,
    }));
    updateImages({ uploaded: updated });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold gradient-text">Import des photos</h2>
        <p className="text-muted-foreground mt-1">
          Uploadez jusqu'à 10 photos de votre produit
        </p>
      </div>

      {/* Drop zone */}
      <Card
        className={cn(
          "border-2 border-dashed transition-all duration-300 cursor-pointer",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border hover:border-primary/50",
          images.uploaded.length >= 10 && "opacity-50 cursor-not-allowed"
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
            disabled={images.uploaded.length >= 10}
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
            <p className="text-xs text-muted-foreground mt-4">
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
            {images.uploaded.length < 10 && (
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

      {/* Tips */}
      <Card className="bg-secondary/50">
        <CardContent className="p-4">
          <h4 className="font-medium mb-2">💡 Conseils pour de meilleurs résultats</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Utilisez des photos haute résolution (min. 1000px)</li>
            <li>• Photographiez sur fond neutre de préférence</li>
            <li>• Incluez des vues de différents angles</li>
            <li>• L'image principale sera utilisée pour le Hero</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
