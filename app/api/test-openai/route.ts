import { NextResponse } from "next/server"
import OpenAI from "openai"

export async function GET() {
  try {
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

    // Test the API key with a simple completion
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Hello!" }],
      max_tokens: 5,
    })

    return NextResponse.json({
      success: true,
      message: "OpenAI API key is valid",
      response: completion.choices[0].message,
    })
  } catch (error: any) {
    console.error("Error testing OpenAI API key:", error)

    return NextResponse.json({
      success: false,
      error: error.message || "Unknown error",
    })
  }
}
