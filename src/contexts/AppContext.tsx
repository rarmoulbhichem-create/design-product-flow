import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { GeneratedProject, LandingTemplate, LandingLanguage } from "@/types/project";

interface UploadedProductImage {
  url: string;
  base64: string;
  file?: File;
}

interface AppState {
  currentView: "upload" | "price" | "generating" | "preview" | "export";
  generatedProject: GeneratedProject | null;
  productImages: UploadedProductImage[];
  userPrice: string;
  selectedLanguage: LandingLanguage;
  isGenerating: boolean;
  generationProgress: number;
  generationStep: string;
  selectedTemplate: LandingTemplate;
}

interface AppContextType extends AppState {
  setCurrentView: (view: AppState["currentView"]) => void;
  setGeneratedProject: (project: GeneratedProject | null) => void;
  updateGeneratedProject: (updater: (prev: GeneratedProject) => GeneratedProject) => void;
  addProductImage: (url: string, base64: string, file?: File) => void;
  removeProductImage: (index: number) => void;
  clearProductImages: () => void;
  setUserPrice: (price: string) => void;
  setSelectedLanguage: (lang: LandingLanguage) => void;
  setIsGenerating: (val: boolean) => void;
  setGenerationProgress: (val: number) => void;
  setGenerationStep: (val: string) => void;
  setSelectedTemplate: (template: LandingTemplate) => void;
  resetApp: () => void;
  // Legacy compat
  productImageUrl: string | null;
  productImageBase64: string | null;
  setProductImage: (url: string, base64: string, file?: File) => void;
}

const initialState: AppState = {
  currentView: "upload",
  generatedProject: null,
  productImages: [],
  userPrice: "",
  selectedLanguage: "ar",
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

  const updateGeneratedProject = useCallback((updater: (prev: GeneratedProject) => GeneratedProject) => {
    setState(prev => {
      if (!prev.generatedProject) return prev;
      return { ...prev, generatedProject: updater(prev.generatedProject) };
    });
  }, []);

  const addProductImage = useCallback((url: string, base64: string, file?: File) => {
    setState(prev => ({
      ...prev,
      productImages: [...prev.productImages, { url, base64, file }],
    }));
  }, []);

  const removeProductImage = useCallback((index: number) => {
    setState(prev => ({
      ...prev,
      productImages: prev.productImages.filter((_, i) => i !== index),
    }));
  }, []);

  const clearProductImages = useCallback(() => {
    setState(prev => ({ ...prev, productImages: [] }));
  }, []);

  // Legacy compat
  const setProductImage = useCallback((url: string, base64: string, file?: File) => {
    setState(prev => ({
      ...prev,
      productImages: [{ url, base64, file }],
    }));
  }, []);

  const setUserPrice = useCallback((userPrice: string) => {
    setState(prev => ({ ...prev, userPrice }));
  }, []);

  const setSelectedLanguage = useCallback((selectedLanguage: LandingLanguage) => {
    setState(prev => ({ ...prev, selectedLanguage }));
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

  const productImageUrl = state.productImages[0]?.url || null;
  const productImageBase64 = state.productImages[0]?.base64 || null;

  return (
    <AppContext.Provider value={{
      ...state,
      setCurrentView,
      setGeneratedProject,
      updateGeneratedProject,
      addProductImage,
      removeProductImage,
      clearProductImages,
      setProductImage,
      setUserPrice,
      setSelectedLanguage,
      setIsGenerating,
      setGenerationProgress,
      setGenerationStep,
      setSelectedTemplate,
      resetApp,
      productImageUrl,
      productImageBase64,
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
