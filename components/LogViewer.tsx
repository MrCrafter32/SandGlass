'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export interface LogEntry {
  type: string
  [key: string]: any
}

export default function LogViewer({ logs, onClear }: { logs: LogEntry[]; onClear: () => void }) {
  return (
    <Card className="bg-white dark:bg-neutral-800 dark:border-neutral-700">
      <CardHeader className="flex flex-row items-center justify-between bg-white dark:bg-neutral-800">
        <CardTitle>CSP & Network Log</CardTitle>
        <Button size="sm" variant="outline" onClick={onClear} disabled={logs.length === 0}>
          Clear
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 max-h-64 overflow-y-auto text-xs font-mono bg-white dark:bg-neutral-800">
        {logs.length === 0 && <div className="text-gray-400">No logs yet.</div>}
        {logs.map((log, i) => (
          <div key={i} className="p-2 bg-gray-50 dark:bg-neutral-700 rounded border border-gray-100 dark:border-neutral-700 text-black dark:text-white">
            <div><b>Type:</b> {log.type}</div>
            {log.type === 'csp-violation' && (
              <>
                <div><b>Violated:</b> {log.violatedDirective}</div>
                <div><b>Blocked URI:</b> {log.blockedURI}</div>
                <div><b>Source:</b> {log.sourceFile}:{log.lineNumber}</div>
                <div><b>Message:</b> {log.message}</div>
              </>
            )}
            {/* Add more log types as needed */}
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 