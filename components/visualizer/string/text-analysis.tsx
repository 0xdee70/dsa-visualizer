
"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, BarChart3, Type, Hash } from "lucide-react"

interface TextAnalysisProps {
  text: string
  getWordCount: () => number
  getCharacterFrequency: () => { [key: string]: number }
  getWordFrequency: () => { [key: string]: number }
  countOccurrences: (pattern: string) => number
  findAllOccurrences: (pattern: string) => number[]
}

export function TextAnalysis({
  text,
  getWordCount,
  getCharacterFrequency,
  getWordFrequency,
  countOccurrences,
  findAllOccurrences,
}: TextAnalysisProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState<{
    term: string
    count: number
    positions: number[]
  } | null>(null)

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const count = countOccurrences(searchTerm)
      const positions = findAllOccurrences(searchTerm)
      setSearchResults({
        term: searchTerm,
        count,
        positions,
      })
    }
  }

  const clearSearch = () => {
    setSearchTerm("")
    setSearchResults(null)
  }

  const getTextStats = () => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0).length
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0).length
    const avgWordsPerSentence = sentences > 0 ? Math.round(getWordCount() / sentences) : 0
    
    return {
      characters: text.length,
      charactersNoSpaces: text.replace(/\s/g, '').length,
      words: getWordCount(),
      sentences,
      paragraphs,
      avgWordsPerSentence,
    }
  }

  const stats = getTextStats()
  const charFreq = getCharacterFrequency()
  const wordFreq = getWordFrequency()

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Pattern Search & Count
          </CardTitle>
          <CardDescription>
            Search for specific words, letters, or patterns in your text
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Enter word, letter, or pattern to search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={!searchTerm.trim()}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
            {searchResults && (
              <Button variant="outline" onClick={clearSearch}>
                Clear
              </Button>
            )}
          </div>
          
          {searchResults && (
            <div className="p-4 bg-muted rounded-lg">
              <div className="font-semibold mb-2">
                Search Results for: "{searchResults.term}"
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Total Occurrences:</span>
                  <span className="ml-2 font-mono font-bold">{searchResults.count}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Positions:</span>
                  <span className="ml-2 font-mono text-xs">
                    {searchResults.positions.slice(0, 10).join(', ')}
                    {searchResults.positions.length > 10 && '...'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Text Statistics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Text Statistics
          </CardTitle>
          <CardDescription>
            Comprehensive analysis of your text content
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold font-mono">{stats.characters}</div>
              <div className="text-sm text-muted-foreground">Characters</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold font-mono">{stats.charactersNoSpaces}</div>
              <div className="text-sm text-muted-foreground">Chars (no spaces)</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold font-mono">{stats.words}</div>
              <div className="text-sm text-muted-foreground">Words</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold font-mono">{stats.sentences}</div>
              <div className="text-sm text-muted-foreground">Sentences</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold font-mono">{stats.paragraphs}</div>
              <div className="text-sm text-muted-foreground">Paragraphs</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold font-mono">{stats.avgWordsPerSentence}</div>
              <div className="text-sm text-muted-foreground">Avg words/sentence</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Frequency Analysis */}
      <Tabs defaultValue="characters" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="characters" className="flex items-center gap-2">
            <Type className="h-4 w-4" />
            Character Frequency
          </TabsTrigger>
          <TabsTrigger value="words" className="flex items-center gap-2">
            <Hash className="h-4 w-4" />
            Word Frequency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="characters">
          <Card>
            <CardHeader>
              <CardTitle>Most Frequent Characters</CardTitle>
              <CardDescription>Letter frequency analysis (excluding spaces and punctuation)</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(charFreq).length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(charFreq)
                    .sort(([,a], [,b]) => b - a)
                    .map(([char, count], index) => {
                      const percentage = ((count / stats.charactersNoSpaces) * 100).toFixed(1)
                      return (
                        <div key={char} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <span className="w-6 text-center text-xs text-muted-foreground">
                              #{index + 1}
                            </span>
                            <span className="font-mono text-lg font-bold">'{char}'</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono">{count}</span>
                            <span className="text-sm text-muted-foreground">({percentage}%)</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No character data to analyze
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="words">
          <Card>
            <CardHeader>
              <CardTitle>Most Frequent Words</CardTitle>
              <CardDescription>Word frequency analysis</CardDescription>
            </CardHeader>
            <CardContent>
              {Object.keys(wordFreq).length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(wordFreq)
                    .sort(([,a], [,b]) => b - a)
                    .map(([word, count], index) => {
                      const percentage = ((count / stats.words) * 100).toFixed(1)
                      return (
                        <div key={word} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                          <div className="flex items-center gap-3">
                            <span className="w-6 text-center text-xs text-muted-foreground">
                              #{index + 1}
                            </span>
                            <span className="font-mono font-bold truncate max-w-32">"{word}"</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-mono">{count}</span>
                            <span className="text-sm text-muted-foreground">({percentage}%)</span>
                          </div>
                        </div>
                      )
                    })}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  No word data to analyze
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
