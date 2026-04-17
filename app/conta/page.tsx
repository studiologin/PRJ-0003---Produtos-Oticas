'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Package, Clock, ChevronRight, ShoppingBag, ShoppingCart, MapPin, ClipboardList, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import Link from 'next/link';
import Image from 'next/image';
import { useFavoritesStore, useCartStore } from '@/lib/store';

export default function ContaDashboardPage() {
  const [profile, setProfile] = useState<any>(null);
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { items: favoriteItems, toggleFavorite } = useFavoritesStore();
  const addItem = useCartStore(state => state.addItem);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const fetchDashboardData = async () => {
      const isMock = sessionStorage.getItem('mock_auth') === 'true';
      if (isMock) {
        setProfile({ full_name: 'Manoel Silva', type: 'pf' });
        setRecentOrder({
          id: 'mock-123456-abc',
          created_at: new Date().toISOString(),
          status: 'processing',
          total: 1250.90,
          order_items: [{}, {}, {}]
        });
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const [profileResponse, orderResponse] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', session.user.id).single(),
        supabase.from('orders')
          .select('*, order_items(*)')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single()
      ]);

      if (profileResponse.data) setProfile(profileResponse.data);
      if (orderResponse.data) setRecentOrder(orderResponse.data);
      
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  if (loading || !mounted) {
    return null; // Layout handles main loading state. A skeleton could be placed here.
  }

  const quickLinks = [
    { title: 'Meus Pedidos', desc: 'Acompanhe suas compras', href: '/conta/pedidos', icon: ShoppingBag, color: 'text-[#2563EB]', bg: 'bg-[#EFF6FF]' },
    { title: 'Minhas Listas', desc: 'Compras recorrentes B2B', href: '/conta/listas', icon: ClipboardList, color: 'text-[#D97706]', bg: 'bg-[#FEF3C7]' },
    { title: 'Meus Endereços', desc: 'Gerenciar entregas', href: '/conta/enderecos', icon: MapPin, color: 'text-[#2D7D62]', bg: 'bg-[#E6F5F0]' },
  ];

  return (
    <div className="p-6 md:p-12 mb-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-medium text-[#1A3A5C] mb-2">
          Olá, {profile?.full_name?.split(' ')[0] || 'Cliente'}
        </h1>
        <p className="text-[#1A3A5C]/60">Bem-vindo(a) ao seu painel de controle. Aqui você gerencia suas atividades.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {quickLinks.map((link, i) => {
          const Icon = link.icon;
          return (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={link.title}
            >
              <Link href={link.href} className="group block bg-white rounded-2xl p-6 border border-[#e2e8f0] shadow-sm hover:shadow-lg hover:border-[#1A3A5C]/20 transition-all">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${link.bg} ${link.color} mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <ChevronRight className="w-5 h-5 text-[#1A3A5C]/30 group-hover:text-[#1A3A5C] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="font-bold text-[#1A3A5C] text-lg mb-1">{link.title}</h3>
                <p className="text-[#1A3A5C]/60 text-sm">{link.desc}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-[32px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1A3A5C]">Último Pedido</h2>
            <p className="text-[#1A3A5C]/60 text-sm mt-1">Acompanhe seu pedido mais recente</p>
          </div>
          <Link href="/conta/pedidos" className="text-[#1A3A5C] text-sm font-bold hover:underline hidden sm:block">
            Ver Todos
          </Link>
        </div>

        <div className="p-6 md:p-8 bg-[#F8F9FB]">
          {recentOrder ? (
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-16 h-16 bg-white rounded-2xl border border-[#e2e8f0] flex items-center justify-center shadow-sm shrink-0">
                  <Package className="w-8 h-8 text-[#1A3A5C]" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <p className="font-bold text-[#1A3A5C] text-lg">#{recentOrder.id.slice(0, 8).toUpperCase()}</p>
                    <span className="bg-[#EFF6FF] text-[#2563EB] text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full">
                      {recentOrder.status === 'processing' ? 'Em Processamento' : 
                       recentOrder.status === 'pending' ? 'Aguardando Pagamento' : 
                       recentOrder.status === 'shipped' ? 'Enviado' : 
                       recentOrder.status === 'delivered' ? 'Entregue' : 'Cancelado'}
                    </span>
                  </div>
                  <p className="text-[#1A3A5C]/60 text-sm">
                    {new Date(recentOrder.created_at).toLocaleDateString('pt-BR')} • {recentOrder.order_items?.length || 0} Itens
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-left md:text-right">
                  <p className="text-[10px] font-bold text-[#1A3A5C]/40 uppercase tracking-widest mb-1">Total</p>
                  <p className="text-xl font-black text-[#1A3A5C]">R$ {recentOrder.total.toFixed(2).replace('.', ',')}</p>
                </div>
                <Link href={`/conta/pedidos`} className="w-12 h-12 rounded-full bg-white border border-[#e2e8f0] flex items-center justify-center hover:bg-[#1A3A5C] hover:text-white transition-all shadow-sm">
                  <ChevronRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e2e8f0] shadow-sm">
                <Clock className="w-8 h-8 text-[#1A3A5C]/20" />
              </div>
              <h3 className="text-[#1A3A5C] font-bold text-lg mb-2">Nenhum pedido recente</h3>
              <p className="text-[#1A3A5C]/60 mb-6">Você ainda não realizou compras em nossa loja.</p>
              <Link href="/categoria/todas" className="bg-[#1A3A5C] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#C8A951] transition-colors inline-block text-sm">
                Navegar pela Loja
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="mt-12 bg-white rounded-[32px] border border-[#e2e8f0] shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 border-b border-[#e2e8f0] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#1A3A5C]">Meus Favoritos Recentes</h2>
            <p className="text-[#1A3A5C]/60 text-sm mt-1">Produtos que você marcou com gostei</p>
          </div>
          <Link href="/conta/favoritos" className="text-[#1A3A5C] text-sm font-bold hover:underline hidden sm:block">
            Ver Todos
          </Link>
        </div>

        <div className="p-6 md:p-8 bg-[#F8F9FB]">
          {favoriteItems.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoriteItems.slice(0, 4).map(product => (
                <div key={product.id} className="bg-white rounded-[24px] p-5 shadow-sm border border-[#e2e8f0] flex flex-col h-full relative group">
                  <button
                    onClick={() => toggleFavorite(product)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-white shadow-sm border border-[#e2e8f0] rounded-full flex items-center justify-center text-[#C0392B] hover:bg-[#FDEDEB] hover:scale-110 transition-all"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>

                  <Link href={`/produto/${product.slug}`} className="flex-1 flex flex-col">
                    <div className="aspect-square relative mb-4 rounded-xl overflow-hidden bg-[#F8F9FB] group-hover:bg-[#EFF1F5] transition-colors">
                      <Image 
                        src={product.image} 
                        alt={product.name} 
                        fill 
                        className="object-contain p-2 mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div>
                      <span className="text-[#C8A951] font-bold text-[9px] uppercase tracking-widest mb-1 block">{product.category}</span>
                      <h3 className="text-[#1A3A5C] font-bold text-[13px] mb-2 line-clamp-2 leading-snug group-hover:text-[#C8A951] transition-colors">{product.name}</h3>
                    </div>
                  </Link>

                  <div className="mt-auto pt-3">
                    <span className="text-[#1A3A5C] font-black text-sm block mb-3">R$ {product.price.toFixed(2).replace('.', ',')}</span>
                    <button 
                      onClick={() => addItem(product)}
                      className="w-full bg-[#F5F4F0] text-[#1A3A5C] hover:bg-[#1A3A5C] hover:text-white transition-colors py-2 rounded-xl font-bold text-[12px] flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border border-[#e2e8f0] shadow-sm">
                <Heart className="w-8 h-8 text-[#1A3A5C]/20" />
              </div>
              <h3 className="text-[#1A3A5C] font-bold text-lg mb-2">Nenhum favorito recente</h3>
              <p className="text-[#1A3A5C]/60 mb-6">Explore nossos produtos e salve os que mais gostar.</p>
              <Link href="/categoria/todas" className="bg-[#1A3A5C] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#C8A951] transition-colors inline-block text-sm">
                Explorar Produtos
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
