'use client';

import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock } from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, ease: "easeOut" as any }
};

export default function ContatoPage() {
  return (
    <div className="min-h-screen bg-warm-bg pt-12 pb-24">
      <div className="container mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16 md:mb-24"
        >
          <h1 className="text-4xl md:text-6xl font-display text-[#1A3A5C] mb-6">
            Vamos conversar?
          </h1>
          <p className="text-[#1A3A5C]/70 text-lg md:text-xl leading-relaxed">
            Estamos prontos para atender sua ótica. Seja para dúvidas, suporte técnico ou parcerias B2B, nossa equipe está à disposição.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[10px]">
          {/* Contact Info */}
          <motion.div 
            variants={{
              initial: { opacity: 0, x: -30 },
              whileInView: { opacity: 1, x: 0 }
            }}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-full"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px] h-full">
              <div className="bg-white p-8 rounded-[32px] border border-[#d1d5db] shadow-md hover:shadow-lg transition-shadow h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-[#1A3A5C]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Phone className="w-6 h-6 text-[#1A3A5C]" />
                </div>
                <h3 className="text-[#1A3A5C] font-bold text-lg mb-2">Telefone</h3>
                <p className="text-[#1A3A5C]/80 text-sm mb-4">Segunda a Sexta, das 8h às 18h.</p>
                <a href="tel:+5511999999999" className="text-[#C8A951] font-bold hover:underline">
                  (11) 99999-9999
                </a>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-[#d1d5db] shadow-md hover:shadow-lg transition-shadow h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-[#1A3A5C]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Mail className="w-6 h-6 text-[#1A3A5C]" />
                </div>
                <h3 className="text-[#1A3A5C] font-bold text-lg mb-2">E-mail</h3>
                <p className="text-[#1A3A5C]/80 text-sm mb-4">Respondemos em até 24 horas úteis.</p>
                <a href="mailto:contato@produtosoticas.com.br" className="text-[#C8A951] font-bold hover:underline break-all">
                  contato@produtosoticas.com.br
                </a>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-[#d1d5db] shadow-md hover:shadow-lg transition-shadow h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-[#1A3A5C]/10 rounded-2xl flex items-center justify-center mb-6">
                  <MapPin className="w-6 h-6 text-[#1A3A5C]" />
                </div>
                <h3 className="text-[#1A3A5C] font-bold text-lg mb-2">Endereço</h3>
                <p className="text-[#1A3A5C]/80 text-sm">
                  Av. Paulista, 1000 - 10º Andar<br />
                  Bela Vista, São Paulo - SP<br />
                  CEP: 01310-100
                </p>
              </div>

              <div className="bg-white p-8 rounded-[32px] border border-[#d1d5db] shadow-md hover:shadow-lg transition-shadow h-full flex flex-col justify-center">
                <div className="w-12 h-12 bg-[#1A3A5C]/10 rounded-2xl flex items-center justify-center mb-6">
                  <Clock className="w-6 h-6 text-[#1A3A5C]" />
                </div>
                <h3 className="text-[#1A3A5C] font-bold text-lg mb-2">Horário</h3>
                <p className="text-[#1A3A5C]/80 text-sm">
                  Seg - Sex: 08:00 - 18:00<br />
                  Sáb: 09:00 - 13:00<br />
                  Dom: Fechado
                </p>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div 
            variants={{
              initial: { opacity: 0, x: 30 },
              whileInView: { opacity: 1, x: 0 }
            }}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white p-8 md:p-12 rounded-[40px] border border-[#d1d5db] shadow-2xl h-full flex flex-col justify-center"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1A3A5C] uppercase tracking-widest ml-1">Nome Completo</label>
                  <input 
                    type="text" 
                    placeholder="Ex: João Silva"
                    className="w-full px-6 py-4 bg-warm-bg border border-[#d1d5db] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all text-[#1A3A5C] font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1A3A5C] uppercase tracking-widest ml-1">E-mail Corporativo</label>
                  <input 
                    type="email" 
                    placeholder="joao@suaotica.com.br"
                    className="w-full px-6 py-4 bg-warm-bg border border-[#d1d5db] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all text-[#1A3A5C] font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1A3A5C] uppercase tracking-widest ml-1">Telefone / WhatsApp</label>
                  <input 
                    type="tel" 
                    placeholder="(11) 99999-9999"
                    className="w-full px-6 py-4 bg-warm-bg border border-[#d1d5db] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all text-[#1A3A5C] font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#1A3A5C] uppercase tracking-widest ml-1">Assunto</label>
                  <select className="w-full px-6 py-4 bg-warm-bg border border-[#d1d5db] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all appearance-none cursor-pointer text-[#1A3A5C] font-medium">
                    <option>Parceria B2B</option>
                    <option>Dúvida sobre Produto</option>
                    <option>Suporte Técnico</option>
                    <option>Outros</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-[#1A3A5C] uppercase tracking-widest ml-1">Mensagem</label>
                <textarea 
                  rows={5}
                  placeholder="Como podemos ajudar sua ótica hoje?"
                  className="w-full px-6 py-4 bg-warm-bg border border-[#d1d5db] rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#1A3A5C]/20 focus:border-[#1A3A5C] transition-all resize-none text-[#1A3A5C] font-medium"
                ></textarea>
              </div>

              <button className="w-full py-5 bg-[#1A3A5C] text-white rounded-2xl font-bold text-lg shadow-xl hover:bg-[#2E5F8A] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 group">
                Enviar Mensagem
                <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
              
              <p className="text-center text-[#1A3A5C]/40 text-xs">
                Ao enviar, você concorda com nossos termos de uso e privacidade.
              </p>
            </form>
          </motion.div>
        </div>

        {/* WhatsApp CTA Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-12 md:mt-16 bg-[#1A3A5C] p-8 md:p-12 rounded-[40px] text-white relative overflow-hidden shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#C8A951]/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#C8A951]/5 rounded-full blur-3xl -ml-32 -mb-32" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-4 mb-6">
                <div className="w-12 h-12 bg-[#C8A951]/20 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="w-6 h-6 text-[#C8A951]" />
                </div>
                <h3 className="text-2xl md:text-3xl font-display">Suporte via WhatsApp</h3>
              </div>
              <p className="text-white/80 text-lg leading-relaxed">
                Precisa de uma resposta rápida? Fale diretamente com um de nossos consultores especializados agora mesmo. Estamos prontos para ajudar sua ótica a crescer.
              </p>
            </div>
            <button className="whitespace-nowrap bg-[#C8A951] text-[#1A3A5C] px-10 py-5 rounded-2xl font-bold text-lg hover:bg-[#D4B860] transition-all hover:scale-105 shadow-xl active:scale-95">
              Iniciar Conversa Agora
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
