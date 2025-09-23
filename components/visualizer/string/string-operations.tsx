"use client"

import React from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StringOperation } from "./types"

interface StringOperationsProps {
  operations: StringOperation[]
}

function getOperationIcon(type: StringOperation['type']) {
  switch (type) {
    case 'concatenate':
      return '➕'
    case 'substring':
      return '✂️'
    case 'insert':
      return '📝'
    case 'delete':
      return '🗑️'
    case 'replace':
      return '🔄'
    case 'search':
      return '🔍'
    case 'reverse':
      return '🔀'
    case 'clear':
      return '🧹'
    default:
      return '⚡'
  }
}

function getOperationDescription(operation: StringOperation): string {
  switch (operation.type) {
    case 'concatenate':
      return `Concatenated "${operation.value}"`
    case 'substring':
      return `Extracted substring from index ${operation.index} (length ${operation.length}): "${operation.value}"`
    case 'insert':
      return `Inserted "${operation.value}" at index ${operation.index}`
    case 'delete':
      return `Deleted "${operation.value}" from index ${operation.index}`
    case 'replace':
      return `Replaced "${operation.value}" with "${operation.newValue}"`
    case 'search':
      return `${operation.algorithm}: Searched for "${operation.searchPattern}"${operation.foundIndices && operation.foundIndices.length > 0 ? ` (found at ${operation.foundIndices.join(', ')})` : ' (not found)'}`
    case 'reverse':
      return 'Reversed the string'
    case 'clear':
      return 'Cleared all characters'
    default:
      return 'Unknown operation'
  }
}

function getOperationColor(type: StringOperation['type']): string {
  switch (type) {
    case 'concatenate':
      return 'text-green-500'
    case 'substring':
      return 'text-blue-500'
    case 'insert':
      return 'text-cyan-500'
    case 'delete':
      return 'text-red-500'
    case 'replace':
      return 'text-yellow-500'
    case 'search':
      return 'text-orange-500'
    case 'reverse':
      return 'text-purple-500'
    case 'clear':
      return 'text-gray-500'
    default:
      return 'text-foreground'
  }
}

export function StringOperations({ operations }: StringOperationsProps) {
  const recentOperations = operations.slice(-10).reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Operations</CardTitle>
        <CardDescription>Track your string manipulations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] overflow-y-auto">
          {recentOperations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No operations yet. Start manipulating the string to see history here.
            </div>
          ) : (
            <div className="space-y-2">
              {recentOperations.map((operation, index) => (
                <motion.div
                  key={operation.timestamp}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50 border"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="text-lg min-w-[24px]">
                    {getOperationIcon(operation.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm ${getOperationColor(operation.type)}`}>
                      {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 break-words">
                      {getOperationDescription(operation)}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(operation.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}