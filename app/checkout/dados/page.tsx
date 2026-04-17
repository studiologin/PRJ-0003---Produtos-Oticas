'use client';

import { useCheckoutStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, User } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  fullName: z.string().min(3, 'Nome completo é obrigatório'),
  email: z.string().email('E-mail inválido'),
  cpfCnpj: z.string().min(11, 'CPF/CNPJ inválido'),
  phone: z.string().min(10, 'Telefone inválido'),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutDados() {
  const router = useRouter();
  const { data: checkoutData, updateData } = useCheckoutStore();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: checkoutData.fullName,
      email: checkoutData.email,
      cpfCnpj: checkoutData.cpfCnpj,
      phone: checkoutData.phone,
    }
  });

  const onSubmit = (data: FormData) => {
    updateData(data);
    router.push('/checkout/entrega');
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6 md:p-10">
       <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#1A3A5C]/5 text-[#1A3A5C] rounded-xl flex items-center justify-center shrink-0">
             <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A5C]">Dados Pessoais</h1>
            <p className="text-[#1A3A5C]/60 text-sm">Etapa 1 de 3</p>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="flex gap-2 mb-10">
         <div className="h-2 flex-1 bg-[#1A3A5C] rounded-full" />
         <div className="h-2 flex-1 bg-[#e2e8f0] rounded-full" />
         <div className="h-2 flex-1 bg-[#e2e8f0] rounded-full" />
       </div>

       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
             <div>
               <label className="block text-sm font-bold text-[#1A3A5C] mb-1">E-mail *</label>
               <input 
                 {...register('email')} 
                 type="email" 
                 placeholder="seu@email.com"
                 className={`input w-full ${errors.email ? 'input--error' : ''}`}
               />
               {errors.email && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.email.message}</p>}
             </div>

             <div>
               <label className="block text-sm font-bold text-[#1A3A5C] mb-1">Nome Completo *</label>
               <input 
                 {...register('fullName')} 
                 type="text" 
                 placeholder="João da Silva"
                 className={`input w-full ${errors.fullName ? 'input--error' : ''}`}
               />
               {errors.fullName && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.fullName.message}</p>}
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">CPF ou CNPJ *</label>
                 <input 
                   {...register('cpfCnpj')} 
                   type="text" 
                   placeholder="000.000.000-00"
                   className={`input w-full ${errors.cpfCnpj ? 'input--error' : ''}`}
                 />
                 {errors.cpfCnpj && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.cpfCnpj.message}</p>}
               </div>
               <div>
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">Telefone/WhatsApp *</label>
                 <input 
                   {...register('phone')} 
                   type="text" 
                   placeholder="(11) 99999-9999"
                   className={`input w-full ${errors.phone ? 'input--error' : ''}`}
                 />
                 {errors.phone && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.phone.message}</p>}
               </div>
             </div>
          </div>

          <div className="pt-6 border-t border-[#e2e8f0] flex items-center justify-between">
             <Link href="/carrinho" className="text-[#1A3A5C]/60 hover:text-[#1A3A5C] font-bold text-sm">
               Voltar
             </Link>
             <button type="submit" className="btn-primary btn-xl flex items-center gap-2 group">
               Continuar para Entrega
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
       </form>
    </div>
  );
}
