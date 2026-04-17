import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE config");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function syncUsers() {
  console.log("Fetching users from auth...");
  const { data: usersData, error: authError } = await supabase.auth.admin.listUsers();
  
  if (authError) {
    console.error("Error fetching users:", authError);
    return;
  }
  
  const users = usersData.users;
  console.log(`Found ${users.length} users.`);

  for (const user of users) {
    let role = 'client';
    if (user.email === 'manoel@produtosoticas.com.br') {
      role = 'admin';
    } else if (user.email === 'manoel.neto.arq@gmail.com') {
      role = 'client';
    }

    console.log(`Syncing profile for ${user.email} with role: ${role}`);
    
    const { error: profileError } = await supabase.from('profiles').upsert({
      id: user.id,
      full_name: user.email.split('@')[0],
      cpf_cnpj: '00000000000',
      type: 'pf',
      role: role
    });

    if (profileError) {
      console.error(`Error updating profile for ${user.email}:`, profileError);
    } else {
      console.log(`Profile synced for ${user.email}`);
    }
  }
}

syncUsers();
