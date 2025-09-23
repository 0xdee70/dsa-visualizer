export interface ArrayElement {
  id: string
  value: number
  index: number
}

export interface ArrayOperation {
  type: 'insert' | 'delete' | 'access' | 'update' | 'resize' | 'clear' | 'search' | 'sort' | 'compare' | 'swap'
  value?: number
  index?: number
  oldValue?: number
  newSize?: number
  searchValue?: number
  foundIndex?: number
  algorithm?: string
  compareIndices?: [number, number]
  swapIndices?: [number, number]
  step?: number
  totalSteps?: number
  timestamp: number
}

export interface SearchResult {
  found: boolean
  index: number
  comparisons: number
  steps: number[]
}

export interface SortStep {
  type: 'compare' | 'swap' | 'highlight' | 'sorted'
  indices: number[]
  array?: ArrayElement[]
  description: string
}

export interface ArrayState {
  elements: ArrayElement[]
  capacity: number
  size: number
}