'use client';

import { 
  Settings, 
  Store, 
  CreditCard, 
  Truck, 
  Lock, 
  Bell, 
  Globe, 
  Save, 
  ShieldCheck, 
  Smartphone 
} from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

export default function AdminConfiguracoesPage() {
  const [activeTab, setActiveTab] = useState('loja');

  const tabs = [
    { id: 'loja', label: 'Dados da Loja', icon: Store },
    { id: 'pagamento', label: 'Pagamento', icon: CreditCard },
    { id: 'frete', label: 'Frete e Entrega', icon: Truck },
    { id: 'seguranca', label: 'Segurança & API', icon: ShieldCheck },
    { id: 'notificacoes', label: 'Notificações', icon: Bell },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Configurações do Sistema</h1>
          <p className="text-[#1A3A5C]/60 text-sm">Gerencie preferências da loja, integrações e segurança.</p>
        </div>
        <button className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium">
          <Save className="w-4 h-4" />
          <span>Salvar Alterações</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-72 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-2 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {tabs.map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex-1 lg:flex-none flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                   activeTab === tab.id 
                     ? 'bg-[#1A3A5C] text-white shadow-md' 
                     : 'text-[#4A5568] hover:bg-[#F8F9FB]'
                 }`}
               >
                 <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'text-white' : 'text-[#9AA3B0]'}`} />
                 {tab.label}
               </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 md:p-8">
           
           {activeTab === 'loja' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Dados da Loja</h2>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2 text-[#9AA3B0]">Nome Fantasia</label>
                   <input type="text" defaultValue="Produtos Óticas" className="input w-full" />
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2 text-[#9AA3B0]">Razão Social</label>
                     <input type="text" defaultValue="Produtos Óticas Distribuidora Ltda" className="input w-full" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2 text-[#9AA3B0]">CNPJ</label>
                     <input type="text" defaultValue="12.345.678/0001-90" className="input w-full" />
                   </div>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2 text-[#9AA3B0]">E-mail de Contato</label>
                     <input type="email" defaultValue="contato@produtosoticas.com.br" className="input w-full" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2 text-[#9AA3B0]">Telefone / WhatsApp</label>
                     <input type="text" defaultValue="(11) 98765-4321" className="input w-full" />
                   </div>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2 text-[#9AA3B0]">Endereço Físico</label>
                   <textarea defaultValue="Av. Paulista, 1000 - Bela Vista, São Paulo - SP, 01310-100" className="input w-full min-h-[80px] py-3 resize-none"></textarea>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'pagamento' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Gateway de Pagamento</h2>
               
               <div className="bg-[#F8F9FB] rounded-2xl p-6 border border-[#e2e8f0] border-l-4 border-l-[#C8A951]">
                 <div className="flex items-center gap-4 mb-4">
                    <div className="h-6 w-32 relative">
                      <Image 
                        src="https://logopng.com.br/logos/mercado-pago-85.png" 
                        alt="Mercado Pago" 
                        fill
                        className="object-contain object-left"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <span className="text-sm font-bold text-[#1A3A5C]">Mercado Pago (Ativo)</span>
                    <span className="ml-auto px-2 py-0.5 rounded bg-emerald-100 text-[#2D7D62] text-[10px] font-bold uppercase">Conectado</span>
                 </div>
                 <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-[#9AA3B0] uppercase mb-1">Public Key</label>
                      <input type="password" value="APP_USR-76f8e2..." readOnly className="input w-full bg-white/50 cursor-not-allowed text-xs" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#9AA3B0] uppercase mb-1">Access Token</label>
                      <input type="password" value="APP_USR-293847298374..." readOnly className="input w-full bg-white/50 cursor-not-allowed text-xs" />
                    </div>
                 </div>
               </div>

               <div className="space-y-4">
                 <h4 className="font-bold text-[#1A3A5C] text-sm">Métodos Ativos</h4>
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                   {[
                     { label: 'Cartão de Crédito', active: true },
                     { label: 'Pix (com 5% de desconto)', active: true },
                     { label: 'Boleto Bancário', active: true },
                     { label: 'Parcelamento sem Juros (até 6x)', active: true },
                   ].map((item, idx) => (
                     <label key={idx} className="flex items-center justify-between p-4 rounded-xl border border-[#e2e8f0] bg-white hover:bg-[#F8F9FB] cursor-pointer transition-colors">
                       <span className="text-sm font-medium text-[#4A5568]">{item.label}</span>
                       <div className="relative inline-flex items-center cursor-pointer">
                         <input type="checkbox" defaultChecked={item.active} className="sr-only peer" />
                         <div className="w-11 h-6 bg-[#DDE1E9] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#2D7D62]"></div>
                       </div>
                     </label>
                   ))}
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'seguranca' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Segurança e Integrações</h2>
               
               <div className="space-y-6">
                 <div className="flex items-start gap-4 p-4 bg-blue-50 border border-blue-100 rounded-xl">
                   <ShieldCheck className="w-6 h-6 text-[#2563EB] shrink-0" />
                   <div>
                     <h4 className="text-sm font-bold text-[#1A3A5C] mb-1">Autenticação de Dois Fatores (2FA)</h4>
                     <p className="text-xs text-[#4A5568] mb-3">Aumente a segurança do seu painel administrativo exigindo um código via SMS ou aplicativo.</p>
                     <button className="text-xs font-bold text-[#2563EB] uppercase tracking-widest hover:underline">Configurar Agora</button>
                   </div>
                 </div>

                 <div className="pt-4">
                   <h4 className="font-bold text-[#1A3A5C] text-sm mb-4">Webhooks e API</h4>
                   <div className="space-y-3">
                     <div className="flex items-center justify-between p-4 rounded-xl border border-[#e2e8f0]">
                       <div className="flex flex-col">
                         <span className="text-sm font-bold text-[#1A3A5C]">Melhor Envio API</span>
                         <span className="text-xs text-[#9AA3B0]">Última sincronização: hoje às 10:24</span>
                       </div>
                       <button className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">Editar</button>
                     </div>
                     <div className="flex items-center justify-between p-4 rounded-xl border border-[#e2e8f0]">
                       <div className="flex flex-col">
                         <span className="text-sm font-bold text-[#1A3A5C]">ViaCEP Integration</span>
                         <span className="text-xs text-[#2D7D62] font-bold">Ativo</span>
                       </div>
                       <button className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">Testar</button>
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'frete' && (
             <div className="space-y-8 animate-in fade-in text-center py-20">
               <div className="w-16 h-16 bg-[#1A3A5C]/5 text-[#1A3A5C] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                 <Truck className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-[#1A3A5C] text-lg mb-2">Configurações de Logística</h3>
               <p className="text-[#1A3A5C]/60 max-w-sm mx-auto text-sm">
                 Aqui você poderá configurar as regras de Frete Grátis, transportadoras, prazos de manuseio e integração direta com o Melhor Envio.
               </p>
             </div>
           )}

           {activeTab === 'notificacoes' && (
             <div className="space-y-8 animate-in fade-in text-center py-20">
               <div className="w-16 h-16 bg-[#1A3A5C]/5 text-[#1A3A5C] rounded-2xl flex items-center justify-center mb-4 mx-auto">
                 <Bell className="w-8 h-8" />
               </div>
               <h3 className="font-bold text-[#1A3A5C] text-lg mb-2">Mensagens & Alertas</h3>
               <p className="text-[#1A3A5C]/60 max-w-sm mx-auto text-sm">
                 Configuração de e-mails transacionais (Pedido Recebido, Enviado, etc) e alertas de estoque baixo via Dashboard ou e-mail.
               </p>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
