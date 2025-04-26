import { useMemo, useState } from "react"
import valoresRecebidosPossiveis from "../data/valoresRecebidos.json"
import { useFormatador } from "../hooks/useFormatador"
import { ResetCarrinho } from "./ResetCarrinho"

type CheckoutProps = {
  total: number,
  resetarCarrinho: () => void
}

export const Checkout = ({ total, resetarCarrinho }: CheckoutProps) => {
  const [valorPago, setValorPago] = useState<number>(0)
  const { formatarPreco } = useFormatador()

  const troco = useMemo(() => {
    if (valorPago === 0) return 0
    const diferenca = valorPago - total
    return Math.max(diferenca, 0)
  }, [valorPago, total])

  return (
    <div className="flex gap-2 justify-between">
      <div className="flex flex-1 pr-12 flex-col gap-2">
        <label htmlFor="valor" className="text-lg font-bold tracking-tighter">💵 Valor recebido</label>
        <input
          id="valor"
          className="border-2 border-slate-200 rounded-lg px-4 py-2 text-lg font-mono w-2xs"
          placeholder="0.00"
          type="text"
          inputMode="numeric"
          value={valorPago}
          onChange={(event) => {
            const valor = parseFloat(event.target.value)

            if (Number.isNaN(valor)) {
              setValorPago(0)
              return
            }

            setValorPago(valor)
          }}
        />

        <div className="flex gap-2">
          {valoresRecebidosPossiveis.map((valor) => (
            <button
              type="button"
              key={valor}
              className="inline-flex items-center justify-center px-2 rounded-lg border-2 border-slate-200 bg-slate-100 text-lg font-mono"
              onClick={() => setValorPago(valor)}
            >
              {valor}
            </button>
          ))}
        </div>
        <dl>
          <dt>Troco</dt>
          <dd className="font-bold text-xl font-mono">
            {formatarPreco(troco)}
          </dd>
        </dl>
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <dl>
          <dt>Total</dt>
          <dd className="font-bold text-4xl font-mono">
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
