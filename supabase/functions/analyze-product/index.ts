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
    const { imageBase64, additionalImages, imageUrl, userPrice, language = "ar" } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    // Build image content array - main image + additional images
    const imageContents: any[] = [];
    
    if (imageBase64) {
      imageContents.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } });
    } else if (imageUrl) {
      imageContents.push({ type: "image_url", image_url: { url: imageUrl } });
    }

    // Add additional images
    if (additionalImages && Array.isArray(additionalImages)) {
      for (const img of additionalImages) {
        imageContents.push({ type: "image_url", image_url: { url: `data:image/jpeg;base64,${img}` } });
      }
    }

    const imageCount = imageContents.length;
    const multiImageNote = imageCount > 1 
      ? `لديك ${imageCount} صور للمنتج. حلل جميع الصور معاً للحصول على فهم شامل ودقيق للمنتج - من زوايا مختلفة، تفاصيل، ألوان، وملحقات. استخدم كل المعلومات من جميع الصور لإنشاء وصف شامل ودقيق.`
      : `حلل صورة المنتج هذه بدقة.`;

    const priceInstruction = userPrice 
      ? `السعر المحدد من المستخدم: ${userPrice} دج (دينار جزائري). استخدم هذا السعر بالضبط. اقترح سعراً أصلياً أعلى لإظهار الخصم.`
      : `قدّر سعراً واقعياً بالدينار الجزائري (DZD).`;

    // Language instructions
    const langInstructions = {
      ar: {
        contentLang: "كل المحتوى باللغة العربية الفصحى الحديثة (الأسلوب الجزائري).",
        testimonialNames: "استخدم أسماء وألقاب جزائرية ومدن جزائرية حقيقية.",
        direction: "rtl",
      },
      fr: {
        contentLang: "Tout le contenu doit être en français algérien (style local). Utilisez un français naturel avec des expressions courantes en Algérie.",
        testimonialNames: "Utilisez des prénoms et noms algériens courants et des villes algériennes réelles.",
        direction: "ltr",
      },
      both: {
        contentLang: "Créez le contenu en DEUX langues : arabe algérien ET français algérien. Pour chaque champ texte, fournissez d'abord la version arabe. La structure JSON reste la même mais le contenu principal sera en arabe, avec une section supplémentaire 'frenchVersion' contenant la traduction française de tout le contenu.",
        testimonialNames: "Mélangez des prénoms arabes et français typiquement algériens avec des villes algériennes.",
        direction: "rtl",
      },
    };

    const lang = langInstructions[language as keyof typeof langInstructions] || langInstructions.ar;

    const systemPrompt = `أنت خبير عالمي في التجارة الإلكترونية والتسويق الرقمي وكتابة المحتوى التحويلي.

مهمتك: حلل صور المنتج هذه بدقة متناهية.

## تعليمات اللغة:
${lang.contentLang}
${lang.testimonialNames}

## تعليمات حاسمة:
1. **تعرّف على المنتج الحقيقي بالضبط** - ابحث في ذاكرتك عن هذا المنتج تحديداً. حدد الاسم الدقيق، العلامة التجارية الحقيقية، والموديل إن أمكن.
2. **إذا كانت هناك عدة صور، ادمج المعلومات من كلها** - كل صورة تعطيك زاوية أو تفاصيل إضافية.
3. **المحتوى يجب أن يصف هذا المنتج بالتحديد** وليس منتجاً مشابهاً.
4. **العملة: دينار جزائري (DZD / دج)** - ${priceInstruction}
5. **الشهادات بأسماء جزائرية** - ${lang.testimonialNames}

أجب فقط بكائن JSON صالح، بدون markdown، بدون backticks:

{
  "product": {
    "name": "${language === "fr" ? "Nom complet et réel du produit" : "الاسم الحقيقي الكامل للمنتج"}",
    "brand": "${language === "fr" ? "Marque réelle" : "العلامة التجارية الحقيقية"}",
    "category": "${language === "fr" ? "Catégorie principale" : "الفئة الرئيسية"}",
    "subcategory": "${language === "fr" ? "Sous-catégorie" : "الفئة الفرعية"}",
    "shortDescription": "${language === "fr" ? "Description courte accrocheuse en une phrase" : "وصف قصير جذاب بجملة واحدة"}",
    "longDescription": "${language === "fr" ? "Description détaillée 150-200 mots, persuasive et orientée bénéfices client" : "وصف مفصل 150-200 كلمة، مقنع وموجه لفوائد العميل"}",
    "targetAudience": "${language === "fr" ? "Description précise du public cible" : "وصف دقيق للجمهور المستهدف"}",
    "specifications": [
      {"label": "${language === "fr" ? "Matériau" : "المادة"}", "value": "..."},
      {"label": "${language === "fr" ? "Dimensions" : "الأبعاد"}", "value": "..."},
      {"label": "${language === "fr" ? "Poids" : "الوزن"}", "value": "..."},
      {"label": "${language === "fr" ? "Couleur" : "اللون"}", "value": "..."},
      {"label": "${language === "fr" ? "Garantie" : "الضمان"}", "value": "..."}
    ],
    "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"]
  },
  "pricing": {
    "price": 7999,
    "originalPrice": 12999,
    "currency": "DZD",
    "discountPercent": 38,
    "shippingInfo": "${language === "fr" ? "Livraison gratuite sous 3-5 jours dans toutes les wilayas" : "توصيل مجاني خلال 3-5 أيام لكل الولايات"}",
    "guarantee": "${language === "fr" ? "Garantie satisfait ou remboursé sous 30 jours" : "ضمان استرداد المال خلال 30 يوم"}"
  },
  "landingPage": {
    "hero": {
      "headline": "${language === "fr" ? "Titre accrocheur puissant (6-8 mots)" : "عنوان قوي وجذاب (6-8 كلمات)"}",
      "subheadline": "${language === "fr" ? "Sous-titre convaincant expliquant le bénéfice principal (25 mots max)" : "عنوان فرعي مقنع يشرح الفائدة الرئيسية (25 كلمة كحد أقصى)"}",
      "ctaText": "${language === "fr" ? "Commander maintenant" : "اطلب الآن"}",
      "ctaSubtext": "${language === "fr" ? "⚡ Offre limitée - Plus que 12 pièces" : "⚡ عرض محدود - متبقي 12 قطعة فقط"}",
      "badge": "${language === "fr" ? "Promo -38%" : "تخفيض -38%"}"
    },
    "trustBadges": ["${language === "fr" ? "Livraison gratuite" : "توصيل مجاني"}", "${language === "fr" ? "Paiement sécurisé" : "دفع آمن"}", "${language === "fr" ? "Garantie 30 jours" : "ضمان 30 يوم"}", "${language === "fr" ? "Support 24/7" : "دعم 24/7"}"],
    "benefits": [
      {"icon": "Star", "title": "...", "description": "..."},
      {"icon": "Shield", "title": "...", "description": "..."},
      {"icon": "Zap", "title": "...", "description": "..."},
      {"icon": "Heart", "title": "...", "description": "..."}
    ],
    "socialProof": {
      "rating": 4.8,
      "reviewCount": 2847,
      "satisfactionRate": 98
    },
    "testimonials": [
      {"name": "${language === "fr" ? "Sarah B." : "سارة ب."}", "location": "${language === "fr" ? "Alger" : "الجزائر العاصمة"}", "rating": 5, "text": "...", "verified": true, "date": "${language === "fr" ? "Il y a 3 jours" : "منذ 3 أيام"}"},
      {"name": "${language === "fr" ? "Mohamed L." : "محمد ل."}", "location": "${language === "fr" ? "Oran" : "وهران"}", "rating": 5, "text": "...", "verified": true, "date": "${language === "fr" ? "Il y a 1 semaine" : "منذ أسبوع"}"},
      {"name": "${language === "fr" ? "Amina D." : "أمينة د."}", "location": "${language === "fr" ? "Constantine" : "قسنطينة"}", "rating": 4, "text": "...", "verified": true, "date": "${language === "fr" ? "Il y a 2 semaines" : "منذ أسبوعين"}"},
      {"name": "${language === "fr" ? "Karim R." : "كريم ر."}", "location": "${language === "fr" ? "Sétif" : "سطيف"}", "rating": 5, "text": "...", "verified": true, "date": "${language === "fr" ? "Il y a 3 semaines" : "منذ 3 أسابيع"}"}
    ],
    "features": [
      {"title": "...", "description": "..."},
      {"title": "...", "description": "..."},
      {"title": "...", "description": "..."},
      {"title": "...", "description": "..."},
      {"title": "...", "description": "..."},
      {"title": "...", "description": "..."}
    ],
    "faq": [
      {"question": "...", "answer": "..."},
      {"question": "...", "answer": "..."},
      {"question": "...", "answer": "..."},
      {"question": "...", "answer": "..."},
      {"question": "...", "answer": "..."}
    ],
    "urgency": {
      "text": "${language === "fr" ? "⏰ Offre spéciale limitée" : "⏰ عرض خاص محدود"}",
      "subtext": "${language === "fr" ? "Cette offre expire bientôt. Ne manquez pas cette opportunité unique." : "هذا العرض ينتهي قريباً. لا تفوت هذه الفرصة الفريدة."}",
      "stockText": "${language === "fr" ? "Plus que 12 pièces en stock" : "متبقي 12 قطعة فقط في المخزون"}"
    },
    "finalCta": {
      "headline": "...",
      "subheadline": "...",
      "buttonText": "${language === "fr" ? "Obtenez-le maintenant" : "احصل عليه الآن"}",
      "guaranteeText": "${language === "fr" ? "Garantie satisfait ou remboursé sous 30 jours" : "ضمان استرداد المال خلال 30 يوم"}"
    }
  },
  "seo": {
    "metaTitle": "SEO optimized title (60 chars max)",
    "metaDescription": "Compelling meta description (160 chars max)",
    "h1": "Main H1 with keyword",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"]
  },
  "design": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "backgroundColor": "#0a0a0f",
    "textColor": "#ffffff",
    "mood": "premium"
  }${language === "both" ? `,
  "frenchVersion": {
    "product": { "name": "...", "shortDescription": "...", "longDescription": "...", "specifications": [...] },
    "landingPage": { "hero": { "headline": "...", "subheadline": "...", "ctaText": "...", "ctaSubtext": "...", "badge": "..." }, "trustBadges": [...], "benefits": [...], "testimonials": [...], "features": [...], "faq": [...], "urgency": {...}, "finalCta": {...} }
  }` : ""}
}`;

    const userMessage: any[] = [
      { type: "text", text: `${multiImageNote} تعرّف على المنتج الحقيقي بالضبط كما يظهر في الصور - اسمه، علامته التجارية، مواصفاته الحقيقية. ابحث في معرفتك عن هذا المنتج تحديداً وليس منتجاً مشابهاً. أنشئ كل المحتوى التسويقي لصفحة هبوط بيع عالية التحويل. كل المحتوى باللغة العربية والعملة بالدينار الجزائري.` },
      ...imageContents
    ];

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
          { role: "user", content: userMessage }
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "تم تجاوز الحد المسموح، يرجى المحاولة لاحقاً." }), {
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
        error: "فشل في تحليل استجابة الذكاء الاصطناعي",
        rawContent: content 
      }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Override price if user provided one
    if (userPrice && parsedContent.pricing) {
      parsedContent.pricing.price = parseFloat(userPrice);
      parsedContent.pricing.currency = "DZD";
      if (parsedContent.pricing.originalPrice <= parsedContent.pricing.price) {
        parsedContent.pricing.originalPrice = Math.round(parsedContent.pricing.price * 1.4);
      }
      parsedContent.pricing.discountPercent = Math.round(
        ((parsedContent.pricing.originalPrice - parsedContent.pricing.price) / parsedContent.pricing.originalPrice) * 100
      );
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
