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
    const { imageBase64, imageUrl, productName, productCategory, designMood, primaryColor } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const imageContent = imageBase64 
      ? `data:image/jpeg;base64,${imageBase64}`
      : imageUrl;

    // Generate 3 distinct image variants for the landing page
    const prompts = [
      `Create a professional e-commerce hero banner photo of this ${productCategory || "product"} called "${productName || "product"}". Style: clean white/light background, studio lighting, product centered with soft shadows. Professional product photography for a premium landing page. Mood: ${designMood || "elegant"}. Make it look like a high-end product shoot.`,
      `Create a lifestyle product photo showing this ${productCategory || "product"} "${productName || "product"}" in a real-life context, being used naturally. Warm ambient lighting, beautiful background setting, aspirational lifestyle scene. The product should be the hero of the composition.`,
      `Create a close-up detail shot of this ${productCategory || "product"} "${productName || "product"}" highlighting its quality, texture, and craftsmanship. Macro-style photography, shallow depth of field, premium feel. Show the product details that make it special.`
    ];

    const generatedImages: Array<{ id: string; url: string; prompt: string }> = [];

    for (let i = 0; i < prompts.length; i++) {
      try {
        console.log(`Generating image ${i + 1}/3...`);
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash-image",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: prompts[i] },
                  { type: "image_url", image_url: { url: imageContent } }
                ]
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (!response.ok) {
          console.error(`Image ${i + 1} failed:`, response.status);
          continue;
        }

        const data = await response.json();
        const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (generatedImageUrl) {
          generatedImages.push({
            id: `gen-${Date.now()}-${i}`,
            url: generatedImageUrl,
            prompt: prompts[i]
          });
          console.log(`Image ${i + 1} generated successfully`);
        }
      } catch (imageError) {
        console.error(`Error generating image ${i + 1}:`, imageError);
      }

      // Delay between requests
      if (i < prompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
    }

    return new Response(JSON.stringify({ 
      images: generatedImages,
      count: generatedImages.length 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("generate-product-images error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
