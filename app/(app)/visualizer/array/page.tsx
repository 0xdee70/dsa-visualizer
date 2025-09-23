import { ArrayVisualizer } from "@/components/visualizer/array/array-visualizer"

const content = `# Arrays

## What is an Array?

An **array** is a fundamental data structure that stores elements of the same type in contiguous memory locations. Arrays are one of the most basic and widely used data structures in computer science.

## Key Characteristics

### Contiguous Memory Storage
- Elements are stored in adjacent memory locations
- This enables efficient cache usage and predictable memory access patterns
- Memory address of element at index \`i\`: \`base_address + (i × element_size)\`

### Index-Based Access
- Elements are accessed using integer indices (0-based in most languages)
- Direct access to any element using its index
- Random access capability makes arrays very efficient for certain operations

### Fixed Size (Static Arrays)
- Traditional arrays have a fixed size determined at creation time
- Size cannot be changed after allocation
- Dynamic arrays (like JavaScript arrays, Python lists) can grow and shrink

## Time Complexity

| Operation | Time Complexity | Description |
|-----------|----------------|-------------|
| **Access** | O(1) | Direct access using index |
| **Search** | O(n) | Linear search through elements |
| **Insertion at end** | O(1) | For dynamic arrays with available capacity |
| **Insertion at index** | O(n) | Requires shifting elements |
| **Deletion at end** | O(1) | Simple removal of last element |
| **Deletion at index** | O(n) | Requires shifting elements |

## Space Complexity
- **Space**: O(n) where n is the number of elements
- **Additional space**: O(1) for most operations (in-place)

## Try the visualizer above to see how these operations work in practice!`

export default function ArrayPage() {
  return <ArrayVisualizer content={content} />
}