# Sandglass

Sandglass is a modern, browser-based web exploit simulation tool for visualizing and analyzing CSP bypasses, XSS payloads, and injection vectors inside a secure sandbox environment.

---

## Objective

Sandglass is a self-contained testing lab where you can:
- Inject custom HTML/JS payloads
- Apply and experiment with different CSP policies
- Simulate injection vectors (DOM XSS, inline, attribute-based)
- Visualize what gets executed, what is blocked, and why
- Log and display CSP violations and network behavior
- Explore known CSP bypasses and run them in real-time
- Save, load, export, and import test cases
- Toggle between light and dark themes
- Use a fullscreen sandbox for focused testing

---

## Features

- Payload Playground: Input custom payloads, use real-world payload presets, and inject them into the sandbox.
- CSP Builder: Visual and manual CSP editing with toggles for common directives.
- Injection Vector Simulator: Choose how the payload is injected (innerHTML, attribute, event handler).
- Live Sandbox: Real-time preview with CSP enforcement and isolated execution.
- CSP Violation & Network Log Viewer: See what is blocked and why, in real time.
- Session Exporter: Save, load, export, and import test cases (payload + CSP).
- Theme Toggle: Minimal, global, and accessible light/dark mode.
- Fullscreen Sandbox: Modal overlay for focused, immersive testing.
- Responsive, accessible, and theme-aware UI.

---

## Usage

1. Start the app (see Setup below).
2. Enter a payload in the Payload Playground, or select one from the Payload Library.
3. Set a CSP using the manual input or the visual CSP Builder.
4. Choose an injection vector (innerHTML, attribute, event handler) to simulate different attack surfaces.
5. Click "Run Payload" to execute your test in the sandbox.
6. View results in the live sandbox, check the CSP & Network Log for violations, and see what was blocked.
7. Save or load sessions to keep or share your test cases.
8. Toggle the theme using the sun/moon button in the top-right.
9. Fullscreen the sandbox for demos or deep analysis.

---

## Example Payloads

- `<script>alert(document.domain)</script>`
- `<img src=x onerror=alert(document.domain)>`
- `<svg><script>alert(document.domain)</script></svg>`
- `<a href=javascript:alert(document.domain)>Click me</a>`
- `<input autofocus onfocus=alert(document.domain)>`
- `<script src='data:text/javascript;base64,YWxlcnQoZG9jdW1lbnQuZG9tYWluKQ=='></script>`

---

## Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
2. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
3. Open [http://localhost:3000/lab](http://localhost:3000/lab) in your browser.

---

## Project Structure

```
sandglass/
├── app/
│   ├── layout.tsx
│   ├── globals.css
│   └── lab/page.tsx
├── components/
│   ├── SandboxFrame.tsx
│   ├── CSPBuilder.tsx
│   ├── PayloadLibrary.tsx
│   ├── LogViewer.tsx
│   ├── SessionManager.tsx
│   └── ui/ (shadcn)
├── public/
│   └── data/payloads.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
└── package.json
```

---

## Credits & License

- Built with [Next.js](https://nextjs.org/), [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/), and [Framer Motion](https://www.framer.com/motion/).
- Payload library includes real-world XSS/CSP vectors from public security research.
- MIT License. Use responsibly and ethically.

---

## Contributing

Pull requests and suggestions are welcome. If you have ideas for new features, payloads, or improvements, open an issue or PR.

---

## Disclaimer

This tool is for educational and research purposes only. Do not use it for unauthorized testing or exploitation.

---

## Author

Sandglass was created by **Jagadeesh Duggirala (MrCrafter)**.
