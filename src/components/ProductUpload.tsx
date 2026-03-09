import { useCallback, useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Upload, Loader2, Sparkles, CheckCircle, AlertCircle, Image as ImageIcon, ArrowRight, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const GENERATION_STEPS = [
  { label: "تحليل المنتج بالذكاء الاصطناعي...", progress: 10 },
  { label: "التعرف على المنتج والبحث عن معلوماته...", progress: 25 },
  { label: "إنشاء المحتوى التسويقي بالعربية...", progress: 40 },
  { label: "إنشاء صور المنتج الاحترافية...", progress: 55 },
  { label: "تصميم الصور بأسلوب lifestyle...", progress: 70 },
  { label: "تجميع صفحة الهبوط...", progress: 85 },
  { label: "تحسين SEO والإنهاء...", progress: 95 },
  { label: "تم إنشاء صفحة الهبوط! ✅", progress: 100 },
];

export function ProductUpload() {
  const {
    currentView,
    setCurrentView,
    setGeneratedProject,
    setProductImage,
    setIsGenerating,
    setGenerationProgress,
    setGenerationStep,
    setUserPrice,
    userPrice,
    isGenerating,
    generationProgress,
    generationStep,
    selectedTemplate,
    productImageUrl,
    productImageBase64,
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
    }, 3500);
    return interval;
  };

  const handleGenerate = async () => {
    if (!productImageBase64 || !productImageUrl) return;
    
    setError(null);
    setIsGenerating(true);
    setCurrentView("generating");
    setGenerationProgress(5);
    setGenerationStep("تحضير الصورة...");

    const progressInterval = simulateProgress();

    try {
      // Step 1: Analyze product with price
      const { data: analysisData, error: analysisError } = await supabase.functions.invoke("analyze-product", {
        body: { imageBase64: productImageBase64, userPrice: userPrice || null },
      });

      if (analysisError) throw new Error(analysisError.message || "خطأ في التحليل");
      if (analysisData?.error) throw new Error(analysisData.error);

      // Step 2: Generate matching images
      const { data: imageData } = await supabase.functions.invoke("generate-product-images", {
        body: {
          imageBase64: productImageBase64,
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
        productImageUrl,
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
    const file = Array.from(files).find(f => f.type.startsWith("image/"));
    if (!file) return;
    const url = URL.createObjectURL(file);
    const base64 = await fileToBase64(file);
    setPreviewUrl(url);
    setProductImage(url, base64, file);
    setCurrentView("price");
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

  // GENERATING VIEW
  if (isGenerating || currentView === "generating") {
    const imgUrl = previewUrl || productImageUrl;
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in" dir="rtl">
        <div className="max-w-lg w-full space-y-8 text-center">
          {imgUrl && (
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden border-2 border-primary/30 shadow-lg shadow-primary/20">
              <img src={imgUrl} alt="المنتج" className="w-full h-full object-cover" />
            </div>
          )}
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
    const imgUrl = previewUrl || productImageUrl;
    return (
      <div className="min-h-[80vh] flex items-center justify-center animate-fade-in" dir="rtl">
        <div className="max-w-xl w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-3">
              تم اختيار <span className="gradient-text">صورة المنتج</span>
            </h2>
            <p className="text-muted-foreground">أدخل السعر بالدينار الجزائري (اختياري) ثم ابدأ الإنشاء</p>
          </div>

          {imgUrl && (
            <div className="w-48 h-48 mx-auto rounded-2xl overflow-hidden border-2 border-primary/30 shadow-xl shadow-primary/20">
              <img src={imgUrl} alt="المنتج" className="w-full h-full object-cover" />
            </div>
          )}

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
                setPreviewUrl(null);
                setCurrentView("upload");
              }}
            >
              تغيير الصورة
            </Button>
            <Button
              className="flex-1 btn-gradient gap-2 text-lg h-14"
              onClick={handleGenerate}
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
            ارفع صورة المنتج،{" "}
            <span className="gradient-text">احصل على صفحة هبوط كاملة</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            الذكاء الاصطناعي يتعرف على منتجك، يبحث عن معلوماته، يُنشئ صوراً احترافية
            مطابقة للمنتج الأصلي، ويُجمّع صفحة هبوط جاهزة للبيع على WordPress.
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
                {isDragging ? "أسقط صورتك هنا" : "اسحب وأسقط صورة المنتج"}
              </p>
              <p className="text-muted-foreground mb-6">أو انقر للاختيار</p>
              <Button className="btn-gradient gap-2" size="lg">
                <ImageIcon className="w-5 h-5" />
                اختر صورة
              </Button>
              <p className="text-xs text-muted-foreground mt-4">PNG, JPG, WEBP • حد أقصى 20MB</p>
            </label>
          </CardContent>
        </Card>

        <div className="grid grid-cols-3 gap-4 text-center">
          {[
            { icon: "🔍", title: "تعرّف ذكي", desc: "التعرف الدقيق على المنتج الأصلي" },
            { icon: "🎨", title: "صور مطابقة", desc: "صور احترافية مطابقة للمنتج" },
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
