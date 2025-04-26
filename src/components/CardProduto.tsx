import { useFormatador } from "../hooks/useFormatador";
import { ItemCarrinho, Produto } from "../types";

type CardProdutoProps = {
  quantidade: number;
  produto: Produto,
  onChangeQuantidade: (item: ItemCarrinho) => void
};

export const CardProduto = ({ quantidade, produto, onChangeQuantidade }: CardProdutoProps) => {
  const { formatarPreco } = useFormatador()

  const incrementar = () => {
    const quantidadeAtual = quantidade + 1
    onChangeQuantidade({ id: produto.id, quantidade: quantidadeAtual })
  }

  const decrementar = () => {
    if (quantidade <= 0) return
    const quantidadeAtual = quantidade - 1
    onChangeQuantidade({ id: produto.id, quantidade: quantidadeAtual })
  }

  return (
    <div className="flex gap-2 items-center border-2 border-slate-200 p-4 rounded-lg">
      <span className="text-7xl">{produto.icone}</span>
      <div className="flex flex-1 flex-col gap-1 pl-8">
        <strong className="text-xl tracking-tighter">{produto.nome}</strong>
        <span className="font-medium tracking-tighter">{formatarPreco(produto.preco)}</span>
        <div className="flex items-center gap-4">
          <button className="bg-rose-500 text-white px-4 py-2 rounded-lg" onClick={decrementar} disabled={quantidade === 0}>-</button>
          <span className="text-lg">{quantidade}</span>
          <button className="bg-sky-500 text-white px-4 py-2 rounded-lg" onClick={incrementar}>+</button>
        </div>
      </div>
    </div>
  )
}