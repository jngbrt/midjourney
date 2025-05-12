import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
  try {
    // Log the environment variable (with partial masking for security)
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

    // Initialize OpenAI client
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    console.log("Attempting to connect to OpenAI API...")

    // Test the API key with a simple completion
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "Hello!" }],
        max_tokens: 5,
      })

      console.log("OpenAI API connection successful")

      return NextResponse.json({
        success: true,
        message: "OpenAI API key is valid",
        response: completion.choices[0].message,
      })
    } catch (apiError: any) {
      console.error("OpenAI API specific error:", apiError.message)
      console.error("Error status:", apiError.status)
      console.error("Error type:", apiError.type)

      if (apiError.response) {
        console.error("Response status:", apiError.response.status)
        console.error("Response data:", apiError.response.data)
      }

      throw apiError
    }
  } catch (error: any) {
    console.error("Error testing OpenAI API key:", error)

    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
      errorType: error.constructor.name,
    })
  }
}
