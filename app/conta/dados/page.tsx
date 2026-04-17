'use client';

import { Construction, User } from 'lucide-react';

export default function DadosPage() {
  return (
    <div className="p-6 md:p-12 mb-20 max-w-7xl mx-auto">
      <div className="mb-12">
        <h1 className="text-3xl md:text-4xl font-display font-medium text-[#1A3A5C] mb-2">Meus Dados</h1>
        <p className="text-[#1A3A5C]/60">Gerencie suas informações pessoais e credenciais.</p>
      </div>

      <div className="bg-white rounded-[40px] p-20 text-center border border-[#e2e8f0] shadow-sm">
        <div className="w-20 h-20 bg-[#F5F4F0] rounded-full flex items-center justify-center mx-auto mb-8 text-[#1A3A5C]/20">
          <User className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-bold text-[#1A3A5C] mb-4">Módulo em Desenvolvimento</h3>
        <p className="text-[#1A3A5C]/60 max-w-sm mx-auto">
          A atualização de dados cadastrais estará disponível em breve.
        </p>
      </div>
    </div>
  );
}
