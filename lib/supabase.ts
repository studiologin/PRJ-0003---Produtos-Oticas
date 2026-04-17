import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

// Cliente do Supabase para uso no Frontend (Client Components)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para facilitar o desenvolvimento
export type Profile = {
  id: string;
  full_name: string;
  cpf_cnpj: string;
  type: 'pf' | 'pj';
  whatsapp?: string;
  company_name?: string;
  b2b_group_id?: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  subtotal: number;
  discount: number;
  shipping_cost: number;
  total: number;
  payment_method: string;
  payment_status: string;
  tracking_code?: string;
  created_at: string;
};

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: number;
  qty: number;
  unit_price: number;
  total_price: number;
};
