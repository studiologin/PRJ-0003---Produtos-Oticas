'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Truck, ShieldCheck, Package, CreditCard, Search, ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { motion, useAnimation } from 'motion/react';
import { products as mockProducts, getFeaturedProducts, type Product } from '@/lib/products';
import { useFavoritesStore } from '@/lib/store';

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.6, ease: "easeOut" as any }
};

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const controls = useAnimation();
  const { toggleFavorite, isFavorite } = useFavoritesStore();

  useEffect(() => {
    const fetchFeatured = async () => {
      const data = await getFeaturedProducts();
      setFeaturedProducts(data);
    };
    fetchFeatured();
  }, []);

  const [scrollX, setScrollX] = useState(0);
  const maxScroll = -1200; // This should ideally be calculated based on content width

  const handleScroll = (direction: 'left' | 'right') => {
    const step = 344; // card width (320) + gap (24)
    let newX = direction === 'left' ? scrollX + step : scrollX - step;
    
    // Bounds checking
    if (newX > 0) newX = 0;
    if (newX < maxScroll) newX = maxScroll;
    
    setScrollX(newX);
    controls.start({ x: newX });
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative min-h-[600px] md:h-[700px] flex items-center bg-[#F5F4F0] rounded-b-[40px] md:rounded-b-[80px] z-50 shadow-xl overflow-hidden">
        {/* Background Image - Positioned to the right */}
        <div className="absolute inset-y-0 right-0 w-full md:w-3/5 z-0">
          <Image 
            src="https://dcdn-us.mitiendanube.com/stores/006/909/950/products/freepik__-promptname-aprimoramento-ptico-premium-preservao-__92197-882d361adfa5e7f14117655565073913-1024-1024.webp" 
            alt="Aprimoramento Óptico Premium" 
            fill 
            className="object-cover object-center md:object-right"
            priority
            referrerPolicy="no-referrer"
          />
          {/* Subtle gradient to blend image with the left side background */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#F5F4F0] via-[#F5F4F0]/20 to-transparent hidden md:block"></div>
          {/* Mobile overlay for readability */}
          <div className="absolute inset-0 bg-warm-white/40 md:hidden"></div>
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-[650px] text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-[#1A3A5C] text-4xl md:text-6xl lg:text-7xl leading-[1.1] tracking-tight font-bold mb-6 drop-shadow-sm">
                Tudo o que sua ótica precisa,<br className="hidden md:block" /> em um só lugar
              </h1>
              <p className="text-[#1A3A5C]/80 text-lg md:text-xl mb-10 font-medium leading-relaxed">
                Portfólio completo de lentes, armações e equipamentos com entrega rápida para todo o Brasil. O parceiro ideal para o seu negócio B2B.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
                <Link href="/categoria/todas" className="w-full sm:w-auto bg-[#1A3A5C] text-white px-10 py-4 rounded-full font-bold text-base hover:bg-[#C8A951] transition-all hover:shadow-lg active:scale-95 text-center shadow-md">
                  Ver Catálogo
                </Link>
                <Link href="/contato" className="w-full sm:w-auto bg-warm-white border-2 border-[#1A3A5C] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white px-10 py-4 rounded-full font-bold text-base transition-all active:scale-95 text-center shadow-sm">
                  Seja um Parceiro B2B
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-0 w-1/4 h-1/3 bg-[#C8A951]/5 skew-x-12 transform -translate-x-1/2 hidden md:block z-20"></div>
      </section>

      {/* Trust Bar */}
      <motion.section 
        initial="initial"
        whileInView="animate"
        viewport={{ once: true, margin: "-100px" }}
        variants={{
          animate: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="h-auto md:h-48 bg-[#1A3A5C] grid grid-cols-2 md:flex md:flex-row justify-around items-center py-16 md:py-0 gap-y-10 gap-x-4 md:gap-4 -mt-10 md:-mt-20 pt-20 md:pt-20 relative z-40 rounded-b-[40px] md:rounded-b-[80px] shadow-2xl border-t border-white/10"
      >
        {[
          { icon: Truck, title: "Entrega Rápida", desc: "Todo o Brasil" },
          { icon: ShieldCheck, title: "Compra Segura", desc: "Proteção Total" },
          { icon: Package, title: "Estoque Real", desc: "Pronta Entrega" },
          { icon: CreditCard, title: "Pagamento", desc: "Até 12x s/ Juros" }
        ].map((benefit, idx) => (
          <motion.div 
            key={idx}
            variants={{
              initial: { opacity: 0, y: 20 },
              animate: { opacity: 1, y: 0 }
            }}
            className="flex flex-col md:flex-row items-center md:items-center gap-3 md:gap-4 group transition-transform hover:scale-105"
          >
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center shadow-inner group-hover:bg-[#C8A951] group-hover:border-[#C8A951] transition-all duration-300">
              <benefit.icon className="w-6 h-6 text-white group-hover:text-[#1A3A5C]" />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left">
              <span className="text-white font-bold text-sm tracking-tight">{benefit.title}</span>
              <span className="text-white/60 text-[10px] uppercase tracking-widest font-semibold">{benefit.desc}</span>
            </div>
          </motion.div>
        ))}
      </motion.section>

      {/* A Marca Section (Autoridade e Confiança) */}
      <motion.section 
        {...fadeInUp}
        className="py-24 md:py-32 bg-white -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-35 rounded-b-[40px] md:rounded-b-[80px] shadow-xl overflow-hidden"
      >
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex flex-col lg:flex-row items-center gap-12 md:gap-20">
            {/* Image - Asymmetric Layout */}
            <div className="w-full lg:w-1/2 relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl z-10"
              >
                <Image 
                  src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000&auto=format&fit=crop" 
                  alt="Laboratório e Interior Produtos Óticas" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              {/* Decorative background element */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-[#C8A951] rounded-2xl -z-0 hidden md:block opacity-30"></div>
            </div>

            {/* Content */}
            <div className="w-full lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <span className="text-[#C8A951] font-bold uppercase tracking-[0.2em] text-xs mb-4 block">Autoridade e Confiança</span>
                <h2 className="text-[#1A3A5C] text-3xl md:text-5xl font-bold mb-6 leading-tight tracking-tight">
                  A Marca que entende a sua Ótica
                </h2>
                <div className="w-20 h-1 bg-[#C8A951] mb-8"></div>
                <p className="text-[#1A3A5C]/80 text-lg leading-relaxed mb-6">
                  Fundada com o propósito de elevar o padrão do mercado óptico brasileiro, a <strong className="text-[#1A3A5C]">Produtos Óticas</strong> combina tecnologia de ponta com um atendimento humano e especializado.
                </p>
                <p className="text-[#1A3A5C]/80 text-lg leading-relaxed mb-8">
                  Nossa infraestrutura conta com laboratórios modernos e um centro de distribuição otimizado, garantindo que cada insumo entregue atenda aos mais rigorosos critérios de qualidade e precisão para a saúde visual.
                </p>
                <div className="grid grid-cols-2 gap-8">
                  <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#e2e8f0]">
                    <h4 className="text-[#1A3A5C] font-bold text-2xl mb-1">+10 Anos</h4>
                    <p className="text-[#1A3A5C]/60 text-[10px] uppercase tracking-widest font-bold">De Experiência</p>
                  </div>
                  <div className="p-4 bg-[#F5F4F0] rounded-xl border border-[#e2e8f0]">
                    <h4 className="text-[#1A3A5C] font-bold text-2xl mb-1">5.000+</h4>
                    <p className="text-[#1A3A5C]/60 text-[10px] uppercase tracking-widest font-bold">Clientes B2B</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Categorias em Destaque Section (Navegação Visual) */}
      <motion.section 
        {...fadeInUp}
        className="py-24 md:py-40 bg-white -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-32 rounded-b-[40px] md:rounded-b-[80px] shadow-2xl overflow-hidden"
      >
        <div className="container mx-auto px-6 md:px-12">
          {/* Top Row: Content + Featured Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center mb-12">
            
            {/* Left: Content */}
            <div className="lg:col-span-5 space-y-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <span className="inline-block bg-[#C8A951]/10 text-[#C8A951] px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest mb-6">
                  Destaque + Qualidade
                </span>
                <h2 className="text-[#1A3A5C] text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                  Essenciais para sua visão e estilo diário.
                </h2>
                <p className="text-[#1A3A5C]/60 text-lg leading-relaxed mb-10">
                  Nossa seleção premium de lentes e armações combina tecnologia de ponta com design atemporal, garantindo conforto e nitidez em todos os momentos.
                </p>
                <Link 
                  href="/produtos" 
                  className="inline-flex items-center justify-center bg-[#1A3A5C] text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-[#C8A951] transition-all shadow-lg active:scale-95"
                >
                  Explorar Coleção Completa
                </Link>
              </motion.div>
            </div>

            {/* Right: Large Featured Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="lg:col-span-7 relative aspect-[16/10] bg-[#F5F4F0] rounded-[40px] overflow-hidden group shadow-sm"
            >
              <div className="absolute top-10 left-10 z-10">
                <span className="bg-white/80 backdrop-blur-md border border-[#1A3A5C]/10 text-[#1A3A5C] px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                  Linha Premium
                </span>
              </div>
              <Image 
                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?q=80&w=1200&auto=format&fit=crop" 
                alt="Óculos de Sol Premium" 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#1A3A5C]/20 to-transparent"></div>
            </motion.div>
          </div>

          {/* Bottom Row: Three Smaller Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {[
              {
                title: "Lentes de Contato",
                desc: "Conforto e liberdade para o seu dia.",
                img: "https://images.unsplash.com/photo-1582142306909-195724d33ffc?q=80&w=600&auto=format&fit=crop",
                slug: "lentes"
              },
              {
                title: "Linha Infantil",
                desc: "Resistência e cores para os pequenos.",
                img: "https://images.unsplash.com/photo-1502444330042-d1a1ddf9bb5b?q=80&w=600&auto=format&fit=crop",
                slug: "infantil"
              },
              {
                title: "Acessórios",
                desc: "Cuidados essenciais para seus óculos.",
                img: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=600&auto=format&fit=crop",
                slug: "acessorios"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group relative aspect-[4/3] rounded-[32px] overflow-hidden shadow-sm bg-[#F5F4F0]"
              >
                <Link href={`/categoria/${item.slug}`}>
                  <Image 
                    src={item.img} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A3A5C]/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8">
                    <h3 className="text-white text-xl font-bold mb-1">{item.title}</h3>
                    <p className="text-white/60 text-xs">{item.desc}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Engenharia e Qualidade Section (Estética Glassmorphism / Exploded View) */}
      <motion.section 
        {...fadeInUp}
        className="py-24 md:py-32 relative -mt-10 md:-mt-20 pt-20 md:pt-32 z-31 overflow-hidden"
      >
        {/* Background Image - Sharp but subtle */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="https://jandmwnmaojswfwlrsva.supabase.co/storage/v1/object/public/Imagens%20do%20Site/bg-po.png" 
            alt="Optical Lab Background" 
            fill 
            className="object-cover"
            priority
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[40px] md:rounded-[60px] p-8 md:py-8 md:px-20 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              
              {/* Left Side: Content */}
              <div className="space-y-10">
                <div>
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-[#1A3A5C]/60 font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block"
                  >
                    Personalização B2B
                  </motion.span>
                  <h2 className="text-[#1A3A5C] text-4xl md:text-5xl font-bold tracking-tight leading-tight mb-6">
                    Sua marca em cada detalhe com <span className="text-[#C8A951]">acessórios exclusivos.</span>
                  </h2>
                </div>

                {/* Stat Box */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="inline-flex items-center gap-8 bg-white/60 backdrop-blur-md border border-white/40 rounded-3xl p-8 shadow-lg"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="bg-[#1A3A5C] text-white text-[10px] font-bold px-2 py-0.5 rounded-sm">LOGO HD</span>
                      <span className="text-[#1A3A5C] font-bold text-sm">Fidelidade de Marca</span>
                    </div>
                    <p className="text-[#1A3A5C]/60 text-xs">Impressão de alta definição</p>
                  </div>
                  <div className="flex items-center gap-2 text-[#1A3A5C]">
                    <div className="w-10 h-10 rounded-full bg-[#C8A951] flex items-center justify-center">
                      <ChevronRight className="w-5 h-5 text-white rotate-[-90deg]" />
                    </div>
                    <span className="text-3xl font-black">100%</span>
                  </div>
                </motion.div>

                <p className="text-[#1A3A5C]/50 text-xs italic">
                  *Consulte quantidades mínimas para personalização.
                </p>
              </div>

              {/* Right Side: Floating Product Visual */}
              <div className="relative">
                <div className="relative flex items-center justify-center py-10 md:py-20">
                  {/* Product Glow */}
                  <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 w-64 h-64 bg-[#C8A951]/10 blur-[80px] rounded-full mx-auto"></div>
                  
                  <motion.div 
                    animate={{ 
                      y: [0, -20, 0],
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    className="relative w-80 md:w-[560px] aspect-[4/3] z-10"
                  >
                    <Image 
                      src="https://jandmwnmaojswfwlrsva.supabase.co/storage/v1/object/public/Imagens%20do%20Site/suamarca-PO.png" 
                      alt="Personalized Case and Cloth" 
                      fill 
                      className="object-contain drop-shadow-[0_25px_25px_rgba(0,0,0,0.15)]"
                      referrerPolicy="no-referrer"
                    />
                  </motion.div>
                  
                  {/* Floating Labels */}
                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="absolute top-0 md:top-6 right-0 md:right-20 z-20 bg-white/80 backdrop-blur-md p-5 rounded-[24px] shadow-2xl border border-white/50 max-w-[180px]"
                  >
                    <p className="text-[10px] font-bold text-[#1A3A5C] uppercase tracking-wider mb-2">Acabamento Superior</p>
                    <p className="text-[10px] text-[#1A3A5C]/60 leading-relaxed">Estojos premium com interior aveludado para proteção total.</p>
                    <div className="w-10 h-0.5 bg-[#C8A951]/30 mt-3"></div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="absolute bottom-0 md:bottom-6 left-0 md:left-20 z-20 bg-white/80 backdrop-blur-md p-5 rounded-[24px] shadow-2xl border border-white/50 max-w-[180px]"
                  >
                    <p className="text-[10px] font-bold text-[#1A3A5C] uppercase tracking-wider mb-2">Sua Logo em HD</p>
                    <p className="text-[10px] text-[#1A3A5C]/60 leading-relaxed">Personalização têxtil e metálica com fidelidade de cores.</p>
                    <div className="w-10 h-0.5 bg-[#C8A951]/30 mt-3"></div>
                  </motion.div>

                  {/* Micro Indicators */}
                  <div className="absolute top-1/4 left-1/4 w-2 h-2 rounded-full bg-[#C8A951] animate-ping"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-2 h-2 rounded-full bg-[#C8A951] animate-ping delay-700"></div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </motion.section>

      {/* Catalog Section (Featured Products Carousel) */}
      <motion.section 
        {...fadeInUp}
        className="flex-1 py-20 md:py-32 px-4 md:px-12 bg-warm-white -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-30 rounded-b-[40px] md:rounded-b-[80px] shadow-xl overflow-hidden"
      >
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-[#1A3A5C] font-bold uppercase tracking-[0.2em] text-[10px] mb-2 block">Destaques</span>
              <h2 className="text-[#1A3A5C] text-3xl md:text-4xl font-bold tracking-tight">
                Mais Vendidos
              </h2>
            </div>
            <Link href="/produtos" className="text-[#1A3A5C]/70 text-[13px] font-bold uppercase tracking-wider hover:text-[#1A3A5C] transition-colors">
              Ver Catálogo Completo &rarr;
            </Link>
          </div>

          {/* Carousel Container */}
          <div className="relative group/carousel">
            {/* Navigation Arrows */}
            <div className="absolute top-1/2 -left-4 md:-left-8 z-40 -translate-y-1/2 hidden md:block">
              <button 
                onClick={() => handleScroll('left')}
                className="bg-white text-[#1A3A5C] p-4 rounded-full shadow-xl hover:bg-[#C8A951] transition-all active:scale-90 border border-[#e2e8f0]"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute top-1/2 -right-4 md:-right-8 z-40 -translate-y-1/2 hidden md:block">
              <button 
                onClick={() => handleScroll('right')}
                className="bg-white text-[#1A3A5C] p-4 rounded-full shadow-xl hover:bg-[#C8A951] transition-all active:scale-90 border border-[#e2e8f0]"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <motion.div 
              drag="x"
              animate={controls}
              dragConstraints={{ right: 0, left: maxScroll }} 
              onDragEnd={(_, info) => {
                // Sync the scrollX state after drag ends to keep buttons working correctly
                // We use the offset or just the latest value from onUpdate
              }}
              onUpdate={(latest) => {
                if (typeof latest.x === 'number') {
                  setScrollX(latest.x);
                }
              }}
              className="flex gap-6 cursor-grab active:cursor-grabbing px-2"
            >
              {featuredProducts.map((product) => (
                <motion.div 
                  key={product.id} 
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="min-w-[280px] md:min-w-[320px] rounded-[32px] group transition-all duration-500 bg-[#1A3A5C] shadow-xl relative flex flex-col items-center text-center border border-white/5 overflow-hidden"
                >
                  <div className="w-full h-full p-8 relative">
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      className={`absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md border border-white/10
                        ${isFavorite(product.id) ? 'bg-white/20 text-[#C0392B]' : 'bg-white/5 text-white/50 hover:bg-white/20 hover:text-white'}
                      `}
                      title={isFavorite(product.id) ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
                    >
                      <Heart className={`w-4 h-4 ${isFavorite(product.id) ? 'fill-current' : ''}`} />
                    </button>

                    <Link href={`/produto/${product.slug}`} className="block w-full h-full relative z-10">
                      {/* Badge */}
                      <div className="absolute -top-2 -left-2 z-10">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          product.bestseller ? 'bg-white text-[#1A3A5C] shadow-lg' : 'bg-white/10 text-white backdrop-blur-md'
                        }`}>
                          {product.bestseller ? 'Bestseller' : product.new ? 'Novo' : 'Oferta'}
                        </span>
                      </div>

                      {/* Product Info Top */}
                      <div className="mb-8 mt-4">
                        <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 block">Ref: {product.ref}</span>
                        <h3 className="text-white text-xl font-bold tracking-tight group-hover:text-white/70 transition-colors">{product.name}</h3>
                      </div>

                      {/* Product Image */}
                      <div className="w-full aspect-square relative mb-8 group-hover:scale-110 transition-transform duration-700 ease-out">
                        <Image 
                          src={product.image} 
                          alt={product.name} 
                          fill 
                          className="object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.3)]"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* CTA Button "Styled" */}
                      <div className="w-full bg-white text-[#1A3A5C] py-4 rounded-full font-bold text-sm group-hover:bg-[#1A3A5C] group-hover:text-white transition-all shadow-lg mb-4">
                        Ver Detalhes &rarr;
                      </div>

                      {/* Price */}
                      <div className="text-white/60 text-xs font-medium">
                        A partir de <span className="text-white font-bold ml-1">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                      </div>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            
            {/* Scroll Hint */}
            <div className="mt-10 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className={`h-1 rounded-full transition-all duration-300 ${scrollX >= -100 ? 'w-12 bg-[#1A3A5C]' : 'w-2 bg-[#1A3A5C]/20'}`}></div>
                <div className={`h-1 rounded-full transition-all duration-300 ${scrollX < -100 && scrollX > -800 ? 'w-12 bg-[#1A3A5C]' : 'w-2 bg-[#1A3A5C]/20'}`}></div>
                <div className={`h-1 rounded-full transition-all duration-300 ${scrollX <= -800 ? 'w-12 bg-[#1A3A5C]' : 'w-2 bg-[#1A3A5C]/20'}`}></div>
              </div>
              <div className="flex items-center gap-3 text-[#1A3A5C]">
                <ChevronLeft 
                  onClick={() => handleScroll('left')}
                  className="w-5 h-5 hover:text-[#1A3A5C]/60 cursor-pointer transition-colors" 
                />
                <ChevronRight 
                  onClick={() => handleScroll('right')}
                  className="w-5 h-5 hover:text-[#1A3A5C]/60 cursor-pointer transition-colors" 
                />
              </div>
            </div>
          </div>
        </div>
      </motion.section>
      
      {/* B2B Section */}
      <motion.section 
        {...fadeInUp}
        className="py-24 md:py-32 bg-[#1A3A5C] text-white -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-10 rounded-b-[40px] md:rounded-b-[80px] shadow-2xl"
      >
         <div className="container mx-auto px-4 md:px-12 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Gere mais valor para sua ótica</h2>
            <p className="text-white/80 text-lg mb-10 leading-relaxed">
              Cadastre-se como parceiro B2B e tenha acesso a tabelas de preços exclusivas, faturamento facilitado e atendimento dedicado.
            </p>
            <Link href="/contato" className="inline-flex bg-[#C8A951] text-[#1A3A5C] hover:bg-[#C8A951]/90 px-8 py-3.5 rounded-md font-bold text-sm transition-colors shadow-sm">
              Quero ser Parceiro
            </Link>
         </div>
      </motion.section>
    </>
  );
}
