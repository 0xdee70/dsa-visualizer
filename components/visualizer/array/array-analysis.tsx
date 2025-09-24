
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { ArrayElement, ArrayOperation } from "./types"

interface ArrayAnalysisProps {
  elements: ArrayElement[]
  capacity: number
  operations: ArrayOperation[]
}

export function ArrayAnalysis({ elements, capacity, operations }: ArrayAnalysisProps) {
  const size = elements.length
  const loadFactor = capacity > 0 ? (size / capacity * 100) : 0
  const isEmpty = size === 0
  const isFull = size === capacity
  
  // Calculate basic statistics
  const values = elements.map(el => el.value)
  const sum = values.reduce((acc, val) => acc + val, 0)
  const avg = values.length > 0 ? (sum / values.length).toFixed(2) : "0"
  const min = values.length > 0 ? Math.min(...values) : null
  const max = values.length > 0 ? Math.max(...values) : null

  // Check if array is sorted
  const isSorted = values.length <= 1 || values.every((val, i) => i === 0 || values[i - 1] <= val)
  const isReverseSorted = values.length <= 1 || values.every((val, i) => i === 0 || values[i - 1] >= val)

  // Find duplicates
  const duplicates = values.filter((val, i) => values.indexOf(val) !== i)
  const uniqueValues = [...new Set(values)]

  // Operation statistics
  const operationCounts = operations.reduce((acc, op) => {
    acc[op.type] = (acc[op.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  // Interview pattern analysis
  const getPatternComplexity = () => {
    const patterns = []
    
    if (isSorted) {
      patterns.push({ name: "Binary Search", complexity: "O(log n)", suitable: true })
      patterns.push({ name: "Two Pointers", complexity: "O(n)", suitable: true })
      patterns.push({ name: "Merge Arrays", complexity: "O(n + m)", suitable: true })
    } else {
      patterns.push({ name: "Binary Search", complexity: "N/A", suitable: false })
    }
    
    patterns.push({ name: "Linear Search", complexity: "O(n)", suitable: true })
    patterns.push({ name: "Sliding Window", complexity: "O(n)", suitable: values.length > 2 })
    patterns.push({ name: "Prefix Sum", complexity: "O(n)", suitable: true })
    patterns.push({ name: "Hash Map Lookup", complexity: "O(n)", suitable: duplicates.length > 0 })
    
    return patterns
  }

  const patterns = getPatternComplexity()

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Load Factor</span>
              <span>{loadFactor.toFixed(1)}%</span>
            </div>
            <Progress value={loadFactor} className="h-2" />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">State</span>
              <Badge variant={isEmpty ? "secondary" : isFull ? "destructive" : "default"}>
                {isEmpty ? "Empty" : isFull ? "Full" : "Available"}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Sorted</span>
              <Badge variant={isSorted ? "default" : "secondary"}>
                {isSorted ? "Yes" : isReverseSorted ? "Reverse" : "No"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Element Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Element Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEmpty ? (
            <div className="text-center text-muted-foreground py-4">
              No elements to analyze
            </div>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Min</div>
                  <div className="text-lg font-bold">{min}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Max</div>
                  <div className="text-lg font-bold">{max}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Avg</div>
                  <div className="text-lg font-bold">{avg}</div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Sum</span>
                  <Badge variant="outline">{sum}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Unique Values</span>
                  <Badge variant="outline">{uniqueValues.length}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Duplicates</span>
                  <Badge variant={duplicates.length > 0 ? "destructive" : "secondary"}>
                    {duplicates.length}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interview Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interview Patterns</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground mb-2">
            Common algorithmic patterns for this array:
          </div>
          <div className="space-y-2">
            {patterns.map((pattern, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className={`text-sm ${pattern.suitable ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {pattern.name}
                </span>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={pattern.suitable ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {pattern.complexity}
                  </Badge>
                  {pattern.suitable ? "✅" : "❌"}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Time Complexity Reference */}
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
              <span className="text-sm">Insert at position</span>
              <Badge variant="outline">O(n)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Delete at position</span>
              <Badge variant="outline">O(n)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Linear search</span>
              <Badge variant="outline">O(n)</Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Binary search</span>
              <Badge variant={isSorted ? "default" : "secondary"}>
                {isSorted ? "O(log n)" : "N/A"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Common Interview Problems */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Interview Problems</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm text-muted-foreground mb-2">
            Problems you can solve with this array:
          </div>
          <div className="space-y-2">
            <div className="text-sm">
              <span className="font-medium">Two Sum:</span> Find pairs that sum to target
            </div>
            <div className="text-sm">
              <span className="font-medium">Maximum Subarray:</span> Kadane's algorithm
            </div>
            <div className="text-sm">
              <span className="font-medium">Rotate Array:</span> Rotation techniques
            </div>
            <div className="text-sm">
              <span className="font-medium">Merge Sorted:</span> {isSorted ? "✅ Ready" : "❌ Sort first"}
            </div>
            <div className="text-sm">
              <span className="font-medium">Remove Duplicates:</span> {duplicates.length > 0 ? "✅ Has duplicates" : "❌ No duplicates"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operation Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Operation History</CardTitle>
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
