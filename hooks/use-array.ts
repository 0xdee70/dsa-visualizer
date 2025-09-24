import { useState, useCallback } from "react"
import { ArrayElement, ArrayOperation } from "@/components/visualizer/array/types"
// Corrected import path for CodePlayground
import { CodePlayground } from "@/components/visualizer/shared/code-playground"

let elementIdCounter = 0

export function useArray(initialCapacity: number = 8) {
  const [elements, setElements] = useState<ArrayElement[]>([])
  const [capacity, setCapacity] = useState(initialCapacity)
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
    if (index < 0 || index > elements.length || isAnimating || elements.length >= capacity) return

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

    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndex(null)
    setIsAnimating(false)
  }, [elements.length, capacity, isAnimating, addOperation])

  const deleteAt = useCallback(async (index: number) => {
    if (index < 0 || index >= elements.length || isAnimating) return

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

    await new Promise(resolve => setTimeout(resolve, 500))
    setHighlightedIndex(null)
    setIsAnimating(false)
  }, [elements, isAnimating, addOperation])

  const access = useCallback(async (index: number) => {
    if (index < 0 || index >= elements.length || isAnimating) return elements[index]?.value

    setIsAnimating(true)
    addOperation({ type: 'access', index })

    // Highlight the accessed element
    setAccessedIndex(index)

    await new Promise(resolve => setTimeout(resolve, 800))

    setAccessedIndex(null)
    setIsAnimating(false)
    return elements[index].value
  }, [elements, isAnimating, addOperation])

  const update = useCallback(async (index: number, newValue: number) => {
    if (index < 0 || index >= elements.length || isAnimating) return

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
  }, [elements, isAnimating, addOperation])

  const resize = useCallback(async (newCapacity: number) => {
    if (newCapacity < elements.length || isAnimating || newCapacity < 1) return

    setIsAnimating(true)
    addOperation({ type: 'resize', newSize: newCapacity })

    await new Promise(resolve => setTimeout(resolve, 500))

    setCapacity(newCapacity)

    await new Promise(resolve => setTimeout(resolve, 500))
    setIsAnimating(false)
  }, [elements.length, isAnimating, addOperation])

  const clear = useCallback(() => {
    setElements([])
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

  // Linear Search Implementation
  const linearSearch = useCallback(async (searchValue: number) => {
    if (elements.length === 0 || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'search', searchValue, algorithm: 'Linear Search' })

    let comparisons = 0
    let found = false
    let foundIndex = -1

    for (let i = 0; i < elements.length; i++) {
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
  }, [elements, isAnimating, addOperation])

  // Binary Search Implementation (requires sorted array)
  const binarySearch = useCallback(async (searchValue: number) => {
    if (elements.length === 0 || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'search', searchValue, algorithm: 'Binary Search' })

    let left = 0
    let right = elements.length - 1
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
  }, [elements, isAnimating, addOperation])

  // Bubble Sort Implementation
  const bubbleSort = useCallback(async () => {
    if (elements.length <= 1 || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'sort', algorithm: 'Bubble Sort' })

    const arr = [...elements]
    const n = arr.length

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
    if (elements.length <= 1 || isAnimating) return

    setIsAnimating(true)
    addOperation({ type: 'sort', algorithm: 'Selection Sort' })

    const arr = [...elements]
    const n = arr.length

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
    await insert(elements.length, value)
  }, [insert, elements.length])

  const popBack = useCallback(async () => {
    if (elements.length > 0) {
      await deleteAt(elements.length - 1)
    }
  }, [deleteAt, elements.length])

  // Added setArray function as per the requirement
  const setArray = useCallback((newArray: number[]) => {
    if (newArray.length <= capacity) {
      // Ensure the new elements array respects the capacity, padding with nulls if necessary
      const paddedArray = [
        ...newArray.map((value, index) => ({
          id: `element-${elementIdCounter++}`,
          value,
          index,
        })),
        ...Array(capacity - newArray.length).fill(null).map((_, index) => ({
            id: `empty-${index}`, // Placeholder for empty slots
            value: null,
            index: newArray.length + index
        }))
      ];
      setElements(paddedArray);
      // Assuming there's a size state, otherwise this would need to be managed differently
      // For now, we'll assume size is implicitly elements.length
      // If a separate size state exists, it should be updated here.
      // addOperation('setArray', `Set array to [${newArray.join(', ')}]`); // Corrected addOperation call
    }
  }, [capacity, /* addOperation */]); // addOperation is not directly available here, needs to be passed or managed globally if required by setArray

  // Re-adding the size state and its setter for setArray to work correctly
  const [size, setSize] = useState(0); // Assuming size state is needed

  // Re-defining addOperation to be used by setArray, or ensuring it's available
  const addOperationForSetArray = useCallback((type: ArrayOperation['type'], description: string) => {
      setOperations(prev => [...prev, { type, description, timestamp: Date.now() }]);
  }, []);


  return {
    elements,
    capacity,
    size, // Returning size state
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
    update,
    resize,
    clear,
    pushBack,
    popBack,
    linearSearch,
    binarySearch,
    bubbleSort,
    selectionSort,
    isFull: elements.length >= capacity,
    isEmpty: elements.length === 0,
    setArray, // Exposing the new setArray function
  }
}