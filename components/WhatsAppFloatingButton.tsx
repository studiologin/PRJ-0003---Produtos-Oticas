'use client';

import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function WhatsAppFloatingButton() {
  const pathname = usePathname();
  const [productName, setProductName] = useState<string | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Show button after a short delay
    const timer = setTimeout(() => setShow(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // If on a product page, try to get the product name from the H1
    if (pathname.startsWith('/produto/')) {
      const h1 = document.querySelector('h1');
      if (h1) {
        setProductName(h1.innerText);
      }
    } else {
      setProductName(null);
    }
  }, [pathname]);

  const phoneNumber = '5511988470858';
  const baseMessage = productName 
    ? `Olá, tenho interesse no produto: ${productName}`
    : 'Olá, gostaria de saber mais sobre os produtos da ótica.';
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(baseMessage)}`;

  return (
    <AnimatePresence>
      {show && (
        <motion.a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 20 }}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-[999] group"
          title="Fale conosco no WhatsApp"
        >
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-white px-4 py-2 rounded-xl shadow-xl border border-[#e2e8f0] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap hidden md:block">
            <p className="text-[#1A3A5C] text-xs font-bold uppercase tracking-wider">
              {productName ? 'Dúvida sobre este produto?' : 'Como podemos ajudar?'}
            </p>
          </div>

          {/* Button Background with Pulse Effect */}
          <div className="relative">
            <div className="absolute inset-0 bg-[#25D366] rounded-full blur-xl opacity-40 group-hover:opacity-60 animate-pulse transition-opacity" />
            <div className="relative w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl shadow-[#25D366]/40 border-2 border-white/20">
              <MessageCircle className="w-8 h-8 text-white fill-white/10" />
            </div>
          </div>
        </motion.a>
      )}
    </AnimatePresence>
  );
}
