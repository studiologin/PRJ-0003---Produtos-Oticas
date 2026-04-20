'use client';

import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown, 
  Download, 
  Image as ImageIcon, 
  CheckCircle2, 
  Edit2, 
  Copy, 
  Trash2, 
  EyeOff,
  AlertCircle,
  Loader2,
  ExternalLink,
  Eye
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '@/lib/supabase';

interface Product {
  id: number;
  name: string;
  ref: string;
  price: number;
  category_id: string;
  image: string;
  bestseller: boolean;
  is_active: boolean;
  stock_quantity?: number;
  min_stock?: number;
  categories?: {
    name: string;
  };
}

export default function AdminProdutosPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRefs = useRef<{ [key: number]: HTMLButtonElement | null }>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(name)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMenu = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (openMenuId === id) {
      setOpenMenuId(null);
    } else {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const menuWidth = 192; // w-48 = 12rem = 192px
      
      // Ajustar posição para não sair da tela
      let left = rect.left + window.scrollX - menuWidth + rect.width;
      let top = rect.top + window.scrollY + rect.height + 8;

      // Se estiver muito perto do fundo da página, abre para cima
      if (top + 200 > window.innerHeight + window.scrollY) {
        top = rect.top + window.scrollY - 180; // Aproximadamente o tamanho do menu
      }

      setMenuPosition({ top, left });
      setOpenMenuId(id);
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Tem certeza que deseja excluir o produto "${name}"?`)) return;

    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) throw error;
      setProducts(prev => prev.filter(p => p.id !== id));
      setOpenMenuId(null);
    } catch (err) {
      console.error('Erro ao excluir produto:', err);
      alert('Erro ao excluir produto.');
    }
  };

  const handleToggleStatus = async (product: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ is_active: !product.is_active })
        .eq('id', product.id);

      if (error) throw error;
      
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, is_active: !p.is_active } : p
      ));
      setOpenMenuId(null);
    } catch (err) {
      console.error('Erro ao atualizar status:', err);
      alert('Erro ao atualizar status.');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Gestão de Produtos</h1>
          <p className="text-[#1A3A5C]/60 text-sm">Adicione novos produtos, gerencie estoque e edite o catálogo.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="btn-outline btn-md w-full sm:w-auto flex items-center justify-center gap-2">
            <Download className="w-4 h-4" />
            <span>Importar CSV</span>
          </button>
          <Link href="/admin/produtos/novo" className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium">
            <Plus className="w-5 h-5" />
            <span>Novo Produto</span>
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0]" />
            <input 
              type="text" 
              placeholder="Buscar por nome, SKU ou ref..." 
              className="w-full bg-[#F8F9FB] border border-[#DDE1E9] text-[#1E2A3A] text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="px-4 py-2.5 bg-white border border-[#DDE1E9] rounded-lg text-sm font-medium text-[#4A5568] flex items-center gap-2 hover:bg-[#F8F9FB] w-full sm:w-auto justify-center transition-colors">
              <Filter className="w-4 h-4" />
              <span>Categoria</span>
            </button>
            <button className="px-4 py-2.5 bg-white border border-[#DDE1E9] rounded-lg text-sm font-medium text-[#4A5568] flex items-center gap-2 hover:bg-[#F8F9FB] w-full sm:w-auto justify-center transition-colors">
              <Filter className="w-4 h-4" />
              <span>Status</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">
                  <div className="flex items-center gap-2 cursor-pointer group">
                    Produto
                    <ArrowUpDown className="w-3 h-3 text-[#9AA3B0] group-hover:text-[#1A3A5C] transition-colors" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">SKU / Ref</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">
                  <div className="flex items-center gap-2 cursor-pointer group">
                    Preço
                    <ArrowUpDown className="w-3 h-3 text-[#9AA3B0] group-hover:text-[#1A3A5C] transition-colors" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Estoque</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-[#1A3A5C] animate-spin mx-auto mb-2" />
                    <p className="text-sm text-[#4A5568]">Carregando produtos...</p>
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Package className="w-8 h-8 text-[#9AA3B0] mx-auto mb-2" />
                    <p className="text-sm text-[#4A5568]">Nenhum produto encontrado.</p>
                  </td>
                </tr>
              ) : (
                products.map((product, i) => (
                  <tr key={product.id} className="hover:bg-[#F8F9FB] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F8F9FB] rounded-lg overflow-hidden shrink-0 relative border border-[#e2e8f0]">
                          <Image 
                            src={product.image || `https://picsum.photos/seed/prod${product.id}/150/150`} 
                            alt={product.name} 
                            fill 
                            className="object-cover" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#1A3A5C] group-hover:text-[#00B4D8] transition-colors cursor-pointer">{product.name}</p>
                          {product.bestseller && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A951]">Mais Vendido</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-[#4A5568] bg-[#F8F9FB] px-2 py-1 rounded inline-block border border-[#E2E8F0]">{product.ref}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-[#4A5568]">{product.categories?.name || 'Sem Categoria'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-[#1A3A5C]">
                        {formatCurrency(product.price)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${product.stock_quantity <= (product.min_stock || 5) ? 'text-rose-500' : 'text-[#4A5568]'}`}>
                          {product.stock_quantity} un
                        </span>
                        {product.stock_quantity <= (product.min_stock || 5) && (
                          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-wider">Estoque Baixo</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {product.is_active ? (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-[#2D7D62] text-[11px] font-bold uppercase tracking-widest border border-emerald-100">
                          <CheckCircle2 className="w-3 h-3 mr-1.5" />
                          Ativo
                        </div>
                      ) : (
                        <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 text-[11px] font-bold uppercase tracking-widest border border-gray-100">
                          <EyeOff className="w-3 h-3 mr-1.5" />
                          Inativo
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        ref={el => { buttonRefs.current[product.id] = el }}
                        onClick={(e) => toggleMenu(e, product.id)}
                        className={`p-2 rounded-lg transition-all ${
                          openMenuId === product.id 
                            ? 'bg-[#1A3A5C] text-white shadow-lg' 
                            : 'text-[#9AA3B0] hover:text-[#1A3A5C] hover:bg-[#e2e8f0]'
                        }`}
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-[#e2e8f0] bg-[#F8F9FB] flex items-center justify-between">
          <span className="text-sm text-[#4A5568]">Exibindo <span className="font-bold text-[#1A3A5C]">{products.length}</span> produtos</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-[#DDE1E9] bg-white rounded-md text-sm text-[#4A5568] hover:bg-[#F8F9FB] disabled:opacity-50 transition-colors" disabled>Anterior</button>
            <button className="px-3 py-1.5 bg-[#1A3A5C] text-white rounded-md text-sm font-medium shadow-sm">1</button>
            <button className="px-3 py-1.5 border border-[#DDE1E9] bg-white rounded-md text-sm text-[#4A5568] hover:bg-[#F8F9FB] disabled:opacity-50 transition-colors" disabled>Próximo</button>
          </div>
        </div>
      </div>

      {/* Floating Menu Portal-like */}
      <AnimatePresence>
        {openMenuId !== null && (
          <div className="fixed inset-0 z-[99] pointer-events-none">
            <div className="absolute inset-0 pointer-events-auto" onClick={() => setOpenMenuId(null)} />
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              style={{ 
                position: 'absolute',
                top: menuPosition.top,
                left: menuPosition.left,
                zIndex: 100
              }}
              className="w-48 bg-white rounded-xl shadow-2xl border border-[#e2e8f0] py-1 overflow-hidden pointer-events-auto"
            >
              <button 
                onClick={() => router.push(`/admin/produtos/${openMenuId}`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A5568] hover:bg-[#F8F9FB] transition-colors"
              >
                <Edit2 className="w-4 h-4 text-[#1A3A5C]" />
                <span className="font-medium">Editar Produto</span>
              </button>
              <button 
                onClick={() => router.push(`/admin/produtos/novo?duplicate=${openMenuId}`)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A5568] hover:bg-[#F8F9FB] transition-colors"
              >
                <Copy className="w-4 h-4 text-[#C8A951]" />
                <span className="font-medium">Duplicar</span>
              </button>
              <button 
                onClick={() => {
                  const p = products.find(prod => prod.id === openMenuId);
                  if (p) handleToggleStatus(p);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-[#4A5568] hover:bg-[#F8F9FB] transition-colors border-t border-[#f1f5f9]"
              >
                {products.find(p => p.id === openMenuId)?.is_active ? (
                  <>
                    <EyeOff className="w-4 h-4 text-[#9AA3B0]" />
                    <span className="font-medium">Desativar</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 text-emerald-500" />
                    <span className="font-medium">Ativar</span>
                  </>
                )}
              </button>
              <button 
                onClick={() => {
                  const p = products.find(prod => prod.id === openMenuId);
                  if (p) handleDelete(p.id, p.name);
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-bold">Excluir</span>
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
