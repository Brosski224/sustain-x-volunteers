import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'SustainX Volenteer',
  description: 'A volenteer platform for SustainX', 
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
