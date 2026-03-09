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
    const { imageBase64, imageUrl, productName, productCategory } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const imageContent = imageBase64 
      ? `data:image/jpeg;base64,${imageBase64}`
      : imageUrl;

    // CRITICAL: Prompts emphasize recreating the EXACT same product
    const prompts = [
      `Look at this product image carefully. Create an IDENTICAL copy of this EXACT product in a professional e-commerce studio setting. The product must be THE SAME product - same shape, same color, same design, same details. Place it on a clean dark background with professional studio lighting and soft reflections. Premium product photography style.`,
      `Look at this product image carefully. Create a lifestyle photo featuring this EXACT SAME product (identical shape, color, design) in a real-life usage scenario. The product must look exactly like the one in the reference image. Beautiful ambient lighting, modern setting, aspirational scene.`,
      `Look at this product image carefully. Create a close-up detail shot of this EXACT SAME product showing its texture, quality and craftsmanship. The product must be IDENTICAL to the one in the reference - same color, shape, brand marks, every detail. Macro photography style, shallow depth of field, dark premium background.`
    ];

    const generatedImages: Array<{ id: string; url: string; prompt: string }> = [];

    for (let i = 0; i < prompts.length; i++) {
      try {
        console.log(`Generating image ${i + 1}/3 for "${productName}"...`);
        const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-pro-image-preview",
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

      if (i < prompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 2000));
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
