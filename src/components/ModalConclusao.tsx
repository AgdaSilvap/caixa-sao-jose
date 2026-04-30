import { useState } from "react"
import { FormaPagamento, formaPagamentoList } from "../types"
import { useFormatador } from "../hooks/useFormatador"

type ModalConclusaoProps = {
  total: number
  onConfirmar: (formaPagamento: FormaPagamento) => void
  onCancelar: () => void
}

export const ModalConclusao = ({ total, onConfirmar, onCancelar }: ModalConclusaoProps) => {
  const [formaSelecionada, setFormaSelecionada] = useState<FormaPagamento | null>(null)
  const { formatarPreco } = useFormatador()

  const formasPagamento: { tipo: FormaPagamento, icon: string }[] = [
    { tipo: "PIX", icon: "💳" },
    { tipo: "DINHEIRO", icon: "💵" },
    { tipo: "CADERNETA", icon: "📒" },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onCancelar}
    >
      <div
        className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho */}
        <div className="bg-orange-teal-4 px-6 py-5">
          <h2 className="text-white text-2xl font-bold tracking-tighter">Concluir Venda</h2>
          <p className="text-white/80 text-sm mt-1">Selecione a forma de pagamento</p>
        </div>

        {/* Corpo */}
        <div className="px-6 py-6 flex flex-col gap-5">
          {/* Valor total */}
          <div className="bg-orange-teal-5 rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm font-semibold tracking-tighter text-orange-teal-1">Valor Total</span>
            <span className="text-2xl font-bold font-mono tracking-tighter text-orange-teal-4">
              {formatarPreco(total)}
            </span>
          </div>

          {/* Seleção de forma de pagamento */}
          <div className="flex flex-col gap-2">
            {formaPagamentoList.map(({ id, icone, nome }) => (
              <button
                key={id}
                type="button"
                onClick={() => setFormaSelecionada(id)}
                className={[
                  "flex-1 py-4 rounded-xl border-2 font-bold text-lg tracking-tighter transition-all duration-200",
                  formaSelecionada === id
                    ? "border-orange-teal-4 bg-orange-teal-4 text-white scale-105 shadow-lg"
                    : "border-orange-teal-5 bg-orange-teal-5 text-orange-teal-1 hover:border-orange-teal-3",
                ].join(" ")}
              >
                {icone} {nome}
              </button>
            ))}
          </div>
        </div>

        {/* Ações */}
        <div className="px-6 pb-safe-6 flex gap-3" style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
          <button
            type="button"
            onClick={onCancelar}
            className="flex-1 py-3 rounded-xl border-2 border-slate-200 text-slate-500 font-semibold hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            disabled={formaSelecionada === null}
            onClick={() => formaSelecionada && onConfirmar(formaSelecionada)}
            className={[
              "flex-1 py-3 rounded-xl font-bold text-white transition-all duration-200",
              formaSelecionada
                ? "bg-orange-teal-4 hover:opacity-90 shadow-md"
                : "bg-slate-300 cursor-not-allowed",
            ].join(" ")}
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

