import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Crown, Copy, Check, ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const PAYMENT_INFO = {
  ccp: {
    number: "00799999 99",
    name: "LandPage AI SARL",
  },
  baridimob: {
    rip: "00799999 0000000099 99",
    name: "LandPage AI SARL",
  },
};

const PLAN_PRICES = {
  starter: 2850,
  pro: 7350,
};

export default function UpgradePage() {
  const { t, dir } = useLanguage();
  const { user } = useAuth();
  const { toast } = useToast();
  const [transactionId, setTransactionId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ccp" | "baridimob">("ccp");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const isFr = dir === "ltr";

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async () => {
    if (!transactionId.trim()) {
      toast({
        title: isFr ? "Erreur" : "خطأ",
        description: isFr ? "Veuillez entrer le numéro de transaction" : "الرجاء إدخال رقم المعاملة",
        variant: "destructive",
      });
      return;
    }

    if (!user) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("payment_requests").insert({
        user_id: user.id,
        amount: 2000,
        payment_method: paymentMethod,
        transaction_id: transactionId.trim(),
        status: "pending",
      });

      if (error) throw error;

      setSubmitted(true);
      toast({
        title: isFr ? "Demande envoyée !" : "تم إرسال الطلب!",
        description: isFr
          ? "Votre paiement sera vérifié sous 24h"
          : "سيتم التحقق من دفعتك خلال 24 ساعة",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: isFr ? "Erreur" : "خطأ",
        description: isFr ? "Une erreur est survenue" : "حدث خطأ",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" dir={dir}>
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-8 pb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/10 flex items-center justify-center">
              <Check className="w-8 h-8 text-green-500" />
            </div>
            <h2 className="text-xl font-bold mb-2">
              {isFr ? "Demande envoyée avec succès !" : "تم إرسال الطلب بنجاح!"}
            </h2>
            <p className="text-muted-foreground mb-6">
              {isFr
                ? "Nous vérifierons votre paiement sous 24h. Vous recevrez une notification une fois votre plan activé."
                : "سنتحقق من دفعتك خلال 24 ساعة. ستتلقى إشعاراً بمجرد تفعيل خطتك."}
            </p>
            <Button asChild>
              <Link to="/dashboard">
                {isFr ? "Retour au tableau de bord" : "العودة إلى لوحة التحكم"}
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8" dir={dir}>
      <div className="max-w-2xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 gap-2">
          <Link to="/dashboard">
            <ArrowLeft className="w-4 h-4" />
            {isFr ? "Retour" : "رجوع"}
          </Link>
        </Button>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h1 className="text-2xl font-bold">{isFr ? "Passer à Pro" : "الترقية إلى Pro"}</h1>
          </div>
          <p className="text-3xl font-bold">
            {t.proPrice}<span className="text-lg text-muted-foreground">{t.month}</span>
          </p>
        </div>

        {/* Payment method selector */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button
            variant={paymentMethod === "ccp" ? "default" : "outline"}
            onClick={() => setPaymentMethod("ccp")}
            className="gap-2"
          >
            <CreditCard className="w-4 h-4" />
            CCP
          </Button>
          <Button
            variant={paymentMethod === "baridimob" ? "default" : "outline"}
            onClick={() => setPaymentMethod("baridimob")}
            className="gap-2"
          >
            <CreditCard className="w-4 h-4" />
            BaridiMob
          </Button>
        </div>

        {/* Payment info card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">
              {isFr ? "Informations de paiement" : "معلومات الدفع"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentMethod === "ccp" ? (
              <>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    {isFr ? "Numéro CCP" : "رقم CCP"}
                  </Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-lg">
                      {PAYMENT_INFO.ccp.number}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(PAYMENT_INFO.ccp.number, "ccp")}
                    >
                      {copiedField === "ccp" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    {isFr ? "Nom du bénéficiaire" : "اسم المستفيد"}
                  </Label>
                  <p className="font-medium mt-1">{PAYMENT_INFO.ccp.name}</p>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label className="text-muted-foreground text-sm">RIP BaridiMob</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <code className="flex-1 bg-muted px-3 py-2 rounded-md font-mono text-sm">
                      {PAYMENT_INFO.baridimob.rip}
                    </code>
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyToClipboard(PAYMENT_INFO.baridimob.rip, "rip")}
                    >
                      {copiedField === "rip" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="text-muted-foreground text-sm">
                    {isFr ? "Nom du bénéficiaire" : "اسم المستفيد"}
                  </Label>
                  <p className="font-medium mt-1">{PAYMENT_INFO.baridimob.name}</p>
                </div>
              </>
            )}

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-3 text-sm">
              <p className="font-medium mb-1">
                {isFr ? "💰 Montant à envoyer :" : "💰 المبلغ المطلوب:"}
              </p>
              <p className="text-lg font-bold">{t.proPrice}</p>
            </div>
          </CardContent>
        </Card>

        {/* Transaction confirmation */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {isFr ? "Confirmer le paiement" : "تأكيد الدفع"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>
                {isFr ? "Numéro de transaction / reçu" : "رقم المعاملة / الوصل"}
              </Label>
              <Input
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder={isFr ? "Ex: 123456789" : "مثال: 123456789"}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {isFr
                  ? "Entrez le numéro de transaction affiché après votre virement"
                  : "أدخل رقم المعاملة الظاهر بعد التحويل"}
              </p>
            </div>

            <Button
              onClick={handleSubmit}
              disabled={submitting || !transactionId.trim()}
              className="w-full btn-gradient"
              size="lg"
            >
              {submitting
                ? (isFr ? "Envoi en cours..." : "جاري الإرسال...")
                : (isFr ? "Envoyer la demande" : "إرسال الطلب")}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
