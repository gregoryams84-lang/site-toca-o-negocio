# Manhã de Fé — Plano de Implementação

> Companheiro da [ESPECIFICACAO.md](ESPECIFICACAO.md). A especificação diz *o
> que* e *por quê*; este plano diz *em que ordem* e *como saber que ficou
> pronto*. Total estimado: **8 a 10 semanas** até estar nas duas lojas com o
> ano completo.

## Fase 0 — Preparação (começa já, em paralelo, não espera código)

**Burocracia (dono + contador):**
- [ ] Confirmar tipo do CNPJ com o contador; se MEI, avaliar desenquadramento
      para ME no Simples (software saiu das ocupações do MEI)
- [ ] Incluir CNAE secundário `6203-1/00` ou `6319-4/00`
- [ ] Criar conta Google Play Console (US$ 25, única vez)
- [ ] Criar conta Apple Developer (US$ 99/ano) — antes, verificar isenção para
      entidade educacional/sem fins lucrativos
- [ ] Pedir o D-U-N-S (necessário para conta Apple de empresa; demora dias)

**Acervo (pode ser feito nesta sessão de trabalho):**
- [ ] Selecionar e baixar as 40 faixas de música (Pixabay, Wikimedia/Musopen;
      Suno Pro para os buracos) → cortar em 30s, converter para AAC, registrar
      a origem/licença de cada uma em `CREDITOS.md`
- [ ] Selecionar ~60 obras de arte sacra em domínio público (Wikimedia) +
      gerar imagens complementares → WebP ~100 KB, registrar créditos
- [ ] Baixar a Bíblia Livre (CC BY 4.0) e montar a base de versículos
- [ ] Gerar o 1º lote de 30 mensagens (versículo + reflexão 4 frases + oração
      curta) para revisão do dono — valida o formato antes de escalar

**Critério de saída:** contas das lojas criadas, 1º lote de conteúdo aprovado
pelo dono, acervo de música/imagem com licenças documentadas.

## Fase 1 — Núcleo (o app mínimo que já emociona)

- [ ] Projeto Flutter (Android 7.0+ / iOS), CI de build; iOS via compilação em
      nuvem (Codemagic ou GitHub Actions + runner macOS)
- [ ] Design system: paleta, tipografia (serifa p/ versículo), botões 64 px,
      A+ com 3 tamanhos, contraste AAA
- [ ] Cartão do Dia completo: data + tempo litúrgico, arte, versículo,
      narração com autoplay + PAUSAR gigante, reflexão, música 30s com
      crédito, rodapé GUARDAR/ENVIAR/A+
- [ ] Conteúdo embutido: mensagens do ano (~250 KB), 40 faixas, imagens
- [ ] Pipeline de narração: 1 MP3/dia (Google Chirp 3 HD pt-BR) → Cloudflare
      R2; app baixa 7 dias adiantados no Wi-Fi; fallback TTS local
- [ ] Notificação diária no horário escolhido (agendamento local, sem servidor)
- [ ] Onboarding 4 telas, incluindo "seu celular pode bloquear nossos avisos"
      com instruções ilustradas por marca (Xiaomi, Samsung, Motorola)

**Critério de saída:** num Android antigo real (1 GB RAM), a notificação chega,
o cartão abre instantâneo em modo avião e narra sozinho.

## Fase 2 — Crescimento e receita

- [ ] ENVIAR: gerar imagem versículo-sobre-arte com "Manhã de Fé" no rodapé e
      abrir o WhatsApp com ela pronta (caprichar: é a capa do app)
- [ ] Guardados (favoritos) + tela de dias anteriores
- [ ] Assinatura R$ 9,90/ano nas duas lojas (Google Play Billing / StoreKit),
      tela única conforme spec, botão grande "Já paguei — recuperar minha
      assinatura" (restore)
- [ ] Paywall na primeira abertura, com a mensagem do dia visível ao fundo

**Critério de saída:** compra, cancelamento e restauração funcionando em teste
das duas lojas; imagem do ENVIAR aprovada pelo dono.

## Fase 3 — Devoção

- [ ] Terço guiado: mistérios certos por dia da semana, áudio guiado, contas
      grandes acendendo uma a uma
- [ ] Santo do dia: arte, nome, 3 linhas de história, frase, botão de ouvir
- [ ] Ajustes (6 itens): horário do aviso · tamanho da letra · narrar sozinho ·
      minha assinatura · ajuda · créditos

## Fase 4 — Conteúdo (contínuo, atravessa as outras fases)

- [ ] Lotes de 30 mensagens até fechar 365, com revisão do dono
- [ ] Narrações geradas e publicadas no R2 em lotes
- [ ] Revisão final por padre/diácono (meta: "textos revisados por Pe. Fulano"
      na ficha da loja)
- [ ] Planejar especiais do 1º ano (novenas, Natal, Quaresma, Maio) e o 2º
      ciclo de reflexões do ano 2 — antídoto do cancelamento em massa na
      renovação

## Fase 5 — Lançamento

- [ ] Testes em aparelhos fracos reais (Samsung antigo, Xiaomi, Motorola,
      Android Go) — abertura, notificação, bateria
- [ ] Fichas das lojas: nome, descrição, capturas grandes e legíveis, política
      de privacidade
- [ ] Revisão Apple/Google (margem para idas e voltas)
- [ ] Lançamento + acompanhamento das primeiras avaliações

---

### Riscos já mapeados e suas defesas

| Risco | Defesa |
|---|---|
| Música protegida (ECAD/Google Play) | Acervo 100% próprio/licenciado, créditos documentados |
| Texto bíblico protegido | Bíblia Livre CC BY 4.0 com crédito; migração p/ Matos Soares em 2028 |
| Notificação não chega (Xiaomi/Samsung) | Tela dedicada de onboarding por marca |
| Idoso desiste no paywall | Tela única, letra grande, mensagem visível ao fundo |
| Troca de celular → "fui roubado" | Botão grande de restauração |
| Renovação do ano 2 | Especiais no ano 1 + segundo ciclo de reflexões |
| MEI não cobre software | Confirmar com contador já na Fase 0 |
