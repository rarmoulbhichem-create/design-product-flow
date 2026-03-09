import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  FolderOpen,
  LayoutTemplate,
  Settings,
  Sparkles,
  Plus,
  Crown,
  HelpCircle,
  Shield,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export function AppSidebar() {
  const location = useLocation();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { t, dir } = useLanguage();
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) { setIsAdmin(false); return; }
    supabase.rpc("has_role", { _user_id: user.id, _role: "admin" })
      .then(({ data }) => setIsAdmin(!!data));
  }, [user]);

  const MAIN_NAV = [
    { title: t.dashboard, url: "/dashboard", icon: LayoutDashboard },
    { title: t.myProjects, url: "/projects", icon: FolderOpen },
    { title: t.templates, url: "/templates", icon: LayoutTemplate },
  ];

  const SECONDARY_NAV = [
    { title: t.settings, url: "/settings", icon: Settings },
    { title: t.help, url: "/help", icon: HelpCircle },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-between px-2 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="font-bold text-lg gradient-text">LandPage AI</span>
            )}
          </Link>
          {!collapsed && <LanguageSwitcher />}
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* New Project Button */}
        <div className="p-3">
          <Button asChild className="w-full btn-gradient gap-2 justify-start">
            <Link to="/new">
              <Plus className="w-4 h-4" />
              {!collapsed && t.newProject}
            </Link>
          </Button>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>{t.navigation}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MAIN_NAV.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link
                        to={item.url}
                        className={cn(
                          "flex items-center gap-3",
                          isActive && "text-primary"
                        )}
                      >
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Admin Navigation */}
        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild isActive={location.pathname === "/admin"}>
                    <Link to="/admin" className="flex items-center gap-3">
                      <Shield className="w-4 h-4" />
                      {!collapsed && <span>Administration</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Secondary Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>{t.other}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {SECONDARY_NAV.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link to={item.url} className="flex items-center gap-3">
                        <item.icon className="w-4 h-4" />
                        {!collapsed && <span>{item.title}</span>}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with upgrade */}
      <SidebarFooter className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && (
          <div className="rounded-lg bg-sidebar-accent p-3">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-4 h-4 text-yellow-500" />
              <span className="font-medium text-sm">{t.freePlan}</span>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              1/1 {t.landingsThisMonth}
            </p>
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/upgrade">{t.upgradeToPro}</Link>
            </Button>
          </div>
        )}
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size={collapsed ? "icon" : "sm"}
              className="w-full gap-2 text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-4 h-4" />
              {!collapsed && (dir === "ltr" ? "Déconnexion" : "تسجيل الخروج")}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {dir === "rtl" ? "تأكيد تسجيل الخروج" : "Confirmer la déconnexion"}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {dir === "rtl"
                  ? "هل أنت متأكد أنك تريد تسجيل الخروج؟"
                  : "Êtes-vous sûr de vouloir vous déconnecter ?"}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>
                {dir === "rtl" ? "إلغاء" : "Annuler"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={signOut}>
                {dir === "rtl" ? "تسجيل الخروج" : "Déconnexion"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SidebarFooter>
    </Sidebar>
  );
}
