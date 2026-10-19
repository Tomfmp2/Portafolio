import type { Metadata } from 'next'
import { Archivo, JetBrains_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { LanguageProvider } from '@/hooks/use-language'
import SmoothScrollProvider from '@/components/providers/smooth-scroll-provider'
import './globals.css'

// Archivo's width axis lets one family carry both the extended display type and the body copy.
const archivo = Archivo({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-archivo',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://portafolio-alpha-nine-96.vercel.app'),
  title: 'Tomás Felipe Medina Prada | Desarrollador .NET junior',
  description: 'Portafolio de Tomás Felipe Medina Prada, desarrollador .NET junior en Bucaramanga: APIs en C# y ASP.NET Core con pruebas, Docker y CI.',
  keywords: ['Desarrollador .NET', 'Backend', 'C#', 'ASP.NET Core', 'Entity Framework Core', 'SQL', 'Docker', 'Colombia'],
  authors: [{ name: 'Tomas Felipe Medina Prada' }],
  creator: 'Tomas Felipe Medina Prada',
  openGraph: {
    type: 'website',
    locale: 'es_CO',
    url: 'https://portafolio-alpha-nine-96.vercel.app',
    title: 'Tomás Felipe Medina Prada | Desarrollador .NET junior',
    description: 'Portafolio de Tomás Felipe Medina Prada, desarrollador .NET junior en Bucaramanga: APIs en C# y ASP.NET Core con pruebas, Docker y CI.',
    siteName: 'Tomas Felipe Medina Prada Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tomás Felipe Medina Prada | Desarrollador .NET junior',
    description: 'Portafolio de Tomás Felipe Medina Prada, desarrollador .NET junior en Bucaramanga: APIs en C# y ASP.NET Core con pruebas, Docker y CI.',
  },
  icons: {
    icon: '/c-sharp-16-svgrepo-com.svg',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`dark ${archivo.variable} ${jetbrains.variable}`}>
      <body>
        <LanguageProvider>
          <SmoothScrollProvider>
            {children}
          </SmoothScrollProvider>
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  )
}
