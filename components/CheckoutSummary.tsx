'use client';

import { useCartStore, useCheckoutStore } from '@/lib/store';
import Image from 'next/image';
import { Truck, ShieldCheck, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function CheckoutSummary() {
  const { items, getTotalPrice, getDiscount } = useCartStore();
  const { data: checkoutData } = useCheckoutStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const subtotal = getTotalPrice();
  const discount = getDiscount();
  const shippingCost = checkoutData.shippingCost || 0;
  const total = subtotal - discount + shippingCost;

  return (
    <div className="bg-white rounded-[24px] border border-[#e2e8f0] overflow-hidden sticky top-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="p-6 md:p-8 bg-warm-white border-b border-[#e2e8f0]">
        <h2 className="text-[#1A3A5C] text-lg font-bold mb-6">Resumo do Pedido</h2>
        
        <div className="space-y-4 max-h-[320px] overflow-y-auto custom-scrollbar pr-2 mb-6">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-4 group">
              <div className="w-16 h-16 bg-[#F5F4F0] rounded-xl relative flex-shrink-0 overflow-hidden border border-[#e2e8f0]">
                <Image 
                  src={item.product.image} 
                  alt={item.product.name} 
                  fill 
                  className="object-contain p-2 mix-blend-multiply" 
                />
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-[#1A3A5C] rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                  {item.quantity}
                </div>
              </div>
              <div className="flex-grow min-w-0 flex flex-col justify-center">
                <p className="text-[#1A3A5C] font-bold text-sm truncate">{item.product.name}</p>
                <p className="text-[#1A3A5C]/40 text-[10px] uppercase font-bold tracking-widest mt-0.5">Ref: {item.product.ref}</p>
              </div>
              <div className="text-right flex flex-col justify-center shrink-0">
                <span className="text-[#1A3A5C] font-black text-sm">
                  R$ {(item.product.price * item.quantity).toFixed(2).replace('.', ',')}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-6">
           <div className="relative flex-1">
             <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A3A5C]/40" />
             <input type="text" placeholder="Cupom de desconto" className="input w-full pl-10 bg-white" />
           </div>
           <button className="btn-primary btn-md shrink-0">Aplicar</button>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-[#1A3A5C]/60 text-sm">
            <span>Subtotal</span>
            <span className="font-bold">R$ {subtotal.toFixed(2).replace('.', ',')}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-[#C0392B] text-sm">
              <span>Desconto</span>
              <span className="font-bold">- R$ {discount.toFixed(2).replace('.', ',')}</span>
            </div>
          )}
          <div className="flex justify-between text-[#1A3A5C]/60 text-sm">
            <div className="flex items-center gap-1">
              <Truck className="w-3 h-3" />
              <span>Frete</span>
            </div>
            <span className="font-bold">
              {shippingCost > 0 ? `R$ ${shippingCost.toFixed(2).replace('.', ',')}` : 'Calculado a seguir'}
            </span>
          </div>
          
          <div className="pt-4 mt-2 border-t border-[#e2e8f0] flex justify-between items-end">
            <div>
              <span className="text-[#1A3A5C] font-bold text-sm uppercase tracking-widest block mb-1">Total Estimado</span>
              <span className="text-[#1A3A5C]/60 text-[10px] uppercase tracking-widest block">Em até 12x no cartão</span>
            </div>
            <span className="text-[#1A3A5C] font-black text-3xl tracking-tighter">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-6 flex items-center justify-center gap-2 text-[#2D7D62] text-[11px] font-bold uppercase tracking-widest">
         <ShieldCheck className="w-4 h-4" />
         Compra Segura e Protegida
      </div>
    </div>
  );
}
