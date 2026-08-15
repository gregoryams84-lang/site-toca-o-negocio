export function construirManifesto(dataId: string, requestId: string, ts: string): string {
  return `id:${dataId};request-id:${requestId};ts:${ts};`
}

export function extrairTsEV1(headerXSignature: string): { ts: string; v1: string } | null {
  if (!headerXSignature) return null
  const partes: Record<string, string> = {}
  for (const par of headerXSignature.split(',')) {
    const [chave, valor] = par.split('=')
    if (chave && valor !== undefined) {
      partes[chave.trim()] = valor.trim()
    }
  }
  if (!partes.ts || !partes.v1) return null
  return { ts: partes.ts, v1: partes.v1 }
}

export async function calcularHmac(manifesto: string, segredo: string): Promise<string> {
  const encoder = new TextEncoder()
  const chave = await crypto.subtle.importKey(
    'raw',
    encoder.encode(segredo),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const assinatura = await crypto.subtle.sign('HMAC', chave, encoder.encode(manifesto))
  return Array.from(new Uint8Array(assinatura))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
}

export function compararComSeguranca(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diferenca = 0
  for (let i = 0; i < a.length; i++) {
    diferenca |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diferenca === 0
}
