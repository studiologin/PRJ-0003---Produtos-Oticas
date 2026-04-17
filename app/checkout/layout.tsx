'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lock } from 'lucide-react';
import CheckoutSummary from '@/components/CheckoutSummary';
import { usePathname } from 'next/navigation';

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConfirmation = pathname.includes('/confirmacao') || pathname.includes('/payment');

  return (
    <div className="min-h-screen bg-[#F8F9FB] flex flex-col font-sans">
      <header className="bg-white border-b border-[#e2e8f0] h-20 px-6 md:px-12 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Link href="/" className="flex items-center gap-2 group">
           <div className="text-xl font-display font-medium text-[#1A3A5C] tracking-wide">
             Produtos <span className="text-[#C8A951]">Óticas</span>
           </div>
        </Link>
        <div className="flex items-center gap-2 text-[#2D7D62] text-xs font-bold uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-100">
           <Lock className="w-3.5 h-3.5" />
           <span className="hidden sm:inline">Checkout Seguro</span>
        </div>
      </header>

      <div className={`flex-1 w-full mx-auto px-4 md:px-8 py-8 md:py-12 flex flex-col lg:flex-row gap-8 lg:gap-12 items-start ${isConfirmation ? 'max-w-4xl' : 'max-w-[1400px]'}`}>
         <main className={`w-full ${isConfirmation ? 'lg:w-full' : 'lg:w-7/12'} flex-shrink-0 animate-in fade-in slide-in-from-bottom-8 duration-500`}>
            {children}
         </main>
         
         {!isConfirmation && (
           <aside className="w-full lg:w-5/12 lg:sticky lg:top-28 z-10">
              <CheckoutSummary />
           </aside>
         )}
      </div>
    </div>
  );
}
