import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Log API key information (masked for security)
    const apiKey = process.env.OPENAI_API_KEY || ""
    const maskedKey =
      apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "(not found)"
    console.log(`API Key format check: ${maskedKey}`)
    console.log(`API Key length: ${apiKey.length}`)
    console.log(`API Key starts with 'sk-': ${apiKey.startsWith("sk-")}`)

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        success: false,
        error: "OpenAI API key is missing",
      })
    }

    console.log("Attempting direct fetch to OpenAI Image Generation API...")

    // Test with a simple image generation request using fetch
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: "A simple test image of a blue circle on a white background",
        n: 1,
        size: "1024x1024",
        quality: "low", // Using low quality for faster test
        output_format: "png",
      }),
    })

    console.log("OpenAI API response status:", response.status)

    if (!response.ok) {
      const errorData = await response.text()
      console.error("OpenAI API error response:", errorData)

      return NextResponse.json({
        success: false,
        error: `OpenAI API returned status ${response.status}`,
        details: errorData,
      })
    }

    const data = await response.json()
    console.log("OpenAI API response structure:", Object.keys(data).join(", "))
    console.log("Image data present:", !!data.data?.[0]?.b64_json)

    // Don't log the full base64 string as it would be too large
    if (data.data?.[0]?.b64_json) {
      console.log("Base64 image data length:", data.data[0].b64_json.length)
    }

    return NextResponse.json({
      success: true,
      message: "Direct OpenAI Image Generation API call successful",
      // Don't include the full base64 data in the response
      hasImageData: !!data.data?.[0]?.b64_json,
    })
  } catch (error: any) {
    console.error("Error in direct OpenAI API test:", error)

    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
      errorType: error.constructor.name,
    })
  }
}
