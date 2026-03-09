import { useCallback, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, Sparkles, CheckCircle, AlertCircle, Image as ImageIcon, ArrowRight, DollarSign, X, Plus, Globe } from "lucide-react";
import type { LandingLanguage } from "@/types/project";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GENERATION_STEPS = [
  { label: "تحليل صور المنتج بالذكاء الاصطناعي...", progress: 10 },
  { label: "التعرف على المنتج والبحث عن معلوماته...", progress: 25 },
  { label: "إنشاء المحتوى التسويقي بالعربية...", progress: 40 },
  { label: "إنشاء صور المنتج الاحترافية...", progress: 55 },
  { label: "تصميم الصور بأسلوب lifestyle...", progress: 70 },
  { label: "تجميع صفحة الهبوط...", progress: 85 },
  { label: "تحسين SEO والإنهاء...", progress: 95 },
  { label: "تم إنشاء صفحة الهبوط! ✅", progress: 100 },
];

const MAX_IMAGES = 5;

export function ProductUpload() {
  const {
    currentView,
    setCurrentView,
    setGeneratedProject,
    addProductImage,
    removeProductImage,
    clearProductImages,
    productImages,
    setIsGenerating,
    setGenerationProgress,
    setGenerationStep,
    setUserPrice,
    userPrice,
    selectedLanguage,
    setSelectedLanguage,
    isGenerating,
    generationProgress,
    generationStep,
    selectedTemplate,
    productImageUrl,
    productImageBase64,
  } = useApp();

  const [isDragging, setIsDragging] = useState(false);
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
    }, 3500);
    return interval;
  };

  const handleGenerate = async () => {
    if (productImages.length === 0) return;
    
    setError(null);
    setIsGenerating(true);
    setCurrentView("generating");
    setGenerationProgress(5);
    setGenerationStep("تحضير الصور...");

    const progressInterval = simulateProgress();

    try {
      // Send all images to analyze
      const imagesBase64 = productImages.map(img => img.base64);
      
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-product", {
        body: { 
          imageBase64: imagesBase64[0], 
          additionalImages: imagesBase64.slice(1),
          userPrice: userPrice || null,
          language: selectedLanguage,
        },
      });

      if (analysisError) throw new Error(analysisError.message || "خطأ في التحليل");
      if (analysisData?.error) throw new Error(analysisData.error);

      // Generate matching images
      const { data: imageData } = await supabase.functions.invoke("generate-product-images", {
        body: {
          imageBase64: imagesBase64[0],
          productName: analysisData.product?.name,
          productCategory: analysisData.product?.category,
        },
      });

      clearInterval(progressInterval);

      const generatedImages = imageData?.images || [];

      setGenerationProgress(100);
      setGenerationStep("تم إنشاء صفحة الهبوط! ✅");

      setGeneratedProject({
        product: analysisData.product,
        pricing: analysisData.pricing,
        landingPage: analysisData.landingPage,
        seo: analysisData.seo,
        design: analysisData.design,
        productImageUrl: productImages[0].url,
        generatedImages,
        template: selectedTemplate,
      });

      setTimeout(() => {
        setIsGenerating(false);
        setCurrentView("preview");
        toast.success(`تم إنشاء صفحة الهبوط مع ${generatedImages.length} صور!`);
      }, 800);
    } catch (err) {
      clearInterval(progressInterval);
      console.error("Generation error:", err);
      setError(err instanceof Error ? err.message : "خطأ غير معروف");
      setIsGenerating(false);
      setCurrentView("price");
      toast.error("خطأ أثناء الإنشاء");
    }
  };

  const handleFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter(f => f.type.startsWith("image/"));
    if (imageFiles.length === 0) return;

    const remaining = MAX_IMAGES - productImages.length;
    const toAdd = imageFiles.slice(0, remaining);

    for (const file of toAdd) {
      const url = URL.createObjectURL(file);
      const base64 = await fileToBase64(file);
      addProductImage(url, base64, file);
    }

    if (imageFiles.length > remaining) {
      toast.info(`تم إضافة ${remaining} صور فقط (الحد الأقصى ${MAX_IMAGES})`);
    }
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
  }, [productImages.length]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(e.target.files);
  };

  // GENERATING VIEW
  if (isGenerating || currentView === "generating") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in" dir="rtl">
        <div className="max-w-lg w-full space-y-8 text-center">
          {/* Show uploaded images thumbnails */}
          <div className="flex justify-center gap-2 flex-wrap">
            {productImages.slice(0, 4).map((img, i) => (
              <div key={i} className="w-20 h-20 rounded-xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
                <img src={img.url} alt={`المنتج ${i + 1}`} className="w-full h-full object-cover" />
              </div>
            ))}
            {productImages.length > 4 && (
              <div className="w-20 h-20 rounded-xl bg-primary/10 border-2 border-primary/30 flex items-center justify-center text-primary font-bold">
                +{productImages.length - 4}
              </div>
            )}
          </div>
          <div>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-primary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold mb-2">جاري الإنشاء...</h2>
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
                <span className="text-right">{step.label.replace("...", "")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // PRICE INPUT VIEW
  if (currentView === "price") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in" dir="rtl">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3">
              تم اختيار <span className="gradient-text">{productImages.length} صورة</span> للمنتج
            </h2>
            <p className="text-muted-foreground">أدخل السعر بالدينار الجزائري (اختياري) ثم ابدأ الإنشاء</p>
          </div>

          {/* Image thumbnails grid */}
          <div className="flex justify-center gap-3 flex-wrap">
            {productImages.map((img, i) => (
              <div key={i} className="relative group">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-primary/30 shadow-xl shadow-primary/20">
                  <img src={img.url} alt={`المنتج ${i + 1}`} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => removeProductImage(i)}
                  className="absolute -top-2 -left-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                {i === 0 && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full">
                    رئيسية
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Language selector */}
          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-3">
              <label className="text-sm font-medium flex items-center gap-2">
                <Globe className="w-4 h-4 text-primary" />
                لغة صفحة الهبوط
              </label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { id: "ar" as LandingLanguage, label: "العربية", flag: "🇩🇿", desc: "عربية جزائرية" },
                  { id: "fr" as LandingLanguage, label: "Français", flag: "🇫🇷", desc: "فرنسية جزائرية" },
                  { id: "both" as LandingLanguage, label: "الاثنتان", flag: "🌍", desc: "عربية + فرنسية" },
                ]).map(lang => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedLanguage(lang.id)}
                    className={cn(
                      "p-4 rounded-xl border-2 text-center transition-all",
                      selectedLanguage === lang.id
                        ? "border-primary bg-primary/10 shadow-md shadow-primary/10"
                        : "border-border hover:border-primary/30"
                    )}
                  >
                    <span className="text-2xl block mb-1">{lang.flag}</span>
                    <span className="font-semibold text-sm block">{lang.label}</span>
                    <span className="text-[10px] text-muted-foreground">{lang.desc}</span>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-primary" />
                  سعر المنتج (دج - دينار جزائري)
                </label>
                <Input
                  type="number"
                  placeholder="مثال: 7999"
                  value={userPrice}
                  onChange={(e) => setUserPrice(e.target.value)}
                  className="text-lg text-center h-14 text-xl font-bold"
                  dir="ltr"
                />
                <p className="text-xs text-muted-foreground text-center">
                  اتركه فارغاً ليقوم الذكاء الاصطناعي بتقدير السعر تلقائياً
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                clearProductImages();
                setCurrentView("upload");
              }}
            >
              تغيير الصور
            </Button>
            <Button
              className="flex-1 btn-gradient gap-2 text-lg h-14"
              onClick={handleGenerate}
              disabled={productImages.length === 0}
            >
              <Sparkles className="w-5 h-5" />
              إنشاء صفحة الهبوط
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // UPLOAD VIEW
  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in" dir="rtl">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>الذكاء الاصطناعي يُنشئ كل شيء تلقائياً</span>
          </div>
          <h1 className="text-4xl font-bold mb-3">
            ارفع صور المنتج،{" "}
            <span className="gradient-text">احصل على صفحة هبوط كاملة</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            ارفع عدة صور للمنتج (حتى {MAX_IMAGES} صور) ليفهم الذكاء الاصطناعي منتجك بشكل أفضل
            ويُنشئ صفحة هبوط احترافية مع صور مطابقة.
          </p>
        </div>

        {error && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardContent className="p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-destructive shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-destructive">خطأ في الإنشاء</p>
                <p className="text-xs text-muted-foreground">{error}</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setError(null)}>إعادة المحاولة</Button>
            </CardContent>
          </Card>
        )}

        {/* Uploaded images preview */}
        {productImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{productImages.length} / {MAX_IMAGES} صور مُرفقة</p>
              <Button variant="ghost" size="sm" onClick={clearProductImages} className="text-destructive hover:text-destructive">
                حذف الكل
              </Button>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {productImages.map((img, i) => (
                <div key={i} className="relative group aspect-square rounded-xl overflow-hidden border-2 border-primary/20">
                  <img src={img.url} alt={`صورة ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeProductImage(i)}
                    className="absolute top-1 left-1 w-6 h-6 bg-black/60 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] bg-primary text-primary-foreground px-2 py-0.5 rounded-full whitespace-nowrap">
                      صورة رئيسية
                    </span>
                  )}
                </div>
              ))}
              {/* Add more button */}
              {productImages.length < MAX_IMAGES && (
                <label className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
                  <Plus className="w-6 h-6 text-muted-foreground mb-1" />
                  <span className="text-[10px] text-muted-foreground">إضافة</span>
                </label>
              )}
            </div>
            <Button
              className="w-full btn-gradient gap-2 text-lg h-14"
              onClick={() => setCurrentView("price")}
            >
              <ArrowRight className="w-5 h-5" />
              متابعة
            </Button>
          </div>
        )}

        {/* Upload area */}
        {productImages.length === 0 && (
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
              <input type="file" id="photo-upload" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              <label htmlFor="photo-upload" className="flex flex-col items-center cursor-pointer">
                <div className="p-6 rounded-2xl bg-primary/10 mb-6 group-hover:bg-primary/15 transition-colors">
                  <Upload className="w-12 h-12 text-primary" />
                </div>
                <p className="text-xl font-semibold mb-2">
                  {isDragging ? "أسقط صورك هنا" : "اسحب وأسقط صور المنتج"}
                </p>
                <p className="text-muted-foreground mb-6">أو انقر لاختيار عدة صور</p>
                <Button className="btn-gradient gap-2" size="lg">
                  <ImageIcon className="w-5 h-5" />
                  اختر صور المنتج
                </Button>
                <p className="text-xs text-muted-foreground mt-4">PNG, JPG, WEBP • حتى {MAX_IMAGES} صور • حد أقصى 20MB لكل صورة</p>
              </label>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "📸", title: "صور متعددة", desc: "ارفع حتى 5 صور لتحليل أدق" },
            { icon: "🔍", title: "تعرّف ذكي", desc: "التعرف الدقيق على المنتج الأصلي" },
            { icon: "🚀", title: "جاهز لـ WordPress", desc: "صفحة جاهزة للنشر والبيع" },
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
