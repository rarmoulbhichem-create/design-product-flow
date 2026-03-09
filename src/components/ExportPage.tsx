import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, FileCode, Globe, Copy, Check, Archive, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function ExportPage() {
  const { generatedProject, setCurrentView } = useApp();
  const [copied, setCopied] = useState(false);
  const [zipping, setZipping] = useState(false);

  if (!generatedProject) return null;

  const { product, pricing, landingPage, design, seo, productImageUrl, generatedImages } = generatedProject;

  const generateHTML = (embedImages = false, imageFiles?: Record<string, string>) => {
    const primaryColor = design?.primaryColor || "#7c3aed";
    const accentColor = design?.accentColor || "#06b6d4";
    const heroImg = imageFiles ? "images/product-main.jpg" : (productImageUrl || "images/product-main.jpg");
    const studioImg = imageFiles ? "images/product-studio.jpg" : (generatedImages?.[0]?.url || heroImg);
    const lifestyleImg = imageFiles ? "images/product-lifestyle.jpg" : (generatedImages?.[1]?.url || heroImg);
    const detailImg = imageFiles ? "images/product-detail.jpg" : (generatedImages?.[2]?.url || heroImg);

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo?.metaTitle || product.name}</title>
  <meta name="description" content="${seo?.metaDescription || product.shortDescription}">
  <meta name="keywords" content="${(seo?.keywords || []).join(', ')}">
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <!-- Hero -->
  <section class="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <span class="badge">${landingPage.hero.badge}</span>
        <h1>${landingPage.hero.headline}</h1>
        <p class="hero-sub">${landingPage.hero.subheadline}</p>
        <div class="price-block">
          <span class="price">${pricing.price.toLocaleString('ar-DZ')} د.ج</span>
          ${pricing.originalPrice > pricing.price ? `<span class="price-original">${pricing.originalPrice.toLocaleString('ar-DZ')} د.ج</span>` : ''}
          ${pricing.discountPercent > 0 ? `<span class="discount-badge">-${pricing.discountPercent}%</span>` : ''}
        </div>
        <button class="btn-primary">${landingPage.hero.ctaText}</button>
        <p class="cta-subtext">${landingPage.hero.ctaSubtext || ''}</p>
      </div>
      <div class="hero-image">
        <img src="${heroImg}" alt="${product.name}">
      </div>
    </div>
  </section>

  <!-- Trust Badges -->
  <section class="trust-section">
    <div class="container trust-grid">
      ${(landingPage.trustBadges || []).map(b => `<div class="trust-item">✓ ${b}</div>`).join('\n      ')}
    </div>
  </section>

  <!-- Benefits -->
  <section class="section">
    <div class="container">
      <h2>${product.name} - المميزات</h2>
      <div class="grid-3">
        ${(landingPage.benefits || []).map(b => `
        <div class="card">
          <div class="card-icon">${b.icon || '⭐'}</div>
          <h3>${b.title}</h3>
          <p>${b.description}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- Gallery -->
  <section class="section section-alt">
    <div class="container">
      <h2>صور المنتج</h2>
      <div class="gallery-grid">
        <div class="gallery-item gallery-main">
          <img src="${studioImg}" alt="${product.name} - صورة استوديو">
        </div>
        <div class="gallery-item">
          <img src="${lifestyleImg}" alt="${product.name} - صورة عملية">
        </div>
        <div class="gallery-item">
          <img src="${detailImg}" alt="${product.name} - تفاصيل">
        </div>
      </div>
    </div>
  </section>

  <!-- Description -->
  <section class="section">
    <div class="container">
      <h2>وصف المنتج</h2>
      <p class="description-text">${product.longDescription}</p>
      ${product.specifications?.length ? `
      <div class="specs-grid">
        ${product.specifications.map(s => `
        <div class="spec-item">
          <span class="spec-label">${s.label}</span>
          <span class="spec-value">${s.value}</span>
        </div>`).join('')}
      </div>` : ''}
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section section-alt">
    <div class="container">
      <h2>آراء العملاء</h2>
      <div class="grid-3">
        ${(landingPage.testimonials || []).map(t => `
        <div class="testimonial">
          <div class="stars">${'★'.repeat(t.rating)}${'☆'.repeat(5 - t.rating)}</div>
          <p class="testimonial-text">"${t.text}"</p>
          <div class="testimonial-author">
            <strong>${t.name}</strong>
            <span>${t.location}</span>
          </div>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <!-- FAQ -->
  <section class="section">
    <div class="container faq-container">
      <h2>الأسئلة الشائعة</h2>
      ${(landingPage.faq || []).map(f => `
      <div class="faq-item">
        <h3 class="faq-q">${f.question}</h3>
        <p class="faq-a">${f.answer}</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- Final CTA -->
  <section class="cta-section">
    <div class="container">
      <h2>${landingPage.finalCta?.headline || 'اطلب الآن'}</h2>
      <p class="cta-sub">${landingPage.finalCta?.subheadline || ''}</p>
      <div class="price-block">
        <span class="price price-lg">${pricing.price.toLocaleString('ar-DZ')} د.ج</span>
        ${pricing.originalPrice > pricing.price ? `<span class="price-original">${pricing.originalPrice.toLocaleString('ar-DZ')} د.ج</span>` : ''}
      </div>
      <button class="btn-primary btn-lg">${landingPage.finalCta?.buttonText || landingPage.hero.ctaText}</button>
      <p class="guarantee-text">${pricing.guarantee}</p>
    </div>
  </section>

  <footer>
    <p>© ${new Date().getFullYear()} ${product.brand || product.name}. جميع الحقوق محفوظة.</p>
  </footer>
</body>
</html>`;
  };

  const generateCSS = () => {
    const primaryColor = design?.primaryColor || "#7c3aed";
    const accentColor = design?.accentColor || "#06b6d4";
    return `/* Landing Page - ${product.name} */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1a1a1a; direction: rtl; line-height: 1.7; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 24px; }
img { max-width: 100%; height: auto; }

/* Hero */
.hero { padding: 80px 0; background: linear-gradient(135deg, ${primaryColor}08, ${accentColor}08); }
.hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.hero-content h1 { font-size: 2.8rem; font-weight: 800; line-height: 1.2; margin-bottom: 16px; }
.hero-sub { font-size: 1.15rem; color: #555; margin-bottom: 24px; }
.badge { display: inline-block; padding: 6px 18px; background: ${primaryColor}15; color: ${primaryColor}; border-radius: 20px; font-size: 0.85rem; font-weight: 600; margin-bottom: 16px; }
.price-block { margin: 20px 0; display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }
.price { font-size: 2.2rem; font-weight: 800; color: ${primaryColor}; }
.price-lg { font-size: 3rem; }
.price-original { text-decoration: line-through; color: #999; font-size: 1.3rem; }
.discount-badge { background: #ef4444; color: white; padding: 4px 12px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; }
.btn-primary { display: inline-block; padding: 16px 48px; background: linear-gradient(135deg, ${primaryColor}, ${accentColor}); color: white; border-radius: 12px; font-size: 1.1rem; font-weight: 700; border: none; cursor: pointer; transition: transform 0.2s, box-shadow 0.2s; box-shadow: 0 4px 20px ${primaryColor}40; }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 30px ${primaryColor}50; }
.btn-lg { padding: 20px 60px; font-size: 1.25rem; }
.cta-subtext { margin-top: 12px; font-size: 0.85rem; color: #999; }
.hero-image img { border-radius: 20px; box-shadow: 0 20px 60px ${primaryColor}15; }

/* Trust */
.trust-section { padding: 20px 0; background: ${primaryColor}08; }
.trust-grid { display: flex; justify-content: center; gap: 32px; flex-wrap: wrap; }
.trust-item { font-weight: 600; font-size: 0.9rem; color: #555; }

/* Sections */
.section { padding: 70px 0; }
.section-alt { background: #f8f9fa; }
h2 { font-size: 2rem; font-weight: 700; margin-bottom: 40px; text-align: center; }

/* Grid */
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; }

/* Cards */
.card { padding: 32px 24px; border: 1px solid #e8e8e8; border-radius: 16px; text-align: center; background: white; transition: transform 0.2s, box-shadow 0.2s; }
.card:hover { transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,0,0,0.08); }
.card-icon { font-size: 2rem; margin-bottom: 12px; }
.card h3 { font-weight: 700; margin-bottom: 8px; }
.card p { color: #666; font-size: 0.95rem; }

/* Gallery */
.gallery-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.gallery-main { grid-row: span 2; }
.gallery-item img { width: 100%; height: 100%; object-fit: cover; border-radius: 16px; }

/* Description */
.description-text { max-width: 800px; margin: 0 auto 40px; color: #555; line-height: 1.9; text-align: center; font-size: 1.05rem; }
.specs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; max-width: 800px; margin: 0 auto; }
.spec-item { display: flex; justify-content: space-between; padding: 12px 16px; background: #f5f5f5; border-radius: 10px; }
.spec-label { color: #888; }
.spec-value { font-weight: 600; }

/* Testimonials */
.testimonial { padding: 28px; border: 1px solid #e8e8e8; border-radius: 16px; background: white; }
.stars { color: #f59e0b; font-size: 1.1rem; margin-bottom: 12px; }
.testimonial-text { color: #555; font-size: 0.95rem; margin-bottom: 16px; line-height: 1.7; }
.testimonial-author strong { display: block; }
.testimonial-author span { color: #888; font-size: 0.85rem; }

/* FAQ */
.faq-container { max-width: 800px; }
.faq-item { border-bottom: 1px solid #e8e8e8; padding: 20px 0; }
.faq-q { font-weight: 700; margin-bottom: 8px; font-size: 1.05rem; }
.faq-a { color: #666; line-height: 1.7; }

/* CTA */
.cta-section { padding: 80px 0; text-align: center; background: linear-gradient(135deg, ${primaryColor}05, ${accentColor}08); }
.cta-sub { color: #666; margin-bottom: 24px; max-width: 600px; margin-left: auto; margin-right: auto; }
.guarantee-text { margin-top: 20px; font-size: 0.85rem; color: #999; }

/* Footer */
footer { padding: 24px; text-align: center; border-top: 1px solid #e8e8e8; }
footer p { color: #999; font-size: 0.85rem; }

/* Responsive */
@media (max-width: 768px) {
  .hero-grid { grid-template-columns: 1fr; text-align: center; }
  .hero-content h1 { font-size: 2rem; }
  .price-block { justify-content: center; }
  .gallery-grid { grid-template-columns: 1fr; }
  .gallery-main { grid-row: span 1; }
  .trust-grid { gap: 16px; }
}`;
  };

  const generateReadme = () => {
    return `# ${product.name} - صفحة الهبوط

## الملفات
- \`index.html\` - صفحة الهبوط الرئيسية
- \`style.css\` - ملف التنسيقات
- \`images/\` - مجلد الصور

## كيفية الرفع على WordPress

### الطريقة 1: صفحة HTML مخصصة
1. ارفع مجلد \`images\` إلى مكتبة الوسائط في WordPress
2. أنشئ صفحة جديدة
3. أضف كتلة "HTML مخصص"
4. الصق محتوى \`index.html\`
5. حدّث روابط الصور

### الطريقة 2: باستخدام Elementor
1. أنشئ صفحة جديدة بـ Elementor
2. أضف عنصر HTML
3. الصق الكود
4. ارفع الصور واستبدل الروابط

### الطريقة 3: رفع مباشر عبر FTP
1. ارفع كل الملفات إلى مجلد على سيرفرك
2. اربط الصفحة من القائمة الرئيسية

## SEO
- **العنوان:** ${seo?.metaTitle}
- **الوصف:** ${seo?.metaDescription}
- **الكلمات المفتاحية:** ${(seo?.keywords || []).join(', ')}
`;
  };

  const fetchImageAsBlob = async (url: string): Promise<Blob | null> => {
    try {
      const response = await fetch(url);
      if (!response.ok) return null;
      return await response.blob();
    } catch {
      return null;
    }
  };

  const handleDownloadZip = async () => {
    setZipping(true);
    try {
      const zip = new JSZip();
      const imgFolder = zip.folder("images");

      // Generate HTML & CSS
      zip.file("index.html", generateHTML(false, { local: "true" }));
      zip.file("style.css", generateCSS());
      zip.file("README.md", generateReadme());

      // Download and add images
      const imageUrls = [
        { url: productImageUrl, name: "product-main.jpg" },
        { url: generatedImages?.[0]?.url, name: "product-studio.jpg" },
        { url: generatedImages?.[1]?.url, name: "product-lifestyle.jpg" },
        { url: generatedImages?.[2]?.url, name: "product-detail.jpg" },
      ];

      await Promise.all(
        imageUrls.map(async ({ url, name }) => {
          if (url && imgFolder) {
            const blob = await fetchImageAsBlob(url);
            if (blob) imgFolder.file(name, blob);
          }
        })
      );

      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${product.name.replace(/\s+/g, "-").toLowerCase()}-landing-page.zip`);
      toast.success("تم تحميل ملف ZIP بنجاح!");
    } catch (err) {
      console.error(err);
      toast.error("حدث خطأ أثناء إنشاء الملف");
    } finally {
      setZipping(false);
    }
  };

  const handleCopyHTML = () => {
    const fullHTML = generateHTML().replace('<link rel="stylesheet" href="style.css">', `<style>\n${generateCSS()}\n</style>`);
    navigator.clipboard.writeText(fullHTML);
    setCopied(true);
    toast.success("تم نسخ HTML في الحافظة!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen animate-fade-in" dir="rtl">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView("preview")}>
          <ArrowLeft className="w-4 h-4 ml-1 rotate-180" /> العودة للمعاينة
        </Button>
        <h2 className="font-semibold">تصدير WordPress</h2>
        <div />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">صدّر صفحة الهبوط</h1>
          <p className="text-muted-foreground">
            حمّل ملف ZIP كامل يحتوي على HTML + CSS + صور جاهز للرفع على WordPress
          </p>
        </div>

        {/* Main ZIP Export */}
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-20 h-20 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <Archive className="w-10 h-10 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">تحميل ملف ZIP الكامل</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              يحتوي على index.html + style.css + مجلد الصور + دليل التثبيت على WordPress
            </p>
            <div className="flex flex-wrap gap-3 justify-center text-xs text-muted-foreground">
              <span className="bg-muted px-3 py-1 rounded-full">📄 index.html</span>
              <span className="bg-muted px-3 py-1 rounded-full">🎨 style.css</span>
              <span className="bg-muted px-3 py-1 rounded-full">🖼️ images/</span>
              <span className="bg-muted px-3 py-1 rounded-full">📖 README.md</span>
            </div>
            <Button
              size="lg"
              className="btn-gradient text-lg px-12"
              onClick={handleDownloadZip}
              disabled={zipping}
            >
              {zipping ? (
                <><Loader2 className="w-5 h-5 ml-2 animate-spin" /> جاري التحضير...</>
              ) : (
                <><Download className="w-5 h-5 ml-2" /> تحميل ZIP</>
              )}
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={handleCopyHTML}>
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center">
                {copied ? <Check className="w-7 h-7 text-accent" /> : <Copy className="w-7 h-7 text-accent" />}
              </div>
              <h3 className="text-lg font-bold">نسخ HTML كامل</h3>
              <p className="text-sm text-muted-foreground">
                HTML + CSS مدمج في ملف واحد للصق في Elementor أو كتلة HTML
              </p>
              <Button variant="outline" className="w-full">
                {copied ? "✓ تم النسخ" : "نسخ HTML"}
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all">
            <CardContent className="p-6 text-center space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <FileCode className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-bold">معلومات SEO</h3>
              <div className="text-sm text-right space-y-2">
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">العنوان</span>
                  <span className="font-medium max-w-[60%] text-left truncate">{seo?.metaTitle}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-border">
                  <span className="text-muted-foreground">الوصف</span>
                  <span className="font-medium max-w-[60%] text-left text-xs">{seo?.metaDescription}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">الكلمات</span>
                  <span className="font-medium max-w-[60%] text-left text-xs">{seo?.keywords?.join("، ")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* WordPress Guide */}
        <Card className="bg-secondary/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              دليل الرفع على WordPress
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              {[
                "حمّل ملف ZIP وفك ضغطه",
                "ارفع مجلد images/ إلى مكتبة الوسائط في WordPress",
                "أنشئ صفحة جديدة واختر 'محرر النصوص' أو أضف كتلة 'HTML مخصص'",
                "الصق محتوى index.html مع تضمين style.css",
                "حدّث روابط الصور لتشير إلى مكتبة الوسائط",
                "انشر الصفحة! 🚀",
              ].map((step, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <span className="font-bold text-primary min-w-[24px]">{i + 1}.</span>
                  <p>{step}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
