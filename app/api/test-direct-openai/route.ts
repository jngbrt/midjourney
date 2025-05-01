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

    console.log("Attempting direct fetch to OpenAI API...")

    // Test with a simple completion request using fetch
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello!" }],
        max_tokens: 5,
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
    console.log("OpenAI API response data:", JSON.stringify(data, null, 2))

    return NextResponse.json({
      success: true,
      message: "Direct OpenAI API call successful",
      response: data,
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
