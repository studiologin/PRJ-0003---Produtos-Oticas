CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('pf', 'pj')) DEFAULT 'pf',
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  company_name TEXT,
  b2b_group_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 5. Tabelas de E-commerce

-- 5.1 Categorias
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5.2 Produtos
CREATE TABLE IF NOT EXISTS public.products (
  id BIGSERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  ref TEXT NOT NULL UNIQUE,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id),
  image TEXT,
  bestseller BOOLEAN DEFAULT false,
  new BOOLEAN DEFAULT false,
  colors JSONB DEFAULT '[]'::jsonb,
  specifications JSONB DEFAULT '[]'::jsonb,
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 5,
  is_active BOOLEAN DEFAULT true,
  promo_price DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5.2.1 Imagens do Produto
CREATE TABLE IF NOT EXISTS public.product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5.3 Endereços de Entrega
CREATE TABLE IF NOT EXISTS public.addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Principal',
  street TEXT NOT NULL,
  number TEXT NOT NULL,
  complement TEXT,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5.4 Pedidos
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'shipped', 'delivered', 'cancelled')),
  subtotal DECIMAL(10,2) NOT NULL,
  discount DECIMAL(10,2) DEFAULT 0,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  tracking_code TEXT,
  shipping_address_id UUID REFERENCES public.addresses(id),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5.5 Itens do Pedido
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id BIGINT NOT NULL REFERENCES public.products(id),
  qty INTEGER NOT NULL CHECK (qty > 0),
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Habilitar RLS e Configurar Políticas

-- Habilitar RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Políticas Públicas (Leitura)
CREATE POLICY "Leitura pública de categorias" ON public.categories FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Leitura pública de produtos ativos" ON public.products FOR SELECT TO anon, authenticated USING (is_active = true);

-- Políticas de Usuário (Próprios Dados)
CREATE POLICY "Usuários gerenciam próprios endereços" ON public.addresses FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Usuários veem próprios pedidos" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários veem itens dos próprios pedidos" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid())
);

-- Políticas de Admin (Acesso Total)
CREATE POLICY "Admins gerenciam tudo" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Leitura pública de imagens" ON public.product_images FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins gerenciam imagens" ON public.product_images FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins gerenciam categorias" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Admins veem todos os pedidos" ON public.orders FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 7. Triggers de Autofill
-- Criar perfil automaticamente no cadastro do Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, role, type)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Usuário'),
    'client',
    'pf'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Dados Iniciais (Seed)

-- 8.1 Inserir Categorias
INSERT INTO public.categories (name, slug)
VALUES 
  ('Lentes de Contato', 'lentes-de-contato'),
  ('Armações', 'armacoes'),
  ('Acessórios', 'acessorios')
ON CONFLICT (name) DO NOTHING;

-- 8.2 Inserir Produtos Iniciais
INSERT INTO public.products (slug, name, ref, price, category_id, short_description, description, image, bestseller, new, colors, specifications, stock_quantity)
VALUES 
  (
    'lente-acuvue-oasys-6-unidades', 'Lente Acuvue Oasys', 'ACU-OAS-001', 149.90, 
    (SELECT id FROM public.categories WHERE name = 'Lentes de Contato'),
    'Conforto imbatível e visão nítida com a tecnologia Hydraclear Plus.',
    'As lentes de contato ACUVUE OASYS® com tecnologia HYDRACLEAR® PLUS são ideais para quem passa muito tempo em frente a telas ou em ambientes com ar-condicionado.',
    'https://picsum.photos/seed/product1/800/800', true, false,
    '[{"name": "Incolor", "hex": "#E2E8F0"}, {"name": "Azul Sutil", "hex": "#BFDBFE"}]'::jsonb,
    '[{"label": "Marca", "value": "Acuvue"}, {"label": "Material", "value": "Senofilcon A"}]'::jsonb,
    50
  ),
  (
    'armacao-premium-titanium-black', 'Armação Premium Titanium', 'OPT-TIT-002', 389.00,
    (SELECT id FROM public.categories WHERE name = 'Armações'),
    'Leveza e durabilidade extrema em titânio de alta qualidade.',
    'Nossa linha Premium Titanium oferece o equilíbrio perfeito entre sofisticação e resistência.',
    'https://picsum.photos/seed/product2/800/800', false, true,
    '[{"name": "Black Matte", "hex": "#111827"}, {"name": "Navy Blue", "hex": "#1A3A5C"}]'::jsonb,
    '[{"label": "Material", "value": "Titânio"}, {"label": "Peso", "value": "12g"}]'::jsonb,
    20
  ),
  (
    'kit-limpeza-premium-antiembacante', 'Kit Limpeza Premium', 'ACC-CLN-003', 45.00,
    (SELECT id FROM public.categories WHERE name = 'Acessórios'),
    'Mantenha suas lentes impecáveis e livres de embaçamento.',
    'Este kit completo inclui solução de limpeza de alta performance com efeito antiembaçante.',
    'https://picsum.photos/seed/product3/800/800', false, false,
    '[]'::jsonb,
    '[{"label": "Conteúdo", "value": "60ml"}, {"label": "Flanela", "value": "Microfibra HD"}]'::jsonb,
    100
  ),
  (
    'estojo-rigido-couro-artesanal', 'Estojo Rígido em Couro', 'ACC-CAS-004', 89.90,
    (SELECT id FROM public.categories WHERE name = 'Acessórios'),
    'Proteção clássica e sofisticada para seus óculos favoritos.',
    'Feito à mão com couro sintético de alta qualidade e forro aveludado.',
    'https://picsum.photos/seed/product4/800/800', true, false,
    '[{"name": "Caramel", "hex": "#C8A951"}, {"name": "Black", "hex": "#000000"}]'::jsonb,
    '[{"label": "Material Externo", "value": "Couro Sintético"}]'::jsonb,
    35
  )
ON CONFLICT (slug) DO NOTHING;

