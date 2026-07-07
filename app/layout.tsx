import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });

export const metadata: Metadata = {
  metadataBase: new URL('https://produtosoticas.com.br'), // Substitua pelo domínio final oficial
  title: {
    default: 'Produtos Óticas | Insumos Ópticos B2B',
    template: '%s | Produtos Óticas'
  },
  description: 'Tudo o que sua ótica precisa, em um só lugar. Distribuição e venda de insumos ópticos B2B com entrega para todo o Brasil.',
  keywords: ['ótica', 'insumos ópticos', 'atacado de ótica', 'lentes', 'armações', 'B2B', 'distribuidor ótico', 'acessórios para ótica'],
  authors: [{ name: 'Produtos Óticas' }],
  creator: 'Produtos Óticas',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: '/',
    title: 'Produtos Óticas | Insumos Ópticos B2B',
    description: 'Portfólio completo de lentes, armações e equipamentos com entrega rápida para todo o Brasil. O parceiro ideal para o seu negócio B2B.',
    siteName: 'Produtos Óticas',
    images: [
      {
        url: 'https://jandmwnmaojswfwlrsva.supabase.co/storage/v1/object/public/Imagens%20do%20Site/capasobrehome.png',
        width: 1200,
        height: 630,
        alt: 'Produtos Óticas',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Produtos Óticas | Insumos Ópticos B2B',
    description: 'Tudo o que sua ótica precisa, em um só lugar.',
    images: ['https://jandmwnmaojswfwlrsva.supabase.co/storage/v1/object/public/Imagens%20do%20Site/capasobrehome.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Produtos Óticas",
  "url": "https://produtosoticas.com.br",
  "logo": "https://jandmwnmaojswfwlrsva.supabase.co/storage/v1/object/public/Imagens%20do%20Site/logopng.com.br.png",
  "description": "Distribuição e venda de insumos ópticos B2B.",
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+55-11-98847-0858",
    "contactType": "customer service"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable}`}>
      <body className="bg-[#ffffff] text-[#1A3A5C] antialiased font-sans" suppressHydrationWarning>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
