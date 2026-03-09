import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";
import { ProductUpload } from "@/components/ProductUpload";
import { LandingPreview } from "@/components/LandingPreview";
import { ExportPage } from "@/components/ExportPage";
import type { SavedProject } from "@/hooks/useProjects";

function AppContent() {
  const { currentView, setGeneratedProject, setCurrentView, setSelectedTemplate } = useApp();
  const location = useLocation();

  useEffect(() => {
    const state = location.state as { loadProject?: SavedProject } | null;
    if (state?.loadProject) {
      const p = state.loadProject;
      setGeneratedProject(p.project_data);
      setSelectedTemplate(p.project_data.template || "elegant");
      setCurrentView("preview");
      // Clear location state to prevent re-loading on re-render
      window.history.replaceState({}, document.title);
    }
  }, []);

  switch (currentView) {
    case "upload":
    case "price":
    case "generating":
      return <ProductUpload />;
    case "preview":
      return <LandingPreview />;
    case "export":
      return <ExportPage />;
    default:
      return <ProductUpload />;
  }
}

export default function NewProjectPage() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
