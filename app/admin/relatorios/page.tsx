'use client';

import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Target, 
  ShoppingBag, 
  Users 
} from 'lucide-react';

export default function AdminRelatoriosPage() {
  const kpis = [
    { title: 'Receita Total (Mês)', value: 'R$ 45.280,00', change: '+12.5%', trend: 'up', icon: TrendingUp },
    { title: 'Pedidos Realizados', value: '184', change: '+5.2%', trend: 'up', icon: ShoppingBag },
    { title: 'Ticket Médio', value: 'R$ 246,08', change: '-2.1%', trend: 'down', icon: Target },
    { title: 'Novos Clientes', value: '28', change: '+8.4%', trend: 'up', icon: Users },
  ];

  const topProducts = [
    { name: 'Lente Acuvue Oasys', sales: 124, revenue: 'R$ 18.587,60' },
    { name: 'Lente Biofinity (6 un)', sales: 98, revenue: 'R$ 14.690,20' },
    { name: 'Solução Renu Multiplus 355ml', sales: 85, revenue: 'R$ 4.250,00' },
    { name: 'Armação Ray-Ban Aviator', sales: 42, revenue: 'R$ 18.858,00' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Relatórios e Insights</h1>
          <p className="text-[#1A3A5C]/60 text-sm">Analise o desempenho de vendas e comportamento dos clientes.</p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button className="px-4 py-2.5 bg-white border border-[#DDE1E9] rounded-lg text-sm font-medium text-[#4A5568] flex items-center gap-2 hover:bg-[#F8F9FB] w-full sm:w-auto justify-center transition-colors">
            <Calendar className="w-4 h-4" />
            <span>Últimos 30 Dias</span>
          </button>
          <button className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium">
            <Download className="w-4 h-4" />
            <span>Gerar PDF</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-[#e2e8f0] shadow-sm group hover:border-[#C8A951] transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-[#1A3A5C]/5 text-[#1A3A5C] rounded-xl group-hover:bg-[#1A3A5C] group-hover:text-white transition-all">
                <kpi.icon className="w-5 h-5" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-bold ${kpi.trend === 'up' ? 'text-[#2D7D62]' : 'text-[#C0392B]'}`}>
                {kpi.change}
                {kpi.trend === 'up' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              </div>
            </div>
            <p className="text-xs font-bold text-[#9AA3B0] uppercase tracking-wider mb-1">{kpi.title}</p>
            <h3 className="text-xl font-bold text-[#1A3A5C]">{kpi.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <h3 className="font-bold text-[#1A3A5C]">Vendas no Período</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 mr-4">
                <div className="w-3 h-3 bg-[#1A3A5C] rounded-full"></div>
                <span className="text-xs text-[#4A5568]">Atual</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 bg-[#e2e8f0] rounded-full"></div>
                <span className="text-xs text-[#4A5568]">Anterior</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 flex items-end justify-between gap-4 px-2">
            {[65, 45, 75, 50, 90, 60, 80, 55, 70, 45, 85, 60].map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full relative h-[250px] flex items-end">
                   <div className="absolute inset-x-0 bottom-0 bg-[#e2e8f0] rounded-t-md transition-all group-hover:bg-[#DDE1E9]" style={{ height: `${val * 0.7}%` }}></div>
                   <div className="absolute inset-x-0 bottom-0 bg-[#1A3A5C] rounded-t-md transition-all group-hover:bg-[#00B4D8] z-10" style={{ height: `${val}%` }}></div>
                </div>
                <span className="text-[10px] font-bold text-[#9AA3B0] uppercase">{['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-2xl border border-[#e2e8f0] shadow-sm p-6">
          <h3 className="font-bold text-[#1A3A5C] mb-6">Top Produtos</h3>
          <div className="space-y-6">
            {topProducts.map((prod, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1A3A5C] line-clamp-1">{prod.name}</span>
                  <span className="text-xs text-[#9AA3B0]">{prod.sales} vendas</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-[#1A3A5C]">{prod.revenue}</span>
                  <div className="w-24 h-1.5 bg-[#F8F9FB] rounded-full mt-1.5 overflow-hidden">
                    <div className="h-full bg-[#C8A951]" style={{ width: `${100 - i * 15}%` }}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2.5 text-xs font-bold text-[#00B4D8] uppercase tracking-widest border border-[#00B4D8]/20 rounded-xl hover:bg-[#00B4D8]/5 transition-colors">
            Ver Relatório Completo
          </button>
        </div>
      </div>
    </div>
  );
}
