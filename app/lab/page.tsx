'use client'

import { useState, useEffect } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import SandboxFrame from '@/components/SandboxFrame'
import CSPBuilder from '@/components/CSPBuilder'
import PayloadLibrary from '@/components/PayloadLibrary'
import LogViewer, { LogEntry } from '@/components/LogViewer'
import SessionManager from '@/components/SessionManager'

export default function Lab(){
  const [editingPayload, setEditingPayload] = useState("")
  const [payload, setPayload] = useState(editingPayload)
  const [csp,setCsp]=useState("script-src 'unsafe-inline'; style-src 'unsafe-inline'; default-src 'self';")
  const [activeTab, setActiveTab] = useState<'manual' | 'builder'>('manual')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [injectionMethod, setInjectionMethod] = useState<'innerHTML' | 'attribute' | 'eventHandler'>('innerHTML')
  const [fullscreen, setFullscreen] = useState(false)
  
  const handleLog = (log: LogEntry) => setLogs(l => [log, ...l].slice(0, 100))
  const handleClearLogs = () => setLogs([])
  
  // Escape key closes fullscreen
  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [fullscreen]);
  
  return(
    <motion.div
      className="min-h-screen p-6 space-y-6 max-w-7xl mx-auto transition-colors duration-500"
      initial={{opacity:0}}
      animate={{opacity:1}}
    >
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold dark:text-white">Sandglass Lab</h1>
        <p className="text-gray-600 dark:text-gray-300">Web Security Testing Environment</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Controls */}
        <div className="space-y-3 overflow-y-auto max-h-[90vh] pr-1">
          {/* Payload Library */}
          <PayloadLibrary onSelect={p => { setEditingPayload(p); setPayload(p); }} />

          {/* CSP Configuration */}
          <Card className="p-2">
            <CardHeader className="py-2 px-2">
              <CardTitle className="flex items-center justify-between text-base">
                Content Security Policy
                <div className="flex gap-2">
                  <Button 
                    variant={activeTab === 'manual' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveTab('manual')}
                  >
                    Manual
                  </Button>
                  <Button 
                    variant={activeTab === 'builder' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setActiveTab('builder')}
                  >
                    Builder
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="py-2 px-2">
              {activeTab === 'manual' ? (
                <div className="space-y-2">
                  <Label>CSP String</Label>
                  <Input 
                    value={csp} 
                    onChange={e=>setCsp(e.target.value)}
                    placeholder="script-src 'unsafe-inline'; default-src 'self';"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" size="sm" onClick={()=>setCsp("script-src 'none'; default-src 'self';")}>
                      Restrictive
                    </Button>
                    <Button variant="outline" size="sm" onClick={()=>setCsp("script-src 'unsafe-inline'; default-src 'self';")}>
                      Permissive
                    </Button>
                  </div>
                </div>
              ) : (
                <CSPBuilder onCSPChange={setCsp} />
              )}
            </CardContent>
          </Card>

          {/* Payload Input */}
          <Card className="p-2">
            <CardHeader className="py-2 px-2">
              <CardTitle className="text-base">Payload (HTML / JavaScript)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 py-2 px-2">
              <div className="flex items-center gap-2 mb-2">
                <Label>Injection Method:</Label>
                <select
                  className="border rounded px-2 py-1 text-sm bg-white dark:bg-neutral-800 dark:text-white"
                  value={injectionMethod}
                  onChange={e => setInjectionMethod(e.target.value as any)}
                >
                  <option value="innerHTML">innerHTML (default)</option>
                  <option value="attribute">Attribute (e.g. onerror)</option>
                  <option value="eventHandler">Event Handler (e.g. onclick)</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Custom Payload</Label>
                <Textarea 
                  rows={4} 
                  value={editingPayload} 
                  onChange={e=>setEditingPayload(e.target.value)}
                  placeholder="Enter your HTML/JavaScript payload here..."
                />
              </div>
              <div className="flex flex-wrap gap-2">
                <Button variant="default" size="sm" onClick={()=>setPayload(editingPayload)}>
                  Run Payload
                </Button>
                <Button variant="outline" size="sm" onClick={()=>{setEditingPayload("<script>alert('XSS Test')</script>");setPayload("<script>alert('XSS Test')</script>")}}>
                  XSS Alert
                </Button>
                <Button variant="outline" size="sm" onClick={()=>{setEditingPayload("<h1>Hello World</h1><div style='color:red'>Red text</div>");setPayload("<h1>Hello World</h1><div style='color:red'>Red text</div>")}}>
                  HTML + CSS
                </Button>
                <Button variant="outline" size="sm" onClick={()=>{setEditingPayload("<img src='http://evil.com/image.jpg' onerror='alert(\"XSS\")'>");setPayload("<img src='http://evil.com/image.jpg' onerror='alert(\"XSS\")'>")}}>
                  Image XSS
                </Button>
                <Button variant="outline" size="sm" onClick={()=>{setEditingPayload("<a href='javascript:alert(\"XSS\")'>Click me</a>");setPayload("<a href='javascript:alert(\"XSS\")'>Click me</a>")}}>
                  JavaScript URL
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Session Manager */}
          <SessionManager
            payload={editingPayload}
            csp={csp}
            onLoadSession={s => {
              setEditingPayload(s.payload);
              setPayload(s.payload);
              setCsp(s.csp);
            }}
          />
        </div>

        {/* Right Column - Sandbox */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Sandbox Result</CardTitle>
              <Button size="sm" variant="outline" onClick={() => setFullscreen(true)}>
                Fullscreen
              </Button>
            </CardHeader>
            <CardContent>
             <SandboxFrame payload={payload} csp={csp} onLog={handleLog} injectionMethod={injectionMethod} />
            </CardContent>
          </Card>

          <LogViewer logs={logs} onClear={handleClearLogs} />

          {/* Current Configuration Display */}
          <Card className="bg-white dark:bg-neutral-800 dark:border-neutral-700">
            <CardHeader className="bg-white dark:bg-neutral-800">
              <CardTitle className="dark:text-white">Current Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 bg-white dark:bg-neutral-800">
              <div>
                <Label className="text-sm font-medium dark:text-gray-200">CSP:</Label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-neutral-700 rounded text-sm font-mono break-all text-black dark:text-white">
                  {csp || 'None'}
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium dark:text-gray-200">Payload:</Label>
                <div className="mt-1 p-2 bg-gray-50 dark:bg-neutral-700 rounded text-sm font-mono break-all max-h-32 overflow-y-auto text-black dark:text-white">
                  {payload}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fullscreen Sandbox Modal */}
      {fullscreen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="absolute top-4 right-4">
            <Button size="sm" variant="destructive" onClick={() => setFullscreen(false)}>
              Close [Esc]
            </Button>
          </div>
          <div className="w-full h-full flex items-center justify-center">
            <div
              className="relative flex items-center justify-center border border-neutral-300 dark:border-neutral-700 shadow-2xl bg-white dark:bg-neutral-900 rounded-2xl transition-all duration-300 ease-in-out scale-95 opacity-0 animate-[modalIn_0.3s_ease-in-out_forwards]"
              style={{
                width: 'min(90vw, 160vh)',
                height: 'min(90vh, calc((90vw) * 9 / 16), 56vw)',
                aspectRatio: '16/9',
                maxWidth: '1200px',
                maxHeight: '90vh',
                padding: '0.5rem',
              }}
            >
              <SandboxFrame
                payload={payload}
                csp={csp}
                injectionMethod={injectionMethod}
                onLog={handleLog}
                fullscreen={true}
              />
            </div>
          </div>
          <style>{`
            @keyframes modalIn {
              from { opacity: 0; transform: scale(0.95); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      )}
    </motion.div>
  )
}
