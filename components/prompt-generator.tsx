"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Wand2, Copy, RefreshCw, ImageIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { blobImageUrls } from "@/lib/blob-storage"

// Base elements for prompt construction
const baseElements = {
  subject: [
    "a professional model with perfect lighting",
    "a luxury product on a minimalist background",
    "a person using a cutting-edge device",
    "a fashion accessory styled for maximum appeal",
    "a modern interior with product placement",
    "a portrait with cinematic lighting",
  ],
  style: [
    "high-end commercial photography",
    "minimalist product showcase",
    "lifestyle advertising photography",
    "glossy magazine editorial",
    "clean product photography",
    "cinematic advertising",
  ],
  mood: [
    "aspirational and elegant",
    "modern and sophisticated",
    "bright and optimistic",
    "professional and sleek",
    "warm and inviting",
    "dramatic and impactful",
  ],
  detail: [
    "extreme detail in textures and surfaces",
    "perfect depth of field highlighting key features",
    "subtle environmental reflections",
    "precise focus on product details",
    "balanced composition with rule of thirds",
    "shallow depth of field for subject emphasis",
  ],
  context: [
    "in an upscale urban setting",
    "against a gradient studio background",
    "in natural daylight streaming through windows",
    "with carefully positioned accent lighting",
    "in a lifestyle context showing practical use",
    "with complementary color palette enhancing the subject",
  ],
}

// Creative twists that can be added if threshold is exceeded
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

interface PromptGeneratorProps {
  attributeValues?: {
    subject: number
    style: number
    mood: number
    detail: number
    context: number
  }
}

export function PromptGenerator({ attributeValues }: PromptGeneratorProps) {
  const { toast } = useToast()
  const [localAttributes, setLocalAttributes] = useState({
    subject: attributeValues?.subject || 0.7,
    style: attributeValues?.style || 0.6,
    mood: attributeValues?.mood || 0.5,
    detail: attributeValues?.detail || 0.8,
    context: attributeValues?.context || 0.4,
  })
  const [generatedPrompt, setGeneratedPrompt] = useState("")
  const [isCreativeThresholdMet, setIsCreativeThresholdMet] = useState(false)
  const [selectedElements, setSelectedElements] = useState<Record<string, string>>({})
  const [creativeTwist, setCreativeTwist] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)

  // Update local attributes when props change
  useEffect(() => {
    if (attributeValues) {
      setLocalAttributes(attributeValues)
    }
  }, [attributeValues])

  const calculateScore = () => {
    const values = Object.values(localAttributes)
    const sum = values.reduce((acc, val) => acc + val, 0)

    // Calculate synergy terms
    let synergy = 0
    const keys = Object.keys(localAttributes)
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        synergy +=
          localAttributes[keys[i] as keyof typeof localAttributes] *
          localAttributes[keys[j] as keyof typeof localAttributes] *
          0.2
      }
    }

    return sum + synergy
  }

  const generatePrompt = () => {
    setIsGenerating(true)
    setTimeout(() => {
      const score = calculateScore()
      const creativityThreshold = 3.5 // Adjust as needed
      const meetsThreshold = score >= creativityThreshold
      setIsCreativeThresholdMet(meetsThreshold)

      // Select elements based on attribute values
      const selected: Record<string, string> = {}
      Object.keys(localAttributes).forEach((key) => {
        const value = localAttributes[key as keyof typeof localAttributes]
        // Scale the value to select from the array
        const index = Math.min(
          Math.floor(value * baseElements[key as keyof typeof baseElements].length),
          baseElements[key as keyof typeof baseElements].length - 1,
        )
        selected[key] = baseElements[key as keyof typeof baseElements][index]
      })
      setSelectedElements(selected)

      // Select creative twist if threshold is met
      let twist = ""
      if (meetsThreshold) {
        const twistIndex = Math.floor(Math.random() * creativeTwists.length)
        twist = creativeTwists[twistIndex]
      }
      setCreativeTwist(twist)

      // Construct the prompt
      const prompt = `Imagine ${selected.subject} depicted as a ${selected.style} in a ${
        selected.mood
      } tone, featuring ${selected.detail} ${selected.context}${twist}`
      setGeneratedPrompt(prompt)
      setIsGenerating(false)
    }, 800) // Simulate processing time
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt).then(
      () => {
        toast({
          title: "Copied to clipboard",
          description: "The prompt has been copied to your clipboard.",
        })
      },
      () => {
        toast({
          title: "Failed to copy",
          description: "Could not copy text to clipboard.",
          variant: "destructive",
        })
      },
    )
  }

  return (
    <div className="mt-8 rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-lg font-medium">Image Prompt Generator</h3>
      <p className="mb-4 text-muted-foreground">
        Generate creative image prompts based on the attribute matrix settings. The system will combine elements
        according to your attributes and add an extra creative twist if the calculated score exceeds the threshold.
      </p>

      <Tabs defaultValue="prompt">
        <TabsList className="mb-4 grid w-full grid-cols-2">
          <TabsTrigger value="prompt">Generated Prompt</TabsTrigger>
          <TabsTrigger value="elements">Selected Elements</TabsTrigger>
        </TabsList>

        <TabsContent value="prompt" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              {generatedPrompt ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h4 className="font-medium">Creative Prompt</h4>
                    {isCreativeThresholdMet && (
                      <Badge variant="outline" className="bg-primary/10 text-primary">
                        Creative Threshold Met
                      </Badge>
                    )}
                  </div>
                  <p className="min-h-[100px] whitespace-pre-wrap rounded-md bg-muted p-4 text-sm">{generatedPrompt}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button size="sm" onClick={copyToClipboard} className="gap-2">
                      <Copy className="h-4 w-4" />
                      Copy
                    </Button>
                    <Button size="sm" variant="outline" onClick={generatePrompt} className="gap-2">
                      <RefreshCw className="h-4 w-4" />
                      Regenerate
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center">
                  <ImageIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-center text-muted-foreground">
                    Click the button below to generate a creative image prompt based on your attribute settings.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Button onClick={generatePrompt} disabled={isGenerating} className="w-full gap-2" size="lg">
            {isGenerating ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                Generate Creative Prompt
              </>
            )}
          </Button>
        </TabsContent>

        <TabsContent value="elements">
          <Card>
            <CardContent className="p-6">
              {Object.keys(selectedElements).length > 0 ? (
                <div className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    {Object.entries(selectedElements).map(([key, value]) => (
                      <div key={key} className="rounded-md border p-3">
                        <h4 className="mb-1 text-sm font-medium capitalize">{key}</h4>
                        <p className="text-sm text-muted-foreground">{value}</p>
                      </div>
                    ))}
                  </div>

                  {creativeTwist && (
                    <div className="rounded-md border border-primary/20 bg-primary/5 p-3">
                      <h4 className="mb-1 text-sm font-medium text-primary">Creative Twist</h4>
                      <p className="text-sm text-primary/80">{creativeTwist}</p>
                    </div>
                  )}

                  <div className="rounded-md bg-muted p-3">
                    <h4 className="mb-1 text-sm font-medium">Creativity Score</h4>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground">Based on attribute weights and synergies</p>
                      <Badge variant="outline">{calculateScore().toFixed(2)}</Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex min-h-[200px] flex-col items-center justify-center">
                  <p className="text-center text-muted-foreground">
                    Generate a prompt first to see the selected elements.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="overflow-hidden rounded-md border">
          <Image
            src={blobImageUrls.element1 || "/placeholder.svg"}
            alt="Sample generated image 1"
            width={400}
            height={300}
            className="aspect-video w-full object-cover transition-all hover:scale-105"
            unoptimized
          />
        </div>
        <div className="overflow-hidden rounded-md border">
          <Image
            src={blobImageUrls.element5 || "/placeholder.svg"}
            alt="Sample generated image 2"
            width={400}
            height={300}
            className="aspect-video w-full object-cover transition-all hover:scale-105"
            unoptimized
          />
        </div>
        <div className="overflow-hidden rounded-md border">
          <Image
            src={blobImageUrls.element3 || "/placeholder.svg"}
            alt="Sample generated image 3"
            width={400}
            height={300}
            className="aspect-video w-full object-cover transition-all hover:scale-105"
            unoptimized
          />
        </div>
      </div>
    </div>
  )
}
