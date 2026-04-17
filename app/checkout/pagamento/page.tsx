'use client';

import { useCheckoutStore, useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { CreditCard, Loader2, Lock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { initMercadoPago, Payment } from '@mercadopago/sdk-react';

export default function CheckoutPagamento() {
  const router = useRouter();
  const { data: checkoutData, setOrderConfirmation } = useCheckoutStore();
  const { getTotalPrice, getDiscount, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mpInitialized, setMpInitialized] = useState(false);

  const total = getTotalPrice() - getDiscount() + (checkoutData.shippingCost || 0);

  useEffect(() => {
    // Initialize Mercado Pago with the public key
    const publicKey = process.env.NEXT_PUBLIC_MP_PUBLIC_KEY || 'TEST-9861623356029367-081014-99889abc0bd4464c23f272a81878d6b9-1447043810';
    initMercadoPago(publicKey, { locale: 'pt-BR' });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMpInitialized(true);
  }, []);

  const initialization = {
    amount: total,
    payer: {
      email: checkoutData.email || '',
    },
  };

  const customization = {
    paymentMethods: {
      ticket: "all",
      creditCard: "all",
      debitCard: "all",
      mercadoPago: "all",
    },
  };

  const onSubmit = async ({ selectedPaymentMethod, formData }: any) => {
    setIsProcessing(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          description: 'Pedido na Produtos Óticas',
        }),
      });

      const data = await response.json();

      if (response.ok && (data.status === 'approved' || data.status === 'pending' || data.status === 'in_process')) {
        // Sucesso
        setOrderConfirmation({
          orderId: data.id ? data.id.toString() : `#PO-${Math.floor(Math.random() * 900000)}`,
          paymentMethod: selectedPaymentMethod,
          total: total,
          status: data.status === 'approved' ? 'approved' : 'pending',
          pixQrCode: data.point_of_interaction?.transaction_data?.qr_code_base64 || null,
          pixCopyPaste: data.point_of_interaction?.transaction_data?.qr_code || null,
          ticketUrl: data.transaction_details?.external_resource_url || null,
        });
        clearCart();
        router.push('/checkout/confirmacao');
      } else {
        alert(data.error || 'Erro ao processar o pagamento. Tente novamente.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error(error);
      alert('Erro de comunicação. Tente novamente.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6 md:p-10 relative">
       {isProcessing && (
         <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 rounded-[24px] flex flex-col items-center justify-center">
           <Loader2 className="w-12 h-12 text-[#1A3A5C] animate-spin mb-4" />
           <p className="text-[#1A3A5C] font-bold text-lg">Processando pagamento...</p>
           <p className="text-[#1A3A5C]/60 text-sm mt-2 flex items-center gap-1"><Lock className="w-4 h-4"/> Ambiente seguro Mercado Pago</p>
         </div>
       )}

       <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#1A3A5C]/5 text-[#1A3A5C] rounded-xl flex items-center justify-center shrink-0">
             <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A5C]">Pagamento</h1>
            <p className="text-[#1A3A5C]/60 text-sm">Etapa 3 de 3</p>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="flex gap-2 mb-10">
         <div className="h-2 flex-1 bg-[#1A3A5C] rounded-full" />
         <div className="h-2 flex-1 bg-[#1A3A5C] rounded-full" />
         <div className="h-2 flex-1 bg-[#1A3A5C] rounded-full" />
       </div>

       <div className="space-y-8 min-h-[400px]">
          {mpInitialized && (
            <Payment
              initialization={initialization}
              customization={customization as any}
              onSubmit={onSubmit}
            />
          )}
       </div>

       <div className="pt-6 border-t border-[#e2e8f0] flex items-center justify-between mt-8">
          <Link href="/checkout/entrega" className="text-[#1A3A5C]/60 hover:text-[#1A3A5C] font-bold text-sm">
            Voltar
          </Link>
       </div>
    </div>
  );
}
