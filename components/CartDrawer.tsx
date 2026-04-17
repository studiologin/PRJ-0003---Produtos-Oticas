'use client';

import { motion, AnimatePresence } from 'motion/react';
import { useCartStore } from '@/lib/store';
import { useShallow } from 'zustand/react/shallow';
import Image from 'next/image';
import Link from 'next/link';
import { X, ShoppingBag, Trash2, Minus, Plus, ArrowRight, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { 
    items, 
    removeItem, 
    updateQuantity, 
    totalPrice, 
    totalItems 
  } = useCartStore(useShallow((state) => ({
    items: state.items,
    removeItem: state.removeItem,
    updateQuantity: state.updateQuantity,
    totalPrice: state.getTotalPrice(),
    totalItems: state.getTotalItems(),
  })));
  
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const freeShippingTreshold = 500;
  const progressToFreeShipping = Math.min((totalPrice / freeShippingTreshold) * 100, 100);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-4 top-4 bottom-4 w-full max-w-[420px] bg-white z-[1001] shadow-2xl flex flex-col rounded-[32px] overflow-hidden border border-[#e2e8f0]"
          >
            {/* Header */}
            <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-warm-white">
              <div className="flex items-center gap-3">
                <div className="bg-[#1A3A5C] p-2 rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-[#1A3A5C] font-bold text-lg">Meu Carrinho</h2>
                  <p className="text-[#1A3A5C]/50 text-xs font-bold uppercase tracking-widest">
                    {totalItems} {totalItems === 1 ? 'item' : 'itens'}
                  </p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-[#F5F4F0] rounded-full transition-colors text-[#1A3A5C]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6 py-4 bg-[#F5F4F0]/50 border-b border-[#e2e8f0]">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-bold text-[#1A3A5C] uppercase tracking-[0.1em]">
                  {totalPrice >= freeShippingTreshold 
                    ? '🎉 Frete Grátis Garantido!' 
                    : `Faltam R$ ${(freeShippingTreshold - totalPrice).toFixed(2).replace('.', ',')} para Frete Grátis`}
                </span>
                <span className="text-[10px] font-bold text-[#C8A951]">{Math.round(progressToFreeShipping)}%</span>
              </div>
              <div className="h-1.5 w-full bg-[#e2e8f0] rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progressToFreeShipping}%` }}
                  className={`h-full transition-all duration-500 rounded-full ${
                    totalPrice >= freeShippingTreshold ? 'bg-[#2D7D62]' : 'bg-[#C8A951]'
                  }`}
                />
              </div>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-[#F5F4F0] rounded-full flex items-center justify-center mb-4">
                    <ShoppingBag className="w-10 h-10 text-[#1A3A5C]/20" />
                  </div>
                  <h3 className="text-[#1A3A5C] font-bold text-xl mb-2">Vazio</h3>
                  <p className="text-[#1A3A5C]/50 text-sm max-w-[200px] mb-8">
                    Seu carrinho ainda não possui produtos.
                  </p>
                  <button 
                    onClick={onClose}
                    className="text-[#1A3A5C] font-bold text-sm uppercase tracking-widest hover:opacity-70"
                  >
                    Voltar às compras
                  </button>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.product.id} className="flex gap-4 group">
                    <div className="w-20 h-20 bg-[#F5F4F0] rounded-xl relative flex-shrink-0 overflow-hidden border border-[#e2e8f0]">
                      <Image 
                        src={item.product.image} 
                        alt={item.product.name} 
                        fill 
                        className="object-contain p-2 mix-blend-multiply" 
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <Link 
                          href={`/produto/${item.product.slug}`} 
                          onClick={onClose}
                          className="text-[#1A3A5C] font-bold text-sm truncate hover:text-[#C8A951] transition-colors pr-2"
                        >
                          {item.product.name}
                        </Link>
                        <button 
                          onClick={() => removeItem(item.product.id)}
                          className="text-[#C0392B]/40 hover:text-[#C0392B] transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-[#1A3A5C]/40 text-[10px] uppercase font-bold tracking-widest mb-3">Ref: {item.product.ref}</p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-[#F5F4F0] rounded-lg p-0.5 border border-[#e2e8f0]">
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <Minus className="w-3 h-3 text-[#1A3A5C]" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-[#1A3A5C]">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="p-1 hover:bg-white rounded transition-colors"
                          >
                            <Plus className="w-3 h-3 text-[#1A3A5C]" />
                          </button>
                        </div>
                        <span className="text-[#1A3A5C] font-black text-sm">
                          R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary */}
            {items.length > 0 && (
              <div className="p-6 bg-warm-white border-t border-[#e2e8f0] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)]">
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#1A3A5C]/60 text-sm">
                    <span>Subtotal</span>
                    <span className="font-bold">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between text-[#1A3A5C]/60 text-sm">
                    <div className="flex items-center gap-1">
                      <Truck className="w-3 h-3" />
                      <span>Frete</span>
                    </div>
                    <span className={totalPrice >= freeShippingTreshold ? 'text-[#2D7D62] font-bold' : 'font-bold'}>
                      {totalPrice >= freeShippingTreshold ? 'Grátis' : 'Calculado no checkout'}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-[#e2e8f0] flex justify-between items-end">
                    <span className="text-[#1A3A5C] font-bold text-sm uppercase tracking-widest">Total Estimado</span>
                    <span className="text-[#1A3A5C] font-black text-2xl tracking-tighter">
                      R$ {totalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link 
                    href="/carrinho"
                    onClick={onClose}
                    className="bg-[#F5F4F0] text-[#1A3A5C] py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest text-center hover:bg-[#e2e8f0] transition-all border border-[#e2e8f0]"
                  >
                    Ver Carrinho
                  </Link>
                  <Link 
                    href="/checkout/dados"
                    onClick={onClose}
                    className="bg-[#1A3A5C] text-white py-4 rounded-xl font-bold text-[11px] uppercase tracking-widest text-center hover:bg-[#1A3A5C]/90 transition-all flex items-center justify-center gap-2 group shadow-lg"
                  >
                    Finalizar
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
