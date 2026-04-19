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

  // Masks
  const maskCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskCNPJ = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1/$2')
      .replace(/(\d{4})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const maskWhatsApp = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d{4})/, '$1-$2')
      .replace(/(-\d{4})\d+?$/, '$1');
  };

  useEffect(() => {
    // Logic for checking existing session on mount
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        if (profile?.role === 'admin') {
          router.push('/admin');
        } else {
          router.push('/conta');
        }
      }
    };
    checkSession();
  }, [router]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const { data: authData, error: loginError } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (loginError) throw loginError;
        
        if (authData.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', authData.user.id)
            .single();
            
          if (profile?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/conta');
          }
        }
      } else {
        // Password complexity validation
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const hasMinLength = password.length >= 8;

        if (!hasMinLength || !hasUpperCase || !hasSpecialChar) {
          throw new Error('A senha deve ter no mínimo 8 caracteres, incluindo uma letra maiúscula e um caractere especial.');
        }

        if (password !== confirmPassword) {
          throw new Error('As senhas não coincidem.');
        }

        // SignUp logic
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            }
          }
        });
        if (signUpError) throw signUpError;

        if (signUpData.user) {
          // Create profile (trigger handles auto-creation, but we upsert details if provided)
          const profileData: any = {
            id: signUpData.user.id,
            full_name: fullName,
            role: 'client',
            type: userType
          };

          if (cpfCnpj) profileData.cpf_cnpj = cpfCnpj;
          if (whatsapp) profileData.whatsapp = whatsapp;

          const { error: profileError } = await supabase.from('profiles').upsert(profileData);
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
                      placeholder={userType === 'pf' ? 'CPF: 000.000.000-00' : 'CNPJ: 00.000.000/0000-00'}
                      value={cpfCnpj}
                      onChange={(e) => setCpfCnpj(userType === 'pf' ? maskCPF(e.target.value) : maskCNPJ(e.target.value))}
                      className="w-full h-14 bg-white border border-[#e2e8f0] rounded-2xl pl-12 pr-4 text-[#1A3A5C] font-medium outline-none focus:border-[#C8A951] transition-all"
                    />
                  </div>

                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1A3A5C]/30" />
                    <input 
                      type="text" 
                      required
                      placeholder="WhatsApp: (00) 00000-0000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(maskWhatsApp(e.target.value))}
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
