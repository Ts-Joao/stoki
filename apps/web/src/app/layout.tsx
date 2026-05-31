import type { Metadata } from 'next'
import { Roboto } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const roboto = Roboto({ subsets: ["latin"], weight: ["400", "500", "700", "900"], variable: "--font-roboto" });

export const metadata: Metadata = {
  title: 'Stoki',
  description: 'Sistema de controle de estoque para empresas',
  icons: {
    icon: [
      {
        url: '/favicon-dark.ico',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/favicon-white.ico',
        media: '(prefers-color-scheme: dark)',
      },
    ]
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className="bg-background">
      <body className={`${roboto.className} antialiased bg-background`}>
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
