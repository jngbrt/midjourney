import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronRight, Layers, Lightbulb, Sparkles, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import CreativeCanvas from "@/components/creative-canvas"
import IterationSlider from "@/components/iteration-slider"
import AttributeMatrix from "@/components/attribute-matrix"
import { MathFormula } from "@/components/math-formula"
import { blobImageUrls } from "@/lib/blob-storage"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
          <div className="flex gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <Sparkles className="h-6 w-6" />
              <span className="inline-block font-bold">Artistry</span>
            </Link>
            <nav className="hidden gap-6 md:flex">
              <Link
                href="#features"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
              >
                Features
              </Link>
              <Link
                href="#process"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
              >
                Process
              </Link>
              <Link
                href="#gallery"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
              >
                Gallery
              </Link>
              <Link
                href="#about"
                className="flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm"
              >
                About
              </Link>
            </nav>
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <Button variant="ghost" size="sm">
              Sign In
            </Button>
            <Button size="sm">Get Started</Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Dynamic Creativity System for Advertising Excellence
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Our iterative creative framework transforms artistic elements into stunning, photorealistic
                    advertising visuals that evolve with mathematical precision.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button className="gap-1">
                    Experience the System <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="outline">View Gallery</Button>
                </div>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted lg:aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20" />
                <Image
                  src={blobImageUrls.heroImage || "/placeholder.svg"}
                  width={1200}
                  height={800}
                  alt="Artistic representation of the creative system"
                  className="h-full w-full object-cover"
                  priority
                  unoptimized
                />
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                  Our Approach
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Mathematical Framework for Enhanced Realism
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  A sophisticated system where deterministic influences and multiple layers of random perturbations
                  interact to produce strikingly realistic outputs.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="grid gap-6">
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Attributes as Cells</h3>
                  <p className="text-muted-foreground">
                    Each artistic element (subject, style, mood, detail, context) is represented as a component within a
                    vector, favoring super realistic, photographic quality.
                  </p>
                  <div className="mt-2">
                    <MathFormula formula="\mathbf{s} = [s_1, s_2, \dots, s_n]" />
                  </div>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Neighborhood and Synergy Influence</h3>
                  <p className="text-muted-foreground">
                    A primary theme score that captures contributions from individual attribute weights and their
                    interactions, emphasizing realism and commercial appeal.
                  </p>
                  <div className="mt-2">
                    <MathFormula formula="N = \sum_{i=1}^{n} w_i \cdot s_i + \sum_{i=1}^{n}\sum_{j>i} \lambda_{ij} \cdot (s_i \cdot s_j)" />
                  </div>
                </div>
                <div className="grid gap-1">
                  <h3 className="text-xl font-bold">Nonlinear Transformation</h3>
                  <p className="text-muted-foreground">
                    Applying nonlinear functions to accentuate creative variations, introducing time-dependent
                    randomness for unexpected yet cohesive results.
                  </p>
                  <div className="mt-2">
                    <MathFormula formula="C_{\text{deterministic}} = f(\alpha \cdot N)" />
                    <MathFormula formula="\epsilon(t) = \beta \cdot \sin(\omega t + \phi) + \xi" />
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl bg-muted">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
                <Image
                  src={blobImageUrls.mathFramework || "/placeholder.svg"}
                  width={1200}
                  height={800}
                  alt="Visual representation of the mathematical framework"
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="mt-12">
              <AttributeMatrix />
            </div>
          </div>
        </section>

        <section id="gallery" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">The Creative Grid</h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore our cellular automaton of artistic elements, where each iteration produces unique,
                  photorealistic advertising visuals.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={blobImageUrls.element1 || "/placeholder.svg"}
                    width={800}
                    height={600}
                    alt="Creative element 1"
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Iteration 1</h3>
                  <p className="text-sm text-muted-foreground">
                    A unique blend of deterministic structure and random variation, creating photorealistic advertising
                    imagery.
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                      Explore <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={blobImageUrls.element2 || "/placeholder.svg"}
                    width={800}
                    height={600}
                    alt="Creative element 2"
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Iteration 2</h3>
                  <p className="text-sm text-muted-foreground">
                    A unique blend of deterministic structure and random variation, creating photorealistic advertising
                    imagery.
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                      Explore <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={blobImageUrls.element3 || "/placeholder.svg"}
                    width={800}
                    height={600}
                    alt="Creative element 3"
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Iteration 3</h3>
                  <p className="text-sm text-muted-foreground">
                    A unique blend of deterministic structure and random variation, creating photorealistic advertising
                    imagery.
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                      Explore <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={blobImageUrls.element4 || "/placeholder.svg"}
                    width={800}
                    height={600}
                    alt="Creative element 4"
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Iteration 4</h3>
                  <p className="text-sm text-muted-foreground">
                    A unique blend of deterministic structure and random variation, creating photorealistic advertising
                    imagery.
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                      Explore <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={blobImageUrls.element5 || "/placeholder.svg"}
                    width={800}
                    height={600}
                    alt="Creative element 5"
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Iteration 5</h3>
                  <p className="text-sm text-muted-foreground">
                    A unique blend of deterministic structure and random variation, creating photorealistic advertising
                    imagery.
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                      Explore <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
              <div className="group relative overflow-hidden rounded-lg border bg-background p-2 transition-all hover:shadow-md">
                <div className="aspect-[4/3] overflow-hidden rounded-md bg-muted">
                  <Image
                    src={blobImageUrls.element6 || "/placeholder.svg"}
                    width={800}
                    height={600}
                    alt="Creative element 6"
                    className="h-full w-full object-cover transition-all group-hover:scale-105"
                    unoptimized
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold">Iteration 6</h3>
                  <p className="text-sm text-muted-foreground">
                    A unique blend of deterministic structure and random variation, creating photorealistic advertising
                    imagery.
                  </p>
                  <div className="mt-4 flex items-center text-sm">
                    <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
                      Explore <ChevronRight className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-12">
              <IterationSlider />
            </div>
          </div>
        </section>

        <section id="process" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">
                    Our Process
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Iterative Evolution of Creativity
                  </h2>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                    Each generation blends fixed, realism-oriented influences with layered, time-dependent randomness to
                    create advertising visuals that are both structured and uniquely unpredictable.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Layers className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Composite Creativity Score</h3>
                      <p className="text-sm text-muted-foreground">
                        Combining deterministic and random elements with a decay factor to encourage novelty across
                        iterations.
                      </p>
                      <div className="mt-2">
                        <MathFormula formula="\text{Score}(t) = \gamma \cdot C_{\text{deterministic}} + \epsilon(t) - \delta \cdot \ln(1+t)" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Zap className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Threshold-Based Creative Twists</h3>
                      <p className="text-sm text-muted-foreground">
                        When the score exceeds a threshold, an extra creative twist is added to the visual output.
                      </p>
                      <div className="mt-2">
                        <MathFormula formula="\text{if } \text{Score}(t) \geq \theta \text{, then apply creative twist}" />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                      <Lightbulb className="h-5 w-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-medium">Photorealistic Advertising Aesthetics</h3>
                      <p className="text-sm text-muted-foreground">
                        Emphasizing super realistic, photographic appearance ideal for capturing real humans or products
                        in dynamic, high-quality scenes.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-muted lg:aspect-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-blue-500/20" />
                <Image
                  src={blobImageUrls.creativeProcess || "/placeholder.svg"}
                  width={1200}
                  height={800}
                  alt="Visualization of the iterative creative process"
                  className="h-full w-full object-cover"
                  unoptimized
                />
              </div>
            </div>
            <div className="mt-12">
              <CreativeCanvas />
            </div>
          </div>
        </section>

        <section id="about" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                  Ready to Transform Your Advertising?
                </h2>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Experience the power of our dynamic, iterative creative system and elevate your brand with
                  photorealistic advertising visuals.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button size="lg" className="gap-1">
                  Get Started Today <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg">
                  Request a Demo
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="w-full border-t bg-background py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 Artistry. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium hover:underline">
              Terms
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Privacy
            </Link>
            <Link href="#" className="text-sm font-medium hover:underline">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
