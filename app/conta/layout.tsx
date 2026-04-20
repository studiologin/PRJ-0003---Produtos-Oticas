'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Heart,
  LayoutDashboard, 
  ShoppingBag, 
  ClipboardList, 
  MapPin, 
  User as UserIcon, 
  LogOut, 
  Loader2, 
  ArrowLeft,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
  Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';

export default function ContaLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const isMock = sessionStorage.getItem('mock_auth') === 'true';
      if (isMock) {
        setProfile({ full_name: 'Manoel Silva', type: 'pf' });
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
        
      setProfile(profileData || { full_name: session.user.email?.split('@')[0] });
      setLoading(false);
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    if (sessionStorage.getItem('mock_auth') === 'true') {
      sessionStorage.removeItem('mock_auth');
      router.push('/login');
      return;
    }
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-warm-bg">
        <Loader2 className="w-12 h-12 text-[#1A3A5C] animate-spin" />
      </div>
    );
  }

  const navLinks = [
    { name: 'Dashboard', href: '/conta', icon: LayoutDashboard },
    { name: 'Meus Pedidos', href: '/conta/pedidos', icon: ShoppingBag },
    { name: 'Favoritos', href: '/conta/favoritos', icon: Heart },
    { name: 'Minhas Listas', href: '/conta/listas', icon: ClipboardList },
    { name: 'Endereços', href: '/conta/enderecos', icon: MapPin },
    { name: 'Meus Dados', href: '/conta/dados', icon: UserIcon },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full overflow-hidden text-white/90">
      <div className={`p-8 pb-4 transition-all duration-300 ${isSidebarCollapsed ? 'px-4 items-center flex flex-col' : ''}`}>
        <Link href="/" className={`inline-flex items-center gap-2 text-white/40 hover:text-white font-bold text-xs uppercase tracking-widest mb-10 transition-colors ${isSidebarCollapsed ? 'justify-center' : ''}`}>
          <ArrowLeft className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && <span>Voltar à Loja</span>}
        </Link>
        
        {!isSidebarCollapsed && (
          <Link href="/" className="mb-8 px-2 block hover:opacity-80 transition-opacity">
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
          <Link href="/" className="mb-6 block hover:opacity-80 transition-opacity">
            <Image 
              src="https://dcdn-us.mitiendanube.com/stores/006/909/950/themes/common/logo-131855825-1762198181-7154c71cb7dfed7f98631202f8a8e5b41762198181-640-0.webp" 
              alt="Produtos Óticas" 
              width={40} 
              height={40} 
              className="object-contain brightness-0 invert"
              referrerPolicy="no-referrer"
            />
          </Link>
        )}
      </div>

      <div className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        <h3 className={`text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4 px-4 ${isSidebarCollapsed ? 'text-center hidden' : ''}`}>
          Menu Principal
        </h3>
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link 
              key={link.href}
              href={link.href} 
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center px-4 py-3 rounded-xl transition-all font-medium ${
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
      </div>

      <div className="p-4 mt-auto border-t border-white/10 space-y-2">
        <button 
          onClick={handleLogout}
          className={`flex items-center px-4 py-3 w-full rounded-xl transition-all font-medium text-[#C0392B] hover:bg-[#FDEDEB]/10 ${isSidebarCollapsed ? 'justify-center' : 'gap-4'}`}
          title={isSidebarCollapsed ? "Sair" : undefined}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isSidebarCollapsed && <span>Sair da Conta</span>}
        </button>

        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className={`hidden lg:flex items-center px-4 py-3 w-full rounded-xl transition-all font-medium text-white/50 hover:bg-white/10 hover:text-white ${isSidebarCollapsed ? 'justify-center' : 'gap-4'}`}
          title={isSidebarCollapsed ? "Expandir Menu" : "Recolher Menu"}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          {!isSidebarCollapsed && <span>Recolher Menu</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F5F4F0] flex overflow-hidden">
      {/* Mobile Header & Menu */}
      <div className="lg:hidden absolute top-0 left-0 right-0 h-16 bg-[#1A3A5C] text-white flex items-center justify-between px-4 z-50">
        <div className="font-display font-medium text-lg">
          Produtos Óticas
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2">
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="absolute left-0 top-0 bottom-0 w-[280px] bg-[#1A3A5C] shadow-2xl pt-16">
              {renderSidebarContent()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <motion.div 
        animate={{ width: isSidebarCollapsed ? 80 : 280 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block bg-[#1A3A5C] h-screen shrink-0 relative rounded-tr-3xl rounded-br-3xl shadow-sm z-20"
      >
        {renderSidebarContent()}
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 max-h-screen">
        {/* Top Navbar */}
        <header className="hidden lg:flex h-20 px-8 items-center justify-between bg-transparent w-full z-10 sticky top-0 shrink-0">
          <div className="flex-1">
             {/* Left side empty or add breadcrumbs later */}
          </div>
          
          <div className="flex items-center gap-6">
            <button className="text-[#1A3A5C]/50 hover:text-[#1A3A5C] transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#C0392B] rounded-full border-2 border-[#F5F4F0]"></span>
            </button>
            <div className="h-6 w-px bg-[#DDE1E9]"></div>
            
            <div className="flex flex-col items-end">
              <span className="text-sm font-bold text-[#1A3A5C]">{profile?.full_name}</span>
              <span className="text-[11px] text-[#1A3A5C]/60 uppercase tracking-wider">Cliente {profile?.type === 'pj' ? 'B2B' : 'B2C'}</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-[#1A3A5C] text-[#C8A951] rounded-full flex items-center justify-center font-display font-medium text-lg uppercase shadow-sm">
                {profile?.full_name?.charAt(0) || 'U'}
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

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto w-full pt-20 lg:pt-0">
          {children}
        </div>
      </div>
    </div>
  );
}
