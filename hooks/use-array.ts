import { useState, useCallback } from "react"
import { ArrayElement, ArrayOperation } from "@/components/visualizer/array/types"

let elementIdCounter = 0

export function useArray(initialCapacity: number = 8) {
  const [elements, setElements] = useState<ArrayElement[]>([])
  const [capacity, setCapacity] = useState(initialCapacity)
  const [operations, setOperations] = useState<ArrayOperation[]>([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [highlightedIndex, setHighlightedIndex] = useState<number | null>(null)
  const [accessedIndex, setAccessedIndex] = useState<number | null>(null)

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
    setIsAnimating(false)
    setCapacity(initialCapacity)
    elementIdCounter = 0
  }, [initialCapacity])

  const pushBack = useCallback(async (value: number) => {
    await insert(elements.length, value)
  }, [insert, elements.length])

  const popBack = useCallback(async () => {
    if (elements.length > 0) {
      await deleteAt(elements.length - 1)
    }
  }, [deleteAt, elements.length])

  return {
    elements,
    capacity,
    size: elements.length,
    operations,
    isAnimating,
    highlightedIndex,
    accessedIndex,
    insert,
    deleteAt,
    access,
    update,
    resize,
    clear,
    pushBack,
    popBack,
    isFull: elements.length >= capacity,
    isEmpty: elements.length === 0,
  }
}