'use client';

import { useEffect } from 'react';

export default function AuthCallbackPage() {
  useEffect(() => {
    if (window.opener) {
      window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
      window.close();
    } else {
      window.location.href = '/carrinho';
    }
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-warm-bg text-[#1A3A5C]">
      <div className="text-center">
        <h1 className="text-2xl font-display font-bold mb-2">Autenticando...</h1>
        <p className="text-sm opacity-60">Esta janela fechará automaticamente.</p>
      </div>
    </div>
  );
}
