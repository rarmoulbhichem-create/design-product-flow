import { WizardProvider, useWizard } from "@/contexts/WizardContext";
import { StepIndicator } from "./StepIndicator";
import { WizardNavigation } from "./WizardNavigation";
import { Step1ProjectInfo } from "./steps/Step1ProjectInfo";
import { Step2PhotoUpload } from "./steps/Step2PhotoUpload";
import { Step3VisualStyle } from "./steps/Step3VisualStyle";
import { Step4BrandIdentity } from "./steps/Step4BrandIdentity";
import { Step5AIGeneration } from "./steps/Step5AIGeneration";
import { Step6Assembly } from "./steps/Step6Assembly";
import { Step7Export } from "./steps/Step7Export";

function WizardContent() {
  const { currentStep, steps, goToStep } = useWizard();

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1ProjectInfo />;
      case 2:
        return <Step2PhotoUpload />;
      case 3:
        return <Step3VisualStyle />;
      case 4:
        return <Step4BrandIdentity />;
      case 5:
        return <Step5AIGeneration />;
      case 6:
        return <Step6Assembly />;
      case 7:
        return <Step7Export />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <StepIndicator
        steps={steps}
        onStepClick={(stepId) => {
          // Only allow clicking on completed steps or the current step
          const clickedStep = steps.find((s) => s.id === stepId);
          if (clickedStep?.isCompleted || clickedStep?.isActive) {
            goToStep(stepId);
          }
        }}
      />

      {/* Step Content */}
      <div className="mt-8 mb-8 min-h-[400px]">{renderStep()}</div>

      {/* Navigation */}
      <WizardNavigation />
    </div>
  );
}

export function Wizard() {
  return (
    <WizardProvider>
      <WizardContent />
    </WizardProvider>
  );
}

export default Wizard;
