import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageBase64, imageUrl } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const imageContent = imageBase64 
      ? { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const systemPrompt = `Tu es un expert mondial en e-commerce, marketing digital et copywriting de conversion. 

Analyse cette image de produit avec une extrême précision. Tu dois :
1. Identifier exactement le produit (nom, marque si visible, catégorie)
2. Deviner ses caractéristiques techniques et spécifications
3. Estimer un prix réaliste basé sur le marché
4. Générer TOUT le contenu marketing nécessaire pour une landing page de vente WordPress haute conversion

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans texte avant ou après.

Le JSON doit contenir exactement cette structure:
{
  "product": {
    "name": "Nom complet du produit",
    "brand": "Marque (si identifiable, sinon inventer un nom crédible)",
    "category": "Catégorie principale",
    "subcategory": "Sous-catégorie",
    "shortDescription": "Description courte en 1 phrase percutante",
    "longDescription": "Description détaillée de 150-200 mots, persuasive et orientée bénéfices client",
    "targetAudience": "Description précise du public cible",
    "specifications": [
      {"label": "Matériau", "value": "valeur"},
      {"label": "Dimensions", "value": "valeur"},
      {"label": "Poids", "value": "valeur"},
      {"label": "Couleur", "value": "valeur"},
      {"label": "Garantie", "value": "valeur"}
    ],
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  },
  "pricing": {
    "price": 49.99,
    "originalPrice": 79.99,
    "currency": "EUR",
    "discountPercent": 37,
    "shippingInfo": "Livraison gratuite sous 3-5 jours",
    "guarantee": "Satisfait ou remboursé 30 jours"
  },
  "landingPage": {
    "hero": {
      "headline": "Titre accrocheur puissant (max 8 mots)",
      "subheadline": "Sous-titre persuasif qui explique le bénéfice principal (max 25 mots)",
      "ctaText": "Texte bouton CTA (ex: Commander maintenant)",
      "ctaSubtext": "Texte sous le CTA (ex: ⚡ Offre limitée - Plus que 12 en stock)",
      "badge": "Texte badge (ex: -37% PROMO)"
    },
    "trustBadges": [
      "Livraison gratuite",
      "Paiement sécurisé",
      "Garantie 30 jours",
      "Support 24/7"
    ],
    "benefits": [
      {"icon": "Star", "title": "Titre bénéfice 1", "description": "Description du bénéfice en 2 phrases max"},
      {"icon": "Shield", "title": "Titre bénéfice 2", "description": "Description du bénéfice en 2 phrases max"},
      {"icon": "Zap", "title": "Titre bénéfice 3", "description": "Description du bénéfice en 2 phrases max"},
      {"icon": "Heart", "title": "Titre bénéfice 4", "description": "Description du bénéfice en 2 phrases max"}
    ],
    "socialProof": {
      "rating": 4.8,
      "reviewCount": 2847,
      "satisfactionRate": 98
    },
    "testimonials": [
      {"name": "Sophie M.", "location": "Paris", "rating": 5, "text": "Témoignage réaliste et positif de 2-3 phrases", "verified": true, "date": "Il y a 3 jours"},
      {"name": "Thomas L.", "location": "Lyon", "rating": 5, "text": "Témoignage réaliste et positif de 2-3 phrases", "verified": true, "date": "Il y a 1 semaine"},
      {"name": "Marie D.", "location": "Bordeaux", "rating": 4, "text": "Témoignage réaliste et positif de 2-3 phrases", "verified": true, "date": "Il y a 2 semaines"},
      {"name": "Pierre R.", "location": "Marseille", "rating": 5, "text": "Témoignage réaliste et positif de 2-3 phrases", "verified": true, "date": "Il y a 3 semaines"}
    ],
    "features": [
      {"title": "Caractéristique 1", "description": "Explication détaillée"},
      {"title": "Caractéristique 2", "description": "Explication détaillée"},
      {"title": "Caractéristique 3", "description": "Explication détaillée"},
      {"title": "Caractéristique 4", "description": "Explication détaillée"},
      {"title": "Caractéristique 5", "description": "Explication détaillée"},
      {"title": "Caractéristique 6", "description": "Explication détaillée"}
    ],
    "faq": [
      {"question": "Question fréquente 1", "answer": "Réponse détaillée et rassurante"},
      {"question": "Question fréquente 2", "answer": "Réponse détaillée et rassurante"},
      {"question": "Question fréquente 3", "answer": "Réponse détaillée et rassurante"},
      {"question": "Question fréquente 4", "answer": "Réponse détaillée et rassurante"},
      {"question": "Question fréquente 5", "answer": "Réponse détaillée et rassurante"}
    ],
    "urgency": {
      "text": "⏰ Offre spéciale limitée",
      "subtext": "Cette promotion se termine bientôt. Ne manquez pas cette occasion unique.",
      "stockText": "Plus que 12 articles en stock"
    },
    "finalCta": {
      "headline": "Titre final persuasif",
      "subheadline": "Sous-titre créant l'urgence",
      "buttonText": "Texte bouton final",
      "guaranteeText": "Garantie satisfait ou remboursé 30 jours"
    }
  },
  "seo": {
    "metaTitle": "Titre SEO optimisé (max 60 caractères)",
    "metaDescription": "Meta description persuasive (max 160 caractères)",
    "h1": "Titre H1 principal avec mot-clé",
    "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"]
  },
  "design": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "backgroundColor": "#hex",
    "textColor": "#hex",
    "mood": "premium|playful|minimal|bold|elegant"
  }
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: [
              { type: "text", text: "Analyse cette image de produit en profondeur. Identifie le produit, ses caractéristiques, son prix estimé, et génère TOUT le contenu marketing pour une landing page de vente WordPress haute conversion. Sois créatif, persuasif, et professionnel." },
              imageContent
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    let parsedContent;
    try {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedContent = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("No JSON found in response");
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", parseError);
      console.log("Raw content:", content);
      return new Response(JSON.stringify({ 
        error: "Failed to parse AI response",
        rawContent: content 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(parsedContent), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("analyze-product error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
