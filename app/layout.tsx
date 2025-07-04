'use client'
import './globals.css'

import { ReactNode, useEffect, useState } from 'react'

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 2V4M10 16V18M4 10H2M18 10H16M5.64 5.64L4.22 4.22M15.78 15.78L14.36 14.36M5.64 14.36L4.22 15.78M15.78 4.22L14.36 5.64" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15.5 13.5C14.5 14.5 13 15 11.5 15C8.46 15 6 12.54 6 9.5C6 8 6.5 6.5 7.5 5.5C7.5 5.5 7 8 10 10C13 12 15.5 11.5 15.5 11.5C15.5 12.04 15.5 12.98 15.5 13.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('sg-theme')
    if (stored === 'dark') setTheme('dark')
  }, [])

  useEffect(() => {
    if (mounted) localStorage.setItem('sg-theme', theme)
  }, [theme, mounted])

  if (!mounted) {
    return <html lang="en"><body /></html>
  }

  return (
    <html lang="en" className={`${theme === 'dark' ? 'dark' : ''} min-h-screen w-full`}>
      <body className="min-h-screen w-full bg-white text-black transition-colors duration-500 dark:bg-neutral-900 dark:text-white">
        <div className="fixed top-4 right-4 z-50">
          <button
            className="rounded-full border px-3 py-1 bg-white/80 dark:bg-black/60 text-black dark:text-white shadow hover:bg-white dark:hover:bg-black transition flex items-center justify-center"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <MoonIcon /> : <SunIcon />}
          </button>
        </div>
        {children}
      </body>
    </html>
  )
}
