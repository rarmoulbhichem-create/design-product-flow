import { Wizard } from "@/components/wizard/Wizard";

export default function NewProjectPage() {
  return (
    <div className="animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text">Créer une landing page</h1>
        <p className="text-muted-foreground mt-1">
          En 7 étapes, générez une page professionnelle exportable vers WordPress
        </p>
      </div>
      <Wizard />
    </div>
  );
}
