# Aula grátis por trilha + captura de lead — Design

## Contexto

Cada uma das 4 trilhas vai ter sua primeira aula disponibilizada gratuitamente, como isca pra gerar interesse antes do curso pago abrir (que ainda depende da gravação de todas as 24 aulas — ver checklist de 2026-08-15). Pra assistir, a pessoa preenche um formulário (nome, celular, e-mail, cidade, estado); o vídeo libera na hora, sem precisar criar conta.

## Modelo de dados

Duas tabelas novas no Supabase:

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  celular text not null,
  email text not null,
  cidade text not null,
  estado text not null,
  trilha_id uuid references trilhas(id) not null,
  criado_em timestamptz not null default now()
);

alter table leads enable row level security;

create policy "qualquer um pode criar lead" on leads
  for insert with check (true);
-- Sem policy de select para anon/authenticated: só leitura via
-- Supabase Studio ou service role. Mesmo raciocínio de "captura de dado
-- sensível sem exposição pública" já usado em pagamentos.

create table aulas_gratuitas (
  id uuid primary key default gen_random_uuid(),
  trilha_id uuid references trilhas(id) not null unique,
  titulo text not null,
  descricao text,
  panda_video_id text
);

alter table aulas_gratuitas enable row level security;

create policy "qualquer um le aulas gratuitas" on aulas_gratuitas
  for select using (true);
```

`aulas_gratuitas` é intencionalmente separada da tabela `aulas` (usada pelo curso pago) — não tem `ordem` nem `link_atividade` (não existe atividade interativa na aula grátis) nem relação com `matriculas`/progresso. É conteúdo estático de marketing, uma linha fixa por trilha.

`panda_video_id` começa `null` pra todas as 4 linhas — populado depois que Gregory terminar cada gravação, sem precisar de deploy de código.

## Fluxo da página

**Nova página:** `atividades/aula-gratis.html?trilha=<slug>` (reaproveita o padrão de URL por query string já usado em `aula.html?aula_id=`).

1. A página busca em `aulas_gratuitas` (join com `trilhas` pra pegar o nome) pelo `slug` da URL.
2. Mostra o título/descrição da aula, um formulário (nome, celular, e-mail, cidade, estado) e uma área de vídeo escondida atrás do formulário.
3. Ao enviar o formulário: insere a linha em `leads` (client-side, direto pelo Supabase — mesmo padrão de escrita pública já usado em `criar-preferencia-pagamento`, mas aqui é escrita direta porque não tem lógica de servidor envolvida).
4. Se `panda_video_id` já existe: revela o player embutido do Panda Video na hora, sem reload.
5. Se `panda_video_id` ainda é `null`: mostra uma mensagem ("Essa aula está sendo gravada — em breve você recebe o acesso.") no lugar do player. O lead já fica registrado de qualquer forma.

## Vídeo sem marca d'água pessoal

Diferente do vídeo do curso pago (que usa o pipeline de marca d'água por aluno, construído na Fase 3, pra rastrear vazamento de conteúdo pago), a aula grátis é conteúdo público por natureza — embed direto do Panda Video, sem geração de link assinado por pessoa. Consequência: esse link pode ser divulgado livremente nas redes sociais sem quebrar a lógica de proteção de conteúdo pago.

## Onde aparece no site

- **Home:** nova seção "Assista de graça", com as 4 aulas grátis lado a lado (mesmo padrão visual dos cards de trilha/planos), posicionada logo depois de "As trilhas" e antes de "Como funciona".
- **Página de cada trilha:** bloco de destaque perto do topo (seção hero) chamando pra aula grátis daquela trilha específica.

## Fora de escopo

- Autenticação/conta para assistir a aula grátis — deliberadamente sem login, fricção mínima.
- Progresso/conclusão da aula grátis — não é rastreado como as aulas do curso pago.
- Envio automático de e-mail com o link do vídeo (a liberação é na hora, na própria página) — se a captação por e-mail separado for necessária no futuro, é uma extensão, não parte deste trabalho.
- Integração com qualquer sistema externo de CRM/planilha — os leads ficam só no Supabase por enquanto.
