-- supabase/migrations/0037_aula03_parte8_qualidade_e_parte9.sql

-- Gregory reenviou a parte 8 (instalacao no VS Code) com qualidade
-- completa (antes so ia ate 720p, agora tem ate 2160p/4K) -- troca pro
-- novo video_id. Tambem adiciona a parte 9 final: "mao na massa"
-- (27min, video mais longo da aula, fecha o roteiro completo).
update aulas
set partes = jsonb_build_array(
  jsonb_build_object('video_id', '069118f2-287a-498b-8c72-bb465ace5bfe', 'titulo', 'Explicações iniciais'),
  jsonb_build_object('video_id', 'eaa55da1-bd13-4fc3-afb4-483d32577acb', 'titulo', 'Mais sobre o Claude'),
  jsonb_build_object('video_id', '05f8514b-09df-47c7-b500-099fb5796607', 'titulo', 'Conceito: o que são MCPs e Skills'),
  jsonb_build_object('video_id', '94d50042-aa98-48e8-bdde-0660f206c971', 'titulo', 'MCPs de pesquisa e automação — Kit de Ferramentas A'),
  jsonb_build_object('video_id', 'e5b4975a-586d-409f-8ca0-bf642301aa44', 'titulo', 'MCPs de mídia gerada — Kit de Ferramentas B'),
  jsonb_build_object('video_id', '55713640-27fc-4917-a43c-7996efe2d9ee', 'titulo', 'Skills, CLI e referência — Kit de Ferramentas C'),
  jsonb_build_object('video_id', '90897d7d-4eab-4bf6-a888-809e7cfc900d', 'titulo', 'Cadastro das ferramentas'),
  jsonb_build_object(
    'video_id', 'b9608736-e20f-46c7-9d20-bc6686548e1b',
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
  ),
  jsonb_build_object('video_id', '87fde73e-21f3-49f9-86f8-318b4b2486c8', 'titulo', 'Mão na massa')
)
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
