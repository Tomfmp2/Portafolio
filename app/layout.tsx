import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque, JetBrains_Mono, Reenie_Beanie } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/hooks/use-language'
import SmoothScrollProvider from '@/components/providers/smooth-scroll-provider'
import { introScript } from '@/lib/intro'
import './globals.css'

// One variable family carries the whole page: its width and optical-size axes
// give the squeezed display name and comfortable body text from the same font.
const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  axes: ['opsz', 'wdth'],
  variable: '--font-bricolage',
})

// Handwriting, only for the margin notes next to highlighted facts.
const hand = Reenie_Beanie({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-hand',
  // Margin notes appear further down the page: keep them out of the critical download.
  preload: false,
})

// Monospace, only inside code and the terminal.
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-code',
  // Only used inside the demo terminal.
  preload: false,
})

const description =
  'Portafolio de Tomás Felipe Medina Prada, desarrollador .NET junior en Bucaramanga: APIs en C# y ASP.NET Core con pruebas, Docker y CI.'

export const metadata: Metadata = {
  metadataBase: new URL('https://portafolio-alpha-nine-96.vercel.app'),
  title: 'Tomás Medina | Desarrollador .NET junior',
  description,
  keywords: ['Desarrollador .NET', 'Backend', 'C#', 'ASP.NET Core', 'Entity Framework Core', 'SQL', 'Docker', 'Colombia'],
  authors: [{ name: 'Tomás Felipe Medina Prada' }],
  creator: 'Tomás Felipe Medina Prada',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://portafolio-alpha-nine-96.vercel.app',
    title: 'Tomás Medina | Desarrollador .NET junior',
    description,
    siteName: 'Tomás Medina',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tomás Medina | Desarrollador .NET junior',
    description,
  },
}

export const viewport: Viewport = {
  themeColor: '#F2EFE6',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${bricolage.variable} ${hand.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <LanguageProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
