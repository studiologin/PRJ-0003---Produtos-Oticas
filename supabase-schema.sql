-- 1. Tabela de Perfil de Usuários (Estende auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  cpf_cnpj TEXT NOT NULL,
  whatsapp TEXT,
  type TEXT NOT NULL CHECK (type IN ('pf', 'pj')),
  role TEXT NOT NULL DEFAULT 'client' CHECK (role IN ('client', 'admin')),
  company_name TEXT,
  b2b_group_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Habilitar RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Políticas de Segurança (RLS)
-- Permite que usuários leiam apenas seu próprio perfil
CREATE POLICY "Usuários podem ver o próprio perfil" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id);

-- Permite que usuários atualizem apenas seu próprio perfil
CREATE POLICY "Usuários podem atualizar o próprio perfil" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Permite que administradores vejam todos os perfis
CREATE POLICY "Admins podem ver todos os perfis" 
ON public.profiles FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  )
);

-- 4. Função para cadastrar o usuário Admin via SQL (Simulação de Seed)
-- Nota: Para o Auth do Supabase, o ideal é criar via Painel Auth, 
-- mas aqui está o SQL para a tabela de profiles referente ao admin solicitado.

/* 
INSTRUÇÕES PARA O SUPABASE AUTH:
Vá em Authentication -> Users -> Add User
E-mail: manoel@produtosoticas.com.br
Senha: MNeto13dana

Após criar no Auth, o ID dele deve ser inserido abaixo:
*/

-- Exemplo de insert para o Perfil (substitua 'ID_DO_USUARIO_AUTH' pelo UUID gerado no Supabase Auth)
-- INSERT INTO public.profiles (id, full_name, cpf_cnpj, whatsapp, type, role)
-- VALUES ('ID_DO_USUARIO_AUTH', 'Manoel neto', '000.000.000-00', '11 99667-1297', 'pf', 'admin');
