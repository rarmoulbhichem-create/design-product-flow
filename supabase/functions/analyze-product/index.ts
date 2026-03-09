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
    const { imageBase64, imageUrl, userPrice } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const imageContent = imageBase64 
      ? { type: "image_url", image_url: { url: `data:image/jpeg;base64,${imageBase64}` } }
      : { type: "image_url", image_url: { url: imageUrl } };

    const priceInstruction = userPrice 
      ? `السعر المحدد من المستخدم: ${userPrice} دج (دينار جزائري). استخدم هذا السعر بالضبط. اقترح سعراً أصلياً أعلى لإظهار الخصم.`
      : `قدّر سعراً واقعياً بالدينار الجزائري (DZD).`;

    const systemPrompt = `أنت خبير عالمي في التجارة الإلكترونية والتسويق الرقمي وكتابة المحتوى التحويلي.

مهمتك: حلل صورة المنتج هذه بدقة متناهية.

## تعليمات حاسمة:
1. **تعرّف على المنتج الحقيقي بالضبط** - ابحث في ذاكرتك عن هذا المنتج تحديداً. حدد الاسم الدقيق، العلامة التجارية الحقيقية، والموديل إن أمكن. لا تخمن - حدد المنتج كما هو في الصورة.
2. **المحتوى يجب أن يصف هذا المنتج بالتحديد** وليس منتجاً مشابهاً. كل وصف يجب أن يتطابق مع ما تراه في الصورة.
3. **كل المحتوى باللغة العربية** - العناوين، الأوصاف، الشهادات، الأسئلة الشائعة، كل شيء بالعربية الفصحى الحديثة.
4. **العملة: دينار جزائري (دج)** - ${priceInstruction}
5. **الشهادات بأسماء جزائرية** - استخدم أسماء وألقاب جزائرية ومدن جزائرية حقيقية.

أجب فقط بكائن JSON صالح، بدون markdown، بدون backticks:

{
  "product": {
    "name": "الاسم الحقيقي الكامل للمنتج بالعربية",
    "brand": "العلامة التجارية الحقيقية",
    "category": "الفئة الرئيسية",
    "subcategory": "الفئة الفرعية",
    "shortDescription": "وصف قصير جذاب بجملة واحدة",
    "longDescription": "وصف مفصل 150-200 كلمة، مقنع وموجه لفوائد العميل",
    "targetAudience": "وصف دقيق للجمهور المستهدف",
    "specifications": [
      {"label": "المادة", "value": "القيمة"},
      {"label": "الأبعاد", "value": "القيمة"},
      {"label": "الوزن", "value": "القيمة"},
      {"label": "اللون", "value": "القيمة"},
      {"label": "الضمان", "value": "القيمة"}
    ],
    "tags": ["وسم1", "وسم2", "وسم3", "وسم4", "وسم5"]
  },
  "pricing": {
    "price": 7999,
    "originalPrice": 12999,
    "currency": "DZD",
    "discountPercent": 38,
    "shippingInfo": "توصيل مجاني خلال 3-5 أيام لكل الولايات",
    "guarantee": "ضمان استرداد المال خلال 30 يوم"
  },
  "landingPage": {
    "hero": {
      "headline": "عنوان قوي وجذاب (6-8 كلمات)",
      "subheadline": "عنوان فرعي مقنع يشرح الفائدة الرئيسية (25 كلمة كحد أقصى)",
      "ctaText": "اطلب الآن",
      "ctaSubtext": "⚡ عرض محدود - متبقي 12 قطعة فقط",
      "badge": "تخفيض -38%"
    },
    "trustBadges": ["توصيل مجاني", "دفع آمن", "ضمان 30 يوم", "دعم 24/7"],
    "benefits": [
      {"icon": "Star", "title": "عنوان الميزة", "description": "وصف الميزة"},
      {"icon": "Shield", "title": "عنوان الميزة", "description": "وصف الميزة"},
      {"icon": "Zap", "title": "عنوان الميزة", "description": "وصف الميزة"},
      {"icon": "Heart", "title": "عنوان الميزة", "description": "وصف الميزة"}
    ],
    "socialProof": {
      "rating": 4.8,
      "reviewCount": 2847,
      "satisfactionRate": 98
    },
    "testimonials": [
      {"name": "سارة ب.", "location": "الجزائر العاصمة", "rating": 5, "text": "شهادة واقعية وإيجابية", "verified": true, "date": "منذ 3 أيام"},
      {"name": "محمد ل.", "location": "وهران", "rating": 5, "text": "شهادة واقعية وإيجابية", "verified": true, "date": "منذ أسبوع"},
      {"name": "أمينة د.", "location": "قسنطينة", "rating": 4, "text": "شهادة واقعية وإيجابية", "verified": true, "date": "منذ أسبوعين"},
      {"name": "كريم ر.", "location": "سطيف", "rating": 5, "text": "شهادة واقعية وإيجابية", "verified": true, "date": "منذ 3 أسابيع"}
    ],
    "features": [
      {"title": "ميزة 1", "description": "شرح مفصل"},
      {"title": "ميزة 2", "description": "شرح مفصل"},
      {"title": "ميزة 3", "description": "شرح مفصل"},
      {"title": "ميزة 4", "description": "شرح مفصل"},
      {"title": "ميزة 5", "description": "شرح مفصل"},
      {"title": "ميزة 6", "description": "شرح مفصل"}
    ],
    "faq": [
      {"question": "سؤال شائع 1", "answer": "إجابة مفصلة ومطمئنة"},
      {"question": "سؤال شائع 2", "answer": "إجابة مفصلة ومطمئنة"},
      {"question": "سؤال شائع 3", "answer": "إجابة مفصلة ومطمئنة"},
      {"question": "سؤال شائع 4", "answer": "إجابة مفصلة ومطمئنة"},
      {"question": "سؤال شائع 5", "answer": "إجابة مفصلة ومطمئنة"}
    ],
    "urgency": {
      "text": "⏰ عرض خاص محدود",
      "subtext": "هذا العرض ينتهي قريباً. لا تفوت هذه الفرصة الفريدة.",
      "stockText": "متبقي 12 قطعة فقط في المخزون"
    },
    "finalCta": {
      "headline": "عنوان نهائي مقنع",
      "subheadline": "عنوان فرعي يخلق إحساساً بالإلحاح",
      "buttonText": "احصل عليه الآن",
      "guaranteeText": "ضمان استرداد المال خلال 30 يوم"
    }
  },
  "seo": {
    "metaTitle": "عنوان SEO محسّن (60 حرف كحد أقصى)",
    "metaDescription": "وصف ميتا مقنع (160 حرف كحد أقصى)",
    "h1": "عنوان H1 رئيسي مع كلمة مفتاحية",
    "keywords": ["كلمة1", "كلمة2", "كلمة3", "كلمة4", "كلمة5"]
  },
  "design": {
    "primaryColor": "#hex",
    "secondaryColor": "#hex",
    "accentColor": "#hex",
    "backgroundColor": "#0a0a0f",
    "textColor": "#ffffff",
    "mood": "premium"
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
              { type: "text", text: "حلل صورة المنتج هذه بعمق. تعرّف على المنتج الحقيقي بالضبط كما يظهر في الصورة - اسمه، علامته التجارية، مواصفاته الحقيقية. ابحث في معرفتك عن هذا المنتج تحديداً وليس منتجاً مشابهاً. أنشئ كل المحتوى التسويقي لصفحة هبوط بيع عالية التحويل. كل المحتوى باللغة العربية والعملة بالدينار الجزائري." },
              imageContent
            ]
          }
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
