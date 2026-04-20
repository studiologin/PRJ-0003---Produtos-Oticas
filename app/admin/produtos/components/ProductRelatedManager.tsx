'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Plus, Loader2, Package, Check, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

interface RelatedProduct {
  id: number;
  name: string;
  ref: string;
  image: string;
  category_name?: string;
}

interface ProductRelatedManagerProps {
  productId: number;
}

export default function ProductRelatedManager({ productId }: ProductRelatedManagerProps) {
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);
  const [searchResults, setSearchResults] = useState<RelatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productId) {
      fetchRelatedProducts();
    }
  }, [productId]);

  const fetchRelatedProducts = async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('product_related')
        .select(`
          related_id,
          position,
          related:products!product_related_related_id_fkey(
            id,
            name,
            ref,
            image,
            categories(name)
          )
        `)
        .eq('product_id', productId)
        .order('position', { ascending: true });

      if (fetchError) throw fetchError;

      if (data) {
        const formatted = data.map((item: any) => ({
          id: item.related.id,
          name: item.related.name,
          ref: item.related.ref,
          image: item.related.image,
          category_name: item.related.categories?.name
        }));
        setRelatedProducts(formatted);
      }
    } catch (err: any) {
      console.error('Erro ao buscar produtos relacionados:', err);
      setError('Falha ao carregar produtos relacionados.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (term: string) => {
    setSearchTerm(term);
    if (term.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const { data, error: searchError } = await supabase
        .from('products')
        .select('id, name, ref, image, categories(name)')
        .neq('id', productId) // Não mostrar o próprio produto
        .or(`name.ilike.%${term}%,ref.ilike.%${term}%`)
        .limit(5);

      if (searchError) throw searchError;

      if (data) {
        const formatted = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          ref: item.ref,
          image: item.image,
          category_name: item.categories?.name
        }));
        setSearchResults(formatted);
      }
    } catch (err) {
      console.error('Erro na busca:', err);
    } finally {
      setIsSearching(false);
    }
  };

  const addRelatedProduct = async (product: RelatedProduct) => {
    if (relatedProducts.length >= 4) {
      alert('Você só pode adicionar até 4 produtos relacionados.');
      return;
    }

    if (relatedProducts.some(p => p.id === product.id)) {
      alert('Este produto já foi adicionado.');
      return;
    }

    try {
      const position = relatedProducts.length;
      const { error: insertError } = await supabase
        .from('product_related')
        .insert({
          product_id: productId,
          related_id: product.id,
          position: position
        });

      if (insertError) throw insertError;

      setRelatedProducts(prev => [...prev, product]);
      setSearchTerm('');
      setSearchResults([]);
    } catch (err: any) {
      console.error('Erro ao adicionar:', err);
      alert('Erro ao vincular produto.');
    }
  };

  const removeRelatedProduct = async (relatedId: number) => {
    try {
      const { error: deleteError } = await supabase
        .from('product_related')
        .delete()
        .eq('product_id', productId)
        .eq('related_id', relatedId);

      if (deleteError) throw deleteError;

      setRelatedProducts(prev => prev.filter(p => p.id !== relatedId));
    } catch (err: any) {
      console.error('Erro ao remover:', err);
      alert('Erro ao desvincular produto.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-12 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1A3A5C] animate-spin mb-2" />
        <p className="text-sm text-[#4A5568]">Carregando relacionados...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="bg-[#F8F9FB] rounded-2xl p-6 border border-[#DDE1E9] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-[#1A3A5C]">Vincular Produtos</h3>
            <p className="text-sm text-[#4A5568]">Selecione até 4 produtos para serem exibidos como sugestões.</p>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-full border border-[#DDE1E9] inline-flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${relatedProducts.length === 4 ? 'bg-amber-400' : 'bg-emerald-500'}`} />
            <span className="text-xs font-bold text-[#1A3A5C] uppercase tracking-wider">
              {relatedProducts.length} / 4 Selecionados
            </span>
          </div>
        </div>

        <div className="relative">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-[#9AA3B0]" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou referência..." 
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              disabled={relatedProducts.length >= 4}
              className="w-full bg-white border border-[#DDE1E9] text-[#1E2A3A] rounded-xl pl-12 pr-4 py-3.5 focus:outline-none focus:border-[#C8A951] focus:ring-2 focus:ring-[#C8A951]/20 transition-all disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
            {isSearching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 text-[#C8A951] animate-spin" />
              </div>
            )}
          </div>

          {/* Resultados da Busca */}
          {searchResults.length > 0 && (
            <div className="absolute z-10 left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#e2e8f0] overflow-hidden">
              {searchResults.map((product) => {
                const isAlreadyAdded = relatedProducts.some(p => p.id === product.id);
                return (
                  <div 
                    key={product.id}
                    className={`flex items-center gap-4 p-3 hover:bg-[#F8F9FB] transition-colors cursor-pointer border-b border-[#f1f5f9] last:border-0 ${isAlreadyAdded ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    onClick={() => !isAlreadyAdded && addRelatedProduct(product)}
                  >
                    <div className="w-12 h-12 rounded-lg bg-[#F8F9FB] overflow-hidden shrink-0 border border-[#e2e8f0] relative">
                      <img src={product.image || 'https://picsum.photos/100/100'} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#1A3A5C] truncate">{product.name}</p>
                      <p className="text-[10px] text-[#4A5568] uppercase tracking-wider">{product.ref} • {product.category_name}</p>
                    </div>
                    {isAlreadyAdded ? (
                      <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : (
                      <Plus className="w-5 h-5 text-[#C8A951] shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Lista de Selecionados */}
      <div className="space-y-4">
        <h4 className="text-sm font-bold text-[#4A5568] uppercase tracking-widest flex items-center gap-2">
          Sua Seleção Atual
          <div className="h-px flex-1 bg-[#DDE1E9]" />
        </h4>

        {relatedProducts.length === 0 ? (
          <div className="py-12 border-2 border-dashed border-[#DDE1E9] rounded-2xl flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 bg-[#F8F9FB] rounded-full flex items-center justify-center text-[#9AA3B0] mb-4">
              <Package className="w-8 h-8" />
            </div>
            <p className="text-[#1A3A5C] font-bold">Nenhum produto relacionado</p>
            <p className="text-sm text-[#4A5568] max-w-xs">Os produtos que você selecionar aqui aparecerão na página de detalhes para incentivar compras casadas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedProducts.map((product, index) => (
              <div 
                key={product.id}
                className="bg-white border border-[#DDE1E9] rounded-xl p-4 flex items-center gap-4 group hover:border-[#1A3A5C] transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-[#1A3A5C] opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="w-16 h-16 rounded-lg bg-[#F8F9FB] overflow-hidden shrink-0 border border-[#e2e8f0]">
                  <img src={product.image || 'https://picsum.photos/100/100'} alt={product.name} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold text-white bg-[#1A3A5C] w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-sm font-bold text-[#1A3A5C] truncate">{product.name}</p>
                  </div>
                  <p className="text-[10px] text-[#4A5568] uppercase tracking-wider truncate">{product.ref} • {product.category_name}</p>
                </div>

                <button 
                  onClick={() => removeRelatedProduct(product.id)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-[#9AA3B0] hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {relatedProducts.length > 0 && (
        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-emerald-500 shadow-sm shrink-0">
            <Check className="w-5 h-5" />
          </div>
          <div>
            <p className="text-sm font-bold text-[#2D7D62]">Alterações salvas automaticamente</p>
            <p className="text-xs text-[#2D7D62]/80">Os produtos selecionados acima já estão vinculados a este item.</p>
          </div>
        </div>
      )}
    </div>
  );
}
