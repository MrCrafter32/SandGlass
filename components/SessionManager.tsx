'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export interface Session {
  name: string
  payload: string
  csp: string
}

const STORAGE_KEY = 'sandglass-sessions-v1'

function loadSessions(): Session[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
  } catch {
    return []
  }
}

function saveSessions(sessions: Session[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions))
}

export default function SessionManager({
  payload,
  csp,
  onLoadSession
}: {
  payload: string
  csp: string
  onLoadSession: (session: Session) => void
}) {
  const [sessions, setSessions] = useState<Session[]>([])
  const [name, setName] = useState('')
  const [importText, setImportText] = useState('')

  useEffect(() => {
    setSessions(loadSessions())
  }, [])

  const handleSave = () => {
    if (!name.trim()) return
    const newSession = { name: name.trim(), payload, csp }
    const updated = [newSession, ...sessions.filter(s => s.name !== name.trim())]
    setSessions(updated)
    saveSessions(updated)
    setName('')
  }

  const handleDelete = (n: string) => {
    const updated = sessions.filter(s => s.name !== n)
    setSessions(updated)
    saveSessions(updated)
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(sessions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sandglass-sessions.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = () => {
    try {
      const imported = JSON.parse(importText)
      if (Array.isArray(imported)) {
        setSessions(imported)
        saveSessions(imported)
        setImportText('')
      }
    } catch {}
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Sessions
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleExport} disabled={sessions.length === 0}>
              Export
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Session name"
            value={name}
            onChange={e => setName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSave()}
          />
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
        <div className="space-y-2">
          {sessions.length === 0 && <div className="text-gray-400">No saved sessions.</div>}
          {sessions.map(s => (
            <div key={s.name} className="flex items-center gap-2 bg-gray-50 rounded p-2">
              <div className="flex-1 truncate">
                <span className="font-medium">{s.name}</span>
              </div>
              <Button size="sm" variant="outline" onClick={() => onLoadSession(s)}>
                Load
              </Button>
              <Button size="sm" variant="destructive" onClick={() => handleDelete(s.name)}>
                Delete
              </Button>
            </div>
          ))}
        </div>
        <div>
          <Input
            placeholder="Paste JSON to import..."
            value={importText}
            onChange={e => setImportText(e.target.value)}
          />
          <Button size="sm" className="mt-2" onClick={handleImport} disabled={!importText.trim()}>
            Import
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 