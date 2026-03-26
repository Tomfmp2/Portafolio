import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
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
  title: 'Tomas Felipe Medina Prada | Desarrollador Backend',
  description: 'Portafolio profesional de Tomas Felipe Medina Prada - Desarrollador Backend especializado en .NET, C#, SQL, Node.js, Docker y automatización de procesos.',
  keywords: ['Desarrollador Backend', '.NET', 'C#', 'SQL', 'Node.js', 'Docker', 'n8n', 'API', 'Colombia'],
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
        {children}
        <Analytics />
      </body>
    </html>
  )
}
