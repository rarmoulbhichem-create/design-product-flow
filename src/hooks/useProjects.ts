import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import type { GeneratedProject } from "@/types/project";
import { toast } from "sonner";

export interface SavedProject {
  id: string;
  name: string;
  status: string;
  thumbnail_url: string | null;
  template: string;
  project_data: GeneratedProject;
  created_at: string;
  updated_at: string;
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<SavedProject[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("updated_at", { ascending: false });

    if (error) {
      console.error("Error fetching projects:", error);
    } else {
      setProjects((data || []).map(d => ({
        ...d,
        project_data: d.project_data as unknown as GeneratedProject,
      })));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const saveProject = useCallback(async (
    project: GeneratedProject,
    name?: string,
    existingId?: string
  ): Promise<string | null> => {
    if (!user) return null;

    const projectName = name || project.product?.name || "Sans titre";
    const record = {
      user_id: user.id,
      name: projectName,
      status: "ready" as const,
      template: project.template || "elegant",
      project_data: JSON.parse(JSON.stringify(project)),
      thumbnail_url: project.productImageUrl || null,
    };

    if (existingId) {
      const { error } = await supabase
        .from("projects")
        .update(record)
        .eq("id", existingId);
      if (error) {
        toast.error("Erreur lors de la sauvegarde");
        console.error(error);
        return null;
      }
      toast.success("Projet mis à jour !");
      fetchProjects();
      return existingId;
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert(record)
        .select("id")
        .single();
      if (error) {
        toast.error("Erreur lors de la sauvegarde");
        console.error(error);
        return null;
      }
      toast.success("Projet sauvegardé !");
      fetchProjects();
      return data.id;
    }
  }, [user, fetchProjects]);

  const deleteProject = useCallback(async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) {
      toast.error("Erreur lors de la suppression");
      console.error(error);
      return false;
    }
    toast.success("Projet supprimé");
    setProjects(prev => prev.filter(p => p.id !== id));
    return true;
  }, []);

  return { projects, loading, saveProject, deleteProject, refetch: fetchProjects };
}
