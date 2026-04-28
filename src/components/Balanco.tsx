import { useMemo } from "react"
import { RegistroCompra } from "../types"
import { useFormatador } from "../hooks/useFormatador"

type BalancoProps = {
  registros: RegistroCompra[]
}

type AgrupamentoDia = {
  data: string
  dataISO: string
  pix: number
  qtdPix: number
  dinheiro: number
  qtdDinheiro: number
  caderneta: number
  qtdCaderneta: number
  total: number
  qtdTotal: number
}

export const Balanco = ({ registros }: BalancoProps) => {
  const { formatarPreco } = useFormatador()

  const agrupamentos = useMemo(() => {
    const mapa = new Map<string, AgrupamentoDia>()

    registros.forEach((r) => {
      const data = new Date(r.momentoConclusao)
      const dataISO = data.toISOString().slice(0, 10)
      const dataFormatada = data.toLocaleDateString("pt-BR")

      if (!mapa.has(dataISO)) {
        mapa.set(dataISO, { data: dataFormatada, dataISO, pix: 0, qtdPix: 0, dinheiro: 0, qtdDinheiro: 0, caderneta: 0, qtdCaderneta: 0, total: 0, qtdTotal: 0 })
      }

      const entrada = mapa.get(dataISO)!
      if (r.formaPagamento === "PIX") {
        entrada.pix += r.valorTotal
        entrada.qtdPix += 1
      } else if (r.formaPagamento === "DINHEIRO") {
        entrada.dinheiro += r.valorTotal
        entrada.qtdDinheiro += 1
      } else {
        entrada.caderneta += r.valorTotal
        entrada.qtdCaderneta += 1
      }
      entrada.total += r.valorTotal
      entrada.qtdTotal += 1
    })

    return Array.from(mapa.values()).sort((a, b) => b.dataISO.localeCompare(a.dataISO))
  }, [registros])

  if (registros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-orange-teal-1/50 gap-3">
        <svg className="size-12 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M9 17v-2m3 2v-4m3 4v-6M5 20h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v11a2 2 0 002 2z" />
        </svg>
        <p className="text-sm font-semibold">Nenhuma venda registrada ainda</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {agrupamentos.map((dia) => (
          <div
            key={dia.dataISO}
            className="bg-white rounded-2xl border-2 border-orange-teal-5 overflow-hidden"
          >
            {/* Cabeçalho do dia */}
            <div className="bg-orange-teal-5 px-4 py-2.5">
              <span className="font-bold tracking-tighter text-orange-teal-1">{dia.data}</span>
            </div>

            {/* Linhas de pagamento */}
            <div className="divide-y divide-orange-teal-5">
              {dia.pix > 0 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">PIX</span>
                    <span className="text-xs text-orange-teal-1/60 font-medium">{dia.qtdPix} {dia.qtdPix === 1 ? 'compra' : 'compras'}</span>
                  </div>
                  <span className="font-mono font-semibold tracking-tighter text-orange-teal-1">
                    {formatarPreco(dia.pix)}
                  </span>
                </div>
              )}
              {dia.dinheiro > 0 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-green-100 text-green-700">DINHEIRO</span>
                    <span className="text-xs text-orange-teal-1/60 font-medium">{dia.qtdDinheiro} {dia.qtdDinheiro === 1 ? 'compra' : 'compras'}</span>
                  </div>
                  <span className="font-mono font-semibold tracking-tighter text-orange-teal-1">
                    {formatarPreco(dia.dinheiro)}
                  </span>
                </div>
              )}
              {dia.caderneta > 0 && (
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">CADERNETA</span>
                    <span className="text-xs text-orange-teal-1/60 font-medium">{dia.qtdCaderneta} {dia.qtdCaderneta === 1 ? 'compra' : 'compras'}</span>
                  </div>
                  <span className="font-mono font-semibold tracking-tighter text-orange-teal-1">
                    {formatarPreco(dia.caderneta)}
                  </span>
                </div>
              )}

              {/* Total do dia */}
              <div className="flex items-center justify-between px-4 py-3 bg-orange-teal-5/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tighter text-orange-teal-4">TOTAL</span>
                  <span className="text-xs text-orange-teal-4/60 font-medium">{dia.qtdTotal} {dia.qtdTotal === 1 ? 'compra' : 'compras'}</span>
                </div>
                <span className="font-mono font-bold text-lg tracking-tighter text-orange-teal-4">
                  {formatarPreco(dia.total)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
