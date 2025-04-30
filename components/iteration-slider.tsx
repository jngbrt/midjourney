"use client"

import { useState } from "react"
import Image from "next/image"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { blobImageUrls } from "@/lib/blob-storage"

export default function IterationSlider() {
  const [iteration, setIteration] = useState(1)
  const maxIterations = 6

  const handlePrevious = () => {
    setIteration((prev) => (prev > 1 ? prev - 1 : maxIterations))
  }

  const handleNext = () => {
    setIteration((prev) => (prev < maxIterations ? prev + 1 : 1))
  }

  // Map iteration number to the corresponding blob URL
  const getImageUrl = (iteration: number) => {
    switch (iteration) {
      case 1:
        return blobImageUrls.element1
      case 2:
        return blobImageUrls.element2
      case 3:
        return blobImageUrls.element3
      case 4:
        return blobImageUrls.element4
      case 5:
        return blobImageUrls.element5
      case 6:
        return blobImageUrls.element6
      default:
        return blobImageUrls.element1
    }
  }

  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <h3 className="mb-6 text-center text-xl font-medium">Iteration Evolution</h3>
      <div className="mb-8 flex items-center justify-center">
        <Button variant="outline" size="icon" onClick={handlePrevious}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="mx-4 aspect-video w-full max-w-xl overflow-hidden rounded-lg">
          <Image
            src={getImageUrl(iteration) || "/placeholder.svg"}
            width={800}
            height={600}
            alt={`Iteration ${iteration}`}
            className="h-full w-full object-cover"
            unoptimized
          />
        </div>
        <Button variant="outline" size="icon" onClick={handleNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="mx-auto max-w-md space-y-4">
        <Slider
          value={[iteration]}
          min={1}
          max={maxIterations}
          step={1}
          onValueChange={(value) => setIteration(value[0])}
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Initial State</span>
          <span>Final Evolution</span>
        </div>
        <div className="text-center">
          <h4 className="font-medium">Iteration {iteration}</h4>
          <p className="text-sm text-muted-foreground">
            {iteration === 1 && "Base attributes with minimal random influence."}
            {iteration === 2 && "Emerging patterns with increased synergy effects."}
            {iteration === 3 && "Nonlinear transformations becoming more prominent."}
            {iteration === 4 && "Creative threshold crossed, new visual elements emerge."}
            {iteration === 5 && "Complex interactions between deterministic and random factors."}
            {iteration === 6 && "Final evolution with maximum creative expression."}
          </p>
        </div>
      </div>
    </div>
  )
}
