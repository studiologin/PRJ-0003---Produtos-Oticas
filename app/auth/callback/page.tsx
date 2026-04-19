'use client';

import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/login');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-bg text-[#1A3A5C]">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold mb-2">Redirecionando...</h1>
      </div>
    </div>
  );
}
