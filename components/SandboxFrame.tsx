'use client'

import { useEffect, useRef } from 'react'
import type { LogEntry } from './LogViewer'

type Props={payload:string;csp?:string;onLog?: (log: LogEntry) => void, injectionMethod?: 'innerHTML' | 'attribute' | 'eventHandler', fullscreen?: boolean}

export default function SandboxFrame({payload,csp,onLog,injectionMethod = 'innerHTML', fullscreen = false}:Props){
  const ref=useRef<HTMLIFrameElement>(null)
  
  useEffect(()=>{
    if(!ref.current)return
    const loggerScript = `
      window.addEventListener('securitypolicyviolation', function(e) {
        parent.postMessage({
          type: 'csp-violation',
          blockedURI: e.blockedURI,
          violatedDirective: e.violatedDirective,
          effectiveDirective: e.effectiveDirective,
          originalPolicy: e.originalPolicy,
          disposition: e.disposition,
          sourceFile: e.sourceFile,
          lineNumber: e.lineNumber,
          columnNumber: e.columnNumber,
          message: e.message
        }, '*');
      });
    `;
    let bodyContent = payload;
    if (injectionMethod === 'attribute') {
      bodyContent = `<img src=x onerror=\"${payload.replace(/"/g, '&quot;')}\">`;
    } else if (injectionMethod === 'eventHandler') {
      bodyContent = `<button onclick=\"${payload.replace(/"/g, '&quot;')}\">Click me</button>`;
    }
    const meta=csp?`<meta http-equiv="Content-Security-Policy" content="${csp}">`:''
    const html=`
      <html>
        <head>${meta}<style>body{font-family:sans-serif;padding:1rem;}</style></head>
        <body>
          <script>${loggerScript}<\/script>
          ${bodyContent}
        </body>
      </html>
    `
    try {
      ref.current.srcdoc = html
    } catch (error) {
      console.error('Error setting iframe content:', error)
    }
  },[payload,csp,injectionMethod])
  
  // Listen for CSP violation messages
  useEffect(() => {
    if (!onLog) return;
    const handler = (event: MessageEvent) => {
      if (event.data && event.data.type === 'csp-violation') {
        onLog(event.data);
      }
    };
    window.addEventListener('message', handler);
    return () => window.removeEventListener('message', handler);
  }, [onLog]);
  
  // Determine sandbox permissions based on CSP
  const getSandboxPermissions = () => {
    if (!csp) return 'allow-scripts allow-modals'
    
    // If CSP allows scripts, enable them in sandbox
    if (csp.includes("'unsafe-inline'") || csp.includes("'unsafe-eval'")) {
      return 'allow-scripts allow-modals'
    }
    
    // If CSP blocks scripts, disable them in sandbox
    if (csp.includes("'none'")) {
      return ''
    }
    
    // Default: allow scripts for testing
    return 'allow-scripts allow-modals'
  }
  
  return(
    <iframe
      key={payload + '||' + csp + '||' + injectionMethod}
      ref={ref}
      className={fullscreen
        ? "w-full h-full border rounded-2xl shadow-lg bg-white"
        : "w-full h-96 border rounded-2xl shadow-lg bg-white"
      }
      sandbox={getSandboxPermissions()}
      title="sandbox-frame"
    />
  )
}
