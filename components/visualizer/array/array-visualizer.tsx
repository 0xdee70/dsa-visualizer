"use client"

import { ArrayControls } from "@/components/visualizer/array/array-controls"
import { ArrayDisplay } from "@/components/visualizer/array/array-display"
import { ArrayOperations } from "@/components/visualizer/array/array-operations"
import { ArrayAnalysis } from "@/components/visualizer/array/array-analysis"
import { CodePlayground } from "@/components/visualizer/shared/code-playground"
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
    accessByValue,
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
    isSorted,
    setArray,
    // Playback controls
    isAutoPlaying,
    playbackSpeed,
    currentStep,
    totalSteps,
    playNext,
    playPrevious,
    toggleAutoPlay,
    setSpeed,
    resetPlayback,
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
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="explanation">Explanation</TabsTrigger>
        </TabsList>

        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <ArrayControls 
                onInsert={insert}
                onDelete={deleteAt}
                onAccess={access}
                onAccessByValue={accessByValue}
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
                isSorted={isSorted()}
                // Playback controls
                isAutoPlaying={isAutoPlaying}
                playbackSpeed={playbackSpeed}
                currentStep={currentStep}
                totalSteps={totalSteps}
                onPlayNext={playNext}
                onPlayPrevious={playPrevious}
                onToggleAutoPlay={toggleAutoPlay}
                onSetSpeed={setSpeed}
                onResetPlayback={resetPlayback}
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

        <TabsContent value="playground">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CodePlayground 
              dataStructure="array"
              onExecute={(code, result) => {
                // Update the visualizer with playground results
                if (result && Array.isArray(result.arr)) {
                  // Assuming setArray is available to update the visualizer's state
                  setArray(result.arr)
                }
              }}
              context={{ array: elements, setArray: setArray }} // Pass array elements and setter
            />
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Try These Examples:</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Implement sorting algorithms (bubble, selection, quick)</li>
                  <li>Practice search algorithms (linear, binary)</li>
                  <li>Use array methods (map, filter, reduce)</li>
                  <li>Solve common array problems (two sum, rotate)</li>
                </ul>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Array Methods:</h3>
                <div className="text-sm space-y-1">
                  <div><code className="bg-muted px-1 rounded">arr.push()</code> - Add to end</div>
                  <div><code className="bg-muted px-1 rounded">arr.pop()</code> - Remove from end</div>
                  <div><code className="bg-muted px-1 rounded">arr.map()</code> - Transform elements</div>
                  <div><code className="bg-muted px-1 rounded">arr.filter()</code> - Filter elements</div>
                  <div><code className="bg-muted px-1 rounded">arr.reduce()</code> - Reduce to single value</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="explanation" className="prose prose-invert max-w-none">
          <MarkdownContent content={content} />
        </TabsContent>
      </Tabs>
    </div>
  )
}