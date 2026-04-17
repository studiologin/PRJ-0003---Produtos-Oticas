'use client';

import { useCheckoutStore, useCartStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { CheckCircle2, Copy, AlertCircle, ShoppingBag, Truck, ExternalLink, Clock } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Image from 'next/image';

export default function CheckoutConfirmacao() {
  const router = useRouter();
  const { data: checkoutData, orderConfirmation } = useCheckoutStore();
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  if (!orderConfirmation) {
    return (
      <div className="w-full max-w-4xl mx-auto py-20 text-center animate-in fade-in">
        <h2 className="text-2xl font-bold text-[#1A3A5C]">Nenhum pedido recente encontrado.</h2>
        <Link href="/" className="btn-primary btn-lg mt-6 inline-flex px-8">Voltar para a Loja</Link>
      </div>
    );
  }

  const { orderId, total, paymentMethod, status, pixQrCode, pixCopyPaste, ticketUrl } = orderConfirmation;

  const handleCopy = () => {
    if (pixCopyPaste) {
      navigator.clipboard.writeText(pixCopyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getStatusDisplay = () => {
    switch(status) {
      case 'approved': return { text: 'Pagamento Aprovado', color: 'text-[#2D7D62]', bg: 'bg-emerald-100', icon: CheckCircle2 };
      case 'pending': return { text: 'Aguardando Pagamento', color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]', icon: Clock };
      default: return { text: 'Em Processamento', color: 'text-[#1A3A5C]', bg: 'bg-[#1A3A5C]/10', icon: AlertCircle };
    }
  };

  const statusDisplay = getStatusDisplay();
  const StatusIcon = statusDisplay.icon;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-500">
       <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6 md:p-12 text-center">
         <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 shrink-0">
           <CheckCircle2 className="w-10 h-10 text-[#2D7D62]" />
         </div>
         
         <h1 className="text-3xl font-display font-bold text-[#1A3A5C] mb-2">Pedido Realizado com Sucesso!</h1>
         <p className="text-[#1A3A5C]/60 text-lg mb-8">Enviamos os detalhes da sua compra para o e-mail cadastrado.</p>

         <div className="inline-flex items-center gap-2 bg-[#F8F9FB] border border-[#e2e8f0] px-6 py-3 rounded-xl mb-12">
            <span className="text-[#1A3A5C]/60 text-sm">Número do Pedido:</span>
            <span className="font-mono font-bold text-[#1A3A5C] text-lg tracking-wider">{orderId}</span>
         </div>

         {/* Pendente PIX */}
         {status === 'pending' && pixQrCode && (
           <div className="max-w-xl mx-auto bg-emerald-50 p-8 rounded-2xl border border-emerald-100 text-left relative overflow-hidden mb-12">
             <div className="absolute top-0 right-0 bg-[#2D7D62] text-white text-[10px] font-bold uppercase py-1 px-3 rounded-bl-xl">Ação Necessária</div>
             <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
               <div className="w-48 h-48 bg-white p-4 rounded-xl shadow-sm border border-[#e2e8f0] shrink-0 flex items-center justify-center relative">
                 <Image src={`data:image/png;base64,${pixQrCode}`} alt="QR Code PIX" fill className="object-cover p-2" />
               </div>
               <div className="flex-1">
                 <h3 className="font-bold text-[#2D7D62] text-lg mb-2">Pague via PIX para garantir seu pedido</h3>
                 <p className="text-sm text-[#2D7D62]/80 mb-6">Abra o app do seu banco, escolha &quot;PIX Copia e Cola&quot; ou escaneie o QR Code.</p>
                 <div className="flex items-center gap-2">
                   <input 
                     type="text" 
                     value={pixCopyPaste!} 
                     readOnly 
                     className="input bg-white w-full font-mono text-sm border-emerald-100 text-[#2D7D62]"
                   />
                   <button onClick={handleCopy} className="btn-primary btn-md shrink-0 focus:ring-2 focus:ring-[#2D7D62] focus:ring-offset-2">
                     {copied ? <CheckCircle2 className="w-5 h-5"/> : <Copy className="w-5 h-5" />}
                   </button>
                 </div>
                 <p className="text-[#2D7D62]/60 text-xs mt-3 flex items-center gap-1 font-medium"><AlertCircle className="w-3.5 h-3.5"/> O QR Code expira em 30 minutos.</p>
               </div>
             </div>
           </div>
         )}

         {/* Boleto Pendente */}
         {status === 'pending' && ticketUrl && (
           <div className="max-w-md mx-auto bg-[#F8F9FB] p-8 rounded-2xl border border-[#e2e8f0] text-center relative overflow-hidden mb-12">
             <div className="absolute top-0 right-0 bg-[#C8A951] text-white text-[10px] font-bold uppercase py-1 px-3 rounded-bl-xl">Ação Necessária</div>
             <h3 className="font-bold text-[#1A3A5C] text-lg mb-4">
               Boleto Bancário Gerado
             </h3>
             <p className="text-sm text-[#1A3A5C]/70 mb-6">Seu boleto já está disponível. Você pode pagar pelo aplicativo do seu banco ou imprimir.</p>
             <a href={ticketUrl} target="_blank" rel="noopener noreferrer" className="btn-primary btn-xl w-full flex items-center justify-center gap-2 inline-flex border border-[#1A3A5C]">
               Visualizar Boleto
               <span className="w-4 h-4 ml-1">↗</span>
             </a>
           </div>
         )}
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto text-left">
          <div className="bg-white border border-[#e2e8f0] p-6 md:p-8 rounded-[24px]">
             <div className="flex items-center gap-2 text-[#1A3A5C] font-bold mb-4">
               <Truck className="w-5 h-5 text-[#C8A951]" />
               Dados de Entrega
             </div>
             <p className="text-[#1A3A5C] text-sm"><span className="font-bold">{checkoutData.fullName || 'João da Silva'}</span></p>
             <p className="text-[#1A3A5C]/60 text-sm mt-1">
               {checkoutData.street || 'Endereço'}, {checkoutData.number || '100'} {checkoutData.complement && `- ${checkoutData.complement}`}<br/>
               {checkoutData.neighborhood || 'Bairro'}<br/>
               {checkoutData.city || 'Cidade'} - {checkoutData.state || 'UF'}<br/>
               CEP: {checkoutData.cep || '00000-000'}
             </p>
          </div>

          <div className="bg-white border border-[#e2e8f0] p-6 md:p-8 rounded-[24px]">
             <div className="flex items-center gap-2 text-[#1A3A5C] font-bold mb-4">
               <ShoppingBag className="w-5 h-5 text-[#C8A951]" />
               Resumo
             </div>
             <div className="space-y-4">
               <div className="flex justify-between text-sm py-2 border-b border-[#e2e8f0]">
                 <span className="text-[#1A3A5C]/60">Pagamento</span>
                 <span className="font-bold text-[#1A3A5C] uppercase">{paymentMethod || 'Cartão/Pix/Boleto'}</span>
               </div>
               <div className="flex justify-between text-sm py-2 border-b border-[#e2e8f0]">
                 <span className="text-[#1A3A5C]/60">Frete</span>
                 <span className="font-bold text-[#1A3A5C]">R$ {checkoutData.shippingCost?.toFixed(2).replace('.', ',')}</span>
               </div>
               <div className="pt-2 flex justify-between font-bold text-[#1A3A5C] items-center">
                  <span>Total</span>
                  <span className="text-2xl text-[#2D7D62]">R$ {total.toFixed(2).replace('.',',')}</span>
               </div>
             </div>
          </div>
       </div>

       <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-8">
          <Link href="/" className="btn-outline btn-xl w-full sm:w-auto min-w-[200px]">
             Voltar para a Loja
          </Link>
          <Link href="/conta/pedidos" className="btn-primary btn-xl w-full sm:w-auto min-w-[200px]">
             Acompanhar Pedido
          </Link>
       </div>
    </div>
  );
}
