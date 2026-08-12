import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Space_Grotesk, DM_Sans } from 'next/font/google'
import './globals.css'

const display = Space_Grotesk({ subsets: ['latin'], variable: '--font-display' })
const body = DM_Sans({ subsets: ['latin'], variable: '--font-body' })

export const metadata: Metadata = { title: 'Debt, handled. | Personal Debt Tracker', description: 'A clear, calm plan for every loan you owe.', generator: 'v0.app' }
export const viewport: Viewport = { colorScheme: 'light', themeColor: '#f0eee7', userScalable: false }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="bg-background"><body className={`${display.variable} ${body.variable}`}>{children}{process.env.NODE_ENV === 'production' && <Analytics />}</body></html>
}
