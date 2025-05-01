import { NextResponse } from "next/server"
import { put } from "@vercel/blob"

// Sample images to use as fallbacks
const sampleImages = [
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005198919-d3d4b5a92ead?q=80&w=1200&auto=format&fit=crop",
]

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 })
    }

    // Log API key information (masked for security)
    const apiKey = process.env.OPENAI_API_KEY || ""
    const maskedKey =
      apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "(not found)"
    console.log(`API Key format check: ${maskedKey}`)
    console.log(`API Key length: ${apiKey.length}`)
    console.log(`API Key starts with 'sk-': ${apiKey.startsWith("sk-")}`)

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key is missing")
      return NextResponse.json({
        success: true,
        imageUrl: sampleImages[0],
        prompt: prompt,
        isSample: true,
        fallbackReason: "Missing API key",
      })
    }

    try {
      console.log("Attempting to generate image with OpenAI API using fetch...")
      console.log("Using prompt:", prompt.substring(0, 50) + "...")

      // Use fetch API directly instead of OpenAI SDK
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-3",
          prompt: prompt,
          n: 1,
          size: "1024x1024",
          quality: "standard",
          response_format: "url",
        }),
      })

      console.log("OpenAI API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("OpenAI API error response:", errorText)
        throw new Error(`OpenAI API returned status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("OpenAI API response received:", JSON.stringify(data, null, 2))

      // Get the URL from the response
      const imageUrl = data.data[0].url

      if (!imageUrl) {
        throw new Error("No image URL returned from OpenAI")
      }

      console.log("Image URL received:", imageUrl)

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
      console.log("Uploading to Vercel Blob...")
      const blob = await put(filename, imageBlob, {
        access: "public",
        contentType: "image/png",
      })

      console.log("Successfully uploaded to Blob storage:", blob.url)

      return NextResponse.json({
        success: true,
        imageUrl: blob.url,
        prompt: data.data[0].revised_prompt || prompt,
      })
    } catch (openaiError: any) {
      console.error("OpenAI API error:", openaiError)

      // Return a fallback image with detailed error information
      const randomIndex = Math.floor(Math.random() * sampleImages.length)
      return NextResponse.json({
        success: true,
        imageUrl: sampleImages[randomIndex],
        prompt: prompt,
        isSample: true,
        fallbackReason: `OpenAI error: ${openaiError.message || "Unknown error"}`,
      })
    }
  } catch (error: any) {
    console.error("Error in generate-image API route:", error)

    // Return a fallback response even in case of server error
    const randomIndex = Math.floor(Math.random() * sampleImages.length)

    return NextResponse.json({
      success: true,
      imageUrl: sampleImages[randomIndex],
      prompt: "Sample image (server error occurred)",
      isSample: true,
      fallbackReason: `Server error: ${error.message || "Unknown error"}`,
    })
  }
}
