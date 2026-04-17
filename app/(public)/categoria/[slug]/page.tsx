'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight, Filter, SlidersHorizontal, ChevronDown, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { products as allProducts } from '@/lib/products';
import { useFavoritesStore } from '@/lib/store';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as any }
};

const categoryMap: { [key: string]: string } = {
  'lentes': 'Lentes de Contato',
  'infantil': 'Linha Infantil',
  'acessorios': 'Acessórios',
  'armacoes': 'Armações'
};

export default function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const categoryName = categoryMap[slug] || 'Produtos';
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  
  const filteredProducts = allProducts.filter(p => 
    slug === 'produtos' ? true : p.category === categoryName
  );

  return (
    <div className="bg-[#F8F9FB] min-h-screen">
      {/* Hero Header */}
      <section className="bg-[#1A3A5C] py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556761175-b413da4baf72?q=80&w=2000&auto=format&fit=crop')] opacity-10 bg-cover bg-center"></div>
        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div {...fadeInUp}>
            <nav className="flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-white/40 mb-8">
              <Link href="/" className="hover:text-[#C8A951]">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">Categorias</span>
            </nav>
            <h1 className="text-white text-5xl md:text-7xl font-bold tracking-tight mb-6">{categoryName}</h1>
            <p className="text-white/60 text-lg max-w-2xl mx-auto">
              Descubra nossa seleção curada de {categoryName.toLowerCase()}, unindo tecnologia óptica e design contemporâneo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-[#DDE1E9] py-4">
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="text-[10px] font-black uppercase tracking-widest text-[#1A3A5C]/40">
            Exibindo {filteredProducts.length} resultados
          </div>
          <div className="flex items-center gap-6">
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A3A5C] hover:text-[#C8A951] transition-colors">
              <SlidersHorizontal className="w-4 h-4" />
              <span>Filtrar</span>
            </button>
            <button className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A3A5C] hover:text-[#C8A951] transition-colors">
              <span>Ordenar por</span>
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <section className="container mx-auto px-6 py-16">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.05 }}
              >
                <div className="bg-white rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-500 group border border-white flex flex-col h-full relative">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleFavorite(product);
                    }}
                    className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/80 backdrop-blur-md shadow-sm border border-[#e2e8f0] rounded-full flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 hover:scale-110"
                    title={isFavorite(product.id) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-[#C0392B] text-[#C0392B]' : 'text-[#1A3A5C] hover:text-[#C0392B]'}`} />
                  </button>

                  <Link 
                    href={`/produto/${product.slug}`}
                    className="flex flex-col h-full"
                  >
                    <div className="aspect-square relative mb-6 group-hover:scale-105 transition-transform duration-500">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-4"
                        referrerPolicy="no-referrer"
                      />
                      {product.new && (
                        <div className="absolute top-0 left-0">
                          <span className="bg-[#1A3A5C] text-white px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest">Novo</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <span className="text-[#C8A951] font-bold text-[9px] uppercase tracking-widest mb-1 block">{product.category}</span>
                      <h3 className="text-[#1A3A5C] font-bold text-lg mb-2 line-clamp-1 group-hover:text-[#C8A951] transition-colors">{product.name}</h3>
                      <p className="text-[#1A3A5C]/50 text-xs mb-4 line-clamp-2 leading-relaxed h-8">
                        {product.shortDescription}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#F8F9FB]">
                      <span className="text-[#1A3A5C] font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                      <div className="w-8 h-8 rounded-full bg-[#1A3A5C]/5 flex items-center justify-center group-hover:bg-[#C8A951] group-hover:text-white transition-all text-[#1A3A5C]">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-32">
            <h3 className="text-[#1A3A5C] text-2xl font-bold mb-4">Em breve</h3>
            <p className="text-[#1A3A5C]/40 max-w-sm mx-auto">
              Nossa equipe está curando os melhores produtos para esta categoria. Volte em breve!
            </p>
            <Link href="/" className="inline-block mt-8 text-[#C8A951] font-bold uppercase tracking-widest text-[10px] hover:underline">Voltar para Home</Link>
          </div>
        )}
      </section>
    </div>
  );
}
