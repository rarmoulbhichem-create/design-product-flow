import { useApp } from "@/contexts/AppContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Download, FileCode, Globe, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function ExportPage() {
  const { generatedProject, setCurrentView } = useApp();
  const [copied, setCopied] = useState(false);

  if (!generatedProject) return null;

  const { product, pricing, landingPage, design, seo } = generatedProject;

  const generateHTML = () => {
    const primaryColor = design?.primaryColor || "#7c3aed";
    return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${seo?.metaTitle || product.name}</title>
  <meta name="description" content="${seo?.metaDescription || product.shortDescription}">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: system-ui, -apple-system, sans-serif; color: #1a1a1a; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .hero { padding: 80px 0; background: linear-gradient(135deg, ${primaryColor}10, ${design?.accentColor || '#06b6d4'}10); }
    .hero h1 { font-size: 3rem; font-weight: 800; margin-bottom: 1rem; }
    .hero p { font-size: 1.25rem; color: #666; max-width: 600px; }
    .btn-primary { display: inline-block; padding: 16px 40px; background: ${primaryColor}; color: white; border-radius: 12px; font-size: 1.1rem; font-weight: 600; text-decoration: none; border: none; cursor: pointer; }
    .price { font-size: 2.5rem; font-weight: 800; color: ${primaryColor}; }
    .price-original { text-decoration: line-through; color: #999; font-size: 1.5rem; }
    .section { padding: 60px 0; }
    .section-alt { background: #f9f9f9; }
    .grid-4 { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 24px; }
    .card { padding: 24px; border: 1px solid #e5e5e5; border-radius: 12px; }
    .testimonial { padding: 20px; border: 1px solid #e5e5e5; border-radius: 12px; }
    .faq-item { border-bottom: 1px solid #e5e5e5; padding: 16px 0; }
    .faq-q { font-weight: 600; margin-bottom: 8px; }
    .faq-a { color: #666; }
    h2 { font-size: 2rem; font-weight: 700; margin-bottom: 2rem; text-align: center; }
    .text-center { text-align: center; }
    .cta-section { padding: 80px 0; text-align: center; }
  </style>
</head>
<body>
  <section class="hero">
    <div class="container" style="display:flex;align-items:center;gap:40px;flex-wrap:wrap">
      <div style="flex:1;min-width:300px">
        <span style="display:inline-block;padding:4px 16px;background:${primaryColor}20;color:${primaryColor};border-radius:20px;font-size:0.9rem;margin-bottom:16px">${landingPage.hero.badge}</span>
        <h1>${landingPage.hero.headline}</h1>
        <p>${landingPage.hero.subheadline}</p>
        <div style="margin-top:24px">
          <span class="price">${pricing.price}€</span>
          ${pricing.originalPrice > pricing.price ? `<span class="price-original" style="margin-left:12px">${pricing.originalPrice}€</span>` : ''}
        </div>
        <div style="margin-top:24px">
          <button class="btn-primary">${landingPage.hero.ctaText}</button>
        </div>
        <p style="margin-top:12px;font-size:0.85rem;color:#999">${landingPage.hero.ctaSubtext || ''}</p>
      </div>
      <div style="flex:1;min-width:300px;text-align:center">
        <img src="product.jpg" alt="${product.name}" style="max-width:100%;border-radius:16px;box-shadow:0 20px 60px ${primaryColor}20">
      </div>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2>Pourquoi choisir ${product.name} ?</h2>
      <div class="grid-4">
        ${(landingPage.benefits || []).map(b => `
        <div class="card text-center">
          <h3 style="font-weight:600;margin-bottom:8px">${b.title}</h3>
          <p style="color:#666;font-size:0.9rem">${b.description}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container">
      <h2>Description</h2>
      <p style="max-width:800px;margin:0 auto;color:#666;line-height:1.8">${product.longDescription}</p>
    </div>
  </section>

  <section class="section">
    <div class="container">
      <h2>Avis clients</h2>
      <div class="grid-4">
        ${(landingPage.testimonials || []).map(t => `
        <div class="testimonial">
          <div style="margin-bottom:8px">${'★'.repeat(t.rating)}${'☆'.repeat(5-t.rating)}</div>
          <p style="font-size:0.9rem;margin-bottom:12px">${t.text}</p>
          <p style="font-weight:600;font-size:0.85rem">${t.name} - ${t.location}</p>
        </div>`).join('')}
      </div>
    </div>
  </section>

  <section class="section section-alt">
    <div class="container" style="max-width:800px">
      <h2>Questions fréquentes</h2>
      ${(landingPage.faq || []).map(f => `
      <div class="faq-item">
        <p class="faq-q">${f.question}</p>
        <p class="faq-a">${f.answer}</p>
      </div>`).join('')}
    </div>
  </section>

  <section class="cta-section" style="background:linear-gradient(135deg,${primaryColor}05,${design?.accentColor || '#06b6d4'}05)">
    <div class="container">
      <h2>${landingPage.finalCta?.headline || 'Commandez maintenant'}</h2>
      <p style="color:#666;margin-bottom:24px;max-width:600px;margin-left:auto;margin-right:auto">${landingPage.finalCta?.subheadline || ''}</p>
      <span class="price">${pricing.price}€</span>
      <div style="margin-top:24px">
        <button class="btn-primary">${landingPage.finalCta?.buttonText || landingPage.hero.ctaText}</button>
      </div>
      <p style="margin-top:16px;font-size:0.85rem;color:#999">${pricing.guarantee}</p>
    </div>
  </section>

  <footer style="padding:24px;text-align:center;border-top:1px solid #e5e5e5">
    <p style="color:#999;font-size:0.85rem">© 2024 ${product.brand || product.name}. Tous droits réservés.</p>
  </footer>
</body>
</html>`;
  };

  const handleDownloadHTML = () => {
    const html = generateHTML();
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${product.name.replace(/\s+/g, "-").toLowerCase()}-landing-page.html`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("HTML téléchargé !");
  };

  const handleCopyHTML = () => {
    navigator.clipboard.writeText(generateHTML());
    setCopied(true);
    toast.success("HTML copié dans le presse-papiers !");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen animate-fade-in">
      <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border px-4 py-3 flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setCurrentView("preview")}>
          <ArrowLeft className="w-4 h-4 mr-1" /> Retour au preview
        </Button>
        <h2 className="font-semibold">Export WordPress</h2>
        <div />
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold">Exportez votre landing page</h1>
          <p className="text-muted-foreground">
            Téléchargez le code HTML prêt à intégrer dans votre site WordPress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={handleDownloadHTML}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
                <Download className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Télécharger HTML</h3>
              <p className="text-sm text-muted-foreground">
                Fichier HTML autonome avec CSS intégré, prêt à être importé dans WordPress
              </p>
              <Button className="btn-gradient w-full">Télécharger .html</Button>
            </CardContent>
          </Card>

          <Card className="hover:border-primary/50 transition-all cursor-pointer" onClick={handleCopyHTML}>
            <CardContent className="p-8 text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-accent/10 flex items-center justify-center">
                {copied ? <Check className="w-8 h-8 text-accent" /> : <Copy className="w-8 h-8 text-accent" />}
              </div>
              <h3 className="text-xl font-bold">Copier le code</h3>
              <p className="text-sm text-muted-foreground">
                Copiez le HTML et collez-le directement dans un bloc HTML WordPress ou Elementor
              </p>
              <Button variant="outline" className="w-full">
                {copied ? "Copié !" : "Copier le HTML"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-secondary/50">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Guide d'intégration WordPress
            </h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex gap-3">
                <span className="font-bold text-primary">1.</span>
                <p>Téléchargez le fichier HTML ou copiez le code</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">2.</span>
                <p>Dans WordPress, créez une nouvelle page</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">3.</span>
                <p>Ajoutez un bloc "HTML personnalisé" et collez le code</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">4.</span>
                <p>Remplacez "product.jpg" par l'URL de votre image produit</p>
              </div>
              <div className="flex gap-3">
                <span className="font-bold text-primary">5.</span>
                <p>Publiez ! Votre landing page est en ligne 🚀</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SEO Info */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              Informations SEO générées
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Meta Title</span>
                <span className="font-medium max-w-[60%] text-right">{seo?.metaTitle}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Meta Description</span>
                <span className="font-medium max-w-[60%] text-right">{seo?.metaDescription}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Mots-clés</span>
                <span className="font-medium max-w-[60%] text-right">{seo?.keywords?.join(", ")}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
