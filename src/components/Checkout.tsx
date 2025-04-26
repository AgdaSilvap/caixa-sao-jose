import { useMemo, useState } from "react"
import valoresRecebidosPossiveis from "../data/valoresRecebidos.json"
import { useFormatador } from "../hooks/useFormatador"
import { ResetCarrinho } from "./ResetCarrinho"

type CheckoutProps = {
  total: number,
  resetarCarrinho: () => void
}

export const Checkout = ({ total, resetarCarrinho }: CheckoutProps) => {
  const [valorPago, setValorPago] = useState<number | null>(null)
  const { formatarPreco } = useFormatador()

  const troco = useMemo(() => {
    if (!valorPago || valorPago === 0) return 0
    const diferenca = valorPago - total
    return Math.max(diferenca, 0)
  }, [valorPago, total])

  return (
    <div className="sticky bottom-0 z-10 flex gap-2 justify-between bg-orange-teal-5 rounded-lg p-4">
      <div className="flex flex-col pr-12 gap-2">
        <div className="flex gap-2">
          <div className="flex flex-col">
            <label htmlFor="valor" className="text-lg font-bold tracking-tighter">Valor recebido</label>
            <input
              id="valor"
              className="max-w-32 border-2 border-slate-200 bg-white rounded-lg text-right px-4 py-2 text-lg font-mono tracking-tighter font-semibold"
              placeholder="0.00"
              type="text"
              inputMode="numeric"
              value={valorPago ?? ""}
              onChange={(event) => {
                const valor = parseFloat(event.target.value)

                if (Number.isNaN(valor)) {
                  setValorPago(0)
                  return
                }

                setValorPago(valor)
              }}
              onFocus={(event) => event.currentTarget.select()}
              onBlur={(event) => event.currentTarget.blur()}
              onKeyDown={(event => {
                if (event.key === "Enter") {
                  event.preventDefault()
                  event.currentTarget.blur()
                }
              })}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="troco" className="text-lg font-bold tracking-tighter">Troco</label>
            <input
              id="troco"
              className="max-w-32 border-2 border-slate-200 bg-white/75 rounded-lg text-right px-4 py-2 text-lg font-mono tracking-tighter"
              placeholder="0.00"
              type="text"
              value={formatarPreco(troco)}
              readOnly
              tabIndex={-1}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {valoresRecebidosPossiveis.map((valor) => (
            <button
              type="button"
              key={valor}
              className="flex items-center justify-center w-12 py-1 rounded-lg border-2 border-orange-teal-2 bg-orange-teal-2/60 text-white font-mono tracking-tighter font-semibold"
              onClick={() => setValorPago(valor)}
            >
              {valor}
            </button>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-2 mt-auto items-end">
        <dl className="text-right">
          <dt className="tracking-tighter font-semibold">Total</dt>
          <dd className="font-bold text-3xl font-mono">
            {formatarPreco(total)}
          </dd>
        </dl>
        <ResetCarrinho
          onClick={() => {
            resetarCarrinho()
            setValorPago(0)
          }}
        />
      </div>
    </div>
  )
}
