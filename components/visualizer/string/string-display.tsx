"use client"

import React from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { StringCharacter } from "./types"

interface StringDisplayProps {
  characters: StringCharacter[]
  text: string
  highlightedIndices: number[]
  searchingIndex: number | null
  searchResult: { found: boolean; indices: number[]; comparisons: number; pattern: string } | null
}

export function StringDisplay({ 
  characters, 
  text,
  highlightedIndices,
  searchingIndex,
  searchResult
}: StringDisplayProps) {
  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-4">String Visualization</h3>
          
          {/* String Display */}
          <div className="flex flex-wrap justify-center gap-1 min-h-[80px] p-4 bg-muted/30 rounded-lg">
            {characters.length === 0 ? (
              <div className="text-muted-foreground text-sm">Empty string</div>
            ) : (
              characters.map((char, index) => (
                <motion.div
                  key={char.id}
                  className="relative flex flex-col items-center"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  {/* Character Index */}
                  <div className="text-xs text-muted-foreground mb-1">
                    [{index}]
                  </div>
                  
                  {/* Character Box */}
                  <motion.div
                    className={`
                      w-10 h-10 border-2 flex items-center justify-center rounded-lg
                      font-mono font-semibold text-sm transition-colors duration-300
                      border-blue-500 bg-blue-500/10
                      ${highlightedIndices.includes(index) 
                        ? 'border-green-500 bg-green-500/20 ring-2 ring-green-500/50' 
                        : ''
                      }
                      ${searchingIndex === index 
                        ? 'border-orange-500 bg-orange-500/20 ring-2 ring-orange-500/50' 
                        : ''
                      }
                    `}
                    animate={{
                      scale: highlightedIndices.includes(index) || searchingIndex === index ? 1.1 : 1
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <span className="select-none">
                      {char.value === ' ' ? '⎵' : char.value}
                    </span>
                  </motion.div>

                  {/* Highlight Effects */}
                  <AnimatePresence>
                    {highlightedIndices.includes(index) && (
                      <motion.div
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 
                                   bg-green-500 text-white text-xs px-2 py-1 rounded"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        Match
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
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
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
                  {searchResult.found ? '✅ Pattern Found!' : '❌ Pattern Not Found'}
                </div>
                <div className="text-sm">
                  {searchResult.found 
                    ? `Found "${searchResult.pattern}" at ${searchResult.indices.length} location${searchResult.indices.length !== 1 ? 's' : ''}: ${searchResult.indices.join(', ')}` 
                    : `Pattern "${searchResult.pattern}" does not exist in string`
                  }
                </div>
                <div className="text-xs mt-1 opacity-75">
                  Character comparisons: {searchResult.comparisons}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* String Properties */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold">Length</div>
            <div className="text-2xl font-mono">{characters.length}</div>
          </div>
          <div className="text-center p-3 bg-muted rounded-lg">
            <div className="font-semibold">Type</div>
            <div className="text-lg">String</div>
          </div>
        </div>

        {/* Raw String Display */}
        <div className="space-y-2">
          <div className="text-sm font-semibold">Raw String:</div>
          <div className="p-3 bg-muted rounded-lg font-mono text-sm break-all">
            {text || '<empty>'}
          </div>
        </div>
      </div>
    </Card>
  )
}