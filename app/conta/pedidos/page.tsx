'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { motion } from 'motion/react';
import Link from 'next/link';
import { Package, Clock, ChevronRight, ShoppingBag, Loader2, ArrowLeft, Truck, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';

type OrderWithItems = {
  id: string;
  created_at: string;
  status: string;
  total: number;
  payment_method: string;
  order_items: {
    id: string;
    product_id: number;
    qty: number;
    unit_price: number;
  }[];
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderWithItems[]>([]);

  useEffect(() => {
    async function fetchOrders() {
      const isMock = sessionStorage.getItem('mock_auth') === 'true';
      if (isMock) {
        setOrders([
          {
            id: 'mock-123456-abc',
            created_at: new Date().toISOString(),
            status: 'processing',
            total: 1250.90,
            payment_method: 'credit_card',
            order_items: [
              { id: 'item-1', product_id: 101, qty: 1, unit_price: 250.00 },
              { id: 'item-2', product_id: 102, qty: 2, unit_price: 500.45 }
            ]
          },
          {
            id: 'mock-789012-xyz',
            created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'delivered',
            total: 450.00,
            payment_method: 'pix',
            order_items: [
              { id: 'item-3', product_id: 103, qty: 1, unit_price: 450.00 }
            ]
          }
        ]);
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setOrders(data);
      }
      setLoading(false);
    }

    fetchOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bg">
        <Loader2 className="w-12 h-12 text-[#1A3A5C] animate-spin" />
      </div>
    );
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'pending': return { label: 'Aguardando Pagamento', color: 'bg-[#FEF3C7] text-[#D97706]', icon: Clock };
      case 'processing': return { label: 'Em Processamento', color: 'bg-[#EFF6FF] text-[#2563EB]', icon: Package };
      case 'shipped': return { label: 'Enviado', color: 'bg-[#FDF2F2] text-[#C0392B]', icon: Truck };
      case 'delivered': return { label: 'Entregue', color: 'bg-[#E6F5F0] text-[#2D7D62]', icon: CheckCircle2 };
      default: return { label: 'Cancelado', color: 'bg-[#F5F5F5] text-[#737373]', icon: AlertCircle };
    }
  };

  return (
    <div className="p-6 md:p-12 mb-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-medium text-[#1A3A5C] mb-2">Meus Pedidos</h1>
        <p className="text-[#1A3A5C]/60">Acompanhe e gerencie o histórico de todas as suas compras.</p>
      </div>

      {orders.length === 0 ? (
            <div className="bg-white rounded-[40px] p-20 text-center border border-[#e2e8f0] shadow-sm">
              <div className="w-20 h-20 bg-[#F5F4F0] rounded-full flex items-center justify-center mx-auto mb-8 text-[#1A3A5C]/20">
                <ShoppingBag className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-[#1A3A5C] mb-4">Você ainda não tem pedidos</h3>
              <p className="text-[#1A3A5C]/60 mb-10 max-w-sm mx-auto">Sua história com a Produtos Óticas começa agora. Explore nosso catálogo de insumos ópticos.</p>
              <Link href="/categoria/todas" className="bg-[#1A3A5C] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#C8A951] transition-all inline-block shadow-lg">
                Começar a Comprar
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => {
                const statusInfo = getStatusInfo(order.status);
                const Icon = statusInfo.icon;

                return (
                  <motion.div 
                    key={order.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[40px] p-6 md:p-10 shadow-sm border border-[#e2e8f0] hover:shadow-xl transition-all group"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-6 pb-8 border-b border-[#e2e8f0] mb-8">
                       <div className="flex items-center gap-6">
                          <div>
                            <p className="text-[10px] font-bold text-[#1A3A5C]/40 uppercase tracking-widest mb-1">Pedido</p>
                            <p className="text-lg font-bold text-[#1A3A5C] font-mono">#{order.id.slice(0, 8).toUpperCase()}</p>
                          </div>
                          <div className="hidden sm:block w-px h-10 bg-[#e2e8f0]" />
                          <div className="hidden sm:block">
                            <p className="text-[10px] font-bold text-[#1A3A5C]/40 uppercase tracking-widest mb-1">Data</p>
                            <p className="text-sm font-bold text-[#1A3A5C]">{new Date(order.created_at).toLocaleDateString('pt-BR')}</p>
                          </div>
                       </div>

                       <div className={`px-4 py-2 rounded-2xl flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${statusInfo.color}`}>
                          <Icon className="w-4 h-4" />
                          {statusInfo.label}
                       </div>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-10">
                       <div className="flex flex-wrap gap-4">
                          {order.order_items.slice(0, 3).map((item, idx) => (
                             <div key={idx} className="w-16 h-16 bg-[#F5F4F0] rounded-2xl flex items-center justify-center p-2 relative">
                                <span className="absolute -top-2 -right-2 bg-[#1A3A5C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg border-2 border-white shadow-sm">
                                   {item.qty}x
                                </span>
                                <ShoppingBag className="w-6 h-6 text-[#1A3A5C]/20" />
                             </div>
                          ))}
                          {order.order_items.length > 3 && (
                            <div className="w-16 h-16 bg-[#F5F4F0] rounded-2xl flex items-center justify-center text-[#1A3A5C]/40 text-xs font-bold">
                               +{order.order_items.length - 3}
                            </div>
                          )}
                       </div>

                       <div className="flex items-center gap-12">
                          <div className="text-right">
                             <p className="text-[10px] font-bold text-[#1A3A5C]/40 uppercase tracking-widest mb-1">Total do Pedido</p>
                             <p className="text-2xl font-black text-[#1A3A5C]">R$ {order.total.toFixed(2).replace('.', ',')}</p>
                          </div>
                          <button className="w-12 h-12 rounded-full bg-[#1A3A5C]/5 text-[#1A3A5C] flex items-center justify-center group-hover:bg-[#1A3A5C] group-hover:text-white transition-all shadow-sm">
                             <ChevronRight className="w-6 h-6" />
                          </button>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
    </div>
  );
}
