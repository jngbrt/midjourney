"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, RefreshCw, Download } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

export default function CreativeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
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
  const animationRef = useRef<number | null>(null)

  const calculateScore = (t: number, a: number, b: number, g: number, d: number) => {
    // Calculate a sample deterministic component
    const N = a * 0.5 + b * 0.3 + g * 0.7 + 0.2 * 0.5 * 0.3
    const C_deterministic = 1 / (1 + Math.exp(-5 * N))

    // Calculate random perturbation
    const epsilon = b * Math.sin(0.01 * t) + 0.05 * Math.random()

    // Calculate composite score
    return g * C_deterministic + epsilon - d * Math.log(1 + t * 0.01)
  }

  const drawCanvas = (canvas: HTMLCanvasElement, t: number) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "rgba(238, 210, 255, 0.1)")
    gradient.addColorStop(1, "rgba(210, 210, 255, 0.1)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    // Grid size
    const cellSize = 20
    const cols = Math.floor(width / cellSize)
    const rows = Math.floor(height / cellSize)

    // Draw grid
    ctx.strokeStyle = "rgba(150, 150, 200, 0.2)"
    ctx.lineWidth = 0.5

    for (let i = 0; i <= cols; i++) {
      const x = i * cellSize
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, height)
      ctx.stroke()
    }

    for (let j = 0; j <= rows; j++) {
      const y = j * cellSize
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(width, y)
      ctx.stroke()
    }

    // Track the maximum score for normalization
    let maxScore = 0
    let totalScore = 0
    let cellsAboveThreshold = 0
    let totalCells = 0

    // First pass: calculate scores and find maximum
    const cellScores: number[][] = []
    for (let i = 0; i < cols; i++) {
      cellScores[i] = []
      for (let j = 0; j < rows; j++) {
        // Calculate attribute vector components (s_i values)
        const s1 = (i / cols) * (1 + t * 0.0005) // Subject attribute
        const s2 = (j / rows) * (1 + t * 0.0003) // Style attribute
        const s3 = ((i + j) / (cols + rows)) * (1 + t * 0.0001) // Mood attribute

        // Calculate weights (w_i values)
        const w1 = alpha
        const w2 = beta
        const w3 = gamma

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
        const xi = Math.random() * 0.1
        const epsilon = beta * Math.sin(omega * t + phi) + xi

        // Composite Creativity Score
        // Score(t) = γ·C_deterministic + ε(t) - δ·ln(1+t)
        const score = gamma * C_deterministic + epsilon - delta * Math.log(1 + t * 0.01)

        cellScores[i][j] = score
        maxScore = Math.max(maxScore, score)
        totalScore += score
        totalCells++

        if (score >= theta) {
          cellsAboveThreshold++
        }
      }
    }

    // Calculate average score and percentage
    const avgScore = totalScore / totalCells
    const thresholdPercentage = (cellsAboveThreshold / totalCells) * 100

    // Update state with the current score
    setCurrentScore(avgScore)
    setScorePercentage(Math.min((avgScore / theta) * 100, 100))
    setThresholdReached(avgScore >= theta)

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
        const hasCreativeTwist = score >= theta

        // Draw cell
        if (hasCreativeTwist) {
          // Apply creative twist with more vibrant colors and circular shapes
          const hue = (((i * j) % 360) + t * 0.1) % 360
          ctx.fillStyle = `hsla(${hue}, 80%, 60%, ${Math.min(normalizedScore, 1)})`
          ctx.beginPath()
          ctx.arc(x + cellSize / 2, y + cellSize / 2, (cellSize / 2) * Math.min(normalizedScore, 1), 0, Math.PI * 2)
          ctx.fill()

          // Add a glow effect for cells above threshold
          ctx.shadowColor = `hsla(${hue}, 80%, 60%, 0.6)`
          ctx.shadowBlur = 10
          ctx.beginPath()
          ctx.arc(
            x + cellSize / 2,
            y + cellSize / 2,
            (cellSize / 2) * Math.min(normalizedScore, 1) * 0.8,
            0,
            Math.PI * 2,
          )
          ctx.fill()
          ctx.shadowBlur = 0
        } else {
          // Standard representation with squares
          const brightness = Math.floor(Math.min(normalizedScore, 1) * 255)
          ctx.fillStyle = `rgba(${brightness}, ${brightness}, ${brightness + 50}, ${Math.min(normalizedScore, 1)})`
          ctx.fillRect(x, y, cellSize * Math.min(normalizedScore, 1), cellSize * Math.min(normalizedScore, 1))
        }
      }
    }
  }

  const animate = () => {
    if (!canvasRef.current) return

    // Use a smaller increment for smoother evolution
    setIteration((prev) => prev + 1)
    drawCanvas(canvasRef.current, iteration)

    animationRef.current = requestAnimationFrame(animate)
  }

  const toggleAnimation = () => {
    if (isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
    } else {
      animate()
    }
    setIsPlaying(!isPlaying)
  }

  const resetAnimation = () => {
    setIteration(0)
    if (canvasRef.current) {
      drawCanvas(canvasRef.current, 0)
    }
    if (isPlaying) {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      setIsPlaying(false)
    }
  }

  const downloadCanvas = () => {
    if (canvasRef.current) {
      const link = document.createElement("a")
      link.download = `creative-system-iteration-${iteration}.png`
      link.href = canvasRef.current.toDataURL("image/png")
      link.click()
    }
  }

  useEffect(() => {
    if (!canvasRef.current) return

    // Set canvas dimensions
    const canvas = canvasRef.current
    const container = canvas.parentElement
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = 300
    }

    // Initial draw
    drawCanvas(canvas, iteration)

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [alpha, beta, gamma, delta, theta])

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-medium">Interactive Creative System Visualization</h3>

      <div className="mb-4 rounded-md bg-muted p-1">
        <canvas ref={canvasRef} className="w-full rounded" />
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
