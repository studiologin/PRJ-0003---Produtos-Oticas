'use client';

import { MapPin } from 'lucide-react';

export default function EnderecosPage() {
  return (
    <div className="p-6 md:p-12 mb-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-medium text-[#1A3A5C] mb-2">Meus Endereços</h1>
        <p className="text-[#1A3A5C]/60">Gerencie seus endereços para entrega.</p>
      </div>

      <div className="bg-white rounded-[40px] p-20 text-center border border-[#e2e8f0] shadow-sm">
        <div className="w-20 h-20 bg-[#F5F4F0] rounded-full flex items-center justify-center mx-auto mb-8 text-[#1A3A5C]/20">
          <MapPin className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A3A5C] mb-4">Nenhum endereço salvo</h3>
        <p className="text-[#1A3A5C]/60 max-w-sm mx-auto mb-10">
          Você ainda não possui endereços cadastrados ou o módulo está em desenvolvimento.
        </p>
        <button className="bg-[#1A3A5C] text-white px-10 py-4 rounded-2xl font-bold hover:bg-[#C8A951] transition-all inline-block shadow-lg">
          Adicionar Endereço
        </button>
      </div>
    </div>
  );
}
