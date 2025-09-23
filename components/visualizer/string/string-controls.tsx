"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Minus, Search, Edit, RotateCcw, Trash2, Copy, Scissors, FlipHorizontal } from "lucide-react"

interface StringControlsProps {
  onSetText: (text: string) => void
  onConcatenate: (text: string) => void
  onSubstring: (startIndex: number, length: number) => void
  onInsertChar: (index: number, char: string) => void
  onDeleteChar: (index: number) => void
  onReplace: (searchValue: string, replaceValue: string) => void
  onNaiveSearch: (pattern: string) => void
  onReverse: () => void
  onClear: () => void
  isAnimating: boolean
  isEmpty: boolean
  length: number
  currentText: string
}

export function StringControls({
  onSetText,
  onConcatenate,
  onSubstring,
  onInsertChar,
  onDeleteChar,
  onReplace,
  onNaiveSearch,
  onReverse,
  onClear,
  isAnimating,
  isEmpty,
  length,
  currentText,
}: StringControlsProps) {
  const [newText, setNewText] = useState("")
  const [concatText, setConcatText] = useState("")
  const [substringStart, setSubstringStart] = useState("")
  const [substringLength, setSubstringLength] = useState("")
  const [insertIndex, setInsertIndex] = useState("")
  const [insertChar, setInsertChar] = useState("")
  const [deleteIndex, setDeleteIndex] = useState("")
  const [searchPattern, setSearchPattern] = useState("")
  const [replaceSearch, setReplaceSearch] = useState("")
  const [replaceValue, setReplaceValue] = useState("")

  const handleSetText = () => {
    if (newText.trim()) {
      onSetText(newText)
      setNewText("")
    }
  }

  const handleConcatenate = () => {
    if (concatText) {
      onConcatenate(concatText)
      setConcatText("")
    }
  }

  const handleSubstring = () => {
    const start = parseInt(substringStart)
    const len = parseInt(substringLength)
    if (!isNaN(start) && !isNaN(len) && start >= 0 && start < length) {
      onSubstring(start, len)
      setSubstringStart("")
      setSubstringLength("")
    }
  }

  const handleInsertChar = () => {
    const index = parseInt(insertIndex)
    if (!isNaN(index) && insertChar && index >= 0 && index <= length) {
      onInsertChar(index, insertChar)
      setInsertIndex("")
      setInsertChar("")
    }
  }

  const handleDeleteChar = () => {
    const index = parseInt(deleteIndex)
    if (!isNaN(index) && index >= 0 && index < length) {
      onDeleteChar(index)
      setDeleteIndex("")
    }
  }

  const handleReplace = () => {
    if (replaceSearch && replaceValue !== undefined) {
      onReplace(replaceSearch, replaceValue)
      setReplaceSearch("")
      setReplaceValue("")
    }
  }

  const handleSearch = () => {
    if (searchPattern) {
      onNaiveSearch(searchPattern)
      setSearchPattern("")
    }
  }

  return (
    <div className="space-y-4">
      {/* String Creation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">String Creation</CardTitle>
          <CardDescription>Create or modify the string</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Set String</Label>
            <Input
              placeholder="Enter your string here..."
              value={newText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewText(e.target.value)}
              disabled={isAnimating}
            />
            <Button
              onClick={handleSetText}
              disabled={isAnimating || !newText.trim()}
              size="sm"
              className="w-full"
            >
              <Edit className="h-4 w-4 mr-2" />
              Set String
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Basic Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Basic Operations</CardTitle>
          <CardDescription>Fundamental string operations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Concatenation */}
          <div className="space-y-2">
            <Label>Concatenate</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Text to append"
                value={concatText}
                onChange={(e) => setConcatText(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handleConcatenate}
                disabled={isAnimating || !concatText}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Substring */}
          <div className="space-y-2">
            <Label>Substring</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Start"
                value={substringStart}
                onChange={(e) => setSubstringStart(e.target.value)}
                disabled={isAnimating}
                min="0"
                max={Math.max(0, length - 1)}
              />
              <Input
                type="number"
                placeholder="Length"
                value={substringLength}
                onChange={(e) => setSubstringLength(e.target.value)}
                disabled={isAnimating}
                min="1"
              />
              <Button
                onClick={handleSubstring}
                disabled={isAnimating || isEmpty || !substringStart || !substringLength}
                size="sm"
              >
                <Scissors className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Insert Character */}
          <div className="space-y-2">
            <Label>Insert Character</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="number"
                placeholder="Index"
                value={insertIndex}
                onChange={(e) => setInsertIndex(e.target.value)}
                disabled={isAnimating}
                min="0"
                max={length}
              />
              <Input
                type="text"
                placeholder="Char"
                value={insertChar}
                onChange={(e) => setInsertChar(e.target.value.slice(0, 1))}
                disabled={isAnimating}
                maxLength={1}
              />
              <Button
                onClick={handleInsertChar}
                disabled={isAnimating || !insertChar || insertIndex === ""}
                size="sm"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Delete Character */}
          <div className="space-y-2">
            <Label>Delete Character</Label>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="Index to delete"
                value={deleteIndex}
                onChange={(e) => setDeleteIndex(e.target.value)}
                disabled={isAnimating}
                min="0"
                max={Math.max(0, length - 1)}
              />
              <Button
                onClick={handleDeleteChar}
                disabled={isAnimating || isEmpty || deleteIndex === ""}
                size="sm"
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">String Search</CardTitle>
          <CardDescription>Find patterns within the string</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <Label>Search Pattern</Label>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Pattern to search"
                value={searchPattern}
                onChange={(e) => setSearchPattern(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handleSearch}
                disabled={isAnimating || isEmpty || !searchPattern}
                size="sm"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-muted-foreground">
            • Naive Search: O(n×m) - Simple pattern matching
          </div>
        </CardContent>
      </Card>

      {/* Advanced Operations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Advanced Operations</CardTitle>
          <CardDescription>Complex string manipulations</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Replace */}
          <div className="space-y-2">
            <Label>Replace</Label>
            <div className="grid grid-cols-3 gap-2">
              <Input
                type="text"
                placeholder="Find"
                value={replaceSearch}
                onChange={(e) => setReplaceSearch(e.target.value)}
                disabled={isAnimating}
              />
              <Input
                type="text"
                placeholder="Replace"
                value={replaceValue}
                onChange={(e) => setReplaceValue(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handleReplace}
                disabled={isAnimating || isEmpty || !replaceSearch}
                size="sm"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Utility Operations */}
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={onReverse}
              disabled={isAnimating || isEmpty}
              size="sm"
              variant="outline"
            >
              <FlipHorizontal className="h-4 w-4 mr-2" />
              Reverse
            </Button>
            <Button
              onClick={onClear}
              disabled={isAnimating}
              size="sm"
              variant="outline"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* String Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">String Info</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-semibold">Length</div>
              <div className="text-lg font-mono">{length}</div>
            </div>
            <div className="text-center p-2 bg-muted rounded">
              <div className="font-semibold">Empty</div>
              <div className="text-lg">{isEmpty ? 'Yes' : 'No'}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}