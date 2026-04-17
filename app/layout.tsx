import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Produtos Óticas | Insumos Ópticos B2B/B2C',
  description: 'Tudo o que sua ótica precisa, em um só lugar. Distribuição e venda de insumos ópticos.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="bg-[#ffffff] text-[#1A3A5C] antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
