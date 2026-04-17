'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ShoppingCart, User, Menu, X, LogOut, Package, Home, Info, Phone, ShoppingBag } from 'lucide-react';
import { useCartStore } from '@/lib/store';
import CartDrawer from '@/components/CartDrawer';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [session, setSession] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  const totalItems = useCartStore((state) => state.getTotalItems());
  const isCartOpen = useCartStore((state) => state.isDrawerOpen);
  const setDrawerOpen = useCartStore((state) => state.setDrawerOpen);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    setShowUserMenu(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-warm-bg">
      <header className={`sticky top-0 z-[100] w-full h-16 transition-all duration-500 rounded-b-3xl border-b border-[#e2e8f0] ${
        scrolled 
          ? 'bg-warm-white/60 backdrop-blur-lg shadow-lg h-14' 
          : 'bg-warm-white/95 backdrop-blur-md shadow-md h-16'
      }`}>
        <div className="container mx-auto px-6 md:px-12 h-full flex items-center justify-between">
          {/* Esquerda: Logo */}
          <div className="flex items-center w-1/4">
            <Link href="/" className="relative w-28 md:w-52 h-8 md:h-14 transition-transform hover:scale-105 -ml-2 sm:ml-0">
              <Image 
                src="https://dcdn-us.mitiendanube.com/stores/006/909/950/themes/common/logo-131855825-1762198181-7154c71cb7dfed7f98631202f8a8e5b41762198181-640-0.webp" 
                alt="Produtos Óticas" 
                fill 
                className="object-contain object-left"
                priority
                referrerPolicy="no-referrer"
              />
            </Link>
          </div>

          {/* Centro: Navegação Desktop */}
          <div className="flex-1 hidden lg:flex items-center justify-center gap-8">
            <nav className="flex items-center gap-8">
              <Link href="/" className="text-[#1A3A5C] opacity-70 hover:opacity-100 transition-opacity text-sm font-bold uppercase tracking-wider">Home</Link>
              <Link href="/sobre" className="text-[#1A3A5C] opacity-70 hover:opacity-100 transition-opacity text-sm font-bold uppercase tracking-wider">Sobre</Link>
              <Link href="/produtos" className="text-[#1A3A5C] opacity-70 hover:opacity-100 transition-opacity text-sm font-bold uppercase tracking-wider">Produtos</Link>
              <Link href="/contato" className="text-[#1A3A5C] opacity-70 hover:opacity-100 transition-opacity text-sm font-bold uppercase tracking-wider">Contato</Link>
            </nav>
          </div>

          {/* Direita: Ícones de Login e Checkout */}
          <div className="flex items-center justify-end gap-6 w-1/4">
            <div className="relative">
              {!session ? (
                <Link href="/login" className="text-[#1A3A5C] hover:opacity-70 transition-opacity flex items-center">
                  <User className="w-5 h-5" />
                </Link>
              ) : (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="text-[#1A3A5C] hover:text-[#C8A951] transition-colors flex items-center gap-2"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1A3A5C] text-white flex items-center justify-center text-[10px] font-bold">
                       {session.user.email?.slice(0, 2).toUpperCase()}
                    </div>
                  </button>

                  <AnimatePresence>
                    {showUserMenu && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-4 w-56 bg-white rounded-3xl shadow-2xl border border-[#e2e8f0] py-4 z-50 overflow-hidden"
                        >
                           <div className="px-6 pb-4 border-b border-[#e2e8f0] mb-2">
                              <p className="text-[10px] font-bold text-[#1A3A5C]/40 uppercase tracking-widest mb-1">E-mail</p>
                              <p className="text-xs font-bold text-[#1A3A5C] truncate">{session.user.email}</p>
                           </div>
                           
                           <Link 
                             href="/conta/pedidos" 
                             onClick={() => setShowUserMenu(false)}
                             className="flex items-center gap-3 px-6 py-3 hover:bg-[#F5F4F0] text-[#1A3A5C] transition-colors"
                           >
                             <Package className="w-4 h-4 text-[#C8A951]" />
                             <span className="text-sm font-bold">Meus Pedidos</span>
                           </Link>

                           <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-6 py-3 hover:bg-[#FDEDEB] text-[#C0392B] transition-colors mt-2"
                           >
                             <LogOut className="w-4 h-4" />
                             <span className="text-sm font-bold">Sair</span>
                           </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
            <button 
              onClick={() => setDrawerOpen(true)}
              className="text-[#1A3A5C] hover:opacity-70 transition-opacity relative flex items-center cursor-pointer"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5" />
                {mounted && totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#00B4D8] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-in zoom-in duration-300">
                    {totalItems}
                  </span>
                )}
              </div>
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <CartDrawer isOpen={isCartOpen} onClose={() => setDrawerOpen(false)} />

      <footer className="bg-warm-white text-[#1A3A5C]/70 py-12 md:py-16 -mt-10 md:-mt-20 pt-20 md:pt-32 relative z-0">
        <div className="container mx-auto px-4 md:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 text-sm text-center sm:text-left">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="relative w-52 h-16 sm:w-40 sm:h-12 mb-4 inline-block">
              <Image 
                src="https://dcdn-us.mitiendanube.com/stores/006/909/950/themes/common/logo-131855825-1762198181-7154c71cb7dfed7f98631202f8a8e5b41762198181-640-0.webp" 
                alt="Produtos Óticas" 
                fill 
                className="object-contain object-center sm:object-left"
                referrerPolicy="no-referrer"
              />
            </Link>
            <p className="leading-relaxed mb-6 max-w-sm mx-auto sm:mx-0">
              Tudo o que sua ótica precisa, em um só lugar. Distribuição e venda de insumos ópticos com qualidade e rapidez.
            </p>
          </div>
          <div>
            <h4 className="text-[#1A3A5C] font-semibold mb-5 md:mb-6 uppercase text-xs tracking-wider">Institucional</h4>
            <ul className="space-y-3 md:space-y-4">
              <li><Link href="/sobre" className="hover:text-[#1A3A5C] transition-colors">Sobre Nós</Link></li>
              <li><Link href="/contato" className="hover:text-[#1A3A5C] transition-colors">Contato</Link></li>
              <li><Link href="/parceiros" className="hover:text-[#1A3A5C] transition-colors">Seja um Parceiro</Link></li>
              <li><Link href="/blog" className="hover:text-[#1A3A5C] transition-colors">Blog</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#1A3A5C] font-semibold mb-5 md:mb-6 uppercase text-xs tracking-wider">Categorias</h4>
            <ul className="space-y-3 md:space-y-4">
              <li><Link href="/categoria/lentes" className="hover:text-[#1A3A5C] transition-colors">Lentes de Contato</Link></li>
              <li><Link href="/categoria/armacoes" className="hover:text-[#1A3A5C] transition-colors">Armações</Link></li>
              <li><Link href="/categoria/equipamentos" className="hover:text-[#1A3A5C] transition-colors">Equipamentos</Link></li>
              <li><Link href="/categoria/acessorios" className="hover:text-[#1A3A5C] transition-colors">Acessórios</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[#1A3A5C] font-semibold mb-5 md:mb-6 uppercase text-xs tracking-wider">Atendimento</h4>
            <ul className="space-y-3 md:space-y-4">
              <li>0800 123 4567</li>
              <li>contato@produtosoticas.com.br</li>
              <li>Seg - Sex, 8h às 18h</li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-4 md:px-12 mt-12 pt-8 border-t border-[#e2e8f0] flex flex-col md:flex-row items-center justify-between text-xs gap-4 md:gap-0">
          <p className="text-center md:text-left">&copy; {new Date().getFullYear()} Produtos Óticas. Todos os direitos reservados.</p>
          <p className="text-center">
            Desenvolvido pela <a href="https://studiologin.com.br/" target="_blank" rel="noopener noreferrer" className="font-bold hover:text-[#1A3A5C] transition-colors">Studio Login</a>
          </p>
          <div className="flex gap-6 md:gap-4">
            <Link href="/termos" className="hover:text-[#1A3A5C] transition-colors">Termos de Uso</Link>
            <Link href="/privacidade" className="hover:text-[#1A3A5C] transition-colors">Privacidade</Link>
          </div>
        </div>
      </footer>

      {/* Navbar Inferior Mobile */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-[100] bg-[#1A3A5C]/85 backdrop-blur-xl rounded-t-[2.5rem] border-t border-white/10 pb-safe-offset-2">
        <div className="flex items-center justify-around h-16 px-4">
          <Link href="/" className="flex flex-col items-center justify-center gap-1 text-white/60 hover:text-white transition-colors">
            <Home className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Início</span>
          </Link>
          <Link href="/sobre" className="flex flex-col items-center justify-center gap-1 text-white/60 hover:text-white transition-colors">
            <Info className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Sobre</span>
          </Link>
          <Link href="/produtos" className="flex flex-col items-center justify-center gap-1 text-white/60 hover:text-white transition-colors">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Produtos</span>
          </Link>
          <Link href="/contato" className="flex flex-col items-center justify-center gap-1 text-white/60 hover:text-white transition-colors">
            <Phone className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">Contato</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
