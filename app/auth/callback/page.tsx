'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const processCallback = async () => {
      if (window.opener) {
        window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
        window.close();
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();
            
          if (profile?.role === 'admin') {
            router.push('/admin');
          } else {
            router.push('/conta');
          }
        } else {
          router.push('/carrinho');
        }
      }
    };

    processCallback();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-bg text-[#1A3A5C]">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold mb-2">Autenticando...</h1>
        <p className="text-sm opacity-60">Esta janela fechará automaticamente.</p>
      </div>
    </div>
  );
}
