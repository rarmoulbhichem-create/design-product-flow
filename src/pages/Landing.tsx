import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Package, Image, FileCode, Check, LogIn, Star, MessageCircle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useAuth } from "@/hooks/useAuth";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};
const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export default function LandingPage() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();

  return (
    <div className="min-h-screen" dir={dir}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">LandPage AI</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            {!user ? (
              <Button asChild variant="outline" size="sm" className="gap-2">
                <Link to="/login">
                  <LogIn className="w-4 h-4" />
                  {dir === "rtl" ? "تسجيل الدخول" : "Connexion"}
                </Link>
              </Button>
            ) : (
              <Button asChild size="sm" className="btn-gradient">
                <Link to="/dashboard">
                  {dir === "rtl" ? "لوحة التحكم" : "Dashboard"}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-background to-accent/5" />
          <motion.div
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]"
            animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/15 rounded-full blur-[100px]"
            animate={{ x: [0, -20, 0], y: [0, 30, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div
          className="relative container mx-auto px-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <div className="max-w-4xl mx-auto text-center">
            <motion.div variants={item}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm mb-8">
                <Sparkles className="w-4 h-4 text-primary" />
                <span>{t.generatedByAI}</span>
              </div>
            </motion.div>

            <motion.h1 variants={item} className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-[1.1]">
              {t.createLandingPages}{" "}
              <span className="gradient-text">{t.fromYourPhotos}</span>
            </motion.h1>

            <motion.p variants={item} className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              {t.heroSubtitle}
            </motion.p>

            <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-gradient gap-2 text-lg h-14 px-8 animate-pulse-glow">
                <Link to="/new">
                  {t.startFree}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg h-14 px-8">
                <Link to="/templates">{t.seeExamples}</Link>
              </Button>
            </motion.div>

            <motion.p variants={item} className="mt-8 text-sm text-muted-foreground">
              {t.freePlanNote}
            </motion.p>
          </div>
        </motion.div>

        {/* Floating mockup preview */}
        <motion.div
          className="relative container mx-auto px-4 mt-16"
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8, ease: "easeOut" }}
        >
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-2 shadow-2xl shadow-primary/5">
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-border/50 mb-2">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-muted-foreground mx-auto font-mono">landpage-ai.dz</span>
              </div>
              <div className="rounded-xl bg-gradient-to-br from-muted/30 to-muted/10 p-8 md:p-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4" dir="rtl">
                    <div className="inline-block px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-semibold">
                      تخفيض -40%
                    </div>
                    <h3 className="text-2xl font-bold">سماعات بلوتوث Pro Max</h3>
                    <p className="text-sm text-muted-foreground">صوت استثنائي مع إلغاء الضوضاء النشط وبطارية تدوم 36 ساعة</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">7,999 دج</span>
                      <span className="text-muted-foreground line-through text-sm">12,999 دج</span>
                    </div>
                    <div className="flex gap-2">
                      <div className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-bold">اطلب الآن</div>
                      <div className="px-4 py-2 rounded-lg bg-[#25D366] text-white text-sm font-bold flex items-center gap-1">
                        <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
                      </div>
                    </div>
                  </div>
                  <div className="aspect-square rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-border/50 flex items-center justify-center">
                    <Image className="w-16 h-16 text-muted-foreground/30" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-24 border-t border-border/50">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.howItWorks}</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                {t.simpleProcess}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Image, title: t.step1Title, description: t.step1Desc },
              { icon: Sparkles, title: t.step2Title, description: t.step2Desc },
              { icon: Package, title: t.step3Title, description: t.step3Desc },
              { icon: FileCode, title: t.step4Title, description: t.step4Desc },
            ].map((feature, i) => (
              <ScrollReveal key={feature.title} delay={i * 0.1}>
                <div className="text-center p-8 rounded-2xl bg-card border border-border hover:border-primary/50 transition-all hover:shadow-lg hover:shadow-primary/5 group">
                  <div className="w-14 h-14 mx-auto mb-5 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <ScrollReveal>
        <section className="py-16 bg-card/30 border-y border-border/50">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-12 md:gap-20">
              <div className="text-center">
                <p className="text-4xl font-bold gradient-text">10+</p>
                <p className="text-sm text-muted-foreground mt-1">{dir === "rtl" ? "قوالب احترافية" : "Templates pro"}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold gradient-text">3</p>
                <p className="text-sm text-muted-foreground mt-1">{dir === "rtl" ? "صور AI لكل منتج" : "Images IA/produit"}</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold gradient-text">&lt;2min</p>
                <p className="text-sm text-muted-foreground mt-1">{dir === "rtl" ? "وقت الإنشاء" : "Temps de génération"}</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-1 justify-center">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{dir === "rtl" ? "تقييم المستخدمين" : "Note utilisateurs"}</p>
              </div>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Pricing Preview */}
      <section id="pricing" className="py-24">
        <div className="container mx-auto px-4">
          <ScrollReveal>
            <div className="text-center mb-6">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.simplePricing}</h2>
              <p className="text-muted-foreground text-lg">{t.startFreeScale}</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3 mb-14">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-sm font-medium">
                ✨ {t.freeTrial}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                🎁 {t.annualDiscount}
              </span>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <ScrollReveal delay={0}>
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all h-full">
                <h3 className="text-xl font-bold mb-2">{t.starter}</h3>
                <p className="text-3xl font-bold mb-6">
                  {t.starterPrice}<span className="text-lg text-muted-foreground">{t.month}</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {[t.starterFeature1, t.starterFeature2, t.starterFeature3, t.starterFeature4].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/new">{t.startTrial}</Link>
                </Button>
              </div>
            </ScrollReveal>

            {/* Pro */}
            <ScrollReveal delay={0.1}>
              <div className="p-8 rounded-2xl gradient-border bg-card relative h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">
                  {t.popular}
                </div>
                <h3 className="text-xl font-bold mb-2">{t.pro}</h3>
                <p className="text-3xl font-bold mb-6">
                  {t.proPrice}<span className="text-lg text-muted-foreground">{t.month}</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {[t.proFeature1, t.proFeature2, t.proFeature3, t.proFeature4, t.proFeature5].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button className="w-full btn-gradient" asChild>
                  <Link to="/upgrade">{t.goToPro}</Link>
                </Button>
              </div>
            </ScrollReveal>

            {/* Enterprise */}
            <ScrollReveal delay={0.2}>
              <div className="p-8 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all h-full">
                <h3 className="text-xl font-bold mb-2">{t.enterprise}</h3>
                <p className="text-2xl font-bold mb-6">{t.enterprisePrice}</p>
                <ul className="space-y-3 mb-8">
                  {[t.enterpriseFeature1, t.enterpriseFeature2, t.enterpriseFeature3, t.enterpriseFeature4, t.enterpriseFeature5].map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/contact">{t.contactUs}</Link>
                </Button>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <ScrollReveal>
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative container mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">{t.readyToCreate}</h2>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-lg">
              {t.joinCreators}
            </p>
            <Button asChild size="lg" className="btn-gradient gap-2 text-lg h-14 px-10 animate-pulse-glow">
              <Link to="/new">
                <Zap className="w-5 h-5" />
                {t.createMyFirstPage}
              </Link>
            </Button>
          </div>
        </section>
      </ScrollReveal>

      {/* Footer */}
      <footer className="border-t border-border/50 py-10">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-bold">LandPage AI</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">{t.legalNotice}</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">{t.privacy}</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">{t.contact}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
