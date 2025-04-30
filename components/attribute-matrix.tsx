"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"
import { PromptGenerator } from "./prompt-generator"

export default function AttributeMatrix() {
  const [attributes, setAttributes] = useState({
    subject: 0.7,
    style: 0.6,
    mood: 0.5,
    detail: 0.8,
    context: 0.4,
  })

  const calculateSynergy = (attr1: number, attr2: number) => {
    return (attr1 * attr2 * 1.2).toFixed(2)
  }

  const calculateScore = () => {
    const values = Object.values(attributes)
    const sum = values.reduce((acc, val) => acc + val, 0)

    // Calculate synergy terms
    let synergy = 0
    const keys = Object.keys(attributes)
    for (let i = 0; i < keys.length; i++) {
      for (let j = i + 1; j < keys.length; j++) {
        synergy += attributes[keys[i] as keyof typeof attributes] * attributes[keys[j] as keyof typeof attributes] * 0.2
      }
    }

    return (sum + synergy).toFixed(2)
  }

  const randomizeAttributes = () => {
    setAttributes({
      subject: Math.random(),
      style: Math.random(),
      mood: Math.random(),
      detail: Math.random(),
      context: Math.random(),
    })
  }

  return (
    <>
      <div className="rounded-lg border bg-card p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium">Attribute Matrix</h3>
          <Button variant="outline" size="sm" onClick={randomizeAttributes} className="gap-2">
            <RefreshCw className="h-3 w-3" />
            Randomize
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-4">
            {Object.entries(attributes).map(([key, value]) => (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium capitalize">{key}</label>
                  <span className="text-sm text-muted-foreground">{value.toFixed(2)}</span>
                </div>
                <Slider
                  value={[value]}
                  min={0}
                  max={1}
                  step={0.01}
                  onValueChange={(val) => setAttributes((prev) => ({ ...prev, [key]: val[0] }))}
                />
              </div>
            ))}

            <div className="mt-6 rounded-md bg-muted p-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Score:</span>
                <span className="text-lg font-bold">{calculateScore()}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                This score combines individual attribute weights and their synergistic interactions.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Synergy</TableHead>
                  {Object.keys(attributes).map((key) => (
                    <TableHead key={key} className="capitalize">
                      {key}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(attributes).map(([rowKey, rowValue]) => (
                  <TableRow key={rowKey}>
                    <TableCell className="font-medium capitalize">{rowKey}</TableCell>
                    {Object.entries(attributes).map(([colKey, colValue]) => (
                      <TableCell key={colKey}>
                        {rowKey === colKey ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          calculateSynergy(rowValue, colValue)
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <PromptGenerator attributeValues={attributes} />
    </>
  )
}
