import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Check, X, Clock, Shield, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface PaymentRequest {
  id: string;
  user_id: string;
  amount: number;
  payment_method: string;
  transaction_id: string | null;
  status: string;
  notes: string | null;
  created_at: string;
  profile?: { email: string | null; full_name: string | null };
}

export default function AdminPage() {
  const { user } = useAuth();
  const { dir } = useLanguage();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [requests, setRequests] = useState<PaymentRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const isFr = dir === "ltr";

  useEffect(() => {
    if (!user) return;
    checkAdmin();
  }, [user]);

  useEffect(() => {
    if (isAdmin) fetchRequests();
  }, [isAdmin]);

  const checkAdmin = async () => {
    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user!.id)
      .eq("role", "admin")
      .maybeSingle();
    setIsAdmin(!!data);
    if (!data) setLoading(false);
  };

  const fetchRequests = async () => {
    setLoading(true);
    const { data: payments } = await supabase
      .from("payment_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (payments) {
      const userIds = [...new Set(payments.map((p) => p.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email, full_name")
        .in("user_id", userIds);

      const profileMap = new Map(profiles?.map((p) => [p.user_id, p]) ?? []);
      setRequests(
        payments.map((p) => ({
          ...p,
          profile: profileMap.get(p.user_id) ?? undefined,
        }))
      );
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("payment_requests")
      .update({ status })
      .eq("id", id);

    if (error) {
      toast({
        title: isFr ? "Erreur" : "خطأ",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    if (status === "approved") {
      const request = requests.find((r) => r.id === id);
      if (request) {
        await supabase
          .from("profiles")
          .update({ plan: "pro" })
          .eq("user_id", request.user_id);
      }
    }

    toast({
      title: isFr ? "Mis à jour" : "تم التحديث",
      description:
        status === "approved"
          ? isFr ? "Paiement approuvé" : "تمت الموافقة على الدفع"
          : isFr ? "Paiement rejeté" : "تم رفض الدفع",
    });
    fetchRequests();
  };

  if (isAdmin === false) return <Navigate to="/dashboard" replace />;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20"><Check className="w-3 h-3 mr-1" />{isFr ? "Approuvé" : "موافق"}</Badge>;
      case "rejected":
        return <Badge variant="destructive"><X className="w-3 h-3 mr-1" />{isFr ? "Rejeté" : "مرفوض"}</Badge>;
      default:
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />{isFr ? "En attente" : "قيد الانتظار"}</Badge>;
    }
  };

  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir={dir}>
      <div className="max-w-5xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 gap-2">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour" : "رجوع"}
          </Link>
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-primary" />
          <h1 className="text-2xl font-bold">
            {isFr ? "Administration — Paiements" : "الإدارة — المدفوعات"}
          </h1>
          {pending > 0 && (
            <Badge variant="destructive">{pending} {isFr ? "en attente" : "قيد الانتظار"}</Badge>
          )}
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isFr ? "Demandes de paiement" : "طلبات الدفع"} ({requests.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">
                {isFr ? "Aucune demande de paiement" : "لا توجد طلبات دفع"}
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{isFr ? "Utilisateur" : "المستخدم"}</TableHead>
                    <TableHead>{isFr ? "Méthode" : "الطريقة"}</TableHead>
                    <TableHead>{isFr ? "Montant" : "المبلغ"}</TableHead>
                    <TableHead>{isFr ? "Transaction" : "المعاملة"}</TableHead>
                    <TableHead>{isFr ? "Statut" : "الحالة"}</TableHead>
                    <TableHead>{isFr ? "Date" : "التاريخ"}</TableHead>
                    <TableHead>{isFr ? "Actions" : "الإجراءات"}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-sm">{req.profile?.full_name || "—"}</p>
                          <p className="text-xs text-muted-foreground">{req.profile?.email || req.user_id.slice(0, 8)}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="uppercase text-xs">
                          {req.payment_method}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-mono">{req.amount} DA</TableCell>
                      <TableCell className="font-mono text-xs">{req.transaction_id || "—"}</TableCell>
                      <TableCell>{statusBadge(req.status)}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString(isFr ? "fr-FR" : "ar-DZ")}
                      </TableCell>
                      <TableCell>
                        {req.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => updateStatus(req.id, "approved")}
                              className="gap-1 bg-green-600 hover:bg-green-700"
                            >
                              <Check className="w-3 h-3" />
                              {isFr ? "Approuver" : "موافقة"}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => updateStatus(req.id, "rejected")}
                              className="gap-1"
                            >
                              <X className="w-3 h-3" />
                              {isFr ? "Rejeter" : "رفض"}
                            </Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
