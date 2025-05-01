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
      console.log("Using model: gpt-image-1")

      // Use fetch API directly instead of OpenAI SDK
      // Note: gpt-image-1 always returns base64-encoded images
      const response = await fetch("https://api.openai.com/v1/images/generations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt: prompt,
          n: 1,
          size: "1024x1024", // Can be 1024x1024, 1536x1024, 1024x1536, or auto
          quality: "high", // Can be high, medium, or low for gpt-image-1
          output_format: "png", // png, jpeg, or webp
          // Note: response_format is not supported for gpt-image-1
          // It always returns base64-encoded images
        }),
      })

      console.log("OpenAI API response status:", response.status)

      if (!response.ok) {
        const errorText = await response.text()
        console.error("OpenAI API error response:", errorText)
        throw new Error(`OpenAI API returned status ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      console.log("OpenAI API response received with data structure:", Object.keys(data).join(", "))

      // Get the base64 image data from the response
      // gpt-image-1 always returns base64-encoded images in b64_json format
      const base64ImageData = data.data[0].b64_json

      if (!base64ImageData) {
        throw new Error("No base64 image data returned from OpenAI")
      }

      console.log("Base64 image data received (length):", base64ImageData.length)

      // Convert base64 to blob
      const byteCharacters = atob(base64ImageData)
      const byteArrays = []
      for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
        const slice = byteCharacters.slice(offset, offset + 1024)
        const byteNumbers = new Array(slice.length)
        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }
        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }
      const imageBlob = new Blob(byteArrays, { type: "image/png" })

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
        prompt: prompt, // gpt-image-1 doesn't provide a revised_prompt like dall-e-3
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
