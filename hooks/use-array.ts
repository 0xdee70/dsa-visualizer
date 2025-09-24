import { useState, useCallback } from "react"
import { ArrayElement, ArrayOperation } from "@/components/visualizer/array/types"

let elementIdCounter = 0

export function useArray(initialCapacity: number = 8) {
  const [elements, setElements] = useState<ArrayElement[]>([])
  const [capacity, setCapacity] = useState(initialCapacity)
  const [size, setSize] = useState(0)
  const [operations, setOperations] = useState<ArrayOperation[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [accessedIndex, setAccessedIndex] = useState<number | null>(null)
  const [searchingIndex, setSearchingIndex] = useState<number | null>(null)
  const [sortingIndices, setSortingIndices] = useState<number[]>([])
  const [comparingIndices, setComparingIndices] = useState<number[]>([])
  const [searchResult, setSearchResult] = useState<{ found: boolean; index: number; comparisons: number } | null>(null)

  // Helper function to add operations, ensuring it's properly defined
  const addOperation = useCallback((operation: Omit<ArrayOperation, 'timestamp'>) => {
    setOperations(prev => [...prev, { ...operation, timestamp: Date.now() }])
  }, [])

  const insert = useCallback(async (index: number, value: number) => {
    if (index < 0 || index > size || isAnimating || size >= capacity) return

    setIsAnimating(true)
    addOperation({ type: 'insert', value, index })

    // Highlight the insertion position
    setHighlightedIndex(index)

    await new Promise(resolve => setTimeout(resolve, 500))

    // Shift elements and insert new one
    setElements(prev => {
      const newElements = [...prev]
      // Shift elements to the right
      for (let i = newElements.length; i > index; i--) {
        if (newElements[i - 1]) {
          newElements[i - 1] = { ...newElements[i - 1], index: i }
        }
      }
      // Insert new element
      newElements.splice(index, 0, {
        id: `element-${elementIdCounter++}`,
        value,
        index
      })
      // Update indices for all elements
      return newElements.map((el, i) => ({ ...el, index: i }))
    })

    setSize(prev => prev + 1)

    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndex(null)
    setIsAnimating(false)
  }, [size, capacity, isAnimating, addOperation])

  const deleteAt = useCallback(async (index: number) => {
    if (index < 0 || index >= size || isAnimating) return

    setIsAnimating(true)
    const deletedValue = elements[index].value
    addOperation({ type: 'delete', value: deletedValue, index })

    // Highlight the deletion position
    setHighlightedIndex(index)

    await new Promise(resolve => setTimeout(resolve, 500))

    // Remove element and shift others left
    setElements(prev => {
      const newElements = prev.filter((_, i) => i !== index)
      return newElements.map((el, i) => ({ ...el, index: i }))
    })

    setSize(prev => prev - 1)

    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndex(null)
    setIsAnimating(false)
  }, [elements, size, isAnimating, addOperation])

  const access = useCallback(async (index: number) => {
    if (index < 0 || index >= size || isAnimating) return elements[index]?.value

    setIsAnimating(true)
    addOperation({ type: 'access', index })

    // Highlight the accessed element
    setAccessedIndex(index)

    await new Promise(resolve => setTimeout(resolve, 800))

    setAccessedIndex(null)
    setIsAnimating(false)
    return elements[index].value
  }, [elements, size, isAnimating, addOperation])

  // Add access by value function
  const accessByValue = useCallback(async (searchValue: number) => {
    if (size === 0 || isAnimating) return { found: false, index: -1, comparisons: 0 }

    setIsAnimating(true)
    addOperation({ type: 'search', searchValue, algorithm: 'Access by Value' })

    let comparisons = 0
    let found = false
    let foundIndex = -1

    for (let i = 0; i < size; i++) {
      setSearchingIndex(i)
      comparisons++

      await new Promise(resolve => setTimeout(resolve, 600))

      if (elements[i].value === searchValue) {
        found = true
        foundIndex = i
        setAccessedIndex(i)
        break
      }
    }

    setSearchResult({ found, index: foundIndex, comparisons })

    await new Promise(resolve => setTimeout(resolve, 1000))

    setSearchingIndex(null)
    setAccessedIndex(null)
    setIsAnimating(false)

    setTimeout(() => setSearchResult(null), 3000)
    return { found, index: foundIndex, comparisons }
  }, [elements, size, isAnimating, addOperation])

  const update = useCallback(async (index: number, newValue: number) => {
    if (index < 0 || index >= size || isAnimating) return

    setIsAnimating(true)
    const oldValue = elements[index].value
    addOperation({ type: 'update', index, value: newValue, oldValue })

    // Highlight the updated element
    setHighlightedIndex(index)

    await new Promise(resolve => setTimeout(resolve, 500))

    setElements(prev => 
      prev.map((el, i) => 
        i === index ? { ...el, value: newValue } : el
      )
    )

    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndex(null)
    setIsAnimating(false)
  }, [elements, size, isAnimating, addOperation])

  const resize = useCallback(async (newCapacity: number) => {
    if (newCapacity < size || isAnimating || newCapacity < 1) return

    setIsAnimating(true)
    addOperation({ type: 'resize', newSize: newCapacity })

    await new Promise(resolve => setTimeout(resolve, 500))

    setCapacity(newCapacity)

    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAnimating(false)
  }, [size, isAnimating, addOperation])

  const clear = useCallback(() => {
    setElements([])
    setSize(0)
    setOperations([])
    setHighlightedIndex(null)
    setAccessedIndex(null)
    setSearchingIndex(null)
    setSortingIndices([])
    setComparingIndices([])
    setSearchResult(null)
    setIsAnimating(false)
    setCapacity(initialCapacity)
    elementIdCounter = 0
  }, [initialCapacity])

  // Check if array is sorted
  const isSorted = useCallback(() => {
    for (let i = 1; i < size; i++) {
      if (elements[i - 1].value > elements[i].value) {
        return false
      }
    }
    return true
  }, [elements, size])

  // Linear Search Implementation
  const linearSearch = useCallback(async (searchValue: number) => {
    if (size === 0 || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'search', searchValue, algorithm: 'Linear Search' })

    let comparisons = 0
    let found = false
    let foundIndex = -1

    for (let i = 0; i < size; i++) {
      setSearchingIndex(i)
      comparisons++

      await new Promise(resolve => setTimeout(resolve, 800))

      if (elements[i].value === searchValue) {
        found = true
        foundIndex = i
        setAccessedIndex(i)
        break
      }
    }

    addOperation({ 
      type: 'search', 
      searchValue, 
      foundIndex: found ? foundIndex : -1, 
      algorithm: 'Linear Search' 
    })

    setSearchResult({ found, index: foundIndex, comparisons })

    await new Promise(resolve => setTimeout(resolve, 1000))

    setSearchingIndex(null)
    setAccessedIndex(null)
    setIsAnimating(false)

    setTimeout(() => setSearchResult(null), 3000)
  }, [elements, size, isAnimating, addOperation])

  // Binary Search Implementation (requires sorted array)
  const binarySearch = useCallback(async (searchValue: number) => {
    if (size === 0 || isAnimating) return

    // Check if array is sorted
    if (!isSorted()) {
      alert('Binary Search requires a sorted array. Please sort the array first.')
      return
    }

    setIsAnimating(true)
    addOperation({ type: 'search', searchValue, algorithm: 'Binary Search' })

    let left = 0
    let right = size - 1
    let comparisons = 0
    let found = false
    let foundIndex = -1

    while (left <= right) {
      const mid = Math.floor((left + right) / 2)
      setSearchingIndex(mid)
      comparisons++

      await new Promise(resolve => setTimeout(resolve, 800))

      if (elements[mid].value === searchValue) {
        found = true
        foundIndex = mid
        setAccessedIndex(mid)
        break
      } else if (elements[mid].value < searchValue) {
        left = mid + 1
      } else {
        right = mid - 1
      }
    }

    addOperation({ 
      type: 'search', 
      searchValue, 
      foundIndex: found ? foundIndex : -1, 
      algorithm: 'Binary Search' 
    })

    setSearchResult({ found, index: foundIndex, comparisons })

    await new Promise(resolve => setTimeout(resolve, 1000))

    setSearchingIndex(null)
    setAccessedIndex(null)
    setIsAnimating(false)

    setTimeout(() => setSearchResult(null), 3000)
  }, [elements, size, isAnimating, addOperation, isSorted])

  // Bubble Sort Implementation
  const bubbleSort = useCallback(async () => {
    if (size <= 1 || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'sort', algorithm: 'Bubble Sort' })

    const arr = [...elements]
    const n = size

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Highlight comparison
        setComparingIndices([j, j + 1])
        await new Promise(resolve => setTimeout(resolve, 500))

        if (arr[j].value > arr[j + 1].value) {
          // Swap elements
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          // Update indices
          arr[j].index = j
          arr[j + 1].index = j + 1

          setElements([...arr])
          addOperation({ type: 'swap', swapIndices: [j, j + 1] })

          await new Promise(resolve => setTimeout(resolve, 500))
        }
      }
      // Mark element as sorted
      setSortingIndices(prev => [...prev, n - 1 - i])
    }

    setSortingIndices(prev => [...prev, 0]) // Mark first element as sorted
    await new Promise(resolve => setTimeout(resolve, 500))

    setComparingIndices([])
    setSortingIndices([])
    setIsAnimating(false)
  }, [elements, isAnimating, addOperation])

  // Selection Sort Implementation
  const selectionSort = useCallback(async () => {
    if (size <= 1 || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'sort', algorithm: 'Selection Sort' })

    const arr = [...elements]
    const n = size

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i
      setHighlightedIndex(i)

      for (let j = i + 1; j < n; j++) {
        setComparingIndices([minIdx, j])
        await new Promise(resolve => setTimeout(resolve, 400))

        if (arr[j].value < arr[minIdx].value) {
          minIdx = j
        }
      }

      if (minIdx !== i) {
        // Swap elements
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]]
        arr[i].index = i
        arr[minIdx].index = minIdx

        setElements([...arr])
        addOperation({ type: 'swap', swapIndices: [i, minIdx] })

        await new Promise(resolve => setTimeout(resolve, 500))
      }

      setSortingIndices(prev => [...prev, i])
    }

    setSortingIndices(prev => [...prev, n - 1])
    await new Promise(resolve => setTimeout(resolve, 500))

    setHighlightedIndex(null)
    setComparingIndices([])
    setSortingIndices([])
    setIsAnimating(false)
  }, [elements, isAnimating, addOperation])

  const pushBack = useCallback(async (value: number) => {
    await insert(size, value)
  }, [insert, size])

  const popBack = useCallback(async () => {
    if (size > 0) {
      await deleteAt(size - 1)
    }
  }, [deleteAt, size])

  const setArray = useCallback((newArray: number[]) => {
    if (newArray.length <= capacity) {
      const newElements = newArray.map((value, index) => ({
        id: `element-${elementIdCounter++}`,
        value,
        index,
      }))
      setElements(newElements)
      setSize(newArray.length)
      addOperation({ type: 'clear', value: undefined, index: undefined })
    }
  }, [capacity, addOperation])


  return {
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
    isFull: size >= capacity,
    isEmpty: size === 0,
    setArray,
    isSorted,
  }
}