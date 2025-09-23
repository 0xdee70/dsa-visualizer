"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrayOperation } from "./types"
import { formatDistanceToNow } from "date-fns"

interface ArrayOperationsProps {
  operations: ArrayOperation[]
}

function getOperationIcon(type: ArrayOperation['type']) {
  switch (type) {
    case 'insert':
      return '➕'
    case 'delete':
      return '🗑️'
    case 'access':
      return '🔍'
    case 'update':
      return '✏️'
    case 'resize':
      return '📏'
    case 'clear':
      return '🧹'
    case 'search':
      return '🔎'
    case 'sort':
      return '🔀'
    case 'compare':
      return '⚖️'
    case 'swap':
      return '🔄'
    default:
      return '⚡'
  }
}

function getOperationDescription(operation: ArrayOperation): string {
  switch (operation.type) {
    case 'insert':
      return `Inserted ${operation.value} at index ${operation.index}`
    case 'delete':
      return `Deleted ${operation.value} from index ${operation.index}`
    case 'access':
      return `Accessed element at index ${operation.index}`
    case 'update':
      return `Updated index ${operation.index}: ${operation.oldValue} → ${operation.value}`
    case 'resize':
      return `Resized capacity to ${operation.newSize}`
    case 'clear':
      return 'Cleared all elements'
    case 'search':
      return `${operation.algorithm}: Searched for ${operation.searchValue}${operation.foundIndex !== -1 ? ` (found at index ${operation.foundIndex})` : ' (not found)'}`
    case 'sort':
      return `Started ${operation.algorithm} sorting algorithm`
    case 'compare':
      return `Compared elements at indices ${operation.compareIndices?.join(' and ')}`
    case 'swap':
      return `Swapped elements at indices ${operation.swapIndices?.join(' and ')}`
    default:
      return 'Unknown operation'
  }
}

function getOperationColor(type: ArrayOperation['type']): string {
  switch (type) {
    case 'insert':
      return 'text-green-500'
    case 'delete':
      return 'text-red-500'
    case 'access':
      return 'text-blue-500'
    case 'update':
      return 'text-yellow-500'
    case 'resize':
      return 'text-purple-500'
    case 'clear':
      return 'text-gray-500'
    case 'search':
      return 'text-orange-500'
    case 'sort':
      return 'text-indigo-500'
    case 'compare':
      return 'text-pink-500'
    case 'swap':
      return 'text-cyan-500'
    default:
      return 'text-foreground'
  }
}

export function ArrayOperations({ operations }: ArrayOperationsProps) {
  const recentOperations = operations.slice(-10).reverse()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Operation History</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="max-h-[300px] w-full overflow-y-auto">
          {recentOperations.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              No operations yet. Start by adding elements to the array!
            </div>
          ) : (
            <div className="space-y-2">
              {recentOperations.map((operation, index) => (
                <div
                  key={`${operation.timestamp}-${index}`}
                  className="flex items-start gap-3 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <span className="text-lg flex-shrink-0 mt-0.5">
                    {getOperationIcon(operation.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium ${getOperationColor(operation.type)}`}>
                      {operation.type.charAt(0).toUpperCase() + operation.type.slice(1)}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getOperationDescription(operation)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(operation.timestamp), { addSuffix: true })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}