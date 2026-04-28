import { ClockIcon, TrashIcon } from "lucide-react"
import { RegistroCompra } from "../types"
import { useFormatador } from "../hooks/useFormatador"

type HistoricoProps = {
  registros: RegistroCompra[]
  onExcluir: (id: string) => void
  onLimpar: () => void
}

const BADGE: Record<string, string> = {
  PIX: "bg-blue-100 text-blue-700",
  DINHEIRO: "bg-green-100 text-green-700",
  CADERNETA: "bg-purple-100 text-purple-700",
}

export const Historico = ({ registros, onExcluir, onLimpar }: HistoricoProps) => {
  const { formatarPreco } = useFormatador()

  if (registros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-orange-teal-1/50 gap-3">
        <ClockIcon className="size-12 opacity-40" strokeWidth={1.5} />
        <p className="text-sm font-semibold">Nenhuma compra registrada ainda</p>
      </div>
    )
  }

  // mais recente primeiro
  const ordenados = [...registros].sort(
    (a, b) => new Date(b.momentoConclusao).getTime() - new Date(a.momentoConclusao).getTime()
  )

  const handleExcluir = (registro: RegistroCompra) => {
    const data = new Date(registro.momentoConclusao).toLocaleString("pt-BR")
    const valor = formatarPreco(registro.valorTotal)
    if (confirm(`Excluir a compra de ${valor} registrada em ${data}?`)) {
      onExcluir(registro.id)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {ordenados.map((registro, index) => {
        const data = new Date(registro.momentoConclusao)
        const dataFormatada = data.toLocaleDateString("pt-BR")
        const horaFormatada = data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

        return (
          <div
            key={registro.id}
            className="flex items-center gap-3 bg-white rounded-xl border-2 border-orange-teal-5 px-4 py-3"
          >
            {/* Número sequencial (invertido = mais recente = maior número) */}
            <div className="shrink-0 size-8 rounded-full bg-orange-teal-5 flex items-center justify-center">
              <span className="text-xs font-bold text-orange-teal-1">
                {registros.length - index}
              </span>
            </div>

            {/* Dados da compra */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`text-xs font-bold px-2 py-0.5 rounded-full ${BADGE[registro.formaPagamento]}`}
                >
                  {registro.formaPagamento}
                </span>
                <span className="text-xs text-orange-teal-1/60 font-medium">
                  {dataFormatada} · {horaFormatada}
                </span>
              </div>
              <p className="font-mono font-bold text-lg tracking-tighter text-orange-teal-4 mt-0.5">
                {formatarPreco(registro.valorTotal)}
              </p>
            </div>

            {/* Botão excluir */}
            <button
              type="button"
              onClick={() => handleExcluir(registro)}
              title="Excluir este registro"
              className="shrink-0 p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition"
            >
              <TrashIcon className="size-4" />
            </button>
          </div>
        )
      })}

      <div className="flex justify-center">
        <button
          type="button"
          onClick={() => {
            if (confirm("Limpar todo o histórico de compras?")) onLimpar()
          }}
          className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-600 transition px-3 py-1.5 rounded-lg hover:bg-red-50"
        >
          <TrashIcon className="size-4" />
          Limpar histórico
        </button>
      </div>
    </div>
  )
}
