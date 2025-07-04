'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface Payload {
  name: string
  description: string
  payload: string
}

interface PayloadCategory {
  category: string
  payloads: Payload[]
}

export default function PayloadLibrary({ onSelect }: { onSelect: (payload: string) => void }) {
  const [categories, setCategories] = useState<PayloadCategory[]>([])
  const [open, setOpen] = useState(false)

  useEffect(() => {
    fetch('/data/payloads.json')
      .then(res => res.json())
      .then(setCategories)
  }, [])

  return (
    <Card className="!p-0 bg-white dark:bg-neutral-800 dark:border-neutral-700 overflow-hidden rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between py-2 px-4 cursor-pointer select-none bg-white dark:bg-neutral-800" onClick={() => setOpen(o => !o)}>
        <div className="flex items-center gap-2">
          {open ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
          <CardTitle className="text-base">Payload Library</CardTitle>
        </div>
        <Button size="sm" variant="ghost" tabIndex={-1} onClick={e => { e.stopPropagation(); setOpen(o => !o); }}>
          {open ? 'Hide' : 'Show'}
        </Button>
      </CardHeader>
      {open && (
        <CardContent className="space-y-3 max-h-56 overflow-y-auto p-2">
          {categories.map(cat => (
            <div key={cat.category}>
              <div className="font-semibold text-xs mb-1 text-gray-700 dark:text-gray-200">{cat.category}</div>
              <div className="space-y-1">
                {cat.payloads.map(p => (
                  <div key={p.name} className="flex items-start gap-2 p-1 border-b border-gray-200 dark:border-neutral-700 last:border-b-0">
                    <div className="flex-1">
                      <div className="font-medium text-xs text-black dark:text-white">{p.name}</div>
                      <div className="text-[10px] text-gray-500 dark:text-gray-300 mb-1">{p.description}</div>
                      <pre className="text-[10px] text-black dark:text-white rounded p-1 overflow-x-auto max-w-xs">{p.payload}</pre>
                    </div>
                    <Button size="sm" variant="outline" onClick={() => onSelect(p.payload)}>
                      Use
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      )}
    </Card>
  )
} 