import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GeneratedProject, LandingTemplate } from "@/types/project";

interface AppState {
  currentView: "upload" | "price" | "generating" | "preview" | "export";
  generatedProject: GeneratedProject | null;
  productImageUrl: string | null;
  productImageBase64: string | null;
  productFile: File | null;
  userPrice: string;
  isGenerating: boolean;
  generationProgress: number;
  generationStep: string;
  selectedTemplate: LandingTemplate;
}

interface AppContextType extends AppState {
  setCurrentView: (view: AppState["currentView"]) => void;
  setGeneratedProject: (project: GeneratedProject | null) => void;
  setProductImage: (url: string, base64: string, file?: File) => void;
  setUserPrice: (price: string) => void;
  setIsGenerating: (val: boolean) => void;
  setGenerationProgress: (val: number) => void;
  setGenerationStep: (val: string) => void;
  setSelectedTemplate: (template: LandingTemplate) => void;
  resetApp: () => void;
}

const initialState: AppState = {
  currentView: "upload",
  generatedProject: null,
  productImageUrl: null,
  productImageBase64: null,
  productFile: null,
  userPrice: "",
  isGenerating: false,
  generationProgress: 0,
  generationStep: "",
  selectedTemplate: "elegant",
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialState);

  const setCurrentView = useCallback((currentView: AppState["currentView"]) => {
    setState(prev => ({ ...prev, currentView }));
  }, []);

  const setGeneratedProject = useCallback((generatedProject: GeneratedProject | null) => {
    setState(prev => ({ ...prev, generatedProject }));
  }, []);

  const setProductImage = useCallback((url: string, base64: string, file?: File) => {
    setState(prev => ({ ...prev, productImageUrl: url, productImageBase64: base64, productFile: file || null }));
  }, []);

  const setUserPrice = useCallback((userPrice: string) => {
    setState(prev => ({ ...prev, userPrice }));
  }, []);

  const setIsGenerating = useCallback((isGenerating: boolean) => {
    setState(prev => ({ ...prev, isGenerating }));
  }, []);

  const setGenerationProgress = useCallback((generationProgress: number) => {
    setState(prev => ({ ...prev, generationProgress }));
  }, []);

  const setGenerationStep = useCallback((generationStep: string) => {
    setState(prev => ({ ...prev, generationStep }));
  }, []);

  const setSelectedTemplate = useCallback((selectedTemplate: LandingTemplate) => {
    setState(prev => ({ ...prev, selectedTemplate }));
  }, []);

  const resetApp = useCallback(() => {
    setState(initialState);
  }, []);

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentView,
      setGeneratedProject,
      setProductImage,
      setUserPrice,
      setIsGenerating,
      setGenerationProgress,
      setGenerationStep,
      setSelectedTemplate,
      resetApp,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
}
