import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWizard } from "@/contexts/WizardContext";

interface WizardNavigationProps {
  onComplete?: () => void;
}

export function WizardNavigation({ onComplete }: WizardNavigationProps) {
  const { currentStep, prevStep, nextStep, canProceed, isGenerating } = useWizard();

  const isFirstStep = currentStep === 1;
  const isLastStep = currentStep === 7;

  const handleNext = () => {
    if (isLastStep && onComplete) {
      onComplete();
    } else {
      nextStep();
    }
  };

  return (
    <div className="flex items-center justify-between pt-6 border-t border-border">
      <Button
        variant="outline"
        onClick={prevStep}
        disabled={isFirstStep || isGenerating}
        className="gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Précédent
      </Button>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Étape {currentStep} sur 7
      </div>

      <Button
        onClick={handleNext}
        disabled={!canProceed || isGenerating}
        className="gap-2 btn-gradient"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Génération...
          </>
        ) : isLastStep ? (
          "Exporter"
        ) : (
          <>
            Suivant
            <ChevronRight className="w-4 h-4" />
          </>
        )}
      </Button>
    </div>
  );
}
