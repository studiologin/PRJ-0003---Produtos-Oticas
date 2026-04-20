'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  LogOut, 
  Loader2, 
  Menu,
  X,
  Bell,
  Search,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Tag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchAdminUser = async () => {
      const isMock = sessionStorage.getItem('mock_auth_admin') === 'true';
      if (isMock) {
        setProfile({ full_name: 'Administrador', role: 'admin' });
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
        
      if (!profileData || profileData.role !== 'admin') {
        router.push('/'); // Not an admin
        return;
      }

      setProfile(profileData);
      setLoading(false);
    };

    fetchAdminUser();
  }, [router]);

  const handleLogout = async () => {
    if (sessionStorage.getItem('mock_auth_admin') === 'true') {
      sessionStorage.removeItem('mock_auth_admin');
      router.push('/login');
      return;
    }
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FB]">
        <Loader2 className="w-12 h-12 text-[#1A3A5C] animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Pedidos', href: '/admin/pedidos', icon: ShoppingBag },
    { name: 'Produtos', href: '/admin/produtos', icon: Package },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Relatórios', href: '/admin/relatorios', icon: BarChart2 },
    { name: 'Categorias', href: '/admin/categorias', icon: Tag },
    { name: 'Configurações', href: '/admin/configuracoes', icon: Settings },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full relative">
      {/* Botão de Recolher (Desktop) */}
      <button 
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="hidden lg:flex absolute top-8 -right-3 w-6 h-6 bg-[#C8A951] text-[#1A3A5C] rounded-full items-center justify-center shadow-lg hover:bg-white transition-all z-50 group border-2 border-[#1A3A5C]"
        title={isSidebarCollapsed ? "Expandir Menu" : "Recolher Menu"}
      >
        {isSidebarCollapsed ? (
          <ChevronRight className="w-3 h-3 group-hover:scale-125 transition-transform" />
        ) : (
          <ChevronLeft className="w-3 h-3 group-hover:scale-125 transition-transform" />
        )}
      </button>

      {/* Conteúdo Real do Sidebar com Fundo e Cantos Arredondados */}
      <div className="flex flex-col h-full bg-[#1A3A5C] text-white rounded-tr-[40px] rounded-br-[40px] overflow-hidden shadow-xl border-r border-white/5">
        <div className={`p-8 pb-4 transition-all duration-300 ${isSidebarCollapsed ? 'px-4 items-center flex flex-col' : ''}`}>
          {!isSidebarCollapsed && (
            <Link href="/" className="mb-10 px-2 block hover:opacity-80 transition-opacity">
              <Image 
                src="https://dcdn-us.mitiendanube.com/stores/006/909/950/themes/common/logo-131855825-1762198181-7154c71cb7dfed7f98631202f8a8e5b41762198181-640-0.webp" 
                alt="Produtos Óticas" 
                width={160} 
                height={40} 
                className="mb-2 object-contain brightness-0 invert"
                referrerPolicy="no-referrer"
              />
            </Link>
          )}
          {isSidebarCollapsed && (
            <Link href="/" className="mb-10 block hover:opacity-80 transition-opacity">
              <Image 
                src="https://jandmwnmaojswfwlrsva.supabase.co/storage/v1/object/public/Imagens%20do%20Site/PO-B.png" 
                alt="Produtos Óticas" 
                width={40} 
                height={40} 
                className="object-contain"
                referrerPolicy="no-referrer"
              />
            </Link>
          )}
        </div>

        <nav className="flex-1 px-4 space-y-2 overflow-y-auto custom-scrollbar">
          <div className={`px-4 text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 ${isSidebarCollapsed ? 'text-center hidden' : ''}`}>Gestão Principal</div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/admin');
            
            return (
              <Link 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                  isSidebarCollapsed ? 'justify-center' : 'gap-4'
                } ${
                  isActive 
                    ? 'bg-white text-[#1A3A5C] shadow-md' 
                    : 'text-white/60 hover:bg-white/10 hover:text-white'
                }`}
                title={isSidebarCollapsed ? link.name : undefined}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {!isSidebarCollapsed && <span>{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto border-t border-white/10">
          <button 
            onClick={handleLogout}
            className={`flex items-center px-4 py-3 w-full rounded-xl transition-all font-medium text-sm text-[#C0392B] hover:bg-[#FDEDEB]/10 ${isSidebarCollapsed ? 'justify-center' : 'gap-4'}`}
            title={isSidebarCollapsed ? "Sair" : undefined}
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {!isSidebarCollapsed && <span>Sair do Painel</span>}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex overflow-hidden">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#1A3A5C] text-white flex items-center justify-between px-4 z-40 shadow-sm">
        <div className="font-display font-medium text-lg">Admin P.O.</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-white">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 bottom-0 w-[280px] shadow-2xl"
            >
              {renderSidebarContent()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div 
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block h-screen shrink-0 relative z-40"
      >
        {renderSidebarContent()}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 w-full min-w-0 flex flex-col min-h-screen max-h-screen">
        {/* Top Header */}
        <header className="hidden lg:flex h-20 bg-transparent items-center justify-between px-8 shrink-0 sticky top-0 z-20">
          <div className="flex items-center gap-4 flex-1 max-w-xl">
             <div className="relative group w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A3A5C]/40 group-focus-within:text-[#1A3A5C] transition-colors" />
                <input 
                  type="text" 
                  placeholder="Buscar pedidos, produtos, clientes..."
                  className="w-full h-11 pl-12 pr-4 bg-white border border-[#DDE1E9] rounded-2xl focus:outline-none focus:border-[#C8A951] focus:ring-4 focus:ring-[#C8A951]/5 transition-all text-sm"
                />
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-[#1A3A5C]">{profile?.full_name}</span>
              <span className="text-[11px] text-[#C8A951] font-bold uppercase tracking-wider">Gestor da Loja</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#1A3A5C] text-[#C8A951] rounded-full flex items-center justify-center font-display font-medium text-lg uppercase shadow-sm border-2 border-white">
                {profile?.full_name?.charAt(0) || 'A'}
              </div>
              <button 
                onClick={handleLogout}
                title="Sair"
                className="w-10 h-10 flex items-center justify-center rounded-full text-[#C0392B] hover:bg-[#FDEDEB] transition-colors"
                >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8 pt-24 lg:pt-0 w-full overflow-y-auto">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
