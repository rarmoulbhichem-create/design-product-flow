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
    const { imageBase64, imageUrl, prompts, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const imageContent = imageBase64 
      ? `data:image/jpeg;base64,${imageBase64}`
      : imageUrl;

    const styleDescriptions: Record<string, string> = {
      studio: "professional studio lighting, clean white background, high-end product photography",
      luxe: "luxury aesthetic, gold accents, premium materials, sophisticated lighting",
      minimalist: "minimal composition, negative space, clean lines, soft shadows",
      lifestyle: "lifestyle setting, natural environment, real-world context, warm tones"
    };

    const styleDesc = styleDescriptions[style] || styleDescriptions.studio;

    // Generate multiple image variants
    const generatedImages: Array<{ id: string; url: string; prompt: string }> = [];

    const defaultPrompts = prompts || [
      `Transform this product image into a ${styleDesc} shot. Keep the product as the main focus.`,
      `Create a lifestyle scene with this product, showing it in use. ${styleDesc}`,
      `Generate a hero banner image featuring this product with ${styleDesc}`
    ];

    for (let i = 0; i < defaultPrompts.length; i++) {
      const prompt = defaultPrompts[i];
      
      try {
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
                  { type: "text", text: prompt },
                  { type: "image_url", image_url: { url: imageContent } }
                ]
              }
            ],
            modalities: ["image", "text"]
          }),
        });

        if (!response.ok) {
          console.error(`Failed to generate image ${i + 1}:`, response.status);
          continue;
        }

        const data = await response.json();
        const generatedImageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
        
        if (generatedImageUrl) {
          generatedImages.push({
            id: `gen-${Date.now()}-${i}`,
            url: generatedImageUrl,
            prompt: prompt
          });
        }
      } catch (imageError) {
        console.error(`Error generating image ${i + 1}:`, imageError);
      }

      // Small delay between requests to avoid rate limiting
      if (i < defaultPrompts.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
