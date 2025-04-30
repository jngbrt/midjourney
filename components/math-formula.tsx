"use client"

import { useEffect, useRef } from "react"

interface MathFormulaProps {
  formula: string
}

export function MathFormula({ formula }: MathFormulaProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined" && containerRef.current) {
      // Dynamically import KaTeX
      import("katex").then((katex) => {
        import("katex/dist/katex.min.css")
        if (containerRef.current) {
          katex.default.render(formula, containerRef.current, {
            throwOnError: false,
            displayMode: true,
          })
        }
      })
    }
  }, [formula])

  return (
    <div className="overflow-x-auto py-2">
      <div ref={containerRef} className="text-center" />
    </div>
  )
}
