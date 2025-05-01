import { NextResponse } from "next/server"
import OpenAI from "openai"
import { put } from "@vercel/blob"

// Initialize OpenAI client securely using environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// Sample images to use as fallbacks
const sampleImages = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop",
]

async function generateImage(
  prompt: string,
): Promise<{ success: boolean; imageUrl: string; prompt: string; isSample?: boolean; fallbackReason?: string }> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      return { ...useFallbackImage(prompt, "Missing API key"), success: false }
    }

    try {
      // Generate image using DALL-E 3 with URL response format
      // This avoids having to handle base64 encoding/decoding
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url", // Changed from b64_json to url
      })

      // Get the URL from the response
      const imageUrl = response.data[0].url

      if (!imageUrl) {
        throw new Error("No image URL returned from OpenAI")
      }

      // Fetch the image from the URL
      const imageResponse = await fetch(imageUrl)
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image from OpenAI URL: ${imageResponse.status}`)
      }

      // Get the image as a blob
      const imageBlob = await imageResponse.blob()

      // Create a unique filename
      const filename = `generated-image-${Date.now()}.png`

      // Upload to Vercel Blob
      const blob = await put(filename, imageBlob, {
        access: "public",
        contentType: "image/png",
      })

      return {
        success: true,
        imageUrl: blob.url,
        prompt: response.data[0].revised_prompt || prompt,
      }
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError)

      // Log detailed error information
      if (openaiError.response) {
        console.error("OpenAI API response status:", openaiError.response.status)
        console.error("OpenAI API response data:", openaiError.response.data)
      }

      return { ...useFallbackImage(prompt, `OpenAI error: ${openaiError.message || "Unknown error"}`), success: false }
    }
  } catch (error: any) {
    console.error("Error generating image:", error)
    return { ...useFallbackImage(prompt, `Server error: ${error.message || "Unknown error"}`), success: false }
  }
}

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    const result = await generateImage(prompt)

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json({
        success: true,
        imageUrl: result.imageUrl,
        prompt: result.prompt,
        isSample: true,
        fallbackReason: result.fallbackReason,
      })
    }
  } catch (error: any) {
    console.error("Error in POST handler:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

// Helper function to return a fallback image
function useFallbackImage(prompt: string, reason: string) {
  const randomIndex = Math.floor(Math.random() * sampleImages.length)
  const sampleImageUrl = sampleImages[randomIndex]

  return {
    imageUrl: sampleImageUrl,
    prompt: prompt,
    isSample: true,
    fallbackReason: reason,
  }
}
