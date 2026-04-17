'use client';

import { Package, Plus, Search, Filter, MoreHorizontal, ArrowUpDown, Download, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { products } from '@/lib/products';
import Image from 'next/image';

export default function AdminProdutosPage() {
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
                    Preço (B2C)
                    <ArrowUpDown className="w-3 h-3 text-[#9AA3B0] group-hover:text-[#1A3A5C] transition-colors" />
                  </div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Estoque</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase text-center">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {products.map((product, i) => (
                <tr key={product.id} className="hover:bg-[#F8F9FB] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#F8F9FB] rounded-lg overflow-hidden shrink-0 relative border border-[#e2e8f0]">
                        <Image src={`https://picsum.photos/seed/prod${product.id}/150/150`} alt={product.name} fill className="object-cover" />
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
                    <span className="text-sm font-mono text-[#4A5568] bg-[#F8F9FB] px-2 py-1 rounded inline-block border border-[#e2e8f0]">{product.ref}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4A5568]">{product.category}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1A3A5C]">
                      R$ {product.price.toFixed(2).replace('.', ',')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${i % 3 === 0 ? 'bg-[#D97706]' : 'bg-[#2D7D62]'}`}></div>
                      <span className="text-sm text-[#4A5568] font-medium">{i % 3 === 0 ? 'Baixo' : 'Normal'}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-[#2D7D62] text-[11px] font-bold uppercase tracking-widest border border-emerald-100">
                      <CheckCircle2 className="w-3 h-3 mr-1.5" />
                      Ativo
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-[#9AA3B0] hover:text-[#1A3A5C] hover:bg-[#e2e8f0] rounded-lg transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-[#e2e8f0] bg-[#F8F9FB] flex items-center justify-between">
          <span className="text-sm text-[#4A5568]">Exibindo <span className="font-bold text-[#1A3A5C]">1</span> a <span className="font-bold text-[#1A3A5C]">{products.length}</span> de <span className="font-bold text-[#1A3A5C]">{products.length}</span> produtos</span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-[#DDE1E9] bg-white rounded-md text-sm text-[#4A5568] hover:bg-[#F8F9FB] disabled:opacity-50 transition-colors" disabled>Anterior</button>
            <button className="px-3 py-1.5 bg-[#1A3A5C] text-white rounded-md text-sm font-medium shadow-sm">1</button>
            <button className="px-3 py-1.5 border border-[#DDE1E9] bg-white rounded-md text-sm text-[#4A5568] hover:bg-[#F8F9FB] disabled:opacity-50 transition-colors" disabled>Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
