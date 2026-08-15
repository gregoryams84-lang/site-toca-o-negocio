export const PRECO_TRILHA_AVULSA = 99.0
export const PRECO_DUAS_TRILHAS = 186.0
export const PRECO_CURSO_COMPLETO = 350.0

export interface Trilha {
  id: string
  nome: string
}

export interface ResultadoPreco {
  preco: number
  titulo: string
}

export function calcularPreco(trilhaIdsSelecionados: string[], todasTrilhas: Trilha[]): ResultadoPreco | null {
  if (trilhaIdsSelecionados.length === 0) return null

  if (new Set(trilhaIdsSelecionados).size !== trilhaIdsSelecionados.length) return null

  const selecionadas = todasTrilhas.filter((t) => trilhaIdsSelecionados.includes(t.id))
  if (selecionadas.length !== trilhaIdsSelecionados.length) return null

  // A ordem importa: "exatamente 1 selecionada" e "exatamente 2" são
  // sempre avulsa/duas, mesmo se o total de trilhas existentes também for
  // 1 ou 2 no momento (ex.: banco de desenvolvimento com poucas trilhas
  // cadastradas) — "curso completo" só vira um branch distinto quando o
  // total de trilhas é 3 ou mais.
  if (selecionadas.length === 1) {
    return { preco: PRECO_TRILHA_AVULSA, titulo: `Trilha: ${selecionadas[0].nome}` }
  }
  if (selecionadas.length === 2) {
    return { preco: PRECO_DUAS_TRILHAS, titulo: `Duas trilhas: ${selecionadas.map((t) => t.nome).join(' + ')}` }
  }
  if (selecionadas.length === todasTrilhas.length) {
    return { preco: PRECO_CURSO_COMPLETO, titulo: 'Curso completo — acesso a todas as trilhas' }
  }
  return null
}
