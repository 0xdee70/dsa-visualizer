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
                onLoadExample={setArray}
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
                  setArray(result.arr)
                }
              }}
              context={{ array: elements.map(el => el.value), setArray: setArray }}
            />
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">🔥 Interview Problems to Try:</h3>
                <div className="text-sm space-y-2">
                  <div className="p-2 bg-muted rounded">
                    <div className="font-medium">Two Sum</div>
                    <code className="text-xs">
                      {`// Find indices of two numbers that add up to target
const twoSum = (arr, target) => {
  const map = new Map();
  for (let i = 0; i < arr.length; i++) {
    const complement = target - arr[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(arr[i], i);
  }
  return [];
};
console.log(twoSum(arr, 9));`}
                    </code>
                  </div>

                  <div className="p-2 bg-muted rounded">
                    <div className="font-medium">Maximum Subarray (Kadane's)</div>
                    <code className="text-xs">
                      {`// Find maximum sum of contiguous subarray
const maxSubArray = (arr) => {
  let maxSoFar = arr[0];
  let maxEndingHere = arr[0];
  
  for (let i = 1; i < arr.length; i++) {
    maxEndingHere = Math.max(arr[i], maxEndingHere + arr[i]);
    maxSoFar = Math.max(maxSoFar, maxEndingHere);
  }
  return maxSoFar;
};
console.log(maxSubArray(arr));`}
                    </code>
                  </div>

                  <div className="p-2 bg-muted rounded">
                    <div className="font-medium">Rotate Array</div>
                    <code className="text-xs">
                      {`// Rotate array to the right by k steps
const rotate = (arr, k) => {
  k = k % arr.length;
  return [...arr.slice(-k), ...arr.slice(0, -k)];
};
console.log(rotate(arr, 2));`}
                    </code>
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">📚 Learning Tips:</h3>
                <div className="text-sm space-y-1">
                  <div>• Use console.log() to see step-by-step execution</div>
                  <div>• Try different array sizes and patterns</div>
                  <div>• Compare time complexities practically</div>
                  <div>• Use the playback controls to analyze algorithms</div>
                  <div>• Load examples to test edge cases</div>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">🚀 Quick Examples:</h3>
                <div className="text-sm space-y-1">
                  <div><code className="bg-muted px-1 rounded">arr.sort((a,b) => a-b)</code> - Sort ascending</div>
                  <div><code className="bg-muted px-1 rounded">arr.reverse()</code> - Reverse array</div>
                  <div><code className="bg-muted px-1 rounded">arr.includes(val)</code> - Check if contains value</div>
                  <div><code className="bg-muted px-1 rounded">arr.findIndex(x => x > 5)</code> - Find first index</div>
                  <div><code className="bg-muted px-1 rounded">[...new Set(arr)]</code> - Remove duplicates</div>
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