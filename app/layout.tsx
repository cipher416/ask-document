import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/navbar'
import AuthProvider from '@/components/providers/AuthProvider'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ask-document',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className + ' max-h-dvh'}>
            <Navbar/>
            <div className="flex flex-col justify-between px-5">
              <Toaster />
              {children}
            </div>
        </body>
      </AuthProvider>
    </html>
  )
}
