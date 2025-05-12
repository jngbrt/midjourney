"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RefreshCw, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

// Import p5 dynamically to avoid SSR issues
const ReactP5Wrapper = dynamic(() => import("react-p5-wrapper").then((mod) => mod.ReactP5Wrapper), {
  ssr: false,
})

export default function CreativeCanvas() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [iteration, setIteration] = useState(0)
  const [alpha, setAlpha] = useState(0.5)
  const [beta, setBeta] = useState(0.3)
  const [gamma, setGamma] = useState(0.7)
  const [delta, setDelta] = useState(0.05) // Decay factor
  const [theta, setTheta] = useState(0.6) // Threshold
  const [currentScore, setCurrentScore] = useState(0)
  const [scorePercentage, setScorePercentage] = useState(0)
  const [thresholdReached, setThresholdReached] = useState(false)

  const p5Ref = useRef(null)

  const handleScoreUpdate = (score, percentage, threshold) => {
    setCurrentScore(score)
    setScorePercentage(percentage)
    setThresholdReached(threshold)
  }

  const toggleAnimation = () => {
    if (p5Ref.current) {
      p5Ref.current.setPlaying(!isPlaying)
      setIsPlaying(!isPlaying)
    }
  }

  const resetAnimation = () => {
    if (p5Ref.current) {
      p5Ref.current.resetAnimation()
      p5Ref.current.setPlaying(false)
      setIsPlaying(false)
      setIteration(0)
    }
  }

  const downloadCanvas = () => {
    if (p5Ref.current) {
      p5Ref.current.downloadCanvas()
    }
  }

  // Update p5 sketch when parameters change
  useEffect(() => {
    if (p5Ref.current) {
      p5Ref.current.updateParams(alpha, beta, gamma, delta, theta)
    }
  }, [alpha, beta, gamma, delta, theta])

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Interactive Creative System Visualization</h3>

      <div className="mb-4 rounded-md bg-muted p-1 overflow-hidden">
        <ReactP5Wrapper
          sketch={sketch}
          alpha={alpha}
          beta={beta}
          gamma={gamma}
          delta={delta}
          theta={theta}
          onScoreUpdate={handleScoreUpdate}
          ref={p5Ref}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Creativity Score:</span>
            <span className="text-sm">{currentScore.toFixed(3)}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm">Threshold:</span>
            <span className="text-sm">{theta.toFixed(2)}</span>
          </div>
        </div>

        <div className="relative pt-1">
          <Progress value={scorePercentage} className="h-2" />
          <div
            className="absolute top-1 h-3 w-0.5 bg-red-500"
            style={{ left: `${theta * 100}%`, transform: "translateX(-50%)" }}
          />
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>

        {thresholdReached && (
          <Badge variant="outline" className="bg-primary/10 text-primary">
            Creative Threshold Reached!
          </Badge>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Alpha (Deterministic Weight)</label>
            <Slider value={[alpha]} min={0} max={1} step={0.01} onValueChange={(value) => setAlpha(value[0])} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Beta (Random Amplitude)</label>
            <Slider value={[beta]} min={0} max={1} step={0.01} onValueChange={(value) => setBeta(value[0])} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Gamma (Creativity Factor)</label>
            <Slider value={[gamma]} min={0} max={1} step={0.01} onValueChange={(value) => setGamma(value[0])} />
          </div>
        </div>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Delta (Decay Factor)</label>
            <Slider value={[delta]} min={0} max={0.2} step={0.01} onValueChange={(value) => setDelta(value[0])} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Theta (Creativity Threshold)</label>
            <Slider value={[theta]} min={0.1} max={1} step={0.01} onValueChange={(value) => setTheta(value[0])} />
          </div>
          <div className="text-sm text-muted-foreground">
            <p>Iteration: {iteration}</p>
            <p>Formula: Score(t) = γ·C_deterministic + ε(t) - δ·ln(1+t)</p>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Button onClick={toggleAnimation} className="flex-1 gap-2">
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? "Pause" : "Play"}
        </Button>
        <Button variant="outline" onClick={resetAnimation} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
        <Button variant="outline" onClick={downloadCanvas} className="gap-2">
          <Download className="h-4 w-4" />
          Save
        </Button>
      </div>
    </div>
  )
}

// Replace the existing canvas-related functions and useEffect with this p5.js sketch function
const sketch = (p5) => {
  let iteration = 0
  let isPlaying = false
  let currentScore = 0
  let scorePercentage = 0
  let thresholdReached = false

  p5.setup = () => {
    p5.createCanvas(p5.windowWidth, 300)
    p5.frameRate(30)
    drawCanvas(0)
  }

  p5.draw = () => {
    if (isPlaying) {
      iteration++
      drawCanvas(iteration)
    }
  }

  p5.windowResized = () => {
    p5.resizeCanvas(p5.windowWidth, 300)
    drawCanvas(iteration)
  }

  const drawCanvas = (t) => {
    const width = p5.width
    const height = p5.height

    // Clear canvas
    p5.background(255)

    // Create gradient background
    for (let y = 0; y < height; y++) {
      const inter = p5.map(y, 0, height, 0, 1)
      const c = p5.lerpColor(p5.color(238, 210, 255, 25), p5.color(210, 210, 255, 25), inter)
      p5.stroke(c)
      p5.line(0, y, width, y)
    }

    // Grid size
    const cellSize = 20
    const cols = Math.floor(width / cellSize)
    const rows = Math.floor(height / cellSize)

    // Draw grid
    p5.stroke(150, 150, 200, 50)
    p5.strokeWeight(0.5)

    for (let i = 0; i <= cols; i++) {
      const x = i * cellSize
      p5.line(x, 0, x, height)
    }

    for (let j = 0; j <= rows; j++) {
      const y = j * cellSize
      p5.line(0, y, width, y)
    }

    // Track the maximum score for normalization
    let maxScore = 0
    let totalScore = 0
    let cellsAboveThreshold = 0
    let totalCells = 0

    // First pass: calculate scores and find maximum
    const cellScores = []
    for (let i = 0; i < cols; i++) {
      cellScores[i] = []
      for (let j = 0; j < rows; j++) {
        // Calculate attribute vector components (s_i values)
        const s1 = (i / cols) * (1 + t * 0.0005) // Subject attribute
        const s2 = (j / rows) * (1 + t * 0.0003) // Style attribute
        const s3 = ((i + j) / (cols + rows)) * (1 + t * 0.0001) // Mood attribute

        // Calculate weights (w_i values)
        const w1 = p5.alpha
        const w2 = p5.beta
        const w3 = p5.gamma

        // Calculate synergy terms (λ_ij values)
        const lambda12 = 0.2
        const lambda13 = 0.15
        const lambda23 = 0.25

        // Neighborhood influence (N)
        // N = Σ w_i·s_i + Σ Σ λ_ij·(s_i·s_j)
        const N = w1 * s1 + w2 * s2 + w3 * s3 + (lambda12 * s1 * s2 + lambda13 * s1 * s3 + lambda23 * s2 * s3)

        // Nonlinear transformation - deterministic component
        // C_deterministic = f(α·N)
        const C_deterministic = 1 / (1 + Math.exp(-5 * N))

        // Random perturbation - epsilon(t)
        // ε(t) = β·sin(ωt + φ) + ξ
        const omega = 0.01
        const phi = i * j * 0.1
        const xi = p5.random(0.1)
        const epsilon = p5.beta * Math.sin(omega * t + phi) + xi

        // Composite Creativity Score
        // Score(t) = γ·C_deterministic + ε(t) - δ·ln(1+t)
        const score = p5.gamma * C_deterministic + epsilon - p5.delta * Math.log(1 + t * 0.01)

        cellScores[i][j] = score
        maxScore = Math.max(maxScore, score)
        totalScore += score
        totalCells++

        if (score >= p5.theta) {
          cellsAboveThreshold++
        }
      }
    }

    // Calculate average score and percentage
    const avgScore = totalScore / totalCells
    const thresholdPercentageValue = (cellsAboveThreshold / totalCells) * 100

    // Update state with the current score
    currentScore = avgScore
    scorePercentage = Math.min((avgScore / p5.theta) * 100, 100)
    thresholdReached = avgScore >= p5.theta

    // Update the parent component's state
    if (p5.onScoreUpdate) {
      p5.onScoreUpdate(currentScore, scorePercentage, thresholdReached)
    }

    // Second pass: draw cells with normalized scores
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const x = i * cellSize
        const y = j * cellSize

        // Get the score for this cell
        const score = cellScores[i][j]

        // Normalize score for visual representation
        const normalizedScore = maxScore > 0 ? score / maxScore : 0

        // Threshold-based creative twist
        // if Score(t) ≥ θ, then apply creative twist
        const hasCreativeTwist = score >= p5.theta

        // Draw cell
        if (hasCreativeTwist) {
          // Apply creative twist with more vibrant colors and circular shapes
          const hue = (((i * j) % 360) + t * 0.1) % 360
          p5.noStroke()
          p5.fill(p5.color(`hsla(${hue}, 80%, 60%, ${Math.min(normalizedScore, 1)})`))
          p5.ellipse(x + cellSize / 2, y + cellSize / 2, cellSize * Math.min(normalizedScore, 1))

          // Add a glow effect for cells above threshold
          p5.drawingContext.shadowColor = `hsla(${hue}, 80%, 60%, 0.6)`
          p5.drawingContext.shadowBlur = 10
          p5.ellipse(x + cellSize / 2, y + cellSize / 2, cellSize * Math.min(normalizedScore, 1) * 0.8)
          p5.drawingContext.shadowBlur = 0
        } else {
          // Standard representation with squares
          const brightness = Math.floor(Math.min(normalizedScore, 1) * 255)
          p5.noStroke()
          p5.fill(brightness, brightness, brightness + 50, Math.min(normalizedScore, 1) * 255)
          p5.rect(x, y, cellSize * Math.min(normalizedScore, 1), cellSize * Math.min(normalizedScore, 1))
        }
      }
    }
  }

  // Methods to control the animation
  p5.setPlaying = (playing) => {
    isPlaying = playing
  }

  p5.resetAnimation = () => {
    iteration = 0
    drawCanvas(0)
  }

  p5.getIteration = () => iteration

  p5.downloadCanvas = () => {
    p5.saveCanvas(`creative-system-iteration-${iteration}`, "png")
  }

  // Methods to update parameters
  p5.updateParams = (a, b, g, d, t) => {
    p5.alpha = a
    p5.beta = b
    p5.gamma = g
    p5.delta = d
    p5.theta = t
    drawCanvas(iteration)
  }
}
