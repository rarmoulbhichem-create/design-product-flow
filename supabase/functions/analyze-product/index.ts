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
    const { imageBase64, imageUrl, productInfo } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const imageContent = imageBase64 
      ? { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const systemPrompt = `Tu es un expert en marketing e-commerce et copywriting. Analyse cette image de produit et génère du contenu marketing complet en français.

IMPORTANT: Réponds UNIQUEMENT avec un objet JSON valide, sans texte avant ou après.

Le JSON doit contenir:
{
  "productAnalysis": {
    "category": "catégorie du produit",
    "type": "type spécifique",
    "targetAudience": "public cible idéal",
    "uniqueSellingPoints": ["point 1", "point 2", "point 3"],
    "estimatedPriceRange": "fourchette de prix suggérée",
    "keywords": ["mot-clé 1", "mot-clé 2"]
  },
  "landingPageContent": {
    "hero": {
      "title": "titre accrocheur (max 10 mots)",
      "subtitle": "sous-titre persuasif (max 20 mots)",
      "ctaText": "texte du bouton CTA"
    },
    "benefits": [
      { "icon": "nom-icone-lucide", "title": "titre bénéfice", "description": "description courte" }
    ],
    "productDescription": "description détaillée du produit (100-150 mots)",
    "testimonials": [
      { "name": "Prénom N.", "role": "Client vérifié", "content": "témoignage réaliste" }
    ],
    "faq": [
      { "question": "question fréquente", "answer": "réponse concise" }
    ],
    "pricing": {
      "price": "prix suggéré",
      "originalPrice": "prix barré optionnel",
      "features": ["caractéristique 1", "caractéristique 2"]
    },
    "cta": {
      "title": "titre section finale",
      "subtitle": "sous-titre urgence/rareté",
      "buttonText": "texte bouton"
    }
  },
  "seo": {
    "metaTitle": "titre SEO (max 60 caractères)",
    "metaDescription": "meta description (max 160 caractères)",
    "h1": "titre H1 principal"
  },
  "suggestedColors": {
    "primary": "#hexcode",
    "secondary": "#hexcode",
    "accent": "#hexcode"
  },
  "imagePrompts": [
    "prompt pour générer une image lifestyle du produit",
    "prompt pour une mise en scène studio",
    "prompt pour une utilisation en contexte"
  ]
}`;

    const userPrompt = productInfo 
      ? `Analyse cette image de produit. Informations additionnelles: ${JSON.stringify(productInfo)}`
      : "Analyse cette image de produit et génère le contenu marketing complet.";

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
              { type: "text", text: userPrompt },
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
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Payment required, please add credits." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    // Parse the JSON response
    let parsedContent;
    try {
      // Try to extract JSON from the response
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
