"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Plus, Minus, Search, Edit, RotateCcw, Trash2, ArrowUpDown, Zap } from "lucide-react"

interface ArrayControlsProps {
  onInsert: (index: number, value: number) => void
  onDelete: (index: number) => void
  onAccess: (index: number) => Promise<number | undefined>
  onAccessByValue: (value: number) => Promise<{ found: boolean; index: number; comparisons: number }>
  onUpdate: (index: number, value: number) => void
  onResize: (newCapacity: number) => void
  onClear: () => void
  onPushBack: (value: number) => void
  onPopBack: () => void
  onLinearSearch: (value: number) => void
  onBinarySearch: (value: number) => void
  onBubbleSort: () => void
  onSelectionSort: () => void
  isAnimating: boolean
  isFull: boolean
  isEmpty: boolean
  capacity: number
  size: number
  isSorted: boolean
}

export function ArrayControls({
  onInsert,
  onDelete,
  onAccess,
  onAccessByValue,
  onUpdate,
  onResize,
  onClear,
  onPushBack,
  onPopBack,
  onLinearSearch,
  onBinarySearch,
  onBubbleSort,
  onSelectionSort,
  isAnimating,
  isFull,
  isEmpty,
  capacity,
  size,
  isSorted,
}: ArrayControlsProps) {
  const [insertValue, setInsertValue] = useState("")
  const [insertIndex, setInsertIndex] = useState("")
  const [accessIndex, setAccessIndex] = useState("")
  const [updateIndex, setUpdateIndex] = useState("")
  const [updateValue, setUpdateValue] = useState("")
  const [newCapacity, setNewCapacity] = useState("")
  const [pushValue, setPushValue] = useState("")
  const [accessResult, setAccessResult] = useState<number | null>(null)
  const [accessByValueResult, setAccessByValueResult] = useState<{ found: boolean; index: number; comparisons: number } | null>(null)
  const [accessByValueInput, setAccessByValueInput] = useState("")
  const [searchValue, setSearchValue] = useState("")

  const handleInsert = () => {
    const value = parseInt(insertValue)
    const index = parseInt(insertIndex)
    if (!isNaN(value) && !isNaN(index)) {
      onInsert(index, value)
      setInsertValue("")
      setInsertIndex("")
    }
  }

  const handleDelete = () => {
    const index = parseInt(insertIndex)
    if (!isNaN(index)) {
      onDelete(index)
      setInsertIndex("")
    }
  }

  const handleAccess = async () => {
    const index = parseInt(accessIndex)
    if (!isNaN(index)) {
      const result = await onAccess(index)
      setAccessResult(result ?? null)
      setTimeout(() => setAccessResult(null), 3000)
    }
  }

  const handleAccessByValue = async () => {
    const value = parseInt(accessByValueInput)
    if (!isNaN(value)) {
      const result = await onAccessByValue(value)
      setAccessByValueResult(result)
      setTimeout(() => setAccessByValueResult(null), 4000)
    }
  }

  const handleUpdate = () => {
    const index = parseInt(updateIndex)
    const value = parseInt(updateValue)
    if (!isNaN(index) && !isNaN(value)) {
      onUpdate(index, value)
      setUpdateIndex("")
      setUpdateValue("")
    }
  }

  const handleResize = () => {
    const capacity = parseInt(newCapacity)
    if (!isNaN(capacity) && capacity > 0) {
      onResize(capacity)
      setNewCapacity("")
    }
  }

  const handlePush = () => {
    const value = parseInt(pushValue)
    if (!isNaN(value)) {
      onPushBack(value)
      setPushValue("")
    }
  }

  const handleLinearSearch = () => {
    const value = parseInt(searchValue)
    if (!isNaN(value)) {
      onLinearSearch(value)
      setSearchValue("")
    }
  }

  const handleBinarySearch = () => {
    const value = parseInt(searchValue)
    if (!isNaN(value)) {
      onBinarySearch(value)
      setSearchValue("")
    }
  }

  return (
    <div className="space-y-4">
      {/* Quick Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Operations</CardTitle>
          <CardDescription>Push/Pop operations at the end</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              type="number"
              placeholder="Value"
              value={pushValue}
              onChange={(e) => setPushValue(e.target.value)}
              className="flex-1"
              disabled={isAnimating}
            />
            <Button
              onClick={handlePush}
              disabled={isAnimating || isFull || !pushValue}
              size="sm"
            >
              <Plus className="h-4 w-4" />
              Push
            </Button>
          </div>
          <Button
            onClick={onPopBack}
            disabled={isAnimating || isEmpty}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <Minus className="h-4 w-4 mr-2" />
            Pop Back
          </Button>
        </CardContent>
      </Card>

      {/* Insert & Delete */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Insert & Delete</CardTitle>
          <CardDescription>Insert or delete at specific index</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Index</Label>
            <Input
              type="number"
              placeholder="0"
              value={insertIndex}
              onChange={(e) => setInsertIndex(e.target.value)}
              disabled={isAnimating}
            />
          </div>
          <div className="space-y-2">
            <Label>Value</Label>
            <Input
              type="number"
              placeholder="42"
              value={insertValue}
              onChange={(e) => setInsertValue(e.target.value)}
              disabled={isAnimating}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={handleInsert}
              disabled={isAnimating || isFull || !insertValue || !insertIndex}
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Insert
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isAnimating || isEmpty || !insertIndex}
              size="sm"
              variant="destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Access & Update */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Access & Update</CardTitle>
          <CardDescription>Read or modify array elements</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Access Index</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="0"
                value={accessIndex}
                onChange={(e) => setAccessIndex(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handleAccess}
                disabled={isAnimating || isEmpty || !accessIndex}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {accessResult !== null && (
              <div className="text-sm font-medium text-green-500">
                Value: {accessResult}
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>Access by Value</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Search value"
                value={accessByValueInput}
                onChange={(e) => setAccessByValueInput(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handleAccessByValue}
                disabled={isAnimating || isEmpty || !accessByValueInput}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            {accessByValueResult && (
              <div className="text-sm">
                {accessByValueResult.found ? (
                  <span className="text-green-500 font-medium">
                    Found at index {accessByValueResult.index} ({accessByValueResult.comparisons} comparisons)
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    Not found ({accessByValueResult.comparisons} comparisons)
                  </span>
                )}
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-2"></div>
            <Label>Update Index</Label>
            <Input
              type="number"
              placeholder="0"
              value={updateIndex}
              onChange={(e) => setUpdateIndex(e.target.value)}
              disabled={isAnimating}
            />
            <Label>New Value</Label>
            <Input
              type="number"
              placeholder="99"
              value={updateValue}
              onChange={(e) => setUpdateValue(e.target.value)}
              disabled={isAnimating}
            />
            <Button
              onClick={handleUpdate}
              disabled={isAnimating || isEmpty || !updateIndex || !updateValue}
              size="sm"
            >
              <Edit className="h-4 w-4 mr-2" />
              Update
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Search Algorithms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Search Algorithms</CardTitle>
          <CardDescription>Find elements using different search methods</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Search Value</Label>
            <Input
              type="number"
              placeholder="Enter value to search"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              disabled={isAnimating}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleLinearSearch}
              disabled={isAnimating || isEmpty || !searchValue}
              size="sm"
              variant="outline"
            >
              <Search className="h-4 w-4 mr-2" />
              Linear
            </Button>
            <Button
              onClick={handleBinarySearch}
              disabled={isAnimating || isEmpty || !searchValue || !isSorted}
              size="sm"
              variant="outline"
              title={!isSorted ? "Array must be sorted for binary search" : ""}
            >
              <Zap className="h-4 w-4 mr-2" />
              Binary {!isSorted && "⚠️"}
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div>• Linear: O(n) - Works on any array</div>
            <div>• Binary: O(log n) - Requires sorted array {!isSorted && "(⚠️ Sort first)"}</div>
          </div>
        </CardContent>
      </Card>

      {/* Sorting Algorithms */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sorting Algorithms</CardTitle>
          <CardDescription>Sort the array using different algorithms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onBubbleSort}
              disabled={isAnimating || isEmpty || size < 2}
              size="sm"
              variant="outline"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Bubble
            </Button>
            <Button
              onClick={onSelectionSort}
              disabled={isAnimating || isEmpty || size < 2}
              size="sm"
              variant="outline"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Selection
            </Button>
          </div>
          
          <div className="text-xs text-muted-foreground">
            <div>• Bubble Sort: O(n²) - Simple comparison sorting</div>
            <div>• Selection Sort: O(n²) - Find minimum repeatedly</div>
          </div>
        </CardContent>
      </Card>

      {/* Array Management */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Array Management</CardTitle>
          <CardDescription>Resize capacity or reset array</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="text-sm space-y-1">
            <div>Size: {size} / {capacity}</div>
            <div>Capacity: {capacity}</div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label>New Capacity</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder={capacity.toString()}
                value={newCapacity}
                onChange={(e) => setNewCapacity(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handleResize}
                disabled={isAnimating || !newCapacity}
                size="sm"
                variant="outline"
              >
                Resize
              </Button>
            </div>
          </div>
          
          <Button
            onClick={onClear}
            disabled={isAnimating}
            size="sm"
            variant="outline"
            className="w-full"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}