'use client';

import { 
  Users, 
  Search, 
  Filter, 
  MoreHorizontal, 
  UserPlus, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle2 
} from 'lucide-react';

const clients = [
  { id: 1, name: 'Óptica Visão Real', type: 'PJ', email: 'contato@visaoreal.com.br', phone: '(11) 98765-4321', totalSpent: 15400.00, status: 'Ativo', group: 'Premium' },
  { id: 2, name: 'Carlos Eduardo Santos', type: 'PF', email: 'cadu.santos@gmail.com', phone: '(21) 99887-7665', totalSpent: 2450.50, status: 'Ativo', group: 'B2C' },
  { id: 3, name: 'Lentes & Cia Distribuidora', type: 'PJ', email: 'comercial@lentesecia.com', phone: '(31) 3456-7890', totalSpent: 42300.20, status: 'Ativo', group: 'Master' },
  { id: 4, name: 'Mariana Oliveira', type: 'PF', email: 'mari.oli@hotmail.com', phone: '(19) 97766-5544', totalSpent: 890.00, status: 'Inativo', group: 'B2C' },
  { id: 5, name: 'Ótica do Povo', type: 'PJ', email: 'loja@oticadopovo.com.br', phone: '(41) 3322-1100', totalSpent: 6780.00, status: 'Ativo', group: 'Standard' },
];

export default function AdminClientesPage() {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full flex flex-col">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A3A5C] mb-1">Gestão de Clientes</h1>
          <p className="text-[#1A3A5C]/60 text-sm">Gerencie sua base de clientes PF e PJ e grupos de preço.</p>
        </div>
        <button className="btn-primary btn-md w-full sm:w-auto flex items-center justify-center gap-2 font-medium">
          <UserPlus className="w-5 h-5" />
          <span>Novo Cliente</span>
        </button>
      </div>

      <div className="bg-white rounded-[16px] border border-[#e2e8f0] shadow-sm flex-1 flex flex-col overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-[#e2e8f0] flex flex-col sm:flex-row items-center justify-between gap-4 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA3B0]" />
            <input 
              type="text" 
              placeholder="Buscar por nome, e-mail ou CPF/CNPJ..." 
              className="w-full bg-[#F8F9FB] border border-[#DDE1E9] text-[#1E2A3A] text-sm rounded-lg pl-9 pr-4 py-2.5 focus:outline-none focus:border-[#C8A951] focus:ring-1 focus:ring-[#C8A951] transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button className="px-4 py-2.5 bg-white border border-[#DDE1E9] rounded-lg text-sm font-medium text-[#4A5568] flex items-center gap-2 hover:bg-[#F8F9FB] w-full sm:w-auto justify-center transition-colors">
              <Filter className="w-4 h-4" />
              <span>Tipo (PF/PJ)</span>
            </button>
            <button className="px-4 py-2.5 bg-white border border-[#DDE1E9] rounded-lg text-sm font-medium text-[#4A5568] flex items-center gap-2 hover:bg-[#F8F9FB] w-full sm:w-auto justify-center transition-colors">
              <Filter className="w-4 h-4" />
              <span>Grupo</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-[#e2e8f0]">
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Grupo / Faixa</th>
                <th className="px-6 py-4 text-xs font-bold text-[#4A5568] tracking-wider uppercase">Total Comprado</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e2e8f0]">
              {clients.map((client) => (
                <tr key={client.id} className="hover:bg-[#F8F9FB] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#1A3A5C]/5 flex items-center justify-center text-[#1A3A5C] text-sm font-bold border border-[#1A3A5C]/10">
                        {client.name.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#1A3A5C]">{client.name}</span>
                        <span className="text-[10px] font-bold text-[#C8A951] uppercase">{client.type}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#4A5568]">
                        <Mail className="w-3 h-3 text-[#9AA3B0]" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-[#4A5568]">
                        <Phone className="w-3 h-3 text-[#9AA3B0]" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest border ${
                      client.status === 'Ativo' 
                        ? 'bg-emerald-50 text-[#2D7D62] border-emerald-100' 
                        : 'bg-red-50 text-[#C0392B] border-red-100'
                    }`}>
                      {client.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[#4A5568] font-medium">{client.group}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#1A3A5C]">
                      R$ {client.totalSpent.toFixed(2).replace('.', ',')}
                    </span>
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
          <span className="text-sm text-[#4A5568]">Exibindo <span className="font-bold text-[#1A3A5C]">5</span> clientes de <span className="font-bold text-[#1A3A5C]">452</span></span>
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
