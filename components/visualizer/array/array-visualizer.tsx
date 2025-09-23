"use client"

import { ArrayControls } from "@/components/visualizer/array/array-controls"
import { ArrayDisplay } from "@/components/visualizer/array/array-display"
import { ArrayOperations } from "@/components/visualizer/array/array-operations"
import { ArrayAnalysis } from "@/components/visualizer/array/array-analysis"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarkdownContent } from "@/components/shared/markdown-content"
import { useArray } from "@/hooks/use-array"

interface ArrayVisualizerProps {
  content: React.ReactNode
}

export function ArrayVisualizer({ content }: ArrayVisualizerProps) {
  const { 
    elements,
    capacity,
    size,
    operations,
    isAnimating,
    highlightedIndex,
    accessedIndex,
    searchingIndex,
    sortingIndices,
    comparingIndices,
    searchResult,
    insert,
    deleteAt,
    access,
    update,
    resize,
    clear,
    pushBack,
    popBack,
    linearSearch,
    binarySearch,
    bubbleSort,
    selectionSort,
    isFull,
    isEmpty,
  } = useArray()

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Arrays</h1>
        <p className="text-muted-foreground">
          A linear data structure storing elements in contiguous memory locations with constant-time access by index.
        </p>
      </div>

      <Tabs defaultValue="visualization" className="w-full space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <ArrayControls 
                onInsert={insert}
                onDelete={deleteAt}
                onAccess={access}
                onUpdate={update}
                onResize={resize}
                onClear={clear}
                onPushBack={pushBack}
                onPopBack={popBack}
                onLinearSearch={linearSearch}
                onBinarySearch={binarySearch}
                onBubbleSort={bubbleSort}
                onSelectionSort={selectionSort}
                isAnimating={isAnimating}
                isFull={isFull}
                isEmpty={isEmpty}
                capacity={capacity}
                size={size}
              />
              <ArrayOperations operations={operations} />
            </div>
            <div className="xl:col-span-2">
              <ArrayDisplay 
                elements={elements}
                capacity={capacity}
                highlightedIndex={highlightedIndex}
                accessedIndex={accessedIndex}
                searchingIndex={searchingIndex}
                sortingIndices={sortingIndices}
                comparingIndices={comparingIndices}
                searchResult={searchResult}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          <ArrayAnalysis 
            elements={elements}
            capacity={capacity}
            operations={operations}
          />
        </TabsContent>
        
        <TabsContent value="explanation" className="prose prose-invert max-w-none">
          <MarkdownContent content={content} />
        </TabsContent>
      </Tabs>
    </div>
  )
}