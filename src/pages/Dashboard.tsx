import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, FolderOpen, Clock, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useProjects } from "@/hooks/useProjects";
import { formatDistanceToNow } from "date-fns";
import { fr, ar } from "date-fns/locale";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const { t, lang, dir } = useLanguage();
  const { projects, loading, deleteProject } = useProjects();
  const navigate = useNavigate();

  const STATUS_LABELS: Record<string, { label: string; className: string }> = {
    draft: { label: t.draft, className: "bg-muted text-muted-foreground" },
    generating: { label: t.generating, className: "bg-yellow-500/20 text-yellow-500" },
    ready: { label: t.ready, className: "bg-green-500/20 text-green-500" },
    exported: { label: t.exported, className: "bg-primary/20 text-primary" },
  };

  const timeAgo = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), {
        addSuffix: true,
        locale: lang === "ar" ? ar : fr,
      });
    } catch {
      return date;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" dir={dir}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{t.dashboard}</h1>
          <p className="text-muted-foreground">{t.welcomeMessage}</p>
        </div>
        <Button asChild className="btn-gradient gap-2">
          <Link to="/new">
            <Plus className="w-4 h-4" />
            {t.newProject}
          </Link>
        </Button>
      </div>

      {/* Usage Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{t.landingsCount}</p>
            <p className="text-3xl font-bold mt-1">
              {projects.length} <span className="text-lg text-muted-foreground">/ ∞</span>
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{t.aiImages}</p>
            <p className="text-3xl font-bold mt-1">
              0 <span className="text-lg text-muted-foreground">/ 10</span>
            </p>
          </CardContent>
        </Card>
        <Card className="glass-card">
          <CardContent className="p-6">
            <p className="text-sm text-muted-foreground">{t.exportsCount}</p>
            <p className="text-3xl font-bold mt-1">0</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <FolderOpen className="w-5 h-5" />
            {t.recentProjects}
          </h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <Card key={project.id} className="group overflow-hidden hover:border-primary/50 transition-all">
                {/* Thumbnail */}
                <div className="aspect-video bg-secondary relative overflow-hidden">
                  <img
                    src={project.thumbnail_url || "/placeholder.svg"}
                    alt={project.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="gap-1"
                      onClick={() => {
                        // Navigate to /new and load project (via state)
                        navigate("/new", { state: { loadProject: project } });
                      }}
                    >
                      <ExternalLink className="w-3 h-3" />
                      {t.open}
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="destructive" className="h-8 w-8">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            {lang === "fr" ? "Supprimer ce projet ?" : "حذف هذا المشروع؟"}
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            {lang === "fr"
                              ? "Cette action est irréversible."
                              : "لا يمكن التراجع عن هذا الإجراء."}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>
                            {lang === "fr" ? "Annuler" : "إلغاء"}
                          </AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteProject(project.id)}>
                            {lang === "fr" ? "Supprimer" : "حذف"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-medium truncate">{project.name}</h3>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(project.updated_at)}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        (STATUS_LABELS[project.status] || STATUS_LABELS.ready).className
                      }`}
                    >
                      {(STATUS_LABELS[project.status] || STATUS_LABELS.ready).label}
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
              <h3 className="font-medium mb-2">{t.noProjectsYet}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {t.createFirstProject}
              </p>
              <Button asChild className="btn-gradient">
                <Link to="/new">
                  <Plus className="w-4 h-4 mr-2" />
                  {t.createMyFirstProject}
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
            <CardTitle className="text-lg">{t.guidesAndTutorials}</CardTitle>
            <CardDescription>
              {t.learnToCreate}
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="hover:border-primary/50 transition-all cursor-pointer">
          <CardHeader>
            <CardTitle className="text-lg">{t.templateExamples}</CardTitle>
            <CardDescription>
              {t.inspireFromBest}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
