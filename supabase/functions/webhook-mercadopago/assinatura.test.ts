import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { construirManifesto, extrairTsEV1, calcularHmac, compararComSeguranca } from './assinatura.ts'

Deno.test('construirManifesto monta a string no formato exigido pelo Mercado Pago', () => {
  const manifesto = construirManifesto('123456789', 'req-abc-123', '1700000000')
  assertEquals(manifesto, 'id:123456789;request-id:req-abc-123;ts:1700000000;')
})

Deno.test('extrairTsEV1 separa ts e v1 do cabecalho x-signature', () => {
  const resultado = extrairTsEV1('ts=1700000000,v1=abcdef1234567890')
  assertEquals(resultado, { ts: '1700000000', v1: 'abcdef1234567890' })
})

Deno.test('extrairTsEV1 lida com espaco depois da virgula', () => {
  const resultado = extrairTsEV1('ts=1700000000, v1=abcdef1234567890')
  assertEquals(resultado, { ts: '1700000000', v1: 'abcdef1234567890' })
})

Deno.test('extrairTsEV1 retorna null quando falta o v1', () => {
  const resultado = extrairTsEV1('ts=1700000000')
  assertEquals(resultado, null)
})

Deno.test('extrairTsEV1 retorna null quando falta o ts', () => {
  const resultado = extrairTsEV1('v1=abcdef1234567890')
  assertEquals(resultado, null)
})

Deno.test('extrairTsEV1 retorna null para cabecalho vazio', () => {
  const resultado = extrairTsEV1('')
  assertEquals(resultado, null)
})

Deno.test('calcularHmac produz hex minusculo e e deterministico', async () => {
  const hash1 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-de-teste')
  const hash2 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-de-teste')
  assertEquals(hash1, hash2)
  assertEquals(/^[0-9a-f]+$/.test(hash1), true)
})

Deno.test('calcularHmac produz hashes diferentes para segredos diferentes', async () => {
  const hash1 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-a')
  const hash2 = await calcularHmac('id:1;request-id:r;ts:1;', 'segredo-b')
  assertEquals(hash1 === hash2, false)
})

Deno.test('compararComSeguranca retorna true para strings identicas', () => {
  assertEquals(compararComSeguranca('abc123', 'abc123'), true)
})

Deno.test('compararComSeguranca retorna false para strings diferentes de mesmo tamanho', () => {
  assertEquals(compararComSeguranca('abc123', 'abc124'), false)
})

Deno.test('compararComSeguranca retorna false para strings de tamanhos diferentes', () => {
  assertEquals(compararComSeguranca('abc', 'abcdef'), false)
})
