'use client';

import { Package, ShoppingBag, Users, AlertTriangle, ArrowUpRight, ArrowDownRight, Truck } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  const kpis = [
    { 
      title: 'Receita Hoje', 
      value: 'R$ 4.580,00', 
      trend: '+12.5%', 
      isPositive: true, 
      icon: ShoppingBag, 
      color: 'bg-emerald-100 text-emerald-600' 
    },
    { 
      title: 'Pedidos Novos', 
      value: '14', 
      trend: '+3', 
      isPositive: true, 
      icon: Package, 
      color: 'bg-blue-100 text-blue-600' 
    },
    { 
      title: 'Estoque Crítico', 
      value: '8 un', 
      trend: '-2', 
      isPositive: false, 
      icon: AlertTriangle, 
      color: 'bg-amber-100 text-amber-600' 
    },
    { 
      title: 'Novos Clientes', 
      value: '5', 
      trend: 'Mesmo período', 
      isPositive: true, 
      icon: Users, 
      color: 'bg-purple-100 text-purple-600' 
    },
  ];

  const recentOrders = [
    { id: '#12389', date: 'Hoje, 14:30', client: 'Manoel Silva', total: 'R$ 1.250,90', status: 'pending' },
    { id: '#12388', date: 'Hoje, 11:15', client: 'Ótica Visão Plus', total: 'R$ 4.800,00', status: 'processing' },
    { id: '#12387', date: 'Ontem, 16:45', client: 'Joana Correia', total: 'R$ 340,50', status: 'shipped' },
    { id: '#12386', date: 'Ontem, 09:20', client: 'Lentes & Cia (B2B)', total: 'R$ 12.000,00', status: 'delivered' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Visão Geral</h1>
        <p className="text-[#1A3A5C]/60 text-sm">Resumo da sua loja nas últimas 24 horas.</p>
      </div>

      {/* KPIs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col justify-between">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${kpi.isPositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                  {kpi.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <div>
                <h3 className="text-[#1A3A5C]/60 text-sm font-bold mb-1">{kpi.title}</h3>
                <p className="text-2xl font-black text-[#1A3A5C]">{kpi.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Area */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="font-bold text-[#1A3A5C]">Receita Mensal</h2>
            <select className="bg-[#F8F9FB] border border-[#e2e8f0] text-[#1A3A5C] text-xs font-bold rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#C8A951]">
              <option>Últimos 30 dias</option>
              <option>Este Mês</option>
              <option>Ano Atual</option>
            </select>
          </div>
          <div className="p-6 flex-1 flex flex-col items-center justify-center min-h-[300px]">
             {/* CSS mock graph */}
             <div className="w-full flex items-end justify-between h-48 gap-2 mt-4 px-4 overflow-hidden">
                {[40, 25, 60, 45, 80, 55, 90, 70, 100, 85, 60, 40].map((h, i) => (
                  <div key={i} className="w-full bg-[#1A3A5C]/5 hover:bg-[#1A3A5C]/10 rounded-t-sm flex items-end relative group transition-colors">
                     <div style={{ height: `${h}%` }} className="w-full bg-[#1A3A5C] rounded-t-sm group-hover:bg-[#C8A951] transition-colors relative">
                        <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-[#1A3A5C] text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                          R$ {h * 100}
                        </span>
                     </div>
                  </div>
                ))}
             </div>
             <div className="w-full flex justify-between px-4 mt-4 text-[10px] font-bold text-[#1A3A5C]/40 uppercase">
                <span>Jan</span><span>Fev</span><span>Mar</span><span>Abr</span><span>Mai</span><span>Jun</span><span>Jul</span><span>Ago</span><span>Set</span><span>Out</span><span>Nov</span><span>Dez</span>
             </div>
          </div>
        </div>

        {/* Recent Orders List */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#e2e8f0] flex items-center justify-between">
            <h2 className="font-bold text-[#1A3A5C]">Pedidos Recentes</h2>
            <Link href="/admin/pedidos" className="text-[#1A3A5C]/60 hover:text-[#1A3A5C] text-sm font-bold">Ver todos</Link>
          </div>
          <div className="p-0 flex-1 overflow-auto max-h-[400px]">
            {recentOrders.map((order, idx) => (
              <div key={idx} className="p-4 border-b border-[#e2e8f0] last:border-b-0 hover:bg-[#F8F9FB] transition-colors flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#1A3A5C] font-mono">{order.id}</span>
                  <span className="text-[10px] text-[#1A3A5C]/40 uppercase tracking-widest">{order.date}</span>
                </div>
                <p className="text-sm font-medium text-[#1A3A5C] truncate">{order.client}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="font-bold text-[#1A3A5C]">{order.total}</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md
                    ${order.status === 'pending' ? 'bg-amber-100 text-amber-700' : ''}
                    ${order.status === 'processing' ? 'bg-blue-100 text-blue-700' : ''}
                    ${order.status === 'shipped' ? 'bg-purple-100 text-purple-700' : ''}
                    ${order.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : ''}
                  `}>
                    {order.status === 'pending' && 'Aguardando'}
                    {order.status === 'processing' && 'Em Prep.'}
                    {order.status === 'shipped' && 'Enviado'}
                    {order.status === 'delivered' && 'Entregue'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
