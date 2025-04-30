import { NextResponse } from "next/server"
import OpenAI from "openai"
import { put } from "@vercel/blob"

// Initialize OpenAI client securely using environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      // Return a fallback image instead of failing
      return NextResponse.json({
        success: true,
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        prompt: prompt,
        fallback: true,
      })
    }

    try {
      // Generate image using DALL-E 3
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "b64_json",
      })

      // Get the base64 image data
      const imageData = response.data[0].b64_json

      if (!imageData) {
        throw new Error("No image data returned from OpenAI")
      }

      // Convert base64 to buffer for Blob storage
      const buffer = Buffer.from(imageData, "base64")

      // Create a unique filename
      const filename = `generated-image-${Date.now()}.png`

      // Upload to Vercel Blob
      const blob = await put(filename, buffer, {
        access: "public",
        contentType: "image/png",
      })

      return NextResponse.json({
        success: true,
        imageUrl: blob.url,
        prompt: response.data[0].revised_prompt || prompt,
      })
    } catch (openaiError) {
      console.error("OpenAI API error:", openaiError)

      // Return a fallback image instead of failing
      return NextResponse.json({
        success: true,
        imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        prompt: prompt,
        fallback: true,
      })
    }
  } catch (error: any) {
    console.error("Error generating image:", error)
    return NextResponse.json(
      {
        error: error.message || "Failed to generate image",
      },
      {
        status: 500,
      },
    )
  }
}
