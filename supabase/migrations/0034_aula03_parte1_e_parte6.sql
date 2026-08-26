-- supabase/migrations/0034_aula03_parte1_e_parte6.sql

-- Reconstroi o array de partes da aula 3 pra inserir a parte 1
-- ("Explicacoes iniciais", que faltava desde a criacao da aula) na
-- frente de todas as outras, e adiciona a parte 6 (instalacao das
-- ferramentas no VS Code) no final. A parte 6 carrega um campo extra
-- "codigo" com o conteudo do mcp.json que o aluno precisa colar --
-- exibido como quadro copiavel na pagina da aula.
update aulas
set partes = jsonb_build_array(
  jsonb_build_object('video_id', '069118f2-287a-498b-8c72-bb465ace5bfe', 'titulo', 'Explicações iniciais'),
  jsonb_build_object('video_id', '36169ce5-d24c-4ec5-b26f-7b0367893493', 'titulo', 'Mais sobre o Claude'),
  jsonb_build_object('video_id', '6499e3ed-4cf0-4184-bd98-d51deefdbafb', 'titulo', 'Instalar MCPs e Skills (o conceito)'),
  jsonb_build_object('video_id', '4e6ca89a-bb61-4d20-88a3-2c4ddfd6a3aa', 'titulo', 'Kit de extensões do VS Code'),
  jsonb_build_object('video_id', '46bab219-5c89-425c-a03e-4dd411150cf4', 'titulo', 'MCPs de pesquisa e automação'),
  jsonb_build_object('video_id', 'd96dc4dc-d93b-4ef5-bd9f-63aa1feaf3e7', 'titulo', 'MCPs de mídia gerada'),
  jsonb_build_object('video_id', '993e3f22-0725-49d0-b0ee-ce38e68264a0', 'titulo', 'Skills, CLI e referência'),
  jsonb_build_object('video_id', '94d50042-aa98-48e8-bdde-0660f206c971', 'titulo', 'MCPs de pesquisa e automação — Kit de Ferramentas A'),
  jsonb_build_object('video_id', 'e5b4975a-586d-409f-8ca0-bf642301aa44', 'titulo', 'MCPs de mídia gerada — Kit de Ferramentas B'),
  jsonb_build_object('video_id', '55713640-27fc-4917-a43c-7996efe2d9ee', 'titulo', 'Skills, CLI e referência — Kit de Ferramentas C'),
  jsonb_build_object('video_id', '90897d7d-4eab-4bf6-a888-809e7cfc900d', 'titulo', 'Cadastro das ferramentas'),
  jsonb_build_object(
    'video_id', '8271969b-cb60-4938-88a3-15319ea7b02a',
    'titulo', 'Instalando as ferramentas no VS Code',
    'codigo_titulo', 'Configuração do mcp.json',
    'codigo', $codigo$
{
  "servers": {
    "io.github.ChromeDevTools/chrome-devtools-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "--registry",
        "https://registry.npmjs.org",
        "chrome-devtools-mcp@1.7.0"
      ],
      "gallery": "https://api.mcp.github.com",
      "version": "1.7.0"
    },
    "jina-ai": {
      "url": "https://mcp.jina.ai/v1",
      "type": "http"
    },
    "kairogen": {
      "url": "https://mcp.kairogen.ai/mcp",
      "type": "http"
    },
    "nano-banana": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "nano-banana-2-mcp"
      ],
      "env": {
        "GEMINI_API_KEY": "SUA_CHAVE_DO_GEMINI_AQUI"
      }
    },
    "magnific": {
      "url": "https://mcp.magnific.com",
      "type": "http"
    },
    "superpowers": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "superpowers-mcp"
      ]
    },
    "skillsmp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "skillsmp-mcp-lite"
      ],
      "env": {
        "SKILLSMP_API_KEY": "SUA_CHAVE_DO_SKILLSMP_AQUI"
      }
    },
    "hyperframes": {
      "url": "https://hyperframes.heygen.com/mcp",
      "type": "http"
    },
    "supabase": {
      "url": "https://mcp.supabase.com/mcp",
      "type": "http"
    },
    "context7": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "@upstash/context7-mcp"
      ]
    }
  },
  "inputs": []
}
$codigo$
  )
)
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
