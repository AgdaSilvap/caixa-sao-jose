import { RegistroCompra, formaPagamentoList } from "../types"
import { useFormatador } from "../hooks/useFormatador"
import { useBalanco } from "../hooks/useBalanco"

type BalancoProps = {
  registros: RegistroCompra[]
}

export const Balanco = ({ registros }: BalancoProps) => {
  const { formatarPreco } = useFormatador()
  const agrupamentos = useBalanco(registros)

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
            <div className="bg-orange-teal-5 px-4 py-2.5">
              <span className="font-bold tracking-tighter text-orange-teal-1">{dia.data}</span>
            </div>

            <div className="divide-y divide-orange-teal-5">
              {formaPagamentoList.map((formaPagamento) => (
                dia.totais[formaPagamento.id].valor > 0 && (
                  <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${formaPagamento.classeBadge}`}>
                        {formaPagamento.nome}
                      </span>
                      <span className="text-xs text-orange-teal-1/60 font-medium">{dia.totais[formaPagamento.id].quantidade} {dia.totais[formaPagamento.id].quantidade === 1 ? 'compra' : 'compras'}</span>
                    </div>
                    <span className="font-mono font-semibold tracking-tighter text-orange-teal-1">
                      {formatarPreco(dia.totais[formaPagamento.id].valor)}
                    </span>
                  </div>
                )
              ))}

              <div className="flex items-center justify-between px-4 py-3 bg-orange-teal-5/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold tracking-tighter text-orange-teal-4">TOTAL</span>
                  <span className="text-xs text-orange-teal-4/60 font-medium">{dia.quantidadeTotal} {dia.quantidadeTotal === 1 ? 'compra' : 'compras'}</span>
                </div>
                <span className="font-mono font-bold text-lg tracking-tighter text-orange-teal-4">
                  {formatarPreco(dia.totalGeral)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
