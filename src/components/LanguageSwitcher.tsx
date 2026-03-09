import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";

export function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();

  const toggleLang = () => {
    setLang(lang === "ar" ? "fr" : "ar");
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLang}
      className="gap-2"
    >
      <Globe className="w-4 h-4" />
      {lang === "ar" ? "🇫🇷 FR" : "🇩🇿 AR"}
    </Button>
  );
}
