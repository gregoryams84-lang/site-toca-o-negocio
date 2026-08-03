# Publicar no GitHub Pages com domínio próprio

## 1. Criar o repositório no GitHub

1. Crie um repositório novo no GitHub (pode ser público ou privado).
2. Envie esta pasta para o repositório:
   ```bash
   git remote add origin <URL-do-repositorio>
   git branch -M main
   git push -u origin main
   ```

## 2. Ativar o GitHub Pages

1. No repositório, vá em **Settings → Pages**.
2. Em "Build and deployment", escolha **Deploy from a branch**.
3. Escolha a branch `main` e a pasta `/ (root)`.
4. Salve. O GitHub vai gerar uma URL temporária tipo
   `https://<usuario>.github.io/<repositorio>/` — é normal ela não
   funcionar com o domínio próprio ainda nesta etapa.

## 3. Apontar o domínio do registro.br

O arquivo `CNAME` já está na pasta com o conteúdo `tocaonegocio.com.br` —
isso avisa o GitHub Pages qual domínio deve responder por este site.
Falta configurar o DNS no lado do registro.br:

1. Entre no painel do registro.br, na área de **DNS** do domínio
   `tocaonegocio.com.br`.
2. Crie os seguintes registros:

   | Tipo  | Nome (host) | Valor / Destino                  |
   |-------|-------------|-----------------------------------|
   | A     | @           | 185.199.108.153                   |
   | A     | @           | 185.199.109.153                   |
   | A     | @           | 185.199.110.153                   |
   | A     | @           | 185.199.111.153                   |
   | CNAME | www         | `<usuario>.github.io.`            |

   (Esses quatro IPs são os endereços oficiais do GitHub Pages — cadastre
   os quatro como registros `A` separados no host raiz `@`.)

3. Salve e aguarde a propagação — pode levar de alguns minutos a algumas
   horas.

## 4. Confirmar o domínio no GitHub e ativar HTTPS

1. Volte em **Settings → Pages** no repositório.
2. No campo "Custom domain", digite `tocaonegocio.com.br` e salve. O
   GitHub vai verificar o DNS automaticamente (pode levar alguns minutos).
3. Assim que o GitHub confirmar o domínio, marque a opção **Enforce
   HTTPS**. Isso ativa um certificado HTTPS gratuito para o domínio —
   pode demorar até algumas horas para o certificado ficar disponível
   logo após a confirmação do domínio.
4. Depois de ativo, acesse `https://tocaonegocio.com.br` para confirmar
   que o site abre com o cadeado de segurança normalmente.

## Checklist antes de abrir a verificação de empresa na Meta

- [ ] Site abre em `https://tocaonegocio.com.br` com HTTPS ativo (cadeado
      no navegador, sem aviso de site não seguro).
- [ ] Razão social **AUREA EDUCACIONAL LTDA** e CNPJ **67.140.776/0001-88**
      aparecem como texto normal (selecionável) na página principal, sem
      precisar rolar muito para achar.
- [ ] Endereço no rodapé bate exatamente com o endereço registrado no
      CNPJ (mesma rua, número, complemento, bairro, cidade e CEP).
- [ ] Nenhuma página afirma reconhecimento, autorização ou chancela do MEC,
      nem usa as palavras "faculdade" ou "diploma". As únicas menções
      permitidas a MEC/graduação são as frases de negativa já presentes
      no rodapé e na cláusula de certificado de `termos.html` — não
      apague essas frases, elas protegem o negócio.
- [ ] Nenhuma página promete resultado financeiro.
- [ ] A meta tag de verificação de domínio da Meta (obtida no
      Gerenciador de Negócios, em Configurações da Empresa → Domínios)
      foi colada no `<head>` de `index.html`, no lugar do comentário
      `<!-- META DOMAIN VERIFICATION ... -->`, e o site foi republicado
      depois disso.
- [ ] `termos.html` e `privacidade.html` foram revisados por um
      advogado, conforme os avisos deixados no HTML dessas páginas.
