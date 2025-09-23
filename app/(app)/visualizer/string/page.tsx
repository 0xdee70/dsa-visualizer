import { StringVisualizer } from "@/components/visualizer/string/string-visualizer"

export default function StringPage() {
  return (
    <StringVisualizer 
      content={
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold">String Data Structure</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Explore string operations including concatenation, substring extraction, character manipulation, 
            and pattern searching algorithms. Perfect for understanding text processing fundamentals.
          </p>
        </div>
      }
    />
  )
}