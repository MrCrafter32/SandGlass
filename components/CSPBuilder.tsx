'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'

interface CSPDirective {
  name: string
  values: string[]
  customUrls: string[]
}

export default function CSPBuilder({ onCSPChange }: { onCSPChange: (csp: string) => void }) {
  const [directives, setDirectives] = useState<CSPDirective[]>([
    {
      name: 'default-src',
      values: ['self'],
      customUrls: []
    },
    {
      name: 'script-src',
      values: ['self'],
      customUrls: []
    },
    {
      name: 'style-src',
      values: ['self'],
      customUrls: []
    },
    {
      name: 'img-src',
      values: ['self'],
      customUrls: []
    },
    {
      name: 'connect-src',
      values: ['self'],
      customUrls: []
    }
  ])

  const predefinedValues = [
    { label: 'Self', value: 'self' },
    { label: 'Unsafe Inline', value: 'unsafe-inline' },
    { label: 'Unsafe Eval', value: 'unsafe-eval' },
    { label: 'None', value: 'none' },
    { label: 'Data', value: 'data:' },
    { label: 'Blob', value: 'blob:' }
  ]

  const updateDirective = (index: number, values: string[], customUrls: string[]) => {
    const newDirectives = [...directives]
    newDirectives[index] = { ...newDirectives[index], values, customUrls }
    setDirectives(newDirectives)
    generateCSP(newDirectives)
  }

  const toggleValue = (directiveIndex: number, value: string) => {
    const directive = directives[directiveIndex]
    const newValues = directive.values.includes(value)
      ? directive.values.filter(v => v !== value)
      : [...directive.values, value]
    
    updateDirective(directiveIndex, newValues, directive.customUrls)
  }

  const addCustomUrl = (directiveIndex: number, url: string) => {
    if (!url.trim()) return
    const directive = directives[directiveIndex]
    const newUrls = [...directive.customUrls, url.trim()]
    updateDirective(directiveIndex, directive.values, newUrls)
  }

  const removeCustomUrl = (directiveIndex: number, urlIndex: number) => {
    const directive = directives[directiveIndex]
    const newUrls = directive.customUrls.filter((_, i) => i !== urlIndex)
    updateDirective(directiveIndex, directive.values, newUrls)
  }

  const generateCSP = (dirs: CSPDirective[]) => {
    const cspParts = dirs.map(directive => {
      const allValues = [...directive.values, ...directive.customUrls]
      if (allValues.length === 0) return null
      return `${directive.name} ${allValues.map(v => `'${v}'`).join(' ')}`
    }).filter(Boolean)
    
    const csp = cspParts.join('; ')
    onCSPChange(csp)
  }

  const loadPreset = (preset: string) => {
    let newDirectives: CSPDirective[]
    
    switch (preset) {
      case 'restrictive':
        newDirectives = [
          { name: 'default-src', values: ['self'], customUrls: [] },
          { name: 'script-src', values: ['none'], customUrls: [] },
          { name: 'style-src', values: ['self'], customUrls: [] },
          { name: 'img-src', values: ['self'], customUrls: [] },
          { name: 'connect-src', values: ['self'], customUrls: [] }
        ]
        break
      case 'permissive':
        newDirectives = [
          { name: 'default-src', values: ['self'], customUrls: [] },
          { name: 'script-src', values: ['self', 'unsafe-inline'], customUrls: [] },
          { name: 'style-src', values: ['self', 'unsafe-inline'], customUrls: [] },
          { name: 'img-src', values: ['self', 'data:'], customUrls: [] },
          { name: 'connect-src', values: ['self'], customUrls: [] }
        ]
        break
      default:
        return
    }
    
    setDirectives(newDirectives)
    generateCSP(newDirectives)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          CSP Builder
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => loadPreset('restrictive')}>
              Restrictive
            </Button>
            <Button variant="outline" size="sm" onClick={() => loadPreset('permissive')}>
              Permissive
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {directives.map((directive, index) => (
          <div key={directive.name} className="space-y-2">
            <Label className="font-medium">{directive.name}</Label>
            
            <div className="flex flex-wrap gap-2">
              {predefinedValues.map(({ label, value }) => (
                <div key={value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${directive.name}-${value}`}
                    checked={directive.values.includes(value)}
                    onCheckedChange={() => toggleValue(index, value)}
                  />
                  <Label htmlFor={`${directive.name}-${value}`} className="text-sm">
                    {label}
                  </Label>
                </div>
              ))}
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="Add custom URL (e.g., https://example.com)"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    addCustomUrl(index, (e.target as HTMLInputElement).value)
                    ;(e.target as HTMLInputElement).value = ''
                  }
                }}
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const input = document.querySelector(`input[placeholder*="${directive.name}"]`) as HTMLInputElement
                  if (input) {
                    addCustomUrl(index, input.value)
                    input.value = ''
                  }
                }}
              >
                Add
              </Button>
            </div>
            
            {directive.customUrls.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {directive.customUrls.map((url, urlIndex) => (
                  <div key={urlIndex} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-sm">
                    <span>{url}</span>
                    <button
                      onClick={() => removeCustomUrl(index, urlIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 