const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Erro: NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não encontrados no .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setup() {
  console.log('Iniciando configuração do banco de dados e storage...');

  const sql = `
    -- 1. Create product_images table
    CREATE TABLE IF NOT EXISTS public.product_images (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      product_id BIGINT NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
      url TEXT NOT NULL,
      is_cover BOOLEAN DEFAULT false,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
    );

    -- 2. Enable RLS and Policies
    ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Leitura pública de imagens') THEN
        CREATE POLICY "Leitura pública de imagens" ON public.product_images FOR SELECT TO anon, authenticated USING (true);
      END IF;

      IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Admins gerenciam imagens') THEN
        CREATE POLICY "Admins gerenciam imagens" ON public.product_images FOR ALL USING (
          EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
        );
      END IF;
    END $$;
  `;

  // Note: Creating buckets via SQL requires access to the storage schema, which might be restricted.
  // We'll try to create it via the API first.
  
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = buckets.find(b => b.id === 'products');
    if (!exists) {
        console.log('Criando bucket "products"...');
        const { error: createBucketError } = await supabase.storage.createBucket('products', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
            fileSizeLimit: 5242880 // 5MB
        });
        if (createBucketError) throw createBucketError;
        console.log('Bucket "products" criado com sucesso.');
    } else {
        console.log('Bucket "products" já existe.');
    }

    // Now run SQL for the table
    // We use RPC if available or we can try to run it via execute_sql if we had it.
    // Since we don't have a direct "run raw sql" in supabase-js (except via RPC), 
    // I will instruct the user to run the SQL in the dashboard as it's the safest way.
    
    console.log('\n--- ATENÇÃO: COPIE E COLE O SQL ABAIXO NO SUPABASE SQL EDITOR ---');
    console.log(sql);
    console.log('--------------------------------------------------------------\n');

  } catch (err) {
    console.error('Erro durante a configuração:', err.message);
  }
}

setup();
