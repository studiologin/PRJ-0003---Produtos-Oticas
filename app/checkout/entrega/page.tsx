'use client';

import { useCheckoutStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';

const formSchema = z.object({
  cep: z.string().min(8, 'CEP inválido'),
  street: z.string().min(3, 'Rua é obrigatória'),
  number: z.string().min(1, 'Número é obrigatório'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Bairro é obrigatório'),
  city: z.string().min(2, 'Cidade é obrigatória'),
  state: z.string().length(2, 'UF precisa ter 2 letras'),
  shippingMethod: z.enum(['pac', 'sedex', 'jadlog']),
});

type FormData = z.infer<typeof formSchema>;

export default function CheckoutEntrega() {
  const router = useRouter();
  const { data: checkoutData, updateData } = useCheckoutStore();

  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cep: checkoutData.cep,
      street: checkoutData.street,
      number: checkoutData.number,
      complement: checkoutData.complement,
      neighborhood: checkoutData.neighborhood,
      city: checkoutData.city,
      state: checkoutData.state,
      shippingMethod: (checkoutData.shippingMethod as any) || 'pac',
    }
  });

  const selectedShipping = watch('shippingMethod');

  // Simple mock via cep function
  const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const cep = e.target.value.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          setValue('street', data.logradouro);
          setValue('neighborhood', data.bairro);
          setValue('city', data.localidade);
          setValue('state', data.uf);
        }
      } catch (error) {
        console.error('Erro ao buscar CEP', error);
      }
    }
  };

  const onSubmit = (data: FormData) => {
    // In a real app we'd calculate exact shipping here
    let shippingCost = 0;
    if (data.shippingMethod === 'sedex') shippingCost = 45.90;
    if (data.shippingMethod === 'pac') shippingCost = 22.50;
    if (data.shippingMethod === 'jadlog') shippingCost = 31.00;

    updateData({ ...data, shippingCost });
    router.push('/checkout/pagamento');
  };

  return (
    <div className="bg-white rounded-[24px] border border-[#e2e8f0] p-6 md:p-10">
       <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#1A3A5C]/5 text-[#1A3A5C] rounded-xl flex items-center justify-center shrink-0">
             <MapPin className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#1A3A5C]">Endereço de Entrega</h1>
            <p className="text-[#1A3A5C]/60 text-sm">Etapa 2 de 3</p>
          </div>
       </div>

       {/* Progress Bar */}
       <div className="flex gap-2 mb-10">
         <div className="h-2 flex-1 bg-[#1A3A5C] rounded-full" />
         <div className="h-2 flex-1 bg-[#1A3A5C] rounded-full" />
         <div className="h-2 flex-1 bg-[#e2e8f0] rounded-full" />
       </div>

       <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-4">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
               <div>
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">CEP *</label>
                 <input 
                   {...register('cep')} 
                   onBlur={handleCepBlur}
                   type="text" 
                   placeholder="00000-000"
                   className={`input w-full ${errors.cep ? 'input--error' : ''}`}
                 />
                 {errors.cep && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.cep.message}</p>}
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="md:col-span-3">
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">Rua *</label>
                 <input 
                   {...register('street')} 
                   type="text" 
                   placeholder="Nome da rua"
                   className={`input w-full ${errors.street ? 'input--error' : ''}`}
                 />
                 {errors.street && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.street.message}</p>}
               </div>
               <div>
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">Número *</label>
                 <input 
                   {...register('number')} 
                   type="text" 
                   placeholder="123"
                   className={`input w-full ${errors.number ? 'input--error' : ''}`}
                 />
                 {errors.number && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.number.message}</p>}
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div>
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">Complemento</label>
                 <input 
                   {...register('complement')} 
                   type="text" 
                   placeholder="Apto, Sala, Bloco"
                   className="input w-full"
                 />
               </div>
               <div>
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">Bairro *</label>
                 <input 
                   {...register('neighborhood')} 
                   type="text" 
                   placeholder="Bairro"
                   className={`input w-full ${errors.neighborhood ? 'input--error' : ''}`}
                 />
                 {errors.neighborhood && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.neighborhood.message}</p>}
               </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
               <div className="md:col-span-3">
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">Cidade *</label>
                 <input 
                   {...register('city')} 
                   type="text" 
                   placeholder="Cidade"
                   className={`input w-full ${errors.city ? 'input--error' : ''}`}
                 />
                 {errors.city && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.city.message}</p>}
               </div>
               <div>
                 <label className="block text-sm font-bold text-[#1A3A5C] mb-1">UF *</label>
                 <input 
                   {...register('state')} 
                   type="text" 
                   placeholder="SP"
                   maxLength={2}
                   className={`input w-full uppercase ${errors.state ? 'input--error' : ''}`}
                 />
                 {errors.state && <p className="text-[#C0392B] text-xs mt-1 font-medium">{errors.state.message}</p>}
               </div>
             </div>
          </div>

          <div className="space-y-4 pt-6 border-t border-[#e2e8f0]">
             <h2 className="text-lg font-bold text-[#1A3A5C]">Método de Entrega</h2>
             
             <div className="space-y-3">
                <label className={`flex items-center justify-between p-4 rounded-xl border ${selectedShipping === 'pac' ? 'border-[#1A3A5C] bg-[#1A3A5C]/5' : 'border-[#e2e8f0]'} cursor-pointer hover:bg-[#F8F9FB] transition-colors`}>
                   <div className="flex items-center gap-3">
                      <input type="radio" value="pac" {...register('shippingMethod')} className="w-5 h-5 accent-[#1A3A5C]" />
                      <div>
                         <span className="block font-bold text-[#1A3A5C]">Correios (PAC)</span>
                         <span className="text-sm text-[#1A3A5C]/60">Até 8 dias úteis</span>
                      </div>
                   </div>
                   <span className="font-bold text-[#1A3A5C]">R$ 22,50</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border ${selectedShipping === 'sedex' ? 'border-[#1A3A5C] bg-[#1A3A5C]/5' : 'border-[#e2e8f0]'} cursor-pointer hover:bg-[#F8F9FB] transition-colors`}>
                   <div className="flex items-center gap-3">
                      <input type="radio" value="sedex" {...register('shippingMethod')} className="w-5 h-5 accent-[#1A3A5C]" />
                      <div>
                         <span className="block font-bold text-[#1A3A5C]">Correios (Sedex)</span>
                         <span className="text-sm text-[#1A3A5C]/60">Até 3 dias úteis</span>
                      </div>
                   </div>
                   <span className="font-bold text-[#1A3A5C]">R$ 45,90</span>
                </label>

                <label className={`flex items-center justify-between p-4 rounded-xl border ${selectedShipping === 'jadlog' ? 'border-[#1A3A5C] bg-[#1A3A5C]/5' : 'border-[#e2e8f0]'} cursor-pointer hover:bg-[#F8F9FB] transition-colors`}>
                   <div className="flex items-center gap-3">
                      <input type="radio" value="jadlog" {...register('shippingMethod')} className="w-5 h-5 accent-[#1A3A5C]" />
                      <div>
                         <span className="block font-bold text-[#1A3A5C]">Jadlog (.Package)</span>
                         <span className="text-sm text-[#1A3A5C]/60">Até 6 dias úteis</span>
                      </div>
                   </div>
                   <span className="font-bold text-[#1A3A5C]">R$ 31,00</span>
                </label>
             </div>
          </div>

          <div className="pt-6 border-t border-[#e2e8f0] flex items-center justify-between">
             <Link href="/checkout/dados" className="text-[#1A3A5C]/60 hover:text-[#1A3A5C] font-bold text-sm">
               Voltar
             </Link>
             <button type="submit" className="btn-primary btn-xl flex items-center gap-2 group">
               Continuar para Pagamento
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </button>
          </div>
       </form>
    </div>
  );
}
