
"use client"

import React, { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, RotateCcw, AlertCircle, CheckCircle, Code, Terminal } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface PlaygroundProps {
  dataStructure: 'array' | 'string' | 'stack' | 'queue' | 'linkedList'
  initialCode?: string
  onExecute?: (code: string, result: any) => void
  context?: any // The current data structure instance
}

const DEFAULT_CODES = {
  array: `// Try array operations
const arr = [1, 2, 3, 4, 5];

// Add elements
arr.push(6);
arr.unshift(0);

// Find operations
const found = arr.find(x => x > 3);
const index = arr.indexOf(4);

// Transform operations
const doubled = arr.map(x => x * 2);
const evens = arr.filter(x => x % 2 === 0);
const sum = arr.reduce((acc, val) => acc + val, 0);

console.log('Original:', arr);
console.log('Doubled:', doubled);
console.log('Evens:', evens);
console.log('Sum:', sum);

return { arr, doubled, evens, sum, found, index };`,

  string: `// Try string operations
let text = "Hello World";

// Basic operations
const reversed = text.split('').reverse().join('');
const upperCase = text.toUpperCase();
const words = text.split(' ');

// Search operations
const hasWorld = text.includes('World');
const worldIndex = text.indexOf('World');
const replaced = text.replace('World', 'JavaScript');

// Character frequency
const charCount = {};
for (const char of text.toLowerCase()) {
  if (char.match(/[a-z]/)) {
    charCount[char] = (charCount[char] || 0) + 1;
  }
}

console.log('Original:', text);
console.log('Reversed:', reversed);
console.log('Words:', words);
console.log('Character count:', charCount);

return { 
  original: text, 
  reversed, 
  upperCase, 
  words, 
  hasWorld, 
  worldIndex, 
  replaced,
  charCount 
};`,

  stack: `// Try stack operations
const stack = [];

// Push operations
stack.push('First');
stack.push('Second');
stack.push('Third');

console.log('After pushes:', [...stack]);

// Pop operations
const popped1 = stack.pop();
const popped2 = stack.pop();

console.log('Popped:', popped1, popped2);
console.log('Remaining:', [...stack]);

// Peek (look at top without removing)
const top = stack[stack.length - 1];

// Check if balanced parentheses
function isBalanced(str) {
  const stack = [];
  const pairs = { '(': ')', '[': ']', '{': '}' };
  
  for (const char of str) {
    if (char in pairs) {
      stack.push(char);
    } else if (Object.values(pairs).includes(char)) {
      if (stack.length === 0) return false;
      const last = stack.pop();
      if (pairs[last] !== char) return false;
    }
  }
  
  return stack.length === 0;
}

const testStr = "([{}])";
const balanced = isBalanced(testStr);

console.log('Stack operations demo');
console.log('Is balanced:', balanced);

return { stack, popped1, popped2, top, balanced };`,

  queue: `// Try queue operations
const queue = [];

// Enqueue (add to rear)
queue.push('First');
queue.push('Second');
queue.push('Third');

console.log('After enqueues:', [...queue]);

// Dequeue (remove from front)
const dequeued1 = queue.shift();
const dequeued2 = queue.shift();

console.log('Dequeued:', dequeued1, dequeued2);
console.log('Remaining:', [...queue]);

// BFS example
function bfsLevels(levels) {
  const queue = [{ level: 0, value: 'Root' }];
  const result = [];
  
  while (queue.length > 0) {
    const current = queue.shift();
    result.push(current);
    
    if (current.level < levels - 1) {
      queue.push({ level: current.level + 1, value: \`L\${current.level + 1}-A\` });
      queue.push({ level: current.level + 1, value: \`L\${current.level + 1}-B\` });
    }
  }
  
  return result;
}

const bfsResult = bfsLevels(3);
console.log('BFS traversal:', bfsResult);

return { queue, dequeued1, dequeued2, bfsResult };`,

  linkedList: `// Try linked list simulation
class ListNode {
  constructor(val, next = null) {
    this.val = val;
    this.next = next;
  }
}

// Create linked list: 1 -> 2 -> 3 -> 4
let head = new ListNode(1);
head.next = new ListNode(2);
head.next.next = new ListNode(3);
head.next.next.next = new ListNode(4);

// Convert to array for visualization
function listToArray(head) {
  const result = [];
  let current = head;
  while (current) {
    result.push(current.val);
    current = current.next;
  }
  return result;
}

console.log('Original list:', listToArray(head));

// Insert at beginning
function insertAtHead(head, val) {
  return new ListNode(val, head);
}

head = insertAtHead(head, 0);
console.log('After insert at head:', listToArray(head));

// Find middle element
function findMiddle(head) {
  let slow = head, fast = head;
  while (fast && fast.next) {
    slow = slow.next;
    fast = fast.next.next;
  }
  return slow ? slow.val : null;
}

const middle = findMiddle(head);
console.log('Middle element:', middle);

// Reverse the list
function reverseList(head) {
  let prev = null;
  let current = head;
  
  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }
  
  return prev;
}

const reversed = reverseList(head);
console.log('Reversed list:', listToArray(reversed));

return { 
  original: listToArray(head), 
  middle, 
  reversed: listToArray(reversed) 
};`
}

export function CodePlayground({ 
  dataStructure, 
  initialCode, 
  onExecute, 
  context 
}: PlaygroundProps) {
  const [code, setCode] = useState(initialCode || DEFAULT_CODES[dataStructure] || '')
  const [output, setOutput] = useState<string[]>([])
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)

  const executeCode = useCallback(async () => {
    if (!code.trim() || isRunning) return

    setIsRunning(true)
    setError(null)
    setOutput([])
    setResult(null)

    try {
      // Capture console.log outputs
      const logs: string[] = []
      const originalLog = console.log
      console.log = (...args) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '))
        originalLog.apply(console, args)
      }

      // Create a safe execution environment
      const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor
      const safeCode = `
        "use strict";
        ${code}
      `

      // Execute the code
      const func = new AsyncFunction(safeCode)
      const executionResult = await func()

      // Restore console.log
      console.log = originalLog

      setOutput(logs)
      setResult(executionResult)
      
      if (onExecute) {
        onExecute(code, executionResult)
      }
      
    } catch (err) {
      console.log = console.log // Restore console.log
      setError(err instanceof Error ? err.message : 'Unknown error occurred')
    } finally {
      setIsRunning(false)
    }
  }, [code, isRunning, onExecute])

  const resetCode = () => {
    setCode(DEFAULT_CODES[dataStructure] || '')
    setOutput([])
    setResult(null)
    setError(null)
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Code className="h-5 w-5" />
          JavaScript Playground
        </CardTitle>
        <CardDescription>
          Write JavaScript code to explore {dataStructure} operations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="editor" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor">Code Editor</TabsTrigger>
            <TabsTrigger value="output">Output</TabsTrigger>
          </TabsList>
          
          <TabsContent value="editor" className="space-y-4">
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button 
                  onClick={executeCode} 
                  disabled={isRunning || !code.trim()}
                  size="sm"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {isRunning ? 'Running...' : 'Run Code'}
                </Button>
                <Button 
                  onClick={resetCode} 
                  variant="outline" 
                  size="sm"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
              
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full h-[400px] p-4 font-mono text-sm border rounded-lg resize-none
                          bg-muted/50 focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Write your JavaScript code here..."
                disabled={isRunning}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="output" className="space-y-4">
            <div className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Error:</strong> {error}
                  </AlertDescription>
                </Alert>
              )}

              {output.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="h-4 w-4" />
                    <span className="font-medium">Console Output</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-[200px] overflow-y-auto">
                    {output.map((log, index) => (
                      <div key={index} className="border-b border-muted-foreground/20 pb-1 mb-1 last:border-b-0">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Return Value</span>
                  </div>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm max-h-[200px] overflow-y-auto">
                    <pre>{JSON.stringify(result, null, 2)}</pre>
                  </div>
                </div>
              )}

              {!error && output.length === 0 && !result && (
                <div className="text-center text-muted-foreground py-8">
                  Run your code to see the output here
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
