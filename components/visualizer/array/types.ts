export interface ArrayElement {
  id: string
  value: number
  index: number
}

export interface ArrayOperation {
  type: 'insert' | 'delete' | 'access' | 'update' | 'resize' | 'clear'
  value?: number
  index?: number
  oldValue?: number
  newSize?: number
  timestamp: number
}

export interface ArrayState {
  elements: ArrayElement[]
  capacity: number
  size: number
}