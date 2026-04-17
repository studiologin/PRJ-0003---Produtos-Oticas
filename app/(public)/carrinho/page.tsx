'use client';

import { useCartStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import { products } from '@/lib/products';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag, Truck, CreditCard, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export default function CartPage() {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    subtotal, 
    discount, 
    totalItems 
  } = useCartStore(useShallow((state) => ({
    items: state.items,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    subtotal: state.getTotalPrice(),
    discount: state.getDiscount(),
    totalItems: state.getTotalItems(),
  })));
  
  const [mounted, setMounted] = useState(false);
  const [shippingZip, setShippingZip] = useState('');

  // Avoid hydration mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const shippingCost = subtotal > 500 ? 0 : subtotal > 0 ? 45 : 0;
  const total = subtotal - discount + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 bg-warm-bg">
        <motion.div 
          {...fadeInUp}
          className="bg-white p-12 rounded-[40px] shadow-xl text-center max-w-lg w-full border border-[#e2e8f0]"
        >
          <div className="w-24 h-24 bg-[#F5F4F0] rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBag className="w-12 h-12 text-[#1A3A5C]/20" />
          </div>
          <h1 className="text-3xl font-bold text-[#1A3A5C] mb-4 font-display">Seu carrinho está vazio</h1>
          <p className="text-[#1A3A5C]/60 mb-10 leading-relaxed">
            Parece que você ainda não adicionou nenhum produto. Explore nosso catálogo e encontre o que sua ótica precisa.
          </p>
          <Link 
            href="/produtos" 
            className="inline-flex items-center justify-center bg-[#1A3A5C] text-white px-10 py-5 rounded-2xl font-bold hover:bg-[#1A3A5C]/90 transition-all hover:scale-105 active:scale-95 shadow-lg group"
          >
            Explorar Catálogo
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-bg pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-[#1A3A5C] font-display mb-2">Meu Carrinho</h1>
          <p className="text-[#1A3A5C]/60 font-medium">
            Você tem <span className="text-[#C8A951] font-bold">{totalItems}</span> {totalItems === 1 ? 'item' : 'itens'} selecionados
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Item List */}
          <div className="lg:col-span-8 space-y-6">
            {/* B2B Promo Banner */}
            <div className="bg-[#1A3A5C] text-white p-6 rounded-[32px] overflow-hidden relative group">
              <div className="relative z-10">
                <h3 className="text-xl font-bold mb-2">Descontos Progressivos B2B</h3>
                <p className="text-white/70 text-sm max-w-md">
                  Aumente seu pedido e aproveite condições especiais para sua ótica. 
                  <span className="text-[#C8A951] font-bold"> 10+ itens (5%)</span>, 
                  <span className="text-[#C8A951] font-bold"> 20+ itens (10%)</span> ou 
                  <span className="text-[#C8A951] font-bold"> 50+ itens (15%)</span>.
                </p>
              </div>
              <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-[#C8A951]/20 to-transparent pointer-events-none" />
              <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-[#C8A951]/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {items.map((item, idx) => (
              <motion.div 
                key={item.product.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-[32px] p-6 shadow-sm border border-[#e2e8f0] flex flex-col md:flex-row items-center gap-8 relative hover:shadow-md transition-shadow"
              >
                <div className="w-full md:w-32 h-32 bg-[#F5F4F0] rounded-2xl relative overflow-hidden flex-shrink-0">
                  <Image 
                    src={item.product.image} 
                    alt={item.product.name} 
                    fill 
                    className="object-contain p-4 mix-blend-multiply"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="flex-grow text-center md:text-left">
                  <span className="text-[#C8A951] text-[10px] font-bold uppercase tracking-widest mb-1 block">
                    {item.product.category}
                  </span>
                  <Link href={`/produto/${item.product.slug}`} className="hover:underline">
                    <h3 className="text-[#1A3A5C] text-xl font-bold mb-1">{item.product.name}</h3>
                  </Link>
                  <p className="text-[#1A3A5C]/40 text-sm mb-4">Ref: {item.product.ref}</p>
                  
                  <div className="flex items-center justify-center md:justify-start gap-4">
                    <div className="flex items-center bg-[#F5F4F0] rounded-xl p-1 border border-[#e2e8f0]">
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-[#1A3A5C]"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-10 text-center font-bold text-[#1A3A5C]">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-2 hover:bg-white rounded-lg transition-colors text-[#1A3A5C]"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-center md:text-right min-w-[120px]">
                  <p className="text-[#1A3A5C]/40 text-xs mb-1 uppercase font-bold tracking-widest">Preço Total</p>
                  <p className="text-[#1A3A5C] text-2xl font-black">
                    R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                  </p>
                </div>

                <button 
                  onClick={() => removeItem(item.product.id)}
                  className="absolute top-4 right-4 p-3 text-[#C0392B]/50 hover:text-[#C0392B] hover:bg-[#FDEDEB] rounded-full transition-all md:top-auto md:right-8"
                  title="Remover Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </motion.div>
            ))}

            <div className="pt-8">
              <Link 
                href="/produtos" 
                className="text-[#1A3A5C] font-bold flex items-center gap-2 hover:opacity-70 transition-opacity"
              >
                <ShoppingBag className="w-5 h-5" />
                Continuar Comprando
              </Link>
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <div className="bg-white rounded-[40px] p-8 shadow-xl border border-[#e2e8f0]">
              <h2 className="text-2xl font-bold text-[#1A3A5C] mb-8 font-display">Resumo do Pedido</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-[#1A3A5C]/70">
                  <span>Subtotal</span>
                  <span className="font-bold text-[#1A3A5C]">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-[#2D7D62]">
                    <div className="flex items-center gap-2">
                      <span>Desconto B2B</span>
                      <span className="bg-[#E6F5F0] text-[#2D7D62] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                        {totalItems >= 50 ? '15%' : totalItems >= 20 ? '10%' : '5%'} OFF
                      </span>
                    </div>
                    <span className="font-bold">- R$ {discount.toFixed(2).replace('.', ',')}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#1A3A5C]/70">
                  <div className="flex items-center gap-2">
                    <span>Frete</span>
                    {shippingCost === 0 && subtotal > 0 && (
                      <span className="bg-[#E6F5F0] text-[#2D7D62] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Grátis</span>
                    )}
                  </div>
                  <span className="font-bold text-[#1A3A5C]">
                    {shippingCost === 0 ? 'R$ 0,00' : `R$ ${shippingCost.toFixed(2).replace('.', ',')}`}
                  </span>
                </div>
                {subtotal < 500 && (
                  <p className="text-[10px] text-[#2D7D62] font-bold bg-[#E6F5F0] p-2 rounded-lg mt-2">
                    Faltam R$ {(500 - subtotal).toFixed(2).replace('.', ',')} para ganhar **FRETE GRÁTIS**
                  </p>
                )}
              </div>

              <div className="border-t border-[#e2e8f0] pt-6 mb-8 text-[#C8A951]">
                <div className="flex items-center gap-2 mb-4">
                  <Truck className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Cálculo de Frete</span>
                </div>
                <div className="flex gap-0 group/shipping">
                  <input 
                    type="text" 
                    placeholder="00000-000"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    className="flex-grow bg-[#F5F4F0] border border-[#e2e8f0] rounded-l-full px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#C8A951] text-[#1A3A5C] border-r-0"
                  />
                  <button className="bg-[#1A3A5C] text-white px-6 py-3 rounded-r-full font-bold text-xs hover:bg-[#C8A951] transition-colors -ml-px whitespace-nowrap">
                    CALCULAR
                  </button>
                </div>
              </div>

              <div className="border-t border-[#e2e8f0] pt-8 mb-10">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-[#1A3A5C] font-bold uppercase text-xs tracking-widest">Total do Pedido</span>
                  <span className="text-4xl font-black text-[#1A3A5C]">R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-[#1A3A5C]/60 text-xs text-right italic font-medium">
                  Ou em até 10x de R$ {(total / 10).toFixed(2).replace('.', ',')} sem juros
                </p>
              </div>

              <Link 
                href="/checkout/dados" 
                className="w-full bg-[#1A3A5C] text-white py-5 rounded-2xl font-bold text-lg hover:bg-[#1A3A5C]/90 transition-all hover:scale-[1.02] active:scale-95 shadow-lg flex items-center justify-center gap-2 mb-6"
              >
                Finalizar Compra
                <ArrowRight className="w-5 h-5" />
              </Link>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-[#2D7D62]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Compra 100% Segura</span>
                </div>
                <div className="flex items-center gap-2 text-[#1A3A5C]/40">
                  <CreditCard className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Pague com Cartão, PIX ou Boleto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-sell Section */}
      <section className="mt-24 border-t border-[#e2e8f0] pt-24 bg-white/50">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="text-3xl font-bold text-[#1A3A5C] font-display mb-12">Adicione ao seu pedido</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products
              .filter((p) => !items.find(item => item.product.id === p.id))
              .slice(0, 4)
              .map((product, i) => (
                <Link 
                  key={product.id}
                  href={`/produto/${product.slug}`}
                  className="bg-white rounded-[32px] p-6 shadow-sm border border-[#e2e8f0] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="aspect-square relative mb-6 rounded-2xl bg-[#F5F4F0] overflow-hidden">
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      fill 
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-500" 
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <span className="text-[#C8A951] text-[9px] font-bold uppercase tracking-widest mb-1 block">{product.category}</span>
                  <h3 className="text-[#1A3A5C] font-bold mb-4 line-clamp-1">{product.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-[#1A3A5C] font-black">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    <div className="w-8 h-8 rounded-full bg-[#1A3A5C] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Plus className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))
            }
          </div>
        </div>
      </section>
    </div>
  );
}
