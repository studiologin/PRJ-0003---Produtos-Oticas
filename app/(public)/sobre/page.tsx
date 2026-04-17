import Image from 'next/image';

export default function SobrePage() {
  return (
    <div className="bg-warm-white text-[#1A3A5C]">
      {/* Header Institucional */}
      <section className="py-24 md:py-32 bg-[#F5F4F0] rounded-b-[40px] md:rounded-b-[80px] relative z-30 shadow-xl">
        <div className="container mx-auto px-4 md:px-12 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Nossa História
          </h1>
          <p className="text-lg text-[#1A3A5C]/70 leading-relaxed">
            Desde 2010, a Produtos Óticas tem sido o parceiro de confiança para milhares de óticas em todo o Brasil, fornecendo insumos de alta qualidade com agilidade e precisão.
          </p>
        </div>
      </section>

      {/* Conteúdo Principal */}
      <section className="py-24 md:py-32 bg-warm-white -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-20 rounded-b-[40px] md:rounded-b-[80px] shadow-xl">
        <div className="container mx-auto px-4 md:px-12">
          <div className="flex flex-col md:flex-row items-center gap-16 mb-24">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F5F4F0]">
                <Image 
                  src="https://picsum.photos/seed/office/800/600" 
                  alt="Nosso escritório" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                Nossa Missão
              </h2>
              <p className="text-[#1A3A5C]/70 mb-4 text-sm leading-relaxed">
                Acreditamos que a visão é um dos sentidos mais preciosos. Nossa missão é capacitar óticas de todos os tamanhos com os melhores produtos do mercado, garantindo que o consumidor final tenha acesso a soluções ópticas de excelência.
              </p>
              <p className="text-[#1A3A5C]/70 text-sm leading-relaxed">
                Trabalhamos incansavelmente para otimizar nossa cadeia de suprimentos, oferecendo preços competitivos, estoque garantido e um atendimento B2B que entende as reais necessidades do lojista.
              </p>
            </div>
          </div>

          <div className="flex flex-col md:flex-row-reverse items-center gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[#F5F4F0]">
                <Image 
                  src="https://picsum.photos/seed/warehouse/800/600" 
                  alt="Nosso centro de distribuição" 
                  fill 
                  className="object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="text-2xl font-bold tracking-tight mb-4">
                Infraestrutura
              </h2>
              <p className="text-[#1A3A5C]/70 mb-4 text-sm leading-relaxed">
                Contamos com um centro de distribuição moderno e estrategicamente localizado, permitindo envios rápidos para todas as regiões do país. Nosso sistema de gestão de estoque é integrado em tempo real, garantindo que o que você vê no site é o que temos pronto para envio.
              </p>
              <ul className="space-y-3 text-[#1A3A5C]/70 text-sm">
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] mt-1.5 flex-shrink-0"></span>
                  <span>Mais de 10.000 itens em estoque permanente.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] mt-1.5 flex-shrink-0"></span>
                  <span>Parcerias diretas com as maiores fabricantes mundiais.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00B4D8] mt-1.5 flex-shrink-0"></span>
                  <span>Equipe técnica especializada para suporte B2B.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 md:py-32 bg-[#1A3A5C] text-white -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-10 rounded-b-[40px] md:rounded-b-[80px] shadow-2xl">
        <div className="container mx-auto px-4 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              Nossos Valores
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-[#1A3A5C] border border-[#C8A951]/30 p-8 rounded-lg text-center shadow-sm">
              <div className="w-12 h-12 bg-[#C8A951]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl">🎯</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Foco no Cliente</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                O sucesso da sua ótica é o nosso sucesso. Trabalhamos para facilitar o seu dia a dia.
              </p>
            </div>
            <div className="bg-[#1A3A5C] border border-[#C8A951]/30 p-8 rounded-lg text-center shadow-sm">
              <div className="w-12 h-12 bg-[#C8A951]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl">⭐</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Qualidade</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Apenas produtos originais e certificados. Não abrimos mão da excelência óptica.
              </p>
            </div>
            <div className="bg-[#1A3A5C] border border-[#C8A951]/30 p-8 rounded-lg text-center shadow-sm">
              <div className="w-12 h-12 bg-[#C8A951]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold text-white mb-3">Agilidade</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Processos otimizados para que seu pedido chegue o mais rápido possível.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
