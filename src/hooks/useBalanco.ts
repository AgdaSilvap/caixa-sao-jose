import { useMemo } from "react"
import { FormaPagamento, RegistroCompra } from "../types"

type TotalFormaPagamento = {
  [K in FormaPagamento]: {
    valor: number
    quantidade: number
  }
}

export type AgrupamentoDia = {
  data: string
  dataISO: string
  totais: TotalFormaPagamento
  totalGeral: number
  quantidadeTotal: number
}

const totaisInit = (): TotalFormaPagamento => ({
  PIX: { valor: 0, quantidade: 0 },
  DINHEIRO: { valor: 0, quantidade: 0 },
  CADERNETA: { valor: 0, quantidade: 0 },
})

const parseDiaBR = (momentoISO: string): { dataISO: string; dataFormatada: string } => {
  const partes = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(momentoISO))
  const dia = partes.find((p) => p.type === "day")!.value
  const mes = partes.find((p) => p.type === "month")!.value
  const ano = partes.find((p) => p.type === "year")!.value
  return { dataISO: `${ano}-${mes}-${dia}`, dataFormatada: `${dia}/${mes}/${ano}` }
}

export function agruparRegistros(registros: RegistroCompra[]): AgrupamentoDia[] {
  const mapa = new Map<string, AgrupamentoDia>()

  registros.forEach((r) => {
    const { dataISO, dataFormatada } = parseDiaBR(r.momentoConclusao)

    if (!mapa.has(dataISO)) {
      mapa.set(dataISO, {
        data: dataFormatada,
        dataISO,
        totais: totaisInit(),
        totalGeral: 0,
        quantidadeTotal: 0,
      })
    }

    const entrada = mapa.get(dataISO)!

    entrada.totais[r.formaPagamento].valor += r.valorTotal
    entrada.totais[r.formaPagamento].quantidade += 1
    entrada.totalGeral += r.valorTotal
    entrada.quantidadeTotal += 1
  })

  return Array.from(mapa.values()).sort((a, b) =>
    b.dataISO.localeCompare(a.dataISO)
  )
}

export function useBalanco(registros: RegistroCompra[]): AgrupamentoDia[] {
  return useMemo(() => agruparRegistros(registros), [registros])
}
