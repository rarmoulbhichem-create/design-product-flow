import { AppProvider, useApp } from "@/contexts/AppContext";
import { ProductUpload } from "@/components/ProductUpload";
import { LandingPreview } from "@/components/LandingPreview";
import { ExportPage } from "@/components/ExportPage";

function AppContent() {
  const { currentView } = useApp();

  switch (currentView) {
    case "upload":
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
