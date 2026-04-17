'use client';

import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle2, 
  Truck, 
  AlertCircle 
} from 'lucide-react';

const orders = [
  { id: '1084', date: '17/04/2026', customer: 'Óptica Visão Real', type: 'PJ', total: 1250.80, status: 'approved', payment: 'Pix' },
  { id: '1083', date: '17/04/2026', customer: 'Carlos Eduardo Santos', type: 'PF', total: 349.90, status: 'pending', payment: 'Boleto' },
  { id: '1082', date: '16/04/2026', customer: 'Lentes & Cia Distribuidora', type: 'PJ', total: 4200.00, status: 'shipped', payment: 'Cartão' },
  { id: '1081', date: '16/04/2026', customer: 'Mariana Oliveira', type: 'PF', total: 149.90, status: 'delivered', payment: 'Pix' },
  { id: '1080', date: '15/04/2026', customer: 'Ótica do Povo', type: 'PJ', total: 890.00, status: 'cancelled', payment: 'Boleto' },
];

export default function AdminPedidosPage() {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-[#2D7D62] text-[11px] font-bold uppercase tracking-widest border border-emerald-100">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Aprovado
          </div>
        );
      case 'pending':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#FEF3C7] text-[#D97706] text-[11px] font-bold uppercase tracking-widest border border-[#FDE68A]">
            <Clock className="w-3 h-3 mr-1.5" />
            Pendente
          </div>
        );
      case 'shipped':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[11px] font-bold uppercase tracking-widest border border-[#DBEAFE]">
            <Truck className="w-3 h-3 mr-1.5" />
            Enviado
          </div>
        );
      case 'delivered':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#F0FDF4] text-[#16A34A] text-[11px] font-bold uppercase tracking-widest border border-[#DCFCE7]">
            <CheckCircle2 className="w-3 h-3 mr-1.5" />
            Entregue
          </div>
        );
      case 'cancelled':
        return (
          <div className="inline-flex items-center px-2.5 py-1 rounded-full bg-red-50 text-[#C0392B] text-[11px] font-bold uppercase tracking-widest border border-red-100">
            <AlertCircle className="w-3 h-3 mr-1.5" />
            Cancelado
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Gestão de Pedidos</h1>
          <p className="text-[#1A3A5C]/60 text-sm">Gerencie vendas, status de entrega e faturamentos.</p>
        </div>
        <button className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium">
          <Download className="w-4 h-4" />
          <span>Exportar Relatório</span>
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0]" />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou Nº do pedido..." 
              className="w-full bg-[#F8F9FB] border border-[#DDE1E9] text-[#1E2A3A] text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="px-4 py-2.5 bg-white border border-[#DDE1E9] rounded-lg text-sm font-medium text-[#4A5568] flex items-center gap-2 hover:bg-[#F8F9FB] w-full sm:w-auto justify-center transition-colors">
              <Filter className="w-4 h-4" />
              <span>Mês Atual</span>
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
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Nº Pedido</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Data</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Pagamento</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Total</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-[#F8F9FB] transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-bold text-[#1A3A5C]">#{order.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4A5568]">{order.date}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {getStatusBadge(order.status)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#1A3A5C]">{order.customer}</span>
                      <span className="text-[10px] font-bold text-[#C8A951] uppercase">{order.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4A5568]">{order.payment}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1A3A5C]">
                      R$ {order.total.toFixed(2).replace('.', ',')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                       <button className="p-2 text-[#9AA3B0] hover:text-[#00B4D8] hover:bg-[#EFFEFE] rounded-lg transition-colors">
                        <Eye className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-[#9AA3B0] hover:text-[#1A3A5C] hover:bg-[#e2e8f0] rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="p-4 border-t border-[#e2e8f0] bg-[#F8F9FB] flex items-center justify-between">
          <span className="text-sm text-[#4A5568]">Exibindo <span className="font-bold text-[#1A3A5C]">5</span> pedidos de <span className="font-bold text-[#1A3A5C]">1.240</span></span>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-[#DDE1E9] bg-white rounded-md text-sm text-[#4A5568] hover:bg-[#F8F9FB] transition-colors">Anterior</button>
            <button className="px-3 py-1.5 bg-[#1A3A5C] text-white rounded-md text-sm font-medium shadow-sm">1</button>
            <button className="px-3 py-1.5 border border-[#DDE1E9] bg-white rounded-md text-sm text-[#4A5568] hover:bg-[#F8F9FB] transition-colors">Próximo</button>
          </div>
        </div>
      </div>
    </div>
  );
}
