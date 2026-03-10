import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eye, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { DEMO_PROJECTS, getDemoProject } from "@/lib/demoProjects";
import { TEMPLATE_STYLES } from "@/lib/templates";
import { LandingPreview } from "@/components/LandingPreview";
import { AppProvider } from "@/contexts/AppContext";
import { useLanguage } from "@/contexts/LanguageContext";
import type { LandingTemplate, GeneratedProject } from "@/types/project";

function TemplateCard({ template, label, product, price, onPreview }: {
  template: LandingTemplate;
  label: string;
  product: string;
  price: string;
  onPreview: () => void;
}) {
  const style = TEMPLATE_STYLES[template];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="group overflow-hidden border border-border hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
        {/* Preview header bar */}
        <div className={`h-32 flex items-center justify-center relative ${style.isDark ? "bg-[#12121f]" : "bg-muted/50"}`}>
          <span className={`text-3xl font-bold ${style.isDark ? "text-white/20" : "text-foreground/10"}`}>
            {label}
          </span>
          <div className="absolute top-3 right-3">
            <Badge variant={style.isDark ? "default" : "secondary"} className="text-[10px]">
              {style.isDark ? "Dark" : "Light"}
            </Badge>
          </div>
        </div>
        <CardContent className="p-5 space-y-3">
          <div>
            <h3 className="font-semibold text-lg text-foreground">{label}</h3>
            <p className="text-sm text-muted-foreground">{style.descFr}</p>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{product}</p>
              <p className="text-xs text-muted-foreground">{price}</p>
            </div>
            <Button size="sm" onClick={onPreview} className="gap-1.5">
              <Eye className="w-3.5 h-3.5" />
              Voir la démo
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function TemplatesPage() {
  const [previewProject, setPreviewProject] = useState<GeneratedProject | null>(null);
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background" dir={dir}>
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link to="/"><ArrowLeft className="w-4 h-4" /></Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
              <span className="font-bold">LandPage AI</span>
            </div>
          </div>
          <Button asChild size="sm" className="btn-gradient">
            <Link to="/login">Commencer gratuitement</Link>
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">10 Templates professionnels</Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
            Galerie de templates
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explorez nos templates avec de vrais exemples de landing pages.
            Chaque template est optimisé pour la conversion.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {DEMO_PROJECTS.map((demo) => (
            <TemplateCard
              key={demo.template}
              {...demo}
              onPreview={() => setPreviewProject(getDemoProject(demo.template))}
            />
          ))}
        </div>
      </main>

      {/* Full-screen preview modal */}
      <AnimatePresence>
        {previewProject && (
          <motion.div
            className="fixed inset-0 z-50 bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border h-14 flex items-center px-4 justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-foreground">
                  {previewProject.product.name} — Template {TEMPLATE_STYLES[previewProject.template]?.name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button asChild size="sm" variant="default">
                  <Link to="/login">Créer ma page</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setPreviewProject(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="h-[calc(100vh-3.5rem)] overflow-y-auto">
              <AppProvider>
                <LandingPreview
                  project={previewProject}
                  isPreviewMode={true}
                />
              </AppProvider>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
