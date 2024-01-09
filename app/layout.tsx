import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/ui/navbar'
import AuthProvider from '@/components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.js");
  pdfjs.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.0.550/pdf.worker.js";
  return (
    <html lang="en">
      <AuthProvider>
        <body className={inter.className + ' max-h-dvh'}>
            <Navbar/>
            <div className="flex flex-col justify-between px-5">
              {children}
            </div>
        </body>
      </AuthProvider>
    </html>
  )
}
