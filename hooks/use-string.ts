import { useState, useCallback } from 'react'
import { StringCharacter, StringOperation } from '@/components/visualizer/string/types'

let characterIdCounter = 0

export function useString(initialText: string = "") {
  const [text, setText] = useState(initialText)
  const [operations, setOperations] = useState<StringOperation[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightedIndices, setHighlightedIndices] = useState<number[]>([])
  const [searchingIndex, setSearchingIndex] = useState<number | null>(null)
  const [searchResult, setSearchResult] = useState<{ found: boolean; indices: number[]; comparisons: number; pattern: string } | null>(null)

  const addOperation = useCallback((operation: Omit<StringOperation, 'timestamp'>) => {
    setOperations(prev => [...prev, { ...operation, timestamp: Date.now() }])
  }, [])

  // Convert string to character array for visualization
  const characters: StringCharacter[] = text.split('').map((char, index) => ({
    id: `char-${index}-${characterIdCounter++}`,
    value: char,
    index
  }))

  const concatenate = useCallback(async (newText: string) => {
    if (isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'concatenate', value: newText })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setText(prev => prev + newText)
    
    setIsAnimating(false)
  }, [isAnimating, addOperation])

  const substring = useCallback(async (startIndex: number, length: number) => {
    if (isAnimating || startIndex < 0 || startIndex >= text.length) return

    setIsAnimating(true)
    
    // Highlight the substring area
    const endIndex = Math.min(startIndex + length, text.length)
    setHighlightedIndices(Array.from({ length: endIndex - startIndex }, (_, i) => startIndex + i))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const result = text.substring(startIndex, endIndex)
    addOperation({ type: 'substring', index: startIndex, length, value: result })
    
    setText(result)
    setHighlightedIndices([])
    setIsAnimating(false)
  }, [text, isAnimating, addOperation])

  const insertChar = useCallback(async (index: number, char: string) => {
    if (isAnimating || index < 0 || index > text.length) return

    setIsAnimating(true)
    setHighlightedIndices([index])
    
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newText = text.slice(0, index) + char + text.slice(index)
    setText(newText)
    addOperation({ type: 'insert', index, value: char })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndices([])
    setIsAnimating(false)
  }, [text, isAnimating, addOperation])

  const deleteChar = useCallback(async (index: number) => {
    if (isAnimating || index < 0 || index >= text.length) return

    setIsAnimating(true)
    setHighlightedIndices([index])
    
    const deletedChar = text[index]
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const newText = text.slice(0, index) + text.slice(index + 1)
    setText(newText)
    addOperation({ type: 'delete', index, value: deletedChar })
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndices([])
    setIsAnimating(false)
  }, [text, isAnimating, addOperation])

  const replace = useCallback(async (searchValue: string, replaceValue: string) => {
    if (isAnimating || !searchValue) return

    setIsAnimating(true)
    addOperation({ type: 'replace', value: searchValue, newValue: replaceValue })
    
    const newText = text.replace(new RegExp(searchValue, 'g'), replaceValue)
    setText(newText)
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsAnimating(false)
  }, [text, isAnimating, addOperation])

  // Naive String Search Implementation
  const naiveSearch = useCallback(async (pattern: string) => {
    if (!pattern || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'search', searchPattern: pattern, algorithm: 'Naive Search' })
    
    const foundIndices: number[] = []
    let comparisons = 0

    for (let i = 0; i <= text.length - pattern.length; i++) {
      setSearchingIndex(i)
      await new Promise(resolve => setTimeout(resolve, 300))
      
      let match = true
      for (let j = 0; j < pattern.length; j++) {
        comparisons++
        if (text[i + j] !== pattern[j]) {
          match = false
          break
        }
      }
      
      if (match) {
        foundIndices.push(i)
        setHighlightedIndices(Array.from({ length: pattern.length }, (_, j) => i + j))
        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    addOperation({ 
      type: 'search', 
      searchPattern: pattern, 
      foundIndices, 
      algorithm: 'Naive Search' 
    })

    setSearchResult({ found: foundIndices.length > 0, indices: foundIndices, comparisons, pattern })
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setSearchingIndex(null)
    setHighlightedIndices([])
    setIsAnimating(false)
    
    setTimeout(() => setSearchResult(null), 3000)
  }, [text, isAnimating, addOperation])

  const reverse = useCallback(async () => {
    if (isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'reverse' })
    
    // Animate the reversal process
    for (let i = 0; i < Math.floor(text.length / 2); i++) {
      const j = text.length - 1 - i
      setHighlightedIndices([i, j])
      await new Promise(resolve => setTimeout(resolve, 400))
    }
    
    setText(text.split('').reverse().join(''))
    
    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndices([])
    setIsAnimating(false)
  }, [text, isAnimating, addOperation])

  const clear = useCallback(() => {
    setText("")
    setOperations([])
    setHighlightedIndices([])
    setSearchingIndex(null)
    setSearchResult(null)
    setIsAnimating(false)
    characterIdCounter = 0
  }, [])

  // Text Analysis Functions
  const getWordCount = useCallback(() => {
    if (!text.trim()) return 0
    return text.trim().split(/\s+/).length
  }, [text])

  const getCharacterFrequency = useCallback(() => {
    const frequency: { [key: string]: number } = {}
    for (const char of text.toLowerCase()) {
      if (char.match(/[a-z]/)) {
        frequency[char] = (frequency[char] || 0) + 1
      }
    }
    return frequency
  }, [text])

  const getWordFrequency = useCallback(() => {
    if (!text.trim()) return {}
    const words = text.toLowerCase().match(/\b\w+\b/g) || []
    const frequency: { [key: string]: number } = {}
    for (const word of words) {
      frequency[word] = (frequency[word] || 0) + 1
    }
    return frequency
  }, [text])

  const countOccurrences = useCallback((pattern: string) => {
    if (!pattern) return 0
    const regex = new RegExp(pattern.toLowerCase(), 'g')
    const matches = text.toLowerCase().match(regex)
    return matches ? matches.length : 0
  }, [text])

  const findAllOccurrences = useCallback((pattern: string) => {
    if (!pattern) return []
    const indices: number[] = []
    const lowerText = text.toLowerCase()
    const lowerPattern = pattern.toLowerCase()
    let index = lowerText.indexOf(lowerPattern)
    
    while (index !== -1) {
      indices.push(index)
      index = lowerText.indexOf(lowerPattern, index + 1)
    }
    
    return indices
  }, [text])

  return {
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
    isEmpty: text.length === 0,
    length: text.length,
    // Text Analysis
    getWordCount,
    getCharacterFrequency,
    getWordFrequency,
    countOccurrences,
    findAllOccurrences,
  }
}