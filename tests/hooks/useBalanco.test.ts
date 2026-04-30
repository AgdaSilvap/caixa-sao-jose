import { describe, it, expect } from 'vitest'
import { agruparRegistros } from '../../src/hooks/useBalanco'
import { RegistroCompra } from '../../src/types'

function criarRegistro(overrides: Partial<RegistroCompra> = {}): RegistroCompra {
  return {
    id: crypto.randomUUID(),
    momentoConclusao: '2024-06-15T10:00:00.000Z',
    valorTotal: 50,
    formaPagamento: 'DINHEIRO',
    ...overrides,
  }
}

describe('agruparRegistros', () => {
  describe('lista vazia', () => {
    it('retorna array vazio quando não há registros', () => {
      expect(agruparRegistros([])).toEqual([])
    })
  })

  describe('agrupamento por dia', () => {
    it('agrupa registros do mesmo dia em uma única entrada', () => {
      const registros = [
        criarRegistro({ momentoConclusao: '2024-06-15T08:00:00.000Z' }),
        criarRegistro({ momentoConclusao: '2024-06-15T14:30:00.000Z' }),
        criarRegistro({ momentoConclusao: '2024-06-15T21:00:00.000Z' }),
      ]

      const resultado = agruparRegistros(registros)

      expect(resultado).toHaveLength(1)
      expect(resultado[0].dataISO).toBe('2024-06-15')
      expect(resultado[0].data).toBe('15/06/2024')
    })

    it('cria entradas separadas para dias diferentes', () => {
      const registros = [
        criarRegistro({ momentoConclusao: '2024-06-14T10:00:00.000Z' }),
        criarRegistro({ momentoConclusao: '2024-06-15T10:00:00.000Z' }),
        criarRegistro({ momentoConclusao: '2024-06-16T10:00:00.000Z' }),
      ]

      expect(agruparRegistros(registros)).toHaveLength(3)
    })

    it('ordena os dias do mais recente para o mais antigo', () => {
      const registros = [
        criarRegistro({ momentoConclusao: '2024-06-13T10:00:00.000Z' }),
        criarRegistro({ momentoConclusao: '2024-06-15T10:00:00.000Z' }),
        criarRegistro({ momentoConclusao: '2024-06-14T10:00:00.000Z' }),
      ]

      const datas = agruparRegistros(registros).map((d) => d.dataISO)

      expect(datas).toEqual(['2024-06-15', '2024-06-14', '2024-06-13'])
    })

    it('usa o horário de Brasília para determinar o dia (UTC-3)', () => {
      // 2024-06-16T01:00:00Z = 2024-06-15T22:00:00 BRT → deve ser agrupado como 15/06
      const registros = [
        criarRegistro({ momentoConclusao: '2024-06-15T10:00:00.000Z' }), // 07:00 BRT — 15/06
        criarRegistro({ momentoConclusao: '2024-06-16T01:00:00.000Z' }), // 22:00 BRT — 15/06 (não 16/06!)
      ]

      const resultado = agruparRegistros(registros)

      expect(resultado).toHaveLength(1)
      expect(resultado[0].dataISO).toBe('2024-06-15')
      expect(resultado[0].quantidadeTotal).toBe(2)
    })
  })

  describe('totais por forma de pagamento', () => {
    it('acumula corretamente valores e quantidade de PIX', () => {
      const registros = [
        criarRegistro({ formaPagamento: 'PIX', valorTotal: 30 }),
        criarRegistro({ formaPagamento: 'PIX', valorTotal: 70 }),
      ]

      const { totais } = agruparRegistros(registros)[0]

      expect(totais.PIX.valor).toBe(100)
      expect(totais.PIX.quantidade).toBe(2)
    })

    it('acumula corretamente valores e quantidade de DINHEIRO', () => {
      const registros = [
        criarRegistro({ formaPagamento: 'DINHEIRO', valorTotal: 20 }),
        criarRegistro({ formaPagamento: 'DINHEIRO', valorTotal: 80 }),
      ]

      const { totais } = agruparRegistros(registros)[0]

      expect(totais.DINHEIRO.valor).toBe(100)
      expect(totais.DINHEIRO.quantidade).toBe(2)
    })

    it('acumula corretamente valores e quantidade de CADERNETA', () => {
      const registros = [
        criarRegistro({ formaPagamento: 'CADERNETA', valorTotal: 15 }),
        criarRegistro({ formaPagamento: 'CADERNETA', valorTotal: 25 }),
      ]

      const { totais } = agruparRegistros(registros)[0]

      expect(totais.CADERNETA.valor).toBe(40)
      expect(totais.CADERNETA.quantidade).toBe(2)
    })

    it('mantém zerados os valores das formas de pagamento não utilizadas', () => {
      const registros = [criarRegistro({ formaPagamento: 'PIX', valorTotal: 50 })]

      const { totais } = agruparRegistros(registros)[0]

      expect(totais.DINHEIRO.valor).toBe(0)
      expect(totais.DINHEIRO.quantidade).toBe(0)
      expect(totais.CADERNETA.valor).toBe(0)
      expect(totais.CADERNETA.quantidade).toBe(0)
    })
  })

  describe('total geral do dia', () => {
    it('calcula o totalGeral e a quantidadeTotal com formas de pagamento mistas', () => {
      const registros = [
        criarRegistro({ formaPagamento: 'PIX', valorTotal: 40 }),
        criarRegistro({ formaPagamento: 'DINHEIRO', valorTotal: 35 }),
        criarRegistro({ formaPagamento: 'CADERNETA', valorTotal: 25 }),
      ]

      const dia = agruparRegistros(registros)[0]

      expect(dia.totalGeral).toBe(100)
      expect(dia.quantidadeTotal).toBe(3)
    })

    it('calcula totais independentes para cada dia', () => {
      const registros = [
        criarRegistro({ momentoConclusao: '2024-06-14T10:00:00.000Z', valorTotal: 60 }),
        criarRegistro({ momentoConclusao: '2024-06-15T10:00:00.000Z', valorTotal: 40 }),
        criarRegistro({ momentoConclusao: '2024-06-15T18:00:00.000Z', valorTotal: 10 }),
      ]

      // Ordenado do mais recente: [15/06, 14/06]
      const resultado = agruparRegistros(registros)

      expect(resultado[0].dataISO).toBe('2024-06-15')
      expect(resultado[0].totalGeral).toBe(50)
      expect(resultado[0].quantidadeTotal).toBe(2)

      expect(resultado[1].dataISO).toBe('2024-06-14')
      expect(resultado[1].totalGeral).toBe(60)
      expect(resultado[1].quantidadeTotal).toBe(1)
    })
  })

  describe('campo data formatada', () => {
    it('inclui a data formatada em pt-BR no padrão DD/MM/AAAA', () => {
      const registros = [criarRegistro({ momentoConclusao: '2024-06-15T12:00:00.000Z' })]

      const dia = agruparRegistros(registros)[0]

      expect(dia.data).toMatch(/\d{2}\/\d{2}\/\d{4}/)
    })
  })
})
