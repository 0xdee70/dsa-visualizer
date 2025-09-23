"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrayElement } from "./types"

import { ArrayOperation } from "./types"

interface ArrayAnalysisProps {
  elements: ArrayElement[]
  capacity: number
  operations: ArrayOperation[]
}

export function ArrayAnalysis({ elements, capacity, operations }: ArrayAnalysisProps) {
  const size = elements.length
  const loadFactor = capacity > 0 ? (size / capacity * 100).toFixed(1) : "0"
  const isEmpty = size === 0
  const isFull = size === capacity
  
  // Calculate basic statistics
  const values = elements.map(el => el.value)
  const sum = values.reduce((acc, val) => acc + val, 0)
  const avg = values.length > 0 ? (sum / values.length).toFixed(2) : "0"
  const min = values.length > 0 ? Math.min(...values) : null
  const max = values.length > 0 ? Math.max(...values) : null

  // Operation statistics
  const operationCounts = operations.reduce((acc, op) => {
    acc[op.type] = (acc[op.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Array Properties */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Array Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Size</div>
              <div className="text-2xl font-bold">{size}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Capacity</div>
              <div className="text-2xl font-bold">{capacity}</div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Load Factor</span>
              <Badge variant={parseInt(loadFactor) > 75 ? "destructive" : "secondary"}>
                {loadFactor}%
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Status</span>
              <Badge variant={isEmpty ? "secondary" : isFull ? "destructive" : "default"}>
                {isEmpty ? "Empty" : isFull ? "Full" : "Available"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Element Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Element Statistics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEmpty ? (
            <div className="text-center text-muted-foreground py-4">
              No elements to analyze
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Average</div>
                  <div className="text-xl font-bold">{avg}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Minimum</div>
                  <div className="text-xl font-bold">{min}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Maximum</div>
                  <div className="text-xl font-bold">{max}</div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <div className="text-sm text-muted-foreground mb-2">Sum</div>
                <div className="text-xl font-bold">{sum}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Time Complexity */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Time Complexity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Access by index</span>
              <Badge variant="secondary">O(1)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Insert at end</span>
              <Badge variant="secondary">O(1)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Insert at index</span>
              <Badge variant="outline">O(n)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Delete at index</span>
              <Badge variant="outline">O(n)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Search</span>
              <Badge variant="outline">O(n)</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operation Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Operation Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          {Object.keys(operationCounts).length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No operations performed yet
            </div>
          ) : (
            <div className="space-y-2">
              {Object.entries(operationCounts).map(([operation, count]) => (
                <div key={operation} className="flex justify-between">
                  <span className="text-sm capitalize">{operation}</span>
                  <Badge variant="outline">{count}</Badge>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between font-medium">
                <span className="text-sm">Total Operations</span>
                <Badge>{operations.length}</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}