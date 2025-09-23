"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { ArrayElement } from "./types"

interface ArrayDisplayProps {
  elements: ArrayElement[]
  capacity: number
  highlightedIndex: number | null
  accessedIndex: number | null
  searchingIndex: number | null
  sortingIndices: number[]
  comparingIndices: number[]
  searchResult: { found: boolean; index: number; comparisons: number } | null
}

export function ArrayDisplay({ 
  elements, 
  capacity, 
  highlightedIndex, 
  accessedIndex,
  searchingIndex,
  sortingIndices,
  comparingIndices,
  searchResult
}: ArrayDisplayProps) {
  // Create empty slots to show full capacity
  const slots = Array.from({ length: capacity }, (_, index) => {
    const element = elements.find(el => el.index === index)
    return { index, element }
  })

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Array Visualization</h3>
          <p className="text-sm text-muted-foreground">
            Size: {elements.length} / {capacity}
          </p>
        </div>

        {/* Array Display */}
        <div className="flex flex-wrap gap-2 justify-center">
          {slots.map(({ index, element }) => (
            <motion.div
              key={`slot-${index}`}
              className="relative"
              layout
              transition={{ duration: 0.3 }}
            >
              {/* Index Label */}
              <div className="text-xs text-center text-muted-foreground mb-1 font-mono">
                [{index}]
              </div>
              
              {/* Array Slot */}
              <motion.div
                className={`
                  w-16 h-16 border-2 flex items-center justify-center rounded-lg
                  font-mono font-semibold text-lg transition-colors duration-300
                  ${element 
                    ? 'border-blue-500 bg-blue-500/10' 
                    : 'border-dashed border-gray-500 bg-gray-500/5'
                  }
                  ${highlightedIndex === index 
                    ? 'border-yellow-500 bg-yellow-500/20 ring-2 ring-yellow-500/50' 
                    : ''
                  }
                  ${accessedIndex === index 
                    ? 'border-green-500 bg-green-500/20 ring-2 ring-green-500/50' 
                    : ''
                  }
                  ${searchingIndex === index 
                    ? 'border-orange-500 bg-orange-500/20 ring-2 ring-orange-500/50' 
                    : ''
                  }
                  ${sortingIndices.includes(index) 
                    ? 'border-purple-500 bg-purple-500/20 ring-2 ring-purple-500/50' 
                    : ''
                  }
                  ${comparingIndices.includes(index) 
                    ? 'border-red-500 bg-red-500/20 ring-2 ring-red-500/50' 
                    : ''
                  }
                `}
                animate={{
                  scale: highlightedIndex === index || accessedIndex === index || 
                         searchingIndex === index || comparingIndices.includes(index) ? 1.1 : 1
                }}
                transition={{ duration: 0.3 }}
              >
                <AnimatePresence mode="wait">
                  {element && (
                    <motion.span
                      key={element.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {element.value}
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Highlight Effects */}
              <AnimatePresence>
                {highlightedIndex === index && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                               bg-yellow-500 text-black text-xs px-2 py-1 rounded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Modified
                  </motion.div>
                )}
                {accessedIndex === index && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                               bg-green-500 text-white text-xs px-2 py-1 rounded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Found
                  </motion.div>
                )}
                {searchingIndex === index && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                               bg-orange-500 text-white text-xs px-2 py-1 rounded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Searching
                  </motion.div>
                )}
                {sortingIndices.includes(index) && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                               bg-purple-500 text-white text-xs px-2 py-1 rounded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Sorted
                  </motion.div>
                )}
                {comparingIndices.includes(index) && (
                  <motion.div
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                               bg-red-500 text-white text-xs px-2 py-1 rounded"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    Comparing
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Search Result Display */}
        <AnimatePresence>
          {searchResult && (
            <motion.div
              className={`p-4 rounded-lg border ${
                searchResult.found 
                  ? 'bg-green-500/10 border-green-500 text-green-400' 
                  : 'bg-red-500/10 border-red-500 text-red-400'
              }`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <div className="text-center">
                <div className="font-semibold mb-1">
                  {searchResult.found ? '✅ Element Found!' : '❌ Element Not Found'}
                </div>
                <div className="text-sm">
                  {searchResult.found 
                    ? `Found at index ${searchResult.index}` 
                    : 'Element does not exist in array'
                  }
                </div>
                <div className="text-xs mt-1 opacity-75">
                  Comparisons made: {searchResult.comparisons}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Array Properties */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold">Elements</div>
            <div className="text-2xl font-mono">{elements.length}</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold">Capacity</div>
            <div className="text-2xl font-mono">{capacity}</div>
          </div>
        </div>

        {/* Memory Layout Visualization */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Memory Layout</h4>
          <div className="flex items-center gap-1 text-xs">
            <div className="flex">
              {slots.map(({ index, element }) => (
                <div
                  key={`memory-${index}`}
                  className={`
                    w-3 h-6 border-r border-gray-400 first:border-l
                    ${element 
                      ? 'bg-blue-500/30' 
                      : 'bg-gray-500/10'
                    }
                  `}
                  title={element ? `[${index}] = ${element.value}` : `[${index}] = empty`}
                />
              ))}
            </div>
            <span className="ml-2 text-muted-foreground">
              Contiguous memory blocks
            </span>
          </div>
        </div>
      </div>
    </Card>
  )
}