# Arrays

## What is an Array?

An **array** is a fundamental data structure that stores elements of the same type in contiguous memory locations. Arrays are one of the most basic and widely used data structures in computer science.

## Key Characteristics

### Contiguous Memory Storage
- Elements are stored in adjacent memory locations
- This enables efficient cache usage and predictable memory access patterns
- Memory address of element at index `i`: `base_address + (i × element_size)`

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

## Advantages

1. **Fast Access**: O(1) access time using index
2. **Memory Efficiency**: No extra memory needed for pointers/references
3. **Cache Locality**: Contiguous memory improves cache performance
4. **Simplicity**: Easy to understand and implement
5. **Indexing**: Natural mapping to mathematical concepts

## Disadvantages

1. **Fixed Size**: Static arrays cannot be resized
2. **Insertion/Deletion Cost**: O(n) for operations in the middle
3. **Memory Allocation**: May require large contiguous memory blocks
4. **Wasted Space**: Allocated but unused space in dynamic arrays

## Common Use Cases

### Data Storage
- Storing collections of similar items
- Implementing other data structures (stacks, queues, hash tables)
- Matrix operations and mathematical computations

### Algorithm Implementation
- Sorting algorithms (merge sort, quick sort)
- Dynamic programming solutions
- Graph representations (adjacency matrices)

### System Programming
- Buffer management
- Memory pools
- Hardware interfacing

## Dynamic Arrays

Many modern languages provide **dynamic arrays** that can grow and shrink:

### Resizing Strategy
- When array becomes full, allocate new array (typically 2x size)
- Copy all elements to new array
- This gives **amortized O(1)** insertion time at the end

### Popular Implementations
- **C++**: `std::vector`
- **Java**: `ArrayList`
- **Python**: `list`
- **JavaScript**: `Array`
- **C#**: `List<T>`

## Array vs Other Data Structures

### Array vs Linked List
- **Arrays**: Better cache locality, O(1) access, worse insertion/deletion
- **Linked Lists**: Better insertion/deletion, O(n) access, worse cache performance

### Array vs Hash Table
- **Arrays**: Ordered, integer indices, better cache locality
- **Hash Tables**: Key-value mapping, O(1) average operations, unordered

## Best Practices

1. **Choose the Right Size**: Avoid excessive memory allocation
2. **Access Patterns**: Utilize cache-friendly sequential access when possible
3. **Bounds Checking**: Always validate array indices to prevent errors
4. **Consider Alternatives**: Use other data structures when frequent insertion/deletion needed
5. **Initialization**: Initialize arrays properly to avoid undefined behavior

## Implementation Notes

The visualizer above demonstrates core array operations:
- **Insert**: Adding elements at specific positions
- **Delete**: Removing elements and shifting others
- **Access**: Direct element retrieval by index
- **Update**: Modifying element values
- **Resize**: Changing array capacity (for dynamic arrays)

Try the different operations to see how arrays behave and understand the performance characteristics of each operation!