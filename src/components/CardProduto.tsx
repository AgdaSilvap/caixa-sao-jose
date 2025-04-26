import { MinusIcon, PlusIcon } from "lucide-react";
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
    <div className="relative flex gap-2 items-center border-2 border-orange-teal-5 p-4 rounded-lg">
      <img onClick={incrementar} src={produto.imagem ?? "/img/produto.jpg"} alt={produto.nome} className="size-24 object-cover rounded-lg bg-white/50" />
      <div className="flex flex-col gap-1 pl-8">
        <strong className="text-xl tracking-tighter">{produto.nome}</strong>
        <span className="font-semibold tracking-tighter text-orange-teal-1">{formatarPreco(produto.preco)}</span>
        <div className="flex items-center justify-between gap-4 rounded-lg">
          <button className="bg-orange-teal-2/80 text-white size-10 rounded-lg" onClick={decrementar} disabled={quantidade === 0}>
            <MinusIcon className="size-5 mx-auto" />
          </button>
          <strong className="text-lg font-semibold font-mono">{quantidade}</strong>
          <button className="bg-orange-teal-2/80 text-white size-10 rounded-lg" onClick={incrementar}>
            <PlusIcon className="size-5 mx-auto" />
          </button>
        </div>
      </div>
      {quantidade > 0 && (
        <div className="absolute -top-2 -right-2 bg-orange-teal-4 text-white size-10 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-xl font-bold font-mono">{quantidade}</span>
        </div>
      )}
    </div>
  )
}