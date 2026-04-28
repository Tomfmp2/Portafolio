import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/hooks/use-language'
import './globals.css'

const geistSans = Geist({ 
  subsets: ["latin"],
  variable: '--font-geist-sans'
});

const geistMono = Geist_Mono({ 
  subsets: ["latin"],
  variable: '--font-geist-mono'
});

export const metadata: Metadata = {
  title: 'Tomas Felipe Medina Prada | Backend Developer',
  description: 'Professional portfolio of Tomas Felipe Medina Prada - Backend Developer specialized in .NET, C#, SQL, Docker, and process automation.',
  keywords: ['Backend Developer', '.NET', 'C#', 'SQL', 'Docker', 'n8n', 'API', 'Colombia'],
  authors: [{ name: 'Tomas Felipe Medina Prada' }],
  creator: 'Tomas Felipe Medina Prada',
  icons: {
    icon: '/availability-svgrepo-com.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <LanguageProvider>
          {children}
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
