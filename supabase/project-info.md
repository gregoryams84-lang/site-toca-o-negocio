# Projeto Supabase — Toca o Negócio / atividades

- Project ref: `tldmtouhyiglqszwxdmc`
- URL: `https://tldmtouhyiglqszwxdmc.supabase.co`
- Chave pública (publishable, segura para uso no front-end): `sb_publishable_dhQZyHqufAU9vfR2KLEkHQ_hdx5c5ki`

A senha do banco de dados NÃO está neste arquivo — foi entregue diretamente
na conversa quando o projeto foi criado. A chave acima é pública por
design (é assim que o Supabase funciona: a segurança vem das políticas de
Row Level Security no banco, não de esconder esta chave). A chave
"secret"/"service_role" do projeto nunca deve aparecer neste repositório.

## Configuração de Auth (URL Configuration)

- Site URL: `https://tocaonegocio.com.br/atividades/entrar.html`
- Redirect allow list: `https://tocaonegocio.com.br/atividades/*`, `https://tocaonegocio.com.br/*`
- Confirmação de e-mail: **ativada** no projeto hospedado (`mailer_autoconfirm: false`)

Esses três valores foram configurados direto no projeto hospedado (via API
de gerenciamento do Supabase), não fazem parte do `supabase/config.toml`
do repositório — aquele arquivo tem valores de desenvolvimento local
(`localhost`) que nunca devem ser enviados por cima destes com
`supabase config push`.
