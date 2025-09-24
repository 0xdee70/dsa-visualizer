"use client"

import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { StringDisplay } from "./string-display"
import { StringControls } from "./string-controls"
import { StringOperations } from "./string-operations"
import { TextAnalysis } from "./text-analysis"
import { CodePlayground } from "../shared/code-playground"
import { useString } from "@/hooks/use-string"

interface StringVisualizerProps {
  content: React.ReactNode
}

export function StringVisualizer({ content }: StringVisualizerProps) {
  const { 
    text,
    characters,
    operations,
    isAnimating,
    highlightedIndices,
    searchingIndex,
    searchResult,
    setText,
    concatenate,
    substring,
    insertChar,
    deleteChar,
    replace,
    naiveSearch,
    reverse,
    clear,
    isEmpty,
    length,
    getWordCount,
    getCharacterFrequency,
    getWordFrequency,
    countOccurrences,
    findAllOccurrences,
  } = useString()

  return (
    <div className="container mx-auto">
      <div className="mb-6">
        {content}
      </div>
      
      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visualization">Visualization</TabsTrigger>
          <TabsTrigger value="analysis">Analysis</TabsTrigger>
          <TabsTrigger value="playground">Playground</TabsTrigger>
          <TabsTrigger value="theory">Theory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-1 space-y-6">
              <StringControls 
                onSetText={setText}
                onConcatenate={concatenate}
                onSubstring={substring}
                onInsertChar={insertChar}
                onDeleteChar={deleteChar}
                onReplace={replace}
                onNaiveSearch={naiveSearch}
                onReverse={reverse}
                onClear={clear}
                isAnimating={isAnimating}
                isEmpty={isEmpty}
                length={length}
                currentText={text}
                getWordCount={getWordCount}
                getCharacterFrequency={getCharacterFrequency}
                getWordFrequency={getWordFrequency}
                onCountOccurrences={countOccurrences}
                onFindAllOccurrences={findAllOccurrences}
              />
              <StringOperations operations={operations} />
            </div>
            <div className="xl:col-span-2">
              <StringDisplay 
                characters={characters}
                text={text}
                highlightedIndices={highlightedIndices}
                searchingIndex={searchingIndex}
                searchResult={searchResult}
              />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="analysis">
          <TextAnalysis
            text={text}
            getWordCount={getWordCount}
            getCharacterFrequency={getCharacterFrequency}
            getWordFrequency={getWordFrequency}
            countOccurrences={countOccurrences}
            findAllOccurrences={findAllOccurrences}
          />
        </TabsContent>
        
        <TabsContent value="playground">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <CodePlayground 
              dataStructure="string"
              onExecute={(code, result) => {
                // Optionally update the visualizer with playground results
                if (result && typeof result.original === 'string') {
                  setText(result.original)
                }
              }}
              context={{ text, setText }}
            />
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Try These Examples:</h3>
                <ul className="text-sm space-y-1 list-disc pl-4">
                  <li>Create string algorithms (reverse, palindrome check)</li>
                  <li>Implement pattern searching (naive, KMP)</li>
                  <li>Build text analysis tools (word count, frequency)</li>
                  <li>Practice string manipulations (split, join, replace)</li>
                </ul>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Available APIs:</h3>
                <div className="text-sm space-y-1">
                  <div><code className="bg-muted px-1 rounded">string.split()</code> - Split into array</div>
                  <div><code className="bg-muted px-1 rounded">string.indexOf()</code> - Find substring</div>
                  <div><code className="bg-muted px-1 rounded">string.replace()</code> - Replace text</div>
                  <div><code className="bg-muted px-1 rounded">string.includes()</code> - Check if contains</div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="theory">
          <div className="prose max-w-none">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">String Data Structure</h3>
                  <div className="space-y-3 text-sm">
                    <p>
                      A string is a sequence of characters, typically implemented as an array of characters
                      with additional metadata like length. Strings are fundamental in computer science
                      and are used extensively in text processing, data parsing, and user interfaces.
                    </p>
                    <p>
                      Most modern programming languages treat strings as immutable objects, meaning
                      operations like concatenation or replacement create new string objects rather
                      than modifying the original.
                    </p>
                  </div>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Common Operations</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Concatenation:</strong> Joining two or more strings together. 
                      Time complexity varies by implementation but is typically O(n + m).
                    </div>
                    <div>
                      <strong>Substring:</strong> Extracting a portion of the string. 
                      Usually O(k) where k is the length of the substring.
                    </div>
                    <div>
                      <strong>Search:</strong> Finding patterns within strings. 
                      Naive approach is O(n × m), but advanced algorithms can achieve O(n + m).
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Search Algorithms</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <strong>Naive String Search:</strong> 
                      Simple brute-force approach that checks every possible position. 
                      Easy to understand but inefficient for large texts.
                    </div>
                    <div>
                      <strong>KMP Algorithm:</strong> 
                      Knuth-Morris-Pratt algorithm uses preprocessing to avoid redundant comparisons. 
                      Achieves O(n + m) time complexity.
                    </div>
                    <div>
                      <strong>Boyer-Moore:</strong> 
                      Starts matching from the end of the pattern and can skip many characters 
                      when mismatches occur.
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Use Cases</h3>
                  <div className="space-y-2 text-sm">
                    <div>• Text processing and parsing</div>
                    <div>• Pattern matching and searching</div>
                    <div>• Data validation and formatting</div>
                    <div>• Natural language processing</div>
                    <div>• Web development (URLs, HTML parsing)</div>
                    <div>• Configuration file processing</div>
                    <div>• Regular expressions and text replacement</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}