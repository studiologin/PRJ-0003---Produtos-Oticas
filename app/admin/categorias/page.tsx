'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Plus, 
  Search, 
  MoreHorizontal, 
  Trash2, 
  Edit2, 
  Loader2,
  Tag,
  AlertCircle,
  X,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import StatusModal from '../components/StatusModal';

interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'warning';
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar categorias:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      setIsSubmitting(true);
      setError(null);
      
      const slug = generateSlug(newCategoryName);

      const { data, error } = await supabase
        .from('categories')
        .insert([{ name: newCategoryName, slug }])
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          throw new Error('Esta categoria ou slug já existe.');
        }
        throw error;
      }

      setCategories(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewCategoryName('');
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria? Isso pode afetar produtos vinculados.')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === '23503') {
          setStatusModal({
            isOpen: true,
            type: 'warning',
            title: 'Exclusão Negada',
            message: 'Não é possível excluir esta categoria pois existem produtos vinculados a ela. Remova os produtos ou altere suas categorias primeiro.'
          });
          return;
        }
        throw error;
      }

      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      console.error('Erro ao excluir categoria:', err);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Algo deu errado',
        message: 'Ocorreu um erro ao tentar excluir a categoria. Tente novamente em instantes.'
      });
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Gestão de Categorias</h1>
          <p className="text-[#1A3A5C]/60 text-sm">Organize seu catálogo através de categorias dinâmicas.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Categoria</span>
        </button>
      </div>

      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-[#F8F9FB] rounded-xl flex items-center justify-center text-[#1A3A5C]">
              <Tag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#4A5568] uppercase tracking-wider">Total de Categorias</p>
              <h3 className="text-2xl font-bold text-[#1A3A5C]">{categories.length}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm overflow-hidden">
        {/* Table Filters */}
        <div className="p-4 border-b border-[#e2e8f0] bg-white/50 flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A3A5C]/40 group-focus-within:text-[#1A3A5C] transition-colors" />
            <input 
              type="text" 
              placeholder="Buscar categorias..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-11 pl-12 pr-4 bg-white border border-[#DDE1E9] rounded-xl focus:outline-none focus:border-[#C8A951] focus:ring-4 focus:ring-[#C8A951]/5 transition-all text-sm"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase tracking-wider">Nome da Categoria</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {loading ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <Loader2 className="w-8 h-8 text-[#1A3A5C] animate-spin mx-auto" />
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-[#9AA3B0]">
                    Nenhuma categoria encontrada.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="hover:bg-[#F8F9FB] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-[#1A3A5C]/5 rounded-lg flex items-center justify-center text-[#1A3A5C]">
                          <Tag className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-[#1A3A5C]">{category.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-[#F1F5F9] text-[#475569] text-xs font-mono rounded-full border border-[#E2E8F0]">
                        {category.slug}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleDeleteCategory(category.id)}
                          className="p-2 text-[#9AA3B0] hover:text-[#C0392B] hover:bg-[#FDEDEB] rounded-lg transition-all"
                          title="Excluir"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal - Nova Categoria */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isSubmitting && setIsModalOpen(false)}
              className="absolute inset-0 bg-[#1A3A5C]/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between bg-[#F8F9FB]/50">
                <h3 className="text-xl font-bold text-[#1A3A5C]">Nova Categoria</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                  className="p-2 text-[#9AA3B0] hover:text-[#1A3A5C] rounded-xl hover:bg-white transition-all disabled:opacity-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddCategory} className="p-8 space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-3">Nome da Categoria *</label>
                  <input 
                    type="text" 
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Ex: Armações de Luxo" 
                    autoFocus
                    className="input w-full h-12 text-base"
                    required
                  />
                  {newCategoryName && (
                    <p className="mt-2 text-[11px] text-[#9AA3B0]">
                      Slug sugerido: <span className="font-mono">{generateSlug(newCategoryName)}</span>
                    </p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="btn-outline btn-md w-full sm:w-1/3 order-2 sm:order-1"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isSubmitting || !newCategoryName.trim()}
                    className="btn-primary btn-md w-full sm:w-2/3 flex items-center justify-center gap-2 order-1 sm:order-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>Criar Categoria</span>
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <StatusModal 
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  );
}
