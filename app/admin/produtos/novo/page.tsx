'use client';

import { ArrowLeft, Save, Image as ImageIcon, Plus, Loader2, Trash2, Settings2, TrendingUp, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import ProductImageManager from '../components/ProductImageManager';
import { formatCurrency, parseCurrencyToNumber } from '@/lib/utils';
import StatusModal from '../../components/StatusModal';

export default function NovoProdutoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const duplicateId = searchParams.get('duplicate');

  const [activeTab, setActiveTab] = useState('geral');
  const [categories, setCategories] = useState<any[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
  const [isLoadingDuplicate, setIsLoadingDuplicate] = useState(false);
  const [pendingImages, setPendingImages] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    ref: '',
    category_id: '',
    short_description: '',
    description: '',
    price: '', // Venda Varejo
    cost_price: '',
    wholesale_price: '',
    original_price: '',
    stock_quantity: 0,
    min_stock: 5,
    slug: '',
    image: '',
    bestseller: false,
    new: true,
    is_active: true,
    spec_width: '',
    spec_height: '',
    spec_length: '',
    spec_material: '',
    spec_weight: '',
    spec_care: '',
    custom_specs: [] as { label: string, value: string }[]
  });

  useEffect(() => {
    fetchCategories();
    if (duplicateId) {
      fetchProductToDuplicate(duplicateId);
    }
  }, [duplicateId]);

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

  const fetchProductToDuplicate = async (id: string) => {
    try {
      setIsLoadingDuplicate(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (data) {
        const specs = data.specifications || [];
        const spec_width = specs.find((s: any) => s.label === 'Largura')?.value || '';
        const spec_height = specs.find((s: any) => s.label === 'Altura')?.value || '';
        const spec_length = specs.find((s: any) => s.label === 'Comprimento')?.value || '';
        const spec_material = specs.find((s: any) => s.label === 'Material')?.value || '';
        const spec_weight = specs.find((s: any) => s.label === 'Peso')?.value || '';
        const spec_care = specs.find((s: any) => s.label === 'Cuidados')?.value || '';
        const fixedLabels = ['Dimensões', 'Largura', 'Altura', 'Comprimento', 'Material', 'Peso', 'Cuidados'];
        const custom_specs = specs.filter((s: any) => !fixedLabels.includes(s.label));

        setFormData({
          ...data,
          name: `${data.name} (Cópia)`,
          ref: `${data.ref}-COPY`,
          slug: `${data.slug}-copia`,
          price: data.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }),
          cost_price: data.cost_price ? data.cost_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '',
          wholesale_price: data.wholesale_price ? data.wholesale_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '',
          original_price: data.original_price ? data.original_price.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : '',
          spec_width,
          spec_height,
          spec_length,
          spec_material,
          spec_weight,
          spec_care,
          custom_specs
        });
      }
    } catch (err) {
      console.error('Erro ao buscar produto para duplicar:', err);
    } finally {
      setIsLoadingDuplicate(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (['price', 'cost_price', 'wholesale_price', 'original_price'].includes(name)) {
      const digitsOnly = value.replace(/\D/g, '');
      const formatted = (Number(digitsOnly) / 100).toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      setFormData(prev => ({ ...prev, [name]: formatted }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));

    // Auto-generate slug from name
    if (name === 'name') {
      const slug = value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      
      // Validação básica
      if (!formData.name || !formData.ref || !formData.category_id || !formData.price) {
        setStatusModal({
          isOpen: true,
          type: 'warning',
          title: 'Campos Obrigatórios',
          message: 'Por favor, preencha todos os campos marcados com asterisco (*).'
        });
        setIsSaving(false);
        return;
      }

      // Encontrar a imagem de capa nas pendentes para atualizar o formData
      const coverImage = pendingImages.find(img => img.is_cover);

      // 1. Salvar o Produto
      const specifications = [
        ...(formData.spec_width ? [{ label: 'Largura', value: formData.spec_width }] : []),
        ...(formData.spec_height ? [{ label: 'Altura', value: formData.spec_height }] : []),
        ...(formData.spec_length ? [{ label: 'Comprimento', value: formData.spec_length }] : []),
        ...(formData.spec_material ? [{ label: 'Material', value: formData.spec_material }] : []),
        ...(formData.spec_weight ? [{ label: 'Peso', value: formData.spec_weight }] : []),
        ...(formData.spec_care ? [{ label: 'Cuidados', value: formData.spec_care }] : []),
        ...formData.custom_specs.filter(s => s.label && s.value)
      ];

      const productToSave = {
        name: formData.name,
        ref: formData.ref,
        category_id: formData.category_id,
        short_description: formData.short_description,
        description: formData.description,
        price: parseCurrencyToNumber(formData.price),
        cost_price: formData.cost_price ? parseCurrencyToNumber(formData.cost_price) : 0,
        wholesale_price: formData.wholesale_price ? parseCurrencyToNumber(formData.wholesale_price) : 0,
        original_price: formData.original_price ? parseCurrencyToNumber(formData.original_price) : 0,
        stock_quantity: formData.stock_quantity,
        min_stock: formData.min_stock,
        slug: formData.slug,
        is_active: formData.is_active,
        bestseller: formData.bestseller,
        new: formData.new,
        specifications
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productToSave])
        .select()
        .single();

      if (error) throw error;
      const newProductId = data.id;

      // 2. Realizar upload das fotos se houver
      if (pendingImages.length > 0) {
        for (const img of pendingImages) {
          if (img.file) {
             const fileExt = img.file.name.split('.').pop();
             const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
             const filePath = `${newProductId}/${fileName}`;

             const { error: uploadError } = await supabase.storage
               .from('products')
               .upload(filePath, img.file);

             if (uploadError) {
               console.error('Erro no upload:', uploadError);
               continue;
             }

             const { data: { publicUrl } } = supabase.storage
               .from('products')
               .getPublicUrl(filePath);

             // Adicionar na tabela product_images
             await supabase.from('product_images').insert([{
               product_id: newProductId,
               url: publicUrl,
               is_cover: img.is_cover
             }]);

             // Se for a capa, atualizar a tabela principal de produtos
             if (img.is_cover) {
               await supabase.from('products').update({ image: publicUrl }).eq('id', newProductId);
             }
          }
        }
      }

      setStatusModal({
        isOpen: true,
        type: 'success',
        title: 'Criado!',
        message: 'O novo produto foi cadastrado com sucesso no sistema.'
      });
      
      setTimeout(() => {
        router.push('/admin/produtos');
      }, 2000);
    } catch (err) {
      console.error('Erro ao salvar produto:', err);
      setStatusModal({
        isOpen: true,
        type: 'error',
        title: 'Erro no Cadastro',
        message: 'Nao foi possível criar o produto. Tente novamente mais tarde.'
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingDuplicate) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[#1A3A5C] animate-spin mb-4" />
        <p className="text-[#1A3A5C]/60">Carregando dados do produto original...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/produtos" className="p-2 text-[#9AA3B0] hover:text-[#1A3A5C] hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[#e2e8f0]">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">
              {duplicateId ? 'Duplicar Produto' : 'Novo Produto'}
            </h1>
            <p className="text-[#1A3A5C]/60 text-sm">
              {duplicateId ? 'Revise os dados antes de criar a cópia.' : 'Cadastre um novo produto no catálogo.'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button onClick={() => router.back()} className="btn-outline btn-md w-full sm:w-auto" disabled={isSaving}>
            Cancelar
          </button>
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
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
              { id: 'specs', label: 'Especificações' },
              { id: 'imagens', label: 'Imagens' },
              { id: 'estoque', label: 'Estoque' },
              { id: 'financeiro', label: 'Financeiro' },
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
                   <input 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    type="text" 
                    placeholder="Ex: Lente Acuvue Oasys" 
                    className="input w-full" 
                  />
                 </div>
 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">SKU / Ref *</label>
                     <input 
                        name="ref"
                        value={formData.ref}
                        onChange={handleInputChange}
                        type="text" 
                        placeholder="Ex: ACU-OAS-001" 
                        className="input w-full font-mono uppercase" 
                      />
                   </div>
                   <div>
                     <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Categoria *</label>
                     <div className="relative">
                       <select 
                        name="category_id"
                        value={formData.category_id}
                        onChange={handleInputChange}
                        className="input w-full appearance-none" 
                        disabled={loadingCategories}
                      >
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

                  <div>
                    <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Descrição Breve</label>
                    <input 
                     name="short_description"
                     value={formData.short_description || ''}
                     onChange={handleInputChange}
                     type="text" 
                     placeholder="Aparece abaixo do título nas listas" 
                     className="input w-full" 
                   />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Descrição Completa</label>
                    <textarea 
                     name="description"
                     value={formData.description || ''}
                     onChange={handleInputChange}
                     placeholder="Detalhes do produto..." 
                     className="input w-full min-h-[150px] py-3 resize-y"
                   ></textarea>
                  </div>

                  </div>
                </div>
            )}

            {activeTab === 'financeiro' && (
              <div className="space-y-8 animate-in fade-in">
                <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Gestão Financeira</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-[#1A3A5C]">Preços de Venda</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Venda Varejo (B2C) *</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0] font-medium">R$</span>
                          <input 
                            name="price"
                            value={formData.price}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="0,00" 
                            className="input w-full pl-9 border-[#1A3A5C]/20 shadow-sm focus:border-[#C8A951]" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2 flex items-center justify-between">
                          <span>Venda Atacado (B2B)</span>
                          <span className="text-[10px] text-[#C8A951] lowercase font-normal italic">* aplicado para 10+ unidades</span>
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0] font-medium">R$</span>
                          <input 
                            name="wholesale_price"
                            value={formData.wholesale_price}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="0,00" 
                            className="input w-full pl-9" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Valor Original (De:)</label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0] font-medium">R$</span>
                          <input 
                            name="original_price"
                            value={formData.original_price}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="0,00" 
                            className="input w-full pl-9 italic text-[#9AA3B0]" 
                          />
                        </div>
                        <p className="text-[10px] text-[#9AA3B0] mt-1 italic">Exibido como valor riscado na página do produto.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-bold text-[#1A3A5C]">Custos Internos</h3>
                    <div>
                      <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Custo de Compra</label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0] font-medium">R$</span>
                        <input 
                          name="cost_price"
                          value={formData.cost_price}
                          onChange={handleInputChange}
                          type="text" 
                          placeholder="0,00" 
                          className="input w-full pl-9 bg-[#F8F9FB]/50 border-dashed" 
                        />
                      </div>
                      <p className="text-[10px] text-[#9AA3B0] mt-1">Este valor é usado apenas para cálculo de margem no admin.</p>
                    </div>

                    {/* Análise de Margem */}
                    {(formData.price || formData.wholesale_price) && formData.cost_price && (
                      <div className="p-4 bg-[#F8F9FB] rounded-xl border border-[#1A3A5C]/5 space-y-4">
                        <h4 className="text-[10px] font-black text-[#1A3A5C] uppercase tracking-widest flex items-center gap-2">
                          <TrendingUp className="w-3 h-3 text-[#C8A951]" />
                          Margens de Lucro Estimadas
                        </h4>
                        
                        <div className="grid grid-cols-1 gap-3">
                          {/* Margem Varejo */}
                          {parseCurrencyToNumber(formData.price) > 0 && (
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-sm">
                              <div>
                                <p className="text-[10px] font-bold text-[#4A5568] uppercase">Margem Varejo</p>
                                <p className="text-xs text-[#1A3A5C]/60">Lucro: R$ {(parseCurrencyToNumber(formData.price) - parseCurrencyToNumber(formData.cost_price)).toFixed(2).replace('.', ',')}</p>
                              </div>
                              <div className={`text-right ${
                                (parseCurrencyToNumber(formData.price) - parseCurrencyToNumber(formData.cost_price)) / parseCurrencyToNumber(formData.price) * 100 > 30 
                                  ? 'text-green-600' 
                                  : (parseCurrencyToNumber(formData.price) - parseCurrencyToNumber(formData.cost_price)) / parseCurrencyToNumber(formData.price) * 100 > 10
                                    ? 'text-amber-600'
                                    : 'text-red-600'
                              }`}>
                                <p className="text-lg font-black leading-none">
                                  {((parseCurrencyToNumber(formData.price) - parseCurrencyToNumber(formData.cost_price)) / parseCurrencyToNumber(formData.price) * 100).toFixed(1)}%
                                </p>
                                <p className="text-[8px] font-bold uppercase tracking-tight">Margem Bruta</p>
                              </div>
                            </div>
                          )}

                          {/* Margem Atacado */}
                          {parseCurrencyToNumber(formData.wholesale_price) > 0 && (
                            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-[#e2e8f0] shadow-sm">
                              <div>
                                <p className="text-[10px] font-bold text-[#4A5568] uppercase">Margem Atacado</p>
                                <p className="text-xs text-[#1A3A5C]/60">Lucro: R$ {(parseCurrencyToNumber(formData.wholesale_price) - parseCurrencyToNumber(formData.cost_price)).toFixed(2).replace('.', ',')}</p>
                              </div>
                              <div className={`text-right ${
                                (parseCurrencyToNumber(formData.wholesale_price) - parseCurrencyToNumber(formData.cost_price)) / parseCurrencyToNumber(formData.wholesale_price) * 100 > 20 
                                  ? 'text-green-600' 
                                  : (parseCurrencyToNumber(formData.wholesale_price) - parseCurrencyToNumber(formData.cost_price)) / parseCurrencyToNumber(formData.wholesale_price) * 100 > 5
                                    ? 'text-amber-600'
                                    : 'text-red-600'
                              }`}>
                                <p className="text-lg font-black leading-none">
                                  {((parseCurrencyToNumber(formData.wholesale_price) - parseCurrencyToNumber(formData.cost_price)) / parseCurrencyToNumber(formData.wholesale_price) * 100).toFixed(1)}%
                                </p>
                                <p className="text-[8px] font-bold uppercase tracking-tight">Margem Bruta</p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="space-y-8 animate-in fade-in">
                <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                  <h2 className="text-lg font-bold text-[#1A3A5C]">Especificações Técnicas</h2>
                  <p className="text-xs text-[#4A5568]">Detalhes que aparecem na aba do produto</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                   <div className="space-y-6">
                      <h3 className="text-sm font-bold text-[#1A3A5C] flex items-center gap-2">
                        <Settings2 className="w-4 h-4 text-[#C8A951]" />
                        Padrão
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1">Largura</label>
                          <input 
                            name="spec_width"
                            value={formData.spec_width}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="Ex: 8cm" 
                            className="input w-full text-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1">Altura</label>
                          <input 
                            name="spec_height"
                            value={formData.spec_height}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="Ex: 2cm" 
                            className="input w-full text-xs" 
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-bold text-[#4A5568] uppercase mb-1">Comprimento</label>
                          <input 
                            name="spec_length"
                            value={formData.spec_length}
                            onChange={handleInputChange}
                            type="text" 
                            placeholder="Ex: 17cm" 
                            className="input w-full text-xs" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Material</label>
                        <input 
                          name="spec_material"
                          value={formData.spec_material}
                          onChange={handleInputChange}
                          type="text" 
                          placeholder="Ex: Couro Sintético" 
                          className="input w-full" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Peso</label>
                        <input 
                          name="spec_weight"
                          value={formData.spec_weight}
                          onChange={handleInputChange}
                          type="text" 
                          placeholder="Ex: 150g" 
                          className="input w-full" 
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Cuidados</label>
                        <input 
                          name="spec_care"
                          value={formData.spec_care}
                          onChange={handleInputChange}
                          type="text" 
                          placeholder="Ex: Limpar com pano seco" 
                          className="input w-full" 
                        />
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-[#1A3A5C] flex items-center gap-2">
                          <Plus className="w-4 h-4 text-[#C8A951]" />
                          Personalizadas
                        </h3>
                        <button 
                          type="button"
                          onClick={() => setFormData(prev => ({ 
                            ...prev, 
                            custom_specs: [...prev.custom_specs, { label: '', value: '' }] 
                          }))}
                          className="text-[10px] font-bold uppercase tracking-widest text-[#1A3A5C] hover:text-[#C8A951] transition-colors"
                        >
                          + Adicionar
                        </button>
                      </div>

                      <div className="space-y-3">
                        {formData.custom_specs.length === 0 && (
                          <div className="py-8 text-center border-2 border-dashed border-[#e2e8f0] rounded-2xl">
                            <p className="text-xs text-[#4A5568]/50 italic">Nenhuma especificação personalizada adicionada.</p>
                          </div>
                        )}
                        {formData.custom_specs.map((spec, index) => (
                          <div key={index} className="flex gap-2 items-start group">
                            <div className="flex-1 grid grid-cols-2 gap-2">
                              <input 
                                type="text"
                                placeholder="Nome (Ex: Cor)"
                                value={spec.label}
                                onChange={(e) => {
                                  const newSpecs = [...formData.custom_specs];
                                  newSpecs[index].label = e.target.value;
                                  setFormData(prev => ({ ...prev, custom_specs: newSpecs }));
                                }}
                                className="input w-full text-[11px]"
                              />
                              <input 
                                type="text"
                                placeholder="Valor (Ex: Preto)"
                                value={spec.value}
                                onChange={(e) => {
                                  const newSpecs = [...formData.custom_specs];
                                  newSpecs[index].value = e.target.value;
                                  setFormData(prev => ({ ...prev, custom_specs: newSpecs }));
                                }}
                                className="input w-full text-[11px]"
                              />
                            </div>
                            <button 
                              type="button"
                              onClick={() => {
                                const newSpecs = formData.custom_specs.filter((_, i) => i !== index);
                                setFormData(prev => ({ ...prev, custom_specs: newSpecs }));
                              }}
                              className="p-2.5 text-[#9AA3B0] hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                   </div>
                </div>
              </div>
            )}


           {activeTab === 'imagens' && (
             <div className="space-y-8 animate-in fade-in">
               <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-4">
                 <h2 className="text-lg font-bold text-[#1A3A5C]">Galeria de Imagens</h2>
                 <span className="text-sm text-[#4A5568]">Arraste as fotos do produto</span>
               </div>
               
               <ProductImageManager 
                 onImagesChange={(images) => setPendingImages(images)}
               />
             </div>
           )}

           {activeTab === 'estoque' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Controle de Estoque</h2>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Quantidade em Estoque</label>
                   <input 
                    name="stock_quantity"
                    value={formData.stock_quantity}
                    onChange={handleInputChange}
                    type="number" 
                    placeholder="0" 
                    className="input w-full" 
                  />
                 </div>
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">Estoque Mínimo (Alerta)</label>
                   <input 
                    name="min_stock"
                    value={formData.min_stock}
                    onChange={handleInputChange}
                    type="number" 
                    placeholder="5" 
                    className="input w-full" 
                  />
                 </div>
               </div>
             </div>
           )}

           {activeTab === 'seo' && (
             <div className="space-y-8 animate-in fade-in">
               <h2 className="text-lg font-bold text-[#1A3A5C] border-b border-[#e2e8f0] pb-4">Otimização (SEO)</h2>
               
               <div className="space-y-6">
                 <div>
                   <label className="block text-xs font-bold text-[#4A5568] uppercase tracking-wide mb-2">URL Amigável (Slug)</label>
                   <div className="flex">
                     <span className="inline-flex items-center px-4 rounded-l-lg border border-r-0 border-[#DDE1E9] bg-[#F8F9FB] text-sm text-[#9AA3B0]">/produto/</span>
                     <input 
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      type="text" 
                      placeholder="ex-lente-acuvue" 
                      className="input w-full rounded-l-none" 
                    />
                   </div>
                 </div>

                 <div className="flex items-center gap-6 pt-4">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={formData.bestseller}
                          onChange={(e) => setFormData(prev => ({ ...prev, bestseller: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1A3A5C]"></div>
                      </div>
                      <span className="text-sm font-medium text-[#4A5568] group-hover:text-[#1A3A5C] transition-colors flex items-center gap-2">
                        Mais Vendido 
                        <span className="text-[9px] bg-[#1A3A5C]/5 text-[#1A3A5C] px-2 py-0.5 rounded-full border border-[#1A3A5C]/10 uppercase tracking-tighter">Premium</span>
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={formData.is_active}
                          onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      </div>
                      <span className="text-sm font-medium text-[#4A5568] group-hover:text-[#1A3A5C] transition-colors">Ativo</span>
                    </label>
                 </div>
               </div>
             </div>
           )}

        </div>
      </div>
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
