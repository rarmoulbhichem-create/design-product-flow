import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { WizardStep } from "@/types/project";

interface StepIndicatorProps {
  steps: WizardStep[];
  onStepClick?: (stepId: number) => void;
}

export function StepIndicator({ steps, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            {/* Step circle */}
            <button
              onClick={() => onStepClick?.(step.id)}
              disabled={!step.isCompleted && !step.isActive}
              className={cn(
                "relative flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all duration-300",
                step.isActive && "btn-gradient animate-pulse-glow",
                step.isCompleted && "bg-primary text-primary-foreground",
                !step.isActive && !step.isCompleted && "bg-muted text-muted-foreground",
                (step.isCompleted || step.isActive) && "cursor-pointer hover:scale-105",
                !step.isCompleted && !step.isActive && "cursor-not-allowed"
              )}
            >
              {step.isCompleted ? (
                <Check className="w-5 h-5" />
              ) : (
                step.id
              )}
            </button>

            {/* Step info */}
            <div className="hidden sm:block ml-3 mr-4">
              <p
                className={cn(
                  "text-sm font-medium transition-colors",
                  step.isActive && "text-foreground",
                  step.isCompleted && "text-primary",
                  !step.isActive && !step.isCompleted && "text-muted-foreground"
                )}
              >
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground">{step.description}</p>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-[2px] mx-2 sm:mx-0">
                <div
                  className={cn(
                    "h-full transition-all duration-500",
                    step.isCompleted
                      ? "bg-primary"
                      : "bg-muted"
                  )}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
