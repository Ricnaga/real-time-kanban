import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { UrqlProvider } from '../lib/UrqlProvider'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Real-time Kanban',
  description: 'Kanban em tempo real com Next.js, GraphQL e WebSocket',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <UrqlProvider>{children}</UrqlProvider>
      </body>
    </html>
  )
}
