-- supabase/migrations/0035_aula03_reorganiza_partes.sql

-- Gregory pediu pra limpar a aula 3: estava "muito bagunçada, com muitas
-- informações repetitivas". Remove os 4 videos que duplicavam conteudo ja
-- coberto pelos Kits A/B/C (as versoes "nao-kit" de MCPs pesquisa/midia e
-- Skills CLI, e o Kit de extensoes do VS Code, que saiu do roteiro final).
-- A parte 3 (conceito de MCP/Skill) mantem o video ANTIGO por enquanto --
-- Gregory pediu pra recriar esse video do zero, mais didatico; assim que
-- o novo estiver pronto, so trocar o video_id desta posicao.
update aulas
set partes = jsonb_build_array(
  jsonb_build_object('video_id', '069118f2-287a-498b-8c72-bb465ace5bfe', 'titulo', 'Explicações iniciais'),
  jsonb_build_object('video_id', '36169ce5-d24c-4ec5-b26f-7b0367893493', 'titulo', 'Mais sobre o Claude'),
  jsonb_build_object('video_id', '6499e3ed-4cf0-4184-bd98-d51deefdbafb', 'titulo', 'Conceito: o que são MCPs e Skills'),
  jsonb_build_object('video_id', '94d50042-aa98-48e8-bdde-0660f206c971', 'titulo', 'MCPs de pesquisa e automação — Kit de Ferramentas A'),
  jsonb_build_object('video_id', 'e5b4975a-586d-409f-8ca0-bf642301aa44', 'titulo', 'MCPs de mídia gerada — Kit de Ferramentas B'),
  jsonb_build_object('video_id', '55713640-27fc-4917-a43c-7996efe2d9ee', 'titulo', 'Skills, CLI e referência — Kit de Ferramentas C'),
  jsonb_build_object('video_id', '90897d7d-4eab-4bf6-a888-809e7cfc900d', 'titulo', 'Cadastro das ferramentas'),
  jsonb_build_object(
    'video_id', '8271969b-cb60-4938-88a3-15319ea7b02a',
    'titulo', 'Instalando as ferramentas no VS Code',
    'codigo_titulo', 'Configuração do mcp.json',
    'codigo', $codigo${
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
}$codigo$
  )
)
where ordem = 3
  and trilha_id = (select id from trilhas where slug = 'trilha-ia');
