'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, Lock, User, FileText, ArrowRight, ArrowLeft, Loader2, AlertCircle, Eye, EyeOff, Phone } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpfCnpj, setCpfCnpj] = useState('');
  const [userType, setUserType] = useState<'pf' | 'pj'>('pf');

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin can be added here if needed for security
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        router.refresh();
        router.push('/carrinho');
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        // Intercept mock user for testing purpose
        if (email.trim().toLowerCase() === 'manoel@gmail.com' && password === '123456') {
          sessionStorage.setItem('mock_auth', 'true');
          router.push('/conta');
          return;
        }

        // Intercept mock admin
        if (email.trim().toLowerCase() === 'admin@gmail.com' && password === '123456') {
          sessionStorage.setItem('mock_auth_admin', 'true');
          router.push('/admin');
          return;
        }

        const { error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (loginError) throw loginError;
        router.push('/carrinho');
      } else {
        // Validation
        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }

        // SignUp logic
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
        });
        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // Create or update profile
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: signUpData.user.id,
            full_name: fullName,
            cpf_cnpj: cpfCnpj,
            whatsapp: whatsapp,
            type: userType,
            role: 'client'
          });
          if (profileError) throw profileError;
        }
        
        setMode('login');
        setError('Conta criada! Por favor, verifique seu e-mail para confirmar a conta.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          skipBrowserRedirect: true,
        }
      });
      
      if (error) throw error;

      if (data?.url) {
        const width = 600;
        const height = 700;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        
        const popup = window.open(
          data.url,
          'google_login_popup',
          `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`
        );

        if (!popup) {
          throw new Error('O bloqueador de popups impediu a janela de abrir. Por favor, permita popups para este site.');
        }
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao entrar com Google');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg flex">
      {/* Left side: Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1A3A5C] relative overflow-hidden items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20">
          <Image 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1000" 
            alt="Optical Branding" 
            fill 
            className="object-cover"
          />
        </div>
        <div className="relative z-10 max-w-md text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <Link href="/">
               <Image 
                 src="https://dcdn-us.mitiendanube.com/stores/006/909/950/themes/common/logo-131855825-1762198181-7154c71cb7dfed7f98631202f8a8e5b41762198181-640-0.webp" 
                 alt="Produtos Óticas" 
                 width={300}
                 height={80}
                 className="mx-auto brightness-0 invert mb-12"
               />
            </Link>
            <h2 className="text-white text-3xl font-display font-medium mb-6">Excelência em cada detalhe visual</h2>
            <p className="text-white/60 leading-relaxed font-light">
              Acesse sua conta para gerenciar seus pedidos, listas de compras e aproveitar condições exclusivas para parceiros B2B.
            </p>
          </motion.div>
        </div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#C8A951]/20 rounded-full blur-[100px]" />
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12 relative">
        <div className="w-full max-w-md pt-8 lg:pt-0">
          <Link href="/" className="inline-flex items-center gap-2 text-[#1A3A5C]/50 hover:text-[#1A3A5C] font-bold text-xs uppercase tracking-widest mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Voltar para a home
          </Link>
          <div className="mb-10 text-center lg:text-left">
            <Link href="/" className="lg:hidden inline-block mb-8">
              <Image 
                src="https://dcdn-us.mitiendanube.com/stores/006/909/950/themes/common/logo-131855825-1762198181-7154c71cb7dfed7f98631202f8a8e5b41762198181-640-0.webp" 
                alt="Produtos Óticas" 
                width={200}
                height={50}
              />
            </Link>
            <h1 className="text-[#1A3A5C] text-3xl font-bold font-display mb-2">
              {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
            </h1>
            <p className="text-[#1A3A5C]/60">
              {mode === 'login' ? 'Acesse sua conta para continuar' : 'Preencha seus dados para começar'}
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.form 
              key={mode}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onSubmit={handleAuth}
              className="space-y-5"
            >
              {error && (
                <div className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${error.includes('Conta criada') ? 'bg-[#E6F5F0] text-[#2D7D62]' : 'bg-[#FDEDEB] text-[#C0392B]'}`}>
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {mode === 'register' && (
                <div className="space-y-5">
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3A5C]/30" />
                    <input 
                      type="text" 
                      required
                      placeholder="Nome completo"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full h-14 bg-white border border-[#e2e8f0] rounded-2xl pl-12 pr-4 text-[#1A3A5C] font-medium outline-none focus:border-[#C8A951] transition-all"
                    />
                  </div>

                  <div className="flex bg-[#F5F4F0] p-1 rounded-2xl border border-[#e2e8f0]">
                    <button 
                      type="button"
                      onClick={() => setUserType('pf')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${userType === 'pf' ? 'bg-white text-[#1A3A5C] shadow-sm' : 'text-[#1A3A5C]/40'}`}
                    >
                      Pessoa Física
                    </button>
                    <button 
                      type="button"
                      onClick={() => setUserType('pj')}
                      className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-xl transition-all ${userType === 'pj' ? 'bg-white text-[#1A3A5C] shadow-sm' : 'text-[#1A3A5C]/40'}`}
                    >
                      Pessoa Jurídica
                    </button>
                  </div>

                  <div className="relative">
                    <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3A5C]/30" />
                    <input 
                      type="text" 
                      required
                      placeholder={userType === 'pf' ? 'CPF' : 'CNPJ'}
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(e.target.value)}
                      className="w-full h-14 bg-white border border-[#e2e8f0] rounded-2xl pl-12 pr-4 text-[#1A3A5C] font-medium outline-none focus:border-[#C8A951] transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3A5C]/30" />
                    <input 
                      type="text" 
                      required
                      placeholder="WhatsApp (com DDD)"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full h-14 bg-white border border-[#e2e8f0] rounded-2xl pl-12 pr-4 text-[#1A3A5C] font-medium outline-none focus:border-[#C8A951] transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3A5C]/30" />
                <input 
                  type="email" 
                  required
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 bg-white border border-[#e2e8f0] rounded-2xl pl-12 pr-4 text-[#1A3A5C] font-medium outline-none focus:border-[#C8A951] transition-all"
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3A5C]/30" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  required
                  placeholder={mode === 'register' ? "Crie uma senha" : "Sua senha"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full h-14 bg-white border border-[#e2e8f0] rounded-2xl pl-12 pr-12 text-[#1A3A5C] font-medium outline-none focus:border-[#C8A951] transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#1A3A5C]/30 hover:text-[#C8A951] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {mode === 'register' && (
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3A5C]/30" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="Confirme sua senha"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full h-14 bg-white border border-[#e2e8f0] rounded-2xl pl-12 pr-4 text-[#1A3A5C] font-medium outline-none focus:border-[#C8A951] transition-all"
                  />
                </div>
              )}

              {mode === 'login' && (
                <div className="text-right">
                  <Link href="/recuperar-senha" className="text-xs font-bold text-[#C8A951] hover:underline uppercase tracking-widest">
                    Esqueceu a senha?
                  </Link>
                </div>
              )}

              <div className="space-y-4 pt-2">
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-[#1A3A5C] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#1A3A5C]/90 transition-all active:scale-[0.98] shadow-lg disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <>
                      {mode === 'login' ? 'Entrar' : 'Criar Conta'}
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>

                {mode === 'login' && (
                  <>
                    <div className="relative py-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-[#e2e8f0]"></div>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-warm-bg px-2 text-[#1A3A5C]/40 font-bold tracking-widest">Ou</span>
                      </div>
                    </div>

                    <button 
                      type="button"
                      onClick={handleGoogleLogin}
                      disabled={googleLoading || loading}
                      className="w-full h-14 bg-white border border-[#e2e8f0] text-[#1A3A5C] rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-[#F5F4F0] transition-all active:scale-[0.98] disabled:opacity-50"
                    >
                      {googleLoading ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Entrar com Google
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.form>
          </AnimatePresence>

          <div className="mt-8 text-center pt-8 border-t border-[#e2e8f0]">
            <p className="text-[#1A3A5C]/60 text-sm mb-4">
              {mode === 'login' ? 'Não tem uma conta?' : 'Já possui uma conta?'}
            </p>
            <button 
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
              className="text-[#C8A951] font-bold uppercase tracking-widest text-xs hover:underline flex items-center gap-2 mx-auto"
            >
              {mode === 'login' ? (
                <>
                  <User className="w-4 h-4" />
                  Criar uma conta Gratuita
                </>
              ) : (
                <>
                  <ArrowLeft className="w-4 h-4" />
                  Voltar para o Login
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
