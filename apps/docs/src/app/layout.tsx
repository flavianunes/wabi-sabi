import '@wabi-sabi/ui/styles.css'
import './globals.css'

import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: {
    default: 'wabi-sabi',
    template: '%s — wabi-sabi',
  },
  description:
    'React components built on Base UI and Motion, where the transition between states is part of the API.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    // data-theme is set explicitly for now. A theme toggle is a component, and it is not
    // built yet — without the attribute the tokens still follow prefers-color-scheme.
    <html lang="en" data-theme="light">
      <body>{children}</body>
    </html>
  )
}
