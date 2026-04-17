'use client';

import { useFavoritesStore, useCartStore } from '@/lib/store';
import Image from 'next/image';
import Link from 'next/link';
import { HeartCrack, ShoppingCart, ChevronRight, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useEffect } from 'react';

export default function FavoritosPage() {
  const { items, toggleFavorite } = useFavoritesStore();
  const addItem = useCartStore(state => state.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="p-8 md:p-12 animate-in fade-in slide-in-from-bottom-8 duration-500">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-[#1A3A5C] mb-2 font-display">Meus Favoritos</h1>
        <p className="text-[#1A3A5C]/60 text-lg">Acompanhe e compre os itens que você mais gostou.</p>
      </div>

      <div className="bg-white rounded-[32px] border border-[#e2e8f0] p-8 lg:p-12 shadow-sm min-h-[400px]">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center h-full pt-12 pb-8">
            <div className="w-24 h-24 bg-[#F5F4F0] rounded-full flex items-center justify-center mb-6">
              <Heart className="w-10 h-10 text-[#1A3A5C]/20" />
            </div>
            <h2 className="text-[#1A3A5C] font-bold text-2xl mb-4 font-display">Nenhum favorito ainda</h2>
            <p className="text-[#1A3A5C]/60 max-w-md mb-8 leading-relaxed">
              Você ainda não salvou nenhum produto como favorito. Explore nosso catálogo e encontre tudo o que precisa para sua ótica.
            </p>
            <Link href="/" className="btn-primary btn-xl px-12 block w-fit">
              Explorar Produtos
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {items.map((product, idx) => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition-all duration-500 group border border-[#e2e8f0] flex flex-col h-full relative"
                >
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-4 right-4 z-10 w-10 h-10 bg-white shadow-sm border border-[#e2e8f0] rounded-full flex items-center justify-center text-[#C0392B] hover:bg-[#FDEDEB] hover:scale-110 transition-all group/btn"
                    title="Remover dos favoritos"
                  >
                    <HeartCrack className="w-5 h-5 opacity-0 group-hover/btn:opacity-100 absolute" />
                    <Heart className="w-5 h-5 fill-current opacity-100 group-hover/btn:opacity-0" />
                  </button>

                  <Link 
                    href={`/produto/${product.slug}`}
                    className="flex-1 flex flex-col"
                  >
                    <div className="aspect-square relative mb-6 group-hover:scale-105 transition-transform duration-500 rounded-2xl overflow-hidden bg-[#F8F9FB]">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-4 mix-blend-multiply"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[#C8A951] font-bold text-[9px] uppercase tracking-widest mb-1 block">{product.category}</span>
                      <h3 className="text-[#1A3A5C] font-bold text-[15px] mb-2 line-clamp-2 leading-tight group-hover:text-[#C8A951] transition-colors">{product.name}</h3>
                    </div>
                  </Link>

                  <div className="mt-auto pt-4 flex flex-col gap-3">
                    <span className="text-[#1A3A5C] font-black text-lg">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    <button 
                      onClick={() => addItem(product)}
                      className="w-full bg-[#F5F4F0] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-colors py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
