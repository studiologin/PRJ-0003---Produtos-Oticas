'use client';

import { use, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, Package, Minus, Plus, ShoppingCart, Star, MapPin, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { getProductBySlug, getProducts, getRelatedProducts, type Product } from '@/lib/products';
import { useFavoritesStore, useCartStore } from '@/lib/store';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as any }
};

export default function ProductDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const addItem = useCartStore(state => state.addItem);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'descricao' | 'especificacoes'>('descricao');
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  
  // Shipping states
  const [cep, setCep] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const [shippingOptions, setShippingOptions] = useState<any[]>([]);
  const [shippingError, setShippingError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getProductBySlug(slug);
      setProduct(data);
      
      if (data) {
        setSelectedColor(data.colors?.[0]?.name || null);
        const related = await getRelatedProducts(data.id, data.category);
        setRelatedProducts(related);
      }
      
      setLoading(false);
    };
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1A3A5C]"></div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const handleCalculateShipping = async () => {
    if (cep.length < 8) return;
    
    setIsCalculating(true);
    setShippingError(null);
    setShippingOptions([]);

    try {
      const response = await fetch('/api/frete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ to_cep: cep, product }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao calcular frete');
      }

      setShippingOptions(data);
    } catch (error: any) {
      setShippingError(error.message);
    } finally {
      setIsCalculating(false);
    }
  };


  return (
    <div className="bg-[#F8F9FB] min-h-screen">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-8">
        <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1A3A5C]/40">
          <Link href="/" className="hover:text-[#C8A951] transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/produtos" className="hover:text-[#C8A951] transition-colors">{product.category}</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[#1A3A5C]">{product.name}</span>
        </nav>
      </div>

      <section className="container mx-auto px-6 pt-4 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Left: Gallery */}
          <div className="space-y-6">
            <motion.div 
              key={activeImageIndex}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square relative bg-white rounded-[40px] shadow-sm border border-white overflow-hidden group"
            >
              <Image 
                src={product.images?.[activeImageIndex] || product.image} 
                alt={product.name} 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                priority
                referrerPolicy="no-referrer"
              />
              {product.bestseller && (
                <div className="absolute top-8 left-8">
                  <span className="bg-[#C8A951] text-[#1A3A5C] px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg">Bestseller</span>
                </div>
              )}
            </motion.div>
            
            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImageIndex(i)}
                  className={`aspect-square relative bg-white rounded-2xl border-2 transition-all cursor-pointer hover:border-[#C8A951] overflow-hidden ${activeImageIndex === i ? 'border-[#C8A951]' : 'border-transparent'}`}
                >
                  <Image 
                    src={img} 
                    alt={`${product.name} thumbnail ${i + 1}`}
                    fill 
                    className={`object-cover ${activeImageIndex === i ? 'opacity-100' : 'opacity-60'}`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col h-full justify-start">
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-[#C8A951] font-bold text-[10px] uppercase tracking-[0.2em]">{product.category}</span>
                  <div className="flex items-center gap-1 text-[#C8A951]">
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <Star className="w-3 h-3 fill-current" />
                    <span className="text-[10px] font-bold text-[#1A3A5C]/40 ml-1">(4.9/5)</span>
                  </div>
                </div>
                <h1 className="text-[#1A3A5C] text-4xl md:text-5xl font-bold tracking-tight mb-2">{product.name}</h1>
                <p className="text-[#1A3A5C]/40 text-xs font-mono">REF: {product.ref}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-4">
                  <span className="text-[#1A3A5C] text-4xl font-bold">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                  <span className="text-[#1A3A5C]/30 text-lg line-through">R$ {(product.price * 1.25).toFixed(2).replace('.', ',')}</span>
                </div>
                <p className="text-[#1A3A5C]/60 text-sm">Ou em até <span className="text-[#1A3A5C] font-bold">10x de R$ {(product.price / 10).toFixed(2).replace('.', ',')}</span> sem juros</p>
              </div>

              <p className="text-[#1A3A5C]/70 text-base leading-relaxed max-w-lg">
                {product.shortDescription}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#1A3A5C]/40">Cores Disponíveis</span>
                    <span className="text-xs font-bold text-[#1A3A5C]">{selectedColor}</span>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`group relative p-1 rounded-full border-2 transition-all ${
                          selectedColor === color.name ? 'border-[#C8A951] scale-110' : 'border-transparent hover:border-[#DDE1E9]'
                        }`}
                        title={color.name}
                      >
                        <div 
                          className="w-10 h-10 rounded-full shadow-inner border border-black/5" 
                          style={{ backgroundColor: color.hex }}
                        />
                        {selectedColor === color.name && (
                          <motion.div 
                            layoutId="colorCheck"
                            className="absolute -top-1 -right-1 w-4 h-4 bg-[#C8A951] rounded-full flex items-center justify-center border-2 border-white"
                          >
                            <div className="w-1.5 h-1.5 bg-[#1A3A5C] rounded-full" />
                          </motion.div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}              {/* Purchase Actions & Consolidated Info */}
              <div className="space-y-6 pt-4">
                <div className="flex flex-wrap items-center gap-6">
                  {/* Quantity Stepper */}
                  <div className="flex items-center h-14 bg-white rounded-full border border-[#DDE1E9] px-2">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#F8F9FB] rounded-full transition-colors"
                    >
                      <Minus className="w-4 h-4 text-[#1A3A5C]" />
                    </button>
                    <span className="w-12 text-center font-bold text-[#1A3A5C]">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(q => q + 1)}
                      className="w-10 h-10 flex items-center justify-center hover:bg-[#F8F9FB] rounded-full transition-colors"
                    >
                      <Plus className="w-4 h-4 text-[#1A3A5C]" />
                    </button>
                  </div>

                  {/* Stock Status */}
                  <div className="flex flex-col gap-1 min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        (product.stock_quantity || 0) > 0 ? 'bg-emerald-500' : 'bg-rose-500'
                      }`} />
                      <span className={`text-[11px] font-bold uppercase tracking-wider ${
                        (product.stock_quantity || 0) > 0 ? 'text-emerald-500' : 'text-rose-500'
                      }`}>
                        {(product.stock_quantity || 0) > 0 ? 'Disponível em Estoque' : 'Esgotado'}
                      </span>
                    </div>
                    {(product.stock_quantity || 0) > 0 && (product.stock_quantity || 0) <= (product.min_stock || 5) && (
                      <span className="text-[10px] font-medium text-rose-500 italic">
                        Restam apenas {product.stock_quantity} unidades!
                      </span>
                    )}
                  </div>

                  <button 
                    onClick={() => {
                      addItem(product, quantity);
                    }}
                    className="h-14 flex-1 bg-[#1A3A5C] text-white rounded-full font-bold flex items-center justify-center gap-3 hover:bg-[#C8A951] transition-all duration-300 shadow-xl shadow-[#1A3A5C]/10 active:scale-95 px-8"
                  >
                    <ShoppingCart className="w-5 h-5" />
                    Adicionar ao Carrinho
                  </button>

                  <button
                    onClick={() => toggleFavorite(product)}
                    className="w-14 h-14 flex items-center justify-center rounded-full border border-[#DDE1E9] bg-white text-[#1A3A5C] hover:bg-[#F8F9FB] hover:text-[#C0392B] hover:border-[#C0392B] transition-all duration-300"
                    title={isFavorite(product.id) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                  >
                    <Heart className={`w-5 h-5 ${isFavorite(product.id) ? 'fill-[#C0392B] text-[#C0392B]' : ''}`} />
                  </button>
                </div>

                {/* Benefits List (Reintegrated & Compact) */}
                <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#DDE1E9]">
                  <div className="flex items-center gap-2">
                    <Truck className="w-4 h-4 text-[#C8A951]" />
                    <span className="text-[9px] font-bold text-[#1A3A5C] uppercase tracking-wider">Frete Rápido</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#C8A951]" />
                    <span className="text-[9px] font-bold text-[#1A3A5C] uppercase tracking-wider">Compra Segura</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <RotateCcw className="w-4 h-4 text-[#C8A951]" />
                    <span className="text-[9px] font-bold text-[#1A3A5C] uppercase tracking-wider">Troca Fácil</span>
                  </div>
                </div>

                {/* Shipping Calculator (Compacted) */}
                <div className="pt-2 space-y-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-[9px] font-bold text-[#1A3A5C]/40 uppercase tracking-[0.2em]">Calcular Frete e Prazo</label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#1A3A5C]/30" />
                        <input 
                          type="text" 
                          placeholder="00000-000"
                          value={cep}
                          onChange={(e) => setCep(e.target.value.replace(/\D/g, '').slice(0, 8))}
                          className="w-full h-10 bg-white rounded-l-full border border-[#DDE1E9] border-r-0 pl-10 pr-4 text-xs font-bold text-[#1A3A5C] focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951] outline-none transition-all"
                        />
                      </div>
                      <button 
                        onClick={handleCalculateShipping}
                        disabled={isCalculating || cep.length < 8}
                        className="h-10 px-6 bg-[#1A3A5C] text-white rounded-r-full font-bold text-[9px] uppercase tracking-widest hover:bg-[#C8A951] transition-all disabled:opacity-50 disabled:cursor-not-allowed -ml-px"
                      >
                        {isCalculating ? '...' : 'Calcular'}
                      </button>
                    </div>
                  </div>

                  {shippingError && (
                    <p className="text-red-500 text-[9px] font-bold uppercase tracking-wider">{shippingError}</p>
                  )}

                  {shippingOptions.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2 pt-1"
                    >
                      {shippingOptions.map((option) => (
                        <div key={option.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-[#DDE1E9] group hover:border-[#C8A951] transition-all">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 relative bg-white rounded-lg border border-[#DDE1E9] p-1">
                              <Image src={option.company_logo} alt={option.company} fill className="object-contain p-1" />
                            </div>
                            <div>
                              <p className="text-[10px] font-bold text-[#1A3A5C] line-clamp-1">{option.name}</p>
                              <p className="text-[8px] text-[#1A3A5C]/40 font-bold uppercase tracking-wider">Em {option.delivery_time} dias</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-bold text-[#1A3A5C]">R$ {option.price.toFixed(2).replace('.', ',')}</p>
                          </div>
                        </div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {/* Tabs (Description / Specs) (Compacted) */}
                <div className="pt-6 space-y-6">
                  <div className="flex gap-8 border-b border-[#DDE1E9]">
                    <button 
                      onClick={() => setActiveTab('descricao')}
                      className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'descricao' ? 'text-[#1A3A5C]' : 'text-[#1A3A5C]/40 hover:text-[#1A3A5C]'}`}
                    >
                      Descrição
                      {activeTab === 'descricao' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A951]" />}
                    </button>
                    <button 
                      onClick={() => setActiveTab('especificacoes')}
                      className={`pb-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative ${activeTab === 'especificacoes' ? 'text-[#1A3A5C]' : 'text-[#1A3A5C]/40 hover:text-[#1A3A5C]'}`}
                    >
                      Especificações
                      {activeTab === 'especificacoes' && <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C8A951]" />}
                    </button>
                  </div>

                  <div className="min-h-[100px]">
                    {activeTab === 'descricao' ? (
                      <div className="space-y-3">
                        <h3 className="text-sm font-bold text-[#1A3A5C]">Conheça o Produto</h3>
                        <div className="text-[#1A3A5C]/70 leading-relaxed text-sm whitespace-pre-line">
                          {product.description}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <h3 className="text-sm font-bold text-[#1A3A5C]">Detalhes Técnicos</h3>
                        <div className="grid grid-cols-1 gap-y-2">
                          {product.specifications.map((spec, i) => (
                            <div key={i} className="flex justify-between items-center py-2 border-b border-[#DDE1E9]/30">
                              <span className="text-[8px] font-bold uppercase tracking-wider text-[#1A3A5C]/40">{spec.label}</span>
                              <span className="text-[#1A3A5C] text-xs font-semibold">{spec.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-24 bg-[#F8F9FB]">
          <div className="container mx-auto px-6">
            <h2 className="text-[#1A3A5C] text-3xl font-bold tracking-tight mb-12">Quem viu também viu</h2>
            <div className="flex overflow-x-auto pb-4 gap-6 snap-x snap-mandatory lg:grid lg:grid-cols-4 lg:overflow-x-visible lg:gap-8 scrollbar-hide">
              {relatedProducts.map((p) => (
                <Link 
                  href={`/produto/${p.slug}`} 
                  key={p.id}
                  className="min-w-[280px] lg:min-w-0 snap-center bg-white rounded-[32px] p-6 shadow-sm hover:shadow-xl transition-all duration-500 group border border-white"
                >
                  <div className="aspect-square relative mb-6 group-hover:scale-105 transition-transform duration-500 overflow-hidden rounded-2xl">
                    <Image src={p.image} alt={p.name} fill className="object-cover" />
                  </div>
                  <div>
                    <span className="text-[#1A3A5C]/60 font-bold text-[9px] uppercase tracking-widest mb-2 block">{p.category}</span>
                    <h3 className="text-[#1A3A5C] font-bold text-lg mb-4 line-clamp-1">{p.name}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-[#1A3A5C] font-bold">R$ {p.price.toFixed(2).replace('.', ',')}</span>
                      <ChevronRight className="w-4 h-4 text-[#1A3A5C]" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
