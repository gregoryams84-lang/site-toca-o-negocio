import { assertEquals } from 'https://deno.land/std@0.224.0/assert/mod.ts'
import { calcularPreco, PRECO_TRILHA_AVULSA, PRECO_DUAS_TRILHAS, PRECO_CURSO_COMPLETO } from './precos.ts'

const TRILHA_A = { id: 'a', nome: 'IA no Negócio' }
const TRILHA_B = { id: 'b', nome: 'Vendas' }
const TRILHA_C = { id: 'c', nome: 'Financeiro' }
const TRILHA_D = { id: 'd', nome: 'Marketing' }
const QUATRO_TRILHAS = [TRILHA_A, TRILHA_B, TRILHA_C, TRILHA_D]

Deno.test('1 trilha selecionada retorna preco de trilha avulsa', () => {
  const resultado = calcularPreco(['a'], QUATRO_TRILHAS)
  assertEquals(resultado, { preco: PRECO_TRILHA_AVULSA, titulo: 'Trilha: IA no Negócio' })
})

Deno.test('2 trilhas selecionadas retornam preco de duas trilhas', () => {
  const resultado = calcularPreco(['a', 'b'], QUATRO_TRILHAS)
  assertEquals(resultado, { preco: PRECO_DUAS_TRILHAS, titulo: 'Duas trilhas: IA no Negócio + Vendas' })
})

Deno.test('todas as trilhas selecionadas retornam preco de curso completo', () => {
  const resultado = calcularPreco(['a', 'b', 'c', 'd'], QUATRO_TRILHAS)
  assertEquals(resultado, { preco: PRECO_CURSO_COMPLETO, titulo: 'Curso completo — acesso a todas as trilhas' })
})

Deno.test('3 trilhas selecionadas (de um total de 4) retorna null', () => {
  const resultado = calcularPreco(['a', 'b', 'c'], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('array vazio retorna null', () => {
  const resultado = calcularPreco([], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('id duplicado retorna null', () => {
  const resultado = calcularPreco(['a', 'a'], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('id que nao existe em todasTrilhas retorna null', () => {
  const resultado = calcularPreco(['a', 'nao-existe'], QUATRO_TRILHAS)
  assertEquals(resultado, null)
})

Deno.test('1 trilha selecionada quando so existe 1 trilha no total ainda e avulsa, nao completo', () => {
  const resultado = calcularPreco(['a'], [TRILHA_A])
  assertEquals(resultado, { preco: PRECO_TRILHA_AVULSA, titulo: 'Trilha: IA no Negócio' })
})

Deno.test('2 trilhas selecionadas quando so existem 2 no total e duas trilhas, nao completo', () => {
  const resultado = calcularPreco(['a', 'b'], [TRILHA_A, TRILHA_B])
  assertEquals(resultado, { preco: PRECO_DUAS_TRILHAS, titulo: 'Duas trilhas: IA no Negócio + Vendas' })
})
