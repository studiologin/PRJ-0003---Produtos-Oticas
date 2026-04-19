'use client';

import { ArrowLeft, Save, Image as ImageIcon, Plus, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NovoProdutoPage() {
  const [activeTab, setActiveTab] = useState('geral');
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('id, name')
          .order('name');
        
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        console.error('Erro ao buscar categorias:', err);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/produtos" className="p-2 text-[#9AA3B0] hover:text-[#1A3A5C] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#e2e8f0]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Novo Produto</h1>
            <p className="text-[#1A3A5C]/60 text-sm">Cadastre um novo produto no catálogo.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="btn-outline btn-md w-full sm:w-auto">
            Cancelar
          </button>
          <button className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium">
            <Save className="w-4 h-4" />
            <span>Salvar Produto</span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-6 items-start">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-2 shrink-0">
          <nav className="flex flex-row lg:flex-col gap-1 overflow-x-auto lg:overflow-visible">
            {[
              { id: 'geral', label: 'Dados Gerais' },
              { id: 'imagens', label: 'Imagens' },
              { id: 'estoque', label: 'Estoque & Variações' },
              { id: 'b2b', label: 'Preços B2B' },
              { id: 'seo', label: 'SEO' },
            ].map(tab => (
               <button 
                 key={tab.id}
                 onClick={() => setActiveTab(tab.id)}
                 className={`flex-1 lg:flex-none text-left px-4 py-3 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${
                   activeTab === tab.id 
                     ? 'bg-[#1A3A5C] text-white' 
                     : 'text-[#4A5568] hover:bg-[#F8F9FB]'
                 }`}
               >
                 {tab.label}
               </button>
            ))}
          </nav>
        </div>

        {/* Content Area */}
        <div className="flex-1 w-full bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 md:p-8">
           
           {activeTab === 'geral' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Informações Básicas</h2>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Nome do Produto *</label>
                   <input type="text" placeholder="Ex: Lente Acuvue Oasys" className="input w-full" />
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">SKU / Ref *</label>
                     <input type="text" placeholder="Ex: ACU-OAS-001" className="input w-full font-mono uppercase" />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Categoria *</label>
                     <div className="relative">
                       <select className="input w-full appearance-none" disabled={loadingCategories}>
                         <option value="">
                           {loadingCategories ? 'Carregando categorias...' : 'Selecione uma categoria...'}
                         </option>
                         {!loadingCategories && categories.map(category => (
                           <option key={category.id} value={category.id}>
                             {category.name}
                           </option>
                         ))}
                       </select>
                       {loadingCategories && (
                         <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A3A5C] animate-spin" />
                       )}
                     </div>
                   </div>
                 </div>
     </div>

                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Descrição Breve</label>
                   <input type="text" placeholder="Aparece abaixo do título nas listas" className="input w-full" />
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Descrição Completa</label>
                   <textarea placeholder="Detalhes do produto..." className="input w-full min-h-[150px] py-3 resize-y"></textarea>
                 </div>

                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Preço Base (B2C) *</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0] font-medium">R$</span>
                       <input type="text" placeholder="0,00" className="input w-full pl-9" />
                     </div>
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Preço Promocional</label>
                     <div className="relative">
                       <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0] font-medium">R$</span>
                       <input type="text" placeholder="0,00" className="input w-full pl-9" />
                     </div>
                   </div>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'imagens' && (
             <div className="space-y-8 animate-in fade-in">
               <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                 <h2 className="text-lg font-bold text-[#1A3A5C]">Galeria do Produto</h2>
                 <span className="text-sm text-[#4A5568]">Máximo 8 imagens (JPG, WEBP)</span>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                 {/* Empty State / Upload Card */}
                 <div className="aspect-square border-2 border-dashed border-[#DDE1E9] rounded-2xl flex flex-col items-center justify-center bg-[#F8F9FB] text-[#9AA3B0] hover:border-[#1A3A5C] hover:text-[#1A3A5C] hover:bg-white cursor-pointer transition-all">
                    <Plus className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Adicionar Imagem</span>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'estoque' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Controle de Estoque</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Quantidade em Estoque</label>
                   <input type="number" placeholder="0" className="input w-full" />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Estoque Mínimo (Alerta)</label>
                   <input type="number" placeholder="5" className="input w-full" />
                 </div>
               </div>

               <div className="pt-8">
                 <div className="flex items-center justify-between mb-6">
                   <h3 className="text-lg font-bold text-[#1A3A5C]">Variações (Grau, Cor, Tamanho)</h3>
                   <button className="btn-outline btn-sm flex items-center gap-2">
                     <Plus className="w-3 h-3" />
                     Adicionar Variação
                   </button>
                 </div>
                 <div className="bg-[#F8F9FB] border border-[#e2e8f0] rounded-xl p-8 text-center">
                   <p className="text-sm text-[#4A5568]">Este produto não possui variações configuradas.</p>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'b2b' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Preços Diferenciados (B2B)</h2>
               
               <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                 <p className="text-sm text-[#2D7D62]">Configure preços por grupos de clientes ou por volume de compra.</p>
               </div>

               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Preço Base B2B</label>
                   <div className="relative max-w-sm">
                     <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0] font-medium">R$</span>
                     <input type="text" placeholder="0,00" className="input w-full pl-9" />
                   </div>
                 </div>

                 <div className="pt-4">
                   <h4 className="font-bold text-[#1A3A5C] text-sm mb-4">Descontos por Volume</h4>
                   <div className="flex items-end gap-4 mb-3">
                     <div className="flex-1">
                       <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wide mb-1">A partir de (unid.)</label>
                       <input type="number" placeholder="Ex: 10" className="input w-full" />
                     </div>
                     <div className="flex-1">
                       <label className="block text-[10px] font-bold text-[#4A5568] uppercase tracking-wide mb-1">Preço unitário R$</label>
                       <input type="text" placeholder="0,00" className="input w-full" />
                     </div>
                     <button className="btn-danger btn-md w-[44px] shrink-0 font-bold hover:bg-[#C0392B] bg-[#FDEDEB] text-[#C0392B] items-center justify-center flex mb-0.5">X</button>
                   </div>
                   <button className="text-sm text-[#00B4D8] font-bold hover:text-[#0096C7]">+ Adicionar regra de volume</button>
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'seo' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Otimização (SEO)</h2>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Meta Título</label>
                   <input type="text" placeholder="Título que aparece no Google (Máx 60 caracteres)" className="input w-full" />
                   <p className="text-[11px] text-[#9AA3B0] mt-1 text-right">0 / 60</p>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Meta Descrição</label>
                   <textarea placeholder="Descrição para os resultados de busca (Máx 155 caracteres)..." className="input w-full min-h-[100px] py-3 resize-y"></textarea>
                   <p className="text-[11px] text-[#9AA3B0] mt-1 text-right">0 / 155</p>
                 </div>

                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">URL Amigável (Slug)</label>
                   <div className="flex">
                     <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-[#DDE1E9] bg-[#F8F9FB] text-sm text-[#9AA3B0]">/produto/</span>
                     <input type="text" placeholder="ex-lente-acuvue" className="input w-full rounded-l-none" />
                   </div>
                 </div>
               </div>
             </div>
           )}

        </div>
      </div>
    </div>
  );
}
