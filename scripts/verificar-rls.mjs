// Dev-only script: confirms a logged-in student cannot read another
// student's matriculas via the public anon key. Run with:
//   node scripts/verificar-rls.mjs
// Requires two disposable test accounts to exist (created via cadastro.html).
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://tldmtouhyiglqszwxdmc.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_dhQZyHqufAU9vfR2KLEkHQ_hdx5c5ki';

const ALUNO_A = { email: 'SEU_EMAIL_DE_TESTE_A', senha: 'SENHA_DO_TESTE_A' };
const ALUNO_B = { email: 'SEU_EMAIL_DE_TESTE_B', senha: 'SENHA_DO_TESTE_B' };

async function loginComo(credenciais) {
  const cliente = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  const { error } = await cliente.auth.signInWithPassword({
    email: credenciais.email,
    password: credenciais.senha
  });
  if (error) throw new Error(`Login falhou para ${credenciais.email}: ${error.message}`);
  return cliente;
}

const clienteA = await loginComo(ALUNO_A);
const { data: matriculasDeA } = await clienteA.from('matriculas').select('*');
console.log(`Aluno A vê ${matriculasDeA.length} matrícula(s) — deve ser exatamente a(s) dele mesmo.`);

const idDeA = (await clienteA.auth.getUser()).data.user.id;

const clienteB = await loginComo(ALUNO_B);
const { data: matriculasQueDeveriaSerZero } = await clienteB
  .from('matriculas')
  .select('*')
  .eq('aluno_id', idDeA);

const { data: todasMatriculasDeB } = await clienteB.from('matriculas').select('*');

console.log(`Aluno B, sem filtro, vê ${todasMatriculasDeB.length} matrícula(s) (esperado: 0, ele não está matriculado em nada).`);

if (matriculasQueDeveriaSerZero.length === 0) {
  console.log('OK: Aluno B não consegue ler a matrícula do Aluno A. RLS está funcionando.');
} else {
  console.error('FALHA DE SEGURANÇA: Aluno B conseguiu ler dados do Aluno A.');
  process.exit(1);
}
