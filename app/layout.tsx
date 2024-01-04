import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/navbar'
import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className + ' min-h-dvh'}>
            <Navbar/>
            <div className="flex flex-col justify-between px-5 min-h-[90vh]">
              {children}
            </div>
        </body>
      </AuthProvider>
    </html>
  )
}
