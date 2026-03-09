import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import {
  ProjectInfo,
  ProjectImages,
  VisualStyleConfig,
  BrandIdentity,
  LandingSection,
  LandingPageContent,
  WizardStep,
} from "@/types/project";

interface WizardState {
  currentStep: number;
  projectInfo: Partial<ProjectInfo>;
  images: ProjectImages;
  visualStyle: Partial<VisualStyleConfig>;
  brandIdentity: Partial<BrandIdentity>;
  sections: LandingSection[];
  content: Partial<LandingPageContent>;
  isGenerating: boolean;
}

interface WizardContextType extends WizardState {
  steps: WizardStep[];
  goToStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateProjectInfo: (info: Partial<ProjectInfo>) => void;
  updateImages: (images: Partial<ProjectImages>) => void;
  updateVisualStyle: (style: Partial<VisualStyleConfig>) => void;
  updateBrandIdentity: (brand: Partial<BrandIdentity>) => void;
  updateSections: (sections: LandingSection[]) => void;
  updateContent: (content: Partial<LandingPageContent>) => void;
  setIsGenerating: (generating: boolean) => void;
  resetWizard: () => void;
  canProceed: boolean;
}

const initialState: WizardState = {
  currentStep: 1,
  projectInfo: {},
  images: {
    uploaded: [],
    generated: [],
    selected: [],
  },
  visualStyle: {
    style: "studio",
    lighting: "natural",
    aspectRatio: "16:9",
    quality: "hd",
  },
  brandIdentity: {
    primaryColor: "#7c3aed",
    palette: [],
    typography: {
      heading: "Inter",
      body: "Inter",
    },
  },
  sections: ["hero", "benefits", "gallery", "testimonials", "pricing", "faq", "cta", "footer"],
  content: {},
  isGenerating: false,
};

const WIZARD_STEPS: Omit<WizardStep, "isCompleted" | "isActive">[] = [
  { id: 1, title: "Informations", description: "Détails du projet" },
  { id: 2, title: "Photos", description: "Import des images" },
  { id: 3, title: "Style", description: "Style visuel" },
  { id: 4, title: "Marque", description: "Identité de marque" },
  { id: 5, title: "Génération", description: "Visuels IA" },
  { id: 6, title: "Assemblage", description: "Landing page" },
  { id: 7, title: "Export", description: "Preview & export" },
];

const WizardContext = createContext<WizardContextType | undefined>(undefined);

export function WizardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WizardState>(initialState);

  const steps: WizardStep[] = WIZARD_STEPS.map((step) => ({
    ...step,
    isCompleted: step.id < state.currentStep,
    isActive: step.id === state.currentStep,
  }));

  const goToStep = useCallback((step: number) => {
    if (step >= 1 && step <= 7) {
      setState((prev) => ({ ...prev, currentStep: step }));
    }
  }, []);

  const nextStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.min(prev.currentStep + 1, 7),
    }));
  }, []);

  const prevStep = useCallback(() => {
    setState((prev) => ({
      ...prev,
      currentStep: Math.max(prev.currentStep - 1, 1),
    }));
  }, []);

  const updateProjectInfo = useCallback((info: Partial<ProjectInfo>) => {
    setState((prev) => ({
      ...prev,
      projectInfo: { ...prev.projectInfo, ...info },
    }));
  }, []);

  const updateImages = useCallback((images: Partial<ProjectImages>) => {
    setState((prev) => ({
      ...prev,
      images: { ...prev.images, ...images },
    }));
  }, []);

  const updateVisualStyle = useCallback((style: Partial<VisualStyleConfig>) => {
    setState((prev) => ({
      ...prev,
      visualStyle: { ...prev.visualStyle, ...style },
    }));
  }, []);

  const updateBrandIdentity = useCallback((brand: Partial<BrandIdentity>) => {
    setState((prev) => ({
      ...prev,
      brandIdentity: { ...prev.brandIdentity, ...brand },
    }));
  }, []);

  const updateSections = useCallback((sections: LandingSection[]) => {
    setState((prev) => ({ ...prev, sections }));
  }, []);

  const updateContent = useCallback((content: Partial<LandingPageContent>) => {
    setState((prev) => ({
      ...prev,
      content: { ...prev.content, ...content },
    }));
  }, []);

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setState((prev) => ({ ...prev, isGenerating }));
  }, []);

  const resetWizard = useCallback(() => {
    setState(initialState);
  }, []);

  // Determine if user can proceed to next step
  const canProceed = (() => {
    switch (state.currentStep) {
      case 1:
        return !!(
          state.projectInfo.name &&
          state.projectInfo.productType &&
          state.projectInfo.sector
        );
      case 2:
        return state.images.uploaded.length > 0;
      case 3:
        return !!state.visualStyle.style;
      case 4:
        return !!state.brandIdentity.primaryColor;
      case 5:
        return state.images.generated.length > 0 && state.images.selected.length > 0;
      case 6:
        return state.sections.length > 0;
      case 7:
        return true;
      default:
        return false;
    }
  })();

  return (
    <WizardContext.Provider
      value={{
        ...state,
        steps,
        goToStep,
        nextStep,
        prevStep,
        updateProjectInfo,
        updateImages,
        updateVisualStyle,
        updateBrandIdentity,
        updateSections,
        updateContent,
        setIsGenerating,
        resetWizard,
        canProceed,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const context = useContext(WizardContext);
  if (context === undefined) {
    throw new Error("useWizard must be used within a WizardProvider");
  }
  return context;
}
