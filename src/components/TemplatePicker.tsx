import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Palette, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { TEMPLATE_LIST, type TemplateStyle } from "@/lib/templates";
import type { LandingTemplate, LandingLanguage } from "@/types/project";

interface TemplatePickerProps {
  current: LandingTemplate;
  onSelect: (id: LandingTemplate) => void;
  lang: "ar" | "fr";
}

function TemplateThumbnail({ style, active }: { style: TemplateStyle; active: boolean }) {
  const bg = style.isDark ? "bg-[#0c0c14]" : "bg-[#fafaf8]";
  const fg = style.isDark ? "bg-white/70" : "bg-gray-800/60";
  const fgLight = style.isDark ? "bg-white/30" : "bg-gray-400/40";
  const accent = style.overrideColors?.primary || "#7c3aed";

  return (
    <div
      className={cn(
        "w-full aspect-[4/3] rounded-lg border-2 overflow-hidden relative transition-all",
        active ? "border-primary shadow-md ring-2 ring-primary/30" : "border-border hover:border-primary/40",
        bg
      )}
    >
      {/* Mini hero area */}
      {style.heroLayout === "split" ? (
        <div className="flex h-[55%] p-1.5 gap-1">
          <div className="flex-1 flex flex-col justify-center gap-1 px-1">
            <div className={cn("h-1.5 w-10 rounded-full", fgLight)} />
            <div className={cn("h-2 w-full rounded-full", fg)} />
            <div className={cn("h-2 w-3/4 rounded-full", fg)} />
            <div
              className="h-2.5 w-8 rounded-sm mt-1"
              style={{ backgroundColor: accent }}
            />
          </div>
          <div
            className={cn("w-[40%] rounded-md", style.isDark ? "bg-white/10" : "bg-gray-200")}
          />
        </div>
      ) : style.heroLayout === "fullwidth" ? (
        <div className="h-[55%] relative">
          <div className={cn("w-full h-full", style.isDark ? "bg-white/10" : "bg-gray-200")} />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center space-y-1">
              <div className={cn("h-2 w-14 rounded-full mx-auto", fg)} />
              <div className={cn("h-1.5 w-10 rounded-full mx-auto", fgLight)} />
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[55%] flex flex-col items-center justify-center gap-1 px-2">
          <div className={cn("h-1.5 w-8 rounded-full", fgLight)} />
          <div className={cn("h-2 w-16 rounded-full", fg)} />
          <div className={cn("h-1.5 w-12 rounded-full", fgLight)} />
          <div
            className="h-2.5 w-10 rounded-sm mt-1"
            style={{ backgroundColor: accent }}
          />
        </div>
      )}

      {/* Mini feature cards */}
      <div className="px-1.5 pb-1.5 flex gap-1 h-[30%]">
        {[0, 1, 2].map(i => (
          <div
            key={i}
            className={cn(
              "flex-1 rounded-sm p-1 flex flex-col gap-0.5",
              style.isDark ? "bg-white/5 border border-white/10" : "bg-white border border-gray-200",
              style.glassmorphism && "backdrop-blur"
            )}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: accent, opacity: 0.6 }} />
            <div className={cn("h-1 w-full rounded-full", fgLight)} />
            <div className={cn("h-1 w-2/3 rounded-full", fgLight)} />
          </div>
        ))}
      </div>

      {/* Neon / glow effects */}
      {style.glowEffect && (
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            background: `radial-gradient(circle at 50% 30%, ${accent}, transparent 60%)`,
          }}
        />
      )}

      {/* Active check */}
      {active && (
        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
          <Check className="w-2.5 h-2.5 text-primary-foreground" />
        </div>
      )}
    </div>
  );
}

export function TemplatePicker({ current, onSelect, lang }: TemplatePickerProps) {
  const [open, setOpen] = useState(false);
  const currentStyle = TEMPLATE_LIST.find(t => t.id === current);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2 text-xs">
          <Palette className="w-3.5 h-3.5" />
          {currentStyle ? (lang === "fr" ? currentStyle.name : currentStyle.nameAr) : "Template"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[420px] p-3" align="start" sideOffset={8}>
        <p className="text-xs font-medium text-muted-foreground mb-2">
          {lang === "fr" ? "Choisir un template" : "اختر قالبًا"}
        </p>
        <ScrollArea className="max-h-[400px]">
          <div className="grid grid-cols-3 gap-2">
            {TEMPLATE_LIST.map(style => (
              <button
                key={style.id}
                onClick={() => {
                  onSelect(style.id);
                  setOpen(false);
                }}
                className="text-left group focus:outline-none"
              >
                <TemplateThumbnail style={style} active={current === style.id} />
                <p className={cn(
                  "text-[10px] mt-1 text-center truncate transition-colors",
                  current === style.id ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
                )}>
                  {lang === "fr" ? style.name : style.nameAr}
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
