# Guia prático de gravação — Toca o Negócio

Passo a passo pra gravar as 24 aulas (roteiros já prontos em
`app-atividades-curso/conteudo/<trilha>/aula-0N-roteiro.md`).

## Formato recomendado: híbrido (rosto + tela)

Quase todo roteiro tem um bloco de **Demonstração** (abrir uma
ferramenta, mostrar o Portal do Empreendedor, gerar um boleto, montar
um fluxo no n8n) — isso precisa de tela, não de rosto. E toda abertura
é endereçada direto ao aluno ("você trava", "agora é sua vez") — isso
precisa de rosto, não de slide genérico.

**Regra simples pra decidir, olhando o `[timestamp]` do roteiro:**
- Beat de abertura, explicação, aviso, fechamento → **rosto na câmera**.
- Beat marcado "Demonstração:" → **tela gravada** (celular ou
  computador, dependendo da ferramenta mostrada).

Isso não exige dois takes separados nem edição complexa — grava a tela
já com a narração em cima (voz ao vivo enquanto demonstra), sem cortar
o áudio do resto do vídeo.

## Equipamento mínimo

- **Câmera:** celular já serve (câmera traseira, 1080p). Apoiar num
  tripé ou suporte fixo — nada de segurar na mão.
- **Áudio:** é o que mais denuncia gravação amadora. Se não tiver
  microfone de lapela, grava num cômodo fechado, sem ventilador/eco, o
  mais perto possível do celular.
- **Luz:** luz natural de frente pro rosto (nunca janela atrás de
  você). Um ring light barato resolve se não tiver luz natural boa no
  horário que for gravar.
- **Gravação de tela:** função nativa do celular (iOS/Android) pra
  demonstrações em app de celular; gravador de tela do computador
  (OBS, gratuito, ou o nativo do Windows/Mac) pra Portal do
  Empreendedor, n8n, etc.
- **Edição:** CapCut (gratuito, celular ou computador) — só precisa
  cortar início/fim e emendar os blocos de tela com os de rosto, sem
  efeito nem trilha sonora.

## Antes de gravar cada aula

1. Lê o roteiro inteiro uma vez em voz alta, sem gravar — pra treinar o
   ritmo e não soar lido.
2. Se a aula tem "Demonstração", separa com antecedência a
   ferramenta/tela que vai mostrar (login feito, sem notificação
   aparecendo, sem dado real de cliente na tela).
3. Confere o `[timestamp]` de cada beat — é o tempo alvo, não precisa
   bater exato, mas serve de guia pra não alongar.

## Fluxo de gravação

1. **Grava os beats de rosto primeiro**, um atrás do outro, sem parar
   pra cada erro pequeno — só refaz a frase e segue, corta na edição.
2. **Grava a tela separadamente** pro(s) beat(s) de demonstração,
   narrando ao vivo enquanto faz a ação de verdade (não é voz por cima
   de gravação muda).
3. Se travar ou errar feio, para, respira, repete só aquele trecho —
   não precisa recomeçar a aula inteira.

## Ordem sugerida

Grava em lote, uma trilha inteira por sessão — mesma luz, mesma roupa,
mesmo tom de voz nas 6 aulas seguidas, menos trabalho de configurar de
novo:

1. **Trilha 1 — IA no Negócio** (a mais testada, boa pra pegar o ritmo)
2. **Trilha 2 — Vender pela internet e WhatsApp** (mais telas de
   demonstração — reserva mais tempo)
3. **Trilha 3 — Formalizar a empresa** (só grava depois da revisão do
   contador)
4. **Trilha 4 — Gerir o dinheiro**

## Nome dos arquivos

Usa o mesmo id da aula pra não perder o vínculo depois:

```
trilha-ia_aula-01.mp4
trilha-ia_aula-02.mp4
...
trilha-dinheiro_aula-06.mp4
```

## Depois de editar

- Exporta em 1080p, MP4.
- Confere que o áudio está limpo (sem ruído de fundo, volume
  consistente do início ao fim).
- Confere que nenhuma tela de demonstração mostra dado real sensível
  (nome de cliente, CPF, valor de venda real).
- Sobe no Panda Video e avisa (aqui ou na conversa técnica) pra
  vincular o `panda_video_id` de cada aula no banco — isso é um passo
  rápido, não precisa entender como funciona por trás.

## Checklist rápido por aula antes de subir

- [ ] Áudio limpo, sem eco/ruído
- [ ] Blocos de "Demonstração" gravados em tela, narrados ao vivo
- [ ] Nenhum dado sensível real aparece na tela
- [ ] Nome do arquivo bate com o id da aula
- [ ] Duração próxima da soma dos `[timestamp]` do roteiro (não precisa
      ser exata)
