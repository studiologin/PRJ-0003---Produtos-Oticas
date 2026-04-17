'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search, ShoppingCart, Check } from 'lucide-react';
import { motion } from 'motion/react';
import { products, type Product } from '@/lib/products';
import { useState } from 'react';
import { useCartStore } from '@/lib/store';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as any }
};

export default function ProdutosPage() {
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const addItem = useCartStore((state) => state.addItem);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    
    addItem(product);
    
    if (!addedItems.includes(product.id)) {
      setAddedItems(prev => [...prev, product.id]);
      
      // Remove the "added" state after a while
      setTimeout(() => {
        setAddedItems(prev => prev.filter(id => id !== product.id));
      }, 2000);
    }
  };

  const PageButton = ({ page }: { page: number | string }) => {
    const isActive = page === currentPage;
    const isDots = typeof page === 'string';

    return (
      <button 
        disabled={isDots}
        onClick={() => !isDots && setCurrentPage(Number(page))}
        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold transition-all ${
          isActive 
            ? 'bg-[#1A3A5C] text-white shadow-lg' 
            : 'bg-[#F5F4F0] text-[#1A3A5C] hover:bg-[#e2e8f0] disabled:cursor-default'
        }`}
      >
        {page}
      </button>
    );
  };

  // Simple pagination logic to show current, first, last and dots
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-warm-bg">
      {/* Banner Section - Sem texto, apenas imagem, ocupando a altura da tela */}
      <section className="relative h-screen w-full overflow-hidden rounded-b-[40px] md:rounded-b-[80px] shadow-xl z-50">
        {/* Desktop Banner */}
        <Image 
          src="https://dcdn-us.mitiendanube.com/stores/006/909/950/products/freepik__-promptname-aprimoramento-ptico-premium-preservao-__92197-882d361adfa5e7f14117655565073913-1024-1024.webp" 
          alt="Produtos Óticas Banner Desktop" 
          fill 
          className="hidden md:block object-cover object-center"
          priority
          referrerPolicy="no-referrer"
        />
        {/* Mobile Banner */}
        <Image 
          src="https://wwikdikgmrsfusdyixfg.supabase.co/storage/v1/object/public/avatars/freepik__-promptname-campanha-ptica-composio-de-kits-luxo-h__27488.png" 
          alt="Produtos Óticas Banner Mobile" 
          fill 
          className="block md:hidden object-cover object-center"
          priority
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-black/5"></div>
      </section>

      {/* Catalog Section */}
      <motion.section 
        {...fadeInUp}
        className="py-12 md:py-20 px-4 md:px-12 bg-warm-white -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-30 rounded-b-[40px] md:rounded-b-[80px] shadow-xl"
      >
        <div className="container mx-auto">
          {/* Unified Filter Bar */}
          <div className="mb-16">
            <div className="bg-[#F5F4F0] border border-[#e2e8f0] rounded-xl p-3 flex flex-col lg:flex-row items-center gap-3 shadow-inner">
              <div className="flex-1 w-full relative flex items-center">
                <Search className="w-4 h-4 text-[#1A3A5C]/70 absolute left-4" />
                <input 
                  type="text" 
                  placeholder="Buscar por nome, categoria ou referência..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-warm-white border border-[#e2e8f0] rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all text-[#1A3A5C] placeholder:text-[#1A3A5C]/50" 
                />
              </div>
              <div className="flex-1 w-full relative flex items-center">
                <Search className="w-4 h-4 text-[#1A3A5C]/70 absolute left-4" />
                <input type="text" placeholder="SKU ou Referência..." className="w-full bg-warm-white border border-[#e2e8f0] rounded-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all text-[#1A3A5C] placeholder:text-[#1A3A5C]/50" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 w-full lg:w-auto">
                <select className="bg-warm-white border border-[#e2e8f0] rounded-full px-3 py-3 text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors text-[#1A3A5C] cursor-pointer">
                  <option value="">Categoria</option>
                  <option value="lentes">Lentes</option>
                  <option value="armacoes">Armações</option>
                  <option value="equipamentos">Equipamentos</option>
                </select>
                <select className="bg-warm-white border border-[#e2e8f0] rounded-full px-3 py-3 text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors text-[#1A3A5C] cursor-pointer">
                  <option value="">Marca</option>
                  <option value="acuvue">Acuvue</option>
                  <option value="alcon">Alcon</option>
                  <option value="zeiss">Zeiss</option>
                </select>
                <select className="bg-warm-white border border-[#e2e8f0] rounded-full px-3 py-3 text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors text-[#1A3A5C] cursor-pointer">
                  <option value="">Tipo</option>
                  <option value="diario">Diário</option>
                  <option value="mensal">Mensal</option>
                  <option value="anual">Anual</option>
                </select>
                <select className="bg-warm-white border border-[#e2e8f0] rounded-full px-3 py-3 text-sm focus:outline-none focus:border-[#1A3A5C] transition-colors text-[#1A3A5C] cursor-pointer">
                  <option value="">Preço</option>
                  <option value="0-50">Até R$ 50</option>
                  <option value="50-100">R$ 50 - 100</option>
                  <option value="100+">R$ 100+</option>
                </select>
              </div>
              <button className="w-full lg:w-auto bg-[#1A3A5C] text-white px-10 py-3 rounded-full font-bold text-sm hover:bg-[#1A3A5C]/90 transition-all active:scale-95 shadow-md">
                Filtrar
              </button>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-[#1A3A5C] text-3xl font-bold tracking-tight mb-2">
              Todos os Produtos
            </h2>
            <p className="text-[#1A3A5C]/60 text-sm">
              Exibindo <span className="font-bold text-[#1A3A5C]">{currentProducts.length}</span> de <span className="font-bold text-[#1A3A5C]">{products.length}</span> produtos
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentProducts.map((product, i) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 4) * 0.1 }}
              >
                <Link 
                  href={`/produto/${product.slug}`}
                  className="block rounded-2xl group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-white p-4 border border-[#e2e8f0] h-full"
                >
                  <div className="w-full h-[200px] bg-[#F5F4F0] rounded-xl mb-4 relative overflow-hidden">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-contain mix-blend-multiply group-hover:scale-110 transition-transform duration-500 p-6"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col h-[calc(100%-216px)]">
                    <span className="text-[#C8A951] text-[10px] font-bold uppercase tracking-widest mb-1">{product.category}</span>
                    <h3 className="text-[#C8A951] text-base font-bold mb-1 truncate leading-tight">{product.name}</h3>
                    <p className="text-[#1A3A5C]/40 text-xs mb-3">Ref: {product.ref}</p>
                    <div className="flex items-center justify-between mt-auto pt-2">
                      <div className="text-[#1A3A5C] font-black text-xl">R$ {product.price.toFixed(2).replace('.', ',')}</div>
                      <button 
                        onClick={(e) => handleAddToCart(e, product)}
                        className={`p-2.5 rounded-full transition-all duration-300 shadow-sm ${
                          addedItems.includes(product.id)
                            ? 'bg-[#2D7D62] text-white scale-110'
                            : 'bg-[#C8A951] text-white hover:bg-[#1A3A5C] hover:scale-110'
                        }`}
                        title="Adicionar ao Carrinho"
                      >
                        {addedItems.includes(product.id) ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <ShoppingCart className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Pagination Section */}
          <div className="mt-20 flex justify-center gap-2">
            {getPageNumbers().map((page, idx) => (
              <PageButton key={idx} page={page} />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}
