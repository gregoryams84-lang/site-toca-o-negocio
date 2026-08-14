# Design: currículo da trilha 4 (Gerir o dinheiro)

Continuação de `2026-08-13-curriculo-trilhas-1-2-design.md` e
`2026-08-14-curriculo-trilha-3-design.md`. Trilha tradicional — sem IA,
domínio de gestão financeira de pequeno negócio brasileiro. Última das
quatro trilhas do curso.

## Público

Mesmo público das outras trilhas: pequeno empreendedor que toca o negócio
sozinho ou com pouca ajuda. Ponto de partida financeiro típico: dinheiro
pessoal e do negócio misturados na mesma conta/carteira, preço definido
"no olho", sem controle de fluxo de caixa.

## Grade — Trilha 4: Gerir o dinheiro (6 aulas)

1. **Pra onde seu dinheiro vai** — diagnóstico: separar dinheiro pessoal
   do dinheiro do negócio. Não é só desorganização — é o que afunda
   negócio: sem separação, o dono nunca sabe se o negócio dá lucro de
   verdade ou só "parece" dar porque o bolso pessoal cobre o buraco até
   estourar.
2. **Fluxo de caixa simples** — entrada e saída, sem planilha
   complicada.
3. **Precificação** — vai além da fórmula genérica de custo fixo +
   variável + margem que todo curso ensina igual. Entra o valor
   percebido: o que o cliente paga tem a ver com o que aquilo representa
   pra ele, não só quanto custou pra fazer. Preço é também
   posicionamento, não só conta.
4. **Pró-labore** — quanto tirar pra você sem sufocar o negócio.
5. **Gastos fixos e variáveis** — o que é fixo, o que dá pra cortar.
6. **Seu painel financeiro** — projeto final: o aluno monta o próprio
   controle mensal.

## Diferencial (adaptado — domínio tradicional, sem os 3 diferenciais de IA)

- **Raciocínio explícito, não fórmula genérica** — a Aula 3 é o caso mais
  claro: em vez de só ensinar "custo + margem" (que todo mundo já viu),
  ensina a pensar em valor percebido também. A Aula 1 ensina o *porquê*
  de separar contas (mascarar prejuízo), não só o "faça assim".
- **Artefato reutilizável** — cada aula termina com algo que o aluno usa
  depois (planilha de fluxo, cálculo de preço, painel mensal).
- Nenhuma promessa de resultado financeiro (Global Constraint já
  existente) — ensinar gestão, nunca prometer "vai lucrar mais" como
  garantia.

## Formato de cada aula (herdado)

Vídeo curto + atividade interativa que parte de situação concreta do
negócio do aluno (ou um fato real do próprio negócio) antes de qualquer
explicação. Tipos de bloco: `cenario`, `lista_aberta`, `calculo`,
`escolha_simples`. Atividade sempre abre com `cenario` ou fato real do
próprio negócio — nunca autoavaliação genérica (lição da trilha 2).
Fechamento pode ser no bloco de artefato ou num `escolha_simples` de
síntese logo depois, desde que reflita o que acabou de ser construído.

## Global Constraints (herdadas)

- Nunca sugerir reconhecimento, autorização ou chancela do MEC; sempre
  "certificado de conclusão de curso livre".
- Nenhuma promessa de resultado financeiro — especialmente relevante
  aqui, é a trilha sobre dinheiro: ensinar o método, nunca prometer
  quanto o aluno vai lucrar.
- Nenhuma prova social inventada.
- Evitar "solução", "jornada", "transformação", "empoderar",
  "descomplicar".
- Vídeo curto, direto, mobile, sem "vi que você...".
- Como nas trilhas 2 e 3: cuidado com bugs recorrentes já mapeados
  (palavra banida escapando, bloco de abertura não-concreto, reorder
  quebrando referência textual) — checar antes de despachar cada task.

## Fora de escopo deste documento

- Roteiro aula a aula — vira plano de implementação separado.
- Gravação dos vídeos, upload no Panda Video, diagramação dos PDFs de
  todas as trilhas — trabalho de produção separado, já sinalizado nos
  specs anteriores.
