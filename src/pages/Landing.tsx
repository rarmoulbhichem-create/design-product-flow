import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight, Zap, Package, Image, FileCode, Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function LandingPage() {
  const { t, dir } = useLanguage();

  return (
    <div className="min-h-screen" dir={dir}>
      {/* Language switcher in header */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/5" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

        <div className="relative container mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>{t.generatedByAI}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              {t.createLandingPages}{" "}
              <span className="gradient-text">{t.fromYourPhotos}</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {t.heroSubtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="btn-gradient gap-2 text-lg">
                <Link to="/new">
                  {t.startFree}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg">
                <Link to="/templates">{t.seeExamples}</Link>
              </Button>
            </div>

            {/* Social proof */}
            <p className="mt-8 text-sm text-muted-foreground">
              {t.freePlanNote}
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.howItWorks}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {t.simpleProcess}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Image,
                title: t.step1Title,
                description: t.step1Desc,
              },
              {
                icon: Sparkles,
                title: t.step2Title,
                description: t.step2Desc,
              },
              {
                icon: Package,
                title: t.step3Title,
                description: t.step3Desc,
              },
              {
                icon: FileCode,
                title: t.step4Title,
                description: t.step4Desc,
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="text-center p-6 rounded-xl bg-card border border-border hover:border-primary/50 transition-all"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">{t.simplePricing}</h2>
            <p className="text-muted-foreground">{t.startFreeScale}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="p-8 rounded-xl bg-card border border-border">
              <h3 className="text-xl font-bold mb-2">{t.free}</h3>
              <p className="text-3xl font-bold mb-4">{t.freePrice}</p>
              <ul className="space-y-3 mb-8">
                {[t.oneLandingMonth, t.tenAiImages, t.zipExport, t.communitySupport].map(
                  (feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500" />
                      {feature}
                    </li>
                  )
                )}
              </ul>
              <Button variant="outline" className="w-full" asChild>
                <Link to="/new">{t.start}</Link>
              </Button>
            </div>

            {/* Pro Plan */}
            <div className="p-8 rounded-xl gradient-border bg-card relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-primary text-primary-foreground text-xs rounded-full">
                {t.popular}
              </div>
              <h3 className="text-xl font-bold mb-2">{t.pro}</h3>
              <p className="text-3xl font-bold mb-4">
                {t.proPrice}<span className="text-lg text-muted-foreground">{t.month}</span>
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  t.unlimitedLandings,
                  t.fiveHundredImagesMonth,
                  t.wordpressExportFeature,
                  t.premiumStyles,
                  t.prioritySupport,
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button className="w-full btn-gradient" asChild>
                <Link to="/new">{t.goToPro}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">{t.readyToCreate}</h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            {t.joinCreators}
          </p>
          <Button asChild size="lg" className="btn-gradient gap-2">
            <Link to="/new">
              <Zap className="w-5 h-5" />
              {t.createMyFirstPage}
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            <span className="font-bold">LandPage AI</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/terms" className="hover:text-foreground transition-colors">
              {t.legalNotice}
            </Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              {t.privacy}
            </Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">
              {t.contact}
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
