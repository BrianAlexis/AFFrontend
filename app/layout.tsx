import { Inter, Playfair_Display } from 'next/font/google';
import type { Metadata } from 'next';
import "./globals.css";
import ToasterWithSound from '@/src/components/ToasterWithSound';
import Chatbot from '@/src/components/Chatbot';
import StructuredData from '@/src/components/StructuredData';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-secondary',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-primary',
});

const siteUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Andrea Franceschini La Falda - Pastelería Artesanal de Alta Calidad',
    template: '%s | Andrea Franceschini La Falda',
  },
  description: 'Pastelería artesanal de alta calidad en La Falda, Córdoba. Cada creación hecha con amor y dedicación. Productos frescos y deliciosos para tus momentos especiales.',
  keywords: ['pastelería', 'pastelería artesanal', 'tortas', 'postres', 'La Falda', 'Córdoba', 'pastelería La Falda', 'tortas personalizadas', 'dulces artesanales'],
  authors: [{ name: 'Andrea Franceschini' }],
  creator: 'Andrea Franceschini',
  publisher: 'Andrea Franceschini',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: siteUrl,
    siteName: 'Andrea Franceschini La Falda',
    title: 'Andrea Franceschini La Falda - Pastelería Artesanal de Alta Calidad',
    description: 'Pastelería artesanal de alta calidad en La Falda, Córdoba. Cada creación hecha con amor y dedicación.',
    images: [
      {
        url: `${siteUrl}/logo.png`,
        width: 1200,
        height: 630,
        alt: 'Andrea Franceschini La Falda - Pastelería Artesanal',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Andrea Franceschini La Falda - Pastelería Artesanal',
    description: 'Pastelería artesanal de alta calidad en La Falda, Córdoba.',
    images: [`${siteUrl}/logo.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
  },
  alternates: {
    canonical: siteUrl,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="google-site-verification" content="JWzvay20sELH_CTP_uPt5lT2OO9zIamTDM7P1McB8N4" />
        <StructuredData type="organization" />
      </head>
      <body suppressHydrationWarning>
        {children}
        <ToasterWithSound />
        <Chatbot />
      </body>
    </html >
  );
}