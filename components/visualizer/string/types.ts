export interface StringCharacter {
  id: string
  value: string
  index: number
}

export interface StringOperation {
  type: 'concatenate' | 'substring' | 'insert' | 'delete' | 'replace' | 'search' | 'clear' | 'reverse'
  value?: string
  index?: number
  length?: number
  searchPattern?: string
  foundIndices?: number[]
  algorithm?: string
  newValue?: string
  timestamp: number
}

export interface StringSearchResult {
  found: boolean
  indices: number[]
  comparisons: number
  pattern: string
}

export interface StringState {
  characters: StringCharacter[]
  text: string
  operations: StringOperation[]
}