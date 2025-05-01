"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Download, RefreshCw, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { blobImageUrls } from "@/lib/blob-storage"

export function ImageGenerator() {
  const { toast } = useToast()
  const [generatedImageUrl, setGeneratedImageUrl] = useState("")
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isGeneratingImage, setIsGeneratingImage] = useState(false)
  const [activeTab, setActiveTab] = useState("parameters")
  const [isSampleImage, setIsSampleImage] = useState(false)
  const [fallbackReason, setFallbackReason] = useState("")
  const [requestCount, setRequestCount] = useState(0) // Add a counter to force re-fetch

  // Creative parameters
  const [subject, setSubject] = useState(0.7)
  const [style, setStyle] = useState(0.6)
  const [mood, setMood] = useState(0.5)
  const [detail, setDetail] = useState(0.8)
  const [context, setContext] = useState(0.4)
  const [creativity, setCreativity] = useState(0.6)

  // Custom prompt
  const [customPrompt, setCustomPrompt] = useState("")
  const [useCustomPrompt, setUseCustomPrompt] = useState(false)

  const calculateScore = () => {
    const values = [subject, style, mood, detail, context]
    const sum = values.reduce((acc, val) => acc + val, 0)

    // Calculate synergy terms
    let synergy = 0
    for (let i = 0; i < values.length; i++) {
      for (let j = i + 1; j < values.length; j++) {
        synergy += values[i] * values[j] * 0.2
      }
    }

    return sum + synergy
  }

  const isCreativeThresholdMet = () => {
    return calculateScore() >= 3.5 || creativity > 0.7
  }

  const generateImage = async () => {
    setIsGeneratingImage(true)
    setIsSampleImage(false)
    setFallbackReason("")
    setRequestCount((prev) => prev + 1) // Increment counter to avoid caching issues

    try {
      // Generate a prompt based on parameters or use custom prompt
      let prompt = ""

      if (useCustomPrompt && customPrompt.trim()) {
        prompt = customPrompt.trim()
      } else {
        // Subject elements
        const subjectElements = [
          "a professional model with perfect lighting",
          "a luxury product on a minimalist background",
          "a person using a cutting-edge device",
          "a fashion accessory styled for maximum appeal",
          "a modern interior with product placement",
          "a portrait with cinematic lighting",
        ]

        // Style elements
        const styleElements = [
          "high-end commercial photography",
          "minimalist product showcase",
          "lifestyle advertising photography",
          "glossy magazine editorial",
          "clean product photography",
          "cinematic advertising",
        ]

        // Mood elements
        const moodElements = [
          "aspirational and elegant",
          "modern and sophisticated",
          "bright and optimistic",
          "professional and sleek",
          "warm and inviting",
          "dramatic and impactful",
        ]

        // Detail elements
        const detailElements = [
          "extreme detail in textures and surfaces",
          "perfect depth of field highlighting key features",
          "subtle environmental reflections",
          "precise focus on product details",
          "balanced composition with rule of thirds",
          "shallow depth of field for subject emphasis",
        ]

        // Context elements
        const contextElements = [
          "in an upscale urban setting",
          "against a gradient studio background",
          "in natural daylight streaming through windows",
          "with carefully positioned accent lighting",
          "in a lifestyle context showing practical use",
          "with complementary color palette enhancing the subject",
        ]

        // Creative twists
        const creativeTwists = [
          ", with unique perspective that challenges conventional framing",
          ", incorporating subtle visual metaphors that enhance brand messaging",
          ", featuring unexpected color harmonies that draw attention",
          ", with strategic negative space creating visual impact",
          ", utilizing reflective surfaces to create depth and dimension",
          ", with dynamic motion blur suggesting action and energy",
          ", incorporating precise symmetry for maximum aesthetic appeal",
          ", with atmospheric elements creating mood and context",
        ]

        // Select elements based on parameter values
        const selectedSubject = subjectElements[Math.floor(subject * subjectElements.length) % subjectElements.length]
        const selectedStyle = styleElements[Math.floor(style * styleElements.length) % styleElements.length]
        const selectedMood = moodElements[Math.floor(mood * moodElements.length) % moodElements.length]
        const selectedDetail = detailElements[Math.floor(detail * detailElements.length) % detailElements.length]
        const selectedContext = contextElements[Math.floor(context * contextElements.length) % contextElements.length]

        // Add creative twist if threshold is met
        let twist = ""
        if (isCreativeThresholdMet()) {
          twist = creativeTwists[Math.floor(Math.random() * creativeTwists.length)]
        }

        // Construct the prompt
        prompt = `Create a photorealistic advertising image of ${selectedSubject} depicted as a ${selectedStyle} in a ${selectedMood} tone, featuring ${selectedDetail} ${selectedContext}${twist}. Make it extremely high quality, suitable for professional advertising.`
      }

      // Add a cache-busting parameter to avoid browser caching
      const cacheBuster = new Date().getTime()

      // Call the API route to generate the image
      const response = await fetch(`/api/generate-image?cb=${cacheBuster}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
        body: JSON.stringify({ prompt }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.success) {
        // Add a cache-busting parameter to the image URL if it's not already a blob URL
        const imageUrl = data.imageUrl.includes("?")
          ? `${data.imageUrl}&cb=${cacheBuster}`
          : `${data.imageUrl}?cb=${cacheBuster}`

        setGeneratedImageUrl(imageUrl)
        setGeneratedPrompt(data.prompt)
        setIsSampleImage(!!data.isSample)
        if (data.fallbackReason) {
          setFallbackReason(data.fallbackReason)
        }
        setActiveTab("result")

        if (data.isSample) {
          toast({
            title: "Using sample image",
            description: `${data.fallbackReason || "Image generation service is currently limited"}. Showing a sample image.`,
            variant: "default",
          })
        } else {
          toast({
            title: "Image generated successfully",
            description: "Your creative image has been generated based on the parameters.",
          })
        }
      } else {
        throw new Error(data.error || "Failed to generate image")
      }
    } catch (error) {
      console.error("Error generating image:", error)

      // Use a fallback image from our blob storage
      const fallbackImage =
        blobImageUrls.element1 ||
        "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop"
      setGeneratedImageUrl(fallbackImage)
      setGeneratedPrompt(useCustomPrompt ? customPrompt : "Sample image shown due to generation error")
      setIsSampleImage(true)
      setFallbackReason(error instanceof Error ? error.message : "Unknown error")
      setActiveTab("result")

      toast({
        title: "Error generating image",
        description: "Using a sample image instead. Please try again later.",
        variant: "destructive",
      })
    } finally {
      setIsGeneratingImage(false)
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-xl font-medium">Creative Image Generator</h3>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="parameters">Parameters</TabsTrigger>
          <TabsTrigger value="custom">Custom Prompt</TabsTrigger>
          <TabsTrigger value="result">Generated Image</TabsTrigger>
        </TabsList>

        <TabsContent value="parameters" className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">Creative Parameters</h4>
              <div className="flex items-center gap-2">
                <span className="text-sm">Total Score:</span>
                <Badge variant="outline">{calculateScore().toFixed(2)}</Badge>
                {isCreativeThresholdMet() && (
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    Creative
                  </Badge>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Subject</label>
                  <span className="text-xs text-muted-foreground">{subject.toFixed(2)}</span>
                </div>
                <Slider value={[subject]} min={0} max={1} step={0.01} onValueChange={(value) => setSubject(value[0])} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Style</label>
                  <span className="text-xs text-muted-foreground">{style.toFixed(2)}</span>
                </div>
                <Slider value={[style]} min={0} max={1} step={0.01} onValueChange={(value) => setStyle(value[0])} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Mood</label>
                  <span className="text-xs text-muted-foreground">{mood.toFixed(2)}</span>
                </div>
                <Slider value={[mood]} min={0} max={1} step={0.01} onValueChange={(value) => setMood(value[0])} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Detail</label>
                  <span className="text-xs text-muted-foreground">{detail.toFixed(2)}</span>
                </div>
                <Slider value={[detail]} min={0} max={1} step={0.01} onValueChange={(value) => setDetail(value[0])} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Context</label>
                  <span className="text-xs text-muted-foreground">{context.toFixed(2)}</span>
                </div>
                <Slider value={[context]} min={0} max={1} step={0.01} onValueChange={(value) => setContext(value[0])} />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Creativity Boost</label>
                  <span className="text-xs text-muted-foreground">{creativity.toFixed(2)}</span>
                </div>
                <Slider
                  value={[creativity]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(value) => setCreativity(value[0])}
                />
              </div>
            </div>

            <Button
              onClick={() => {
                setUseCustomPrompt(false)
                generateImage()
              }}
              disabled={isGeneratingImage}
              className="w-full gap-2"
            >
              {isGeneratingImage ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Generate Image
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Custom Prompt</label>
              <p className="text-xs text-muted-foreground mb-2">
                Write your own prompt for image generation. Be specific about style, content, and details.
              </p>
              <Textarea
                placeholder="Create a photorealistic advertising image of..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                className="min-h-[150px]"
              />
            </div>

            <Button
              onClick={() => {
                setUseCustomPrompt(true)
                generateImage()
              }}
              disabled={isGeneratingImage || !customPrompt.trim()}
              className="w-full gap-2"
            >
              {isGeneratingImage ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4" />
                  Generate Custom Image
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="result">
          <Card className="overflow-hidden">
            <div className="aspect-video relative">
              {generatedImageUrl ? (
                <>
                  <Image
                    src={`${generatedImageUrl}${generatedImageUrl.includes("?") ? "&" : "?"}v=${requestCount}`}
                    alt="Generated creative image"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  {isSampleImage && (
                    <div className="absolute bottom-2 right-2">
                      <Badge variant="outline" className="bg-yellow-500/20 text-yellow-700">
                        <AlertTriangle className="h-3 w-3 mr-1" /> Sample Image
                      </Badge>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center bg-muted">
                  <div className="text-center">
                    <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">Generate an image to see the result</p>
                  </div>
                </div>
              )}
            </div>
            <CardContent className="p-4">
              {generatedPrompt && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-1">Generated with prompt:</h4>
                  <div className="rounded-md bg-muted p-2">
                    <p className="text-xs text-muted-foreground">{generatedPrompt}</p>
                  </div>
                </div>
              )}

              {isSampleImage && (
                <div className="mb-4 p-2 rounded-md bg-yellow-50 border border-yellow-200">
                  <p className="text-xs text-yellow-700 flex items-center">
                    <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
                    This is a sample image.
                    {fallbackReason && ` Reason: ${fallbackReason}`}
                  </p>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => setActiveTab(useCustomPrompt ? "custom" : "parameters")}
                  className="gap-2"
                >
                  Back to {useCustomPrompt ? "Custom Prompt" : "Parameters"}
                </Button>
                {generatedImageUrl && (
                  <Button variant="outline" onClick={() => window.open(generatedImageUrl, "_blank")} className="gap-2">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default ImageGenerator
