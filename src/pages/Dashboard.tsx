import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderOpen, Clock, MoreHorizontal, ExternalLink } from "lucide-react";

// Mock data for projects
const MOCK_PROJECTS = [
  {
    id: "1",
    name: "Sneakers Urban 2024",
    status: "ready",
    thumbnail: "/placeholder.svg",
    updatedAt: "Il y a 2 heures",
  },
  {
    id: "2",
    name: "Montre Luxe Edition",
    status: "draft",
    thumbnail: "/placeholder.svg",
    updatedAt: "Hier",
  },
  {
    id: "3",
    name: "Sac à Main Premium",
    status: "generating",
    thumbnail: "/placeholder.svg",
    updatedAt: "Il y a 3 jours",
  },
];

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  draft: { label: "Brouillon", className: "bg-muted text-muted-foreground" },
  generating: { label: "En cours", className: "bg-yellow-500/20 text-yellow-500" },
  ready: { label: "Prêt", className: "bg-green-500/20 text-green-500" },
  exported: { label: "Exporté", className: "bg-primary/20 text-primary" },
};

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenue ! Créez votre prochaine landing page.</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/new">
            <Plus className="w-4 h-4" />
            Nouveau projet
          </Link>
        </Button>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Landing pages ce mois</p>
            <p className="text-3xl font-bold mt-1">
              0 <span className="text-lg text-muted-foreground">/ 1</span>
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Images IA générées</p>
            <p className="text-3xl font-bold mt-1">
              0 <span className="text-lg text-muted-foreground">/ 10</span>
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">Exports ce mois</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            Projets récents
          </h2>
          <Button variant="ghost" asChild>
            <Link to="/projects">Voir tout</Link>
          </Button>
        </div>

        {MOCK_PROJECTS.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_PROJECTS.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:border-primary/50 transition-all">
                {/* Thumbnail */}
                <div className="aspect-video bg-secondary relative overflow-hidden">
                  <img
                    src={project.thumbnail}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <Button size="sm" variant="secondary" className="gap-1">
                      <ExternalLink className="w-3 h-3" />
                      Ouvrir
                    </Button>
                    <Button size="icon" variant="secondary" className="h-8 w-8">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium truncate">{project.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {project.updatedAt}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${STATUS_LABELS[project.status].className}`}
                    >
                      {STATUS_LABELS[project.status].label}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-medium mb-2">Aucun projet pour l'instant</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Créez votre première landing page en quelques minutes
              </p>
              <Button asChild className="btn-gradient">
                <Link to="/new">
                  <Plus className="w-4 h-4 mr-2" />
                  Créer mon premier projet
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="hover:border-primary/50 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">📚 Guides & Tutoriels</CardTitle>
            <CardDescription>
              Apprenez à créer des landing pages qui convertissent
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary/50 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">💡 Exemples de templates</CardTitle>
            <CardDescription>
              Inspirez-vous de nos meilleurs modèles
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
