import { CardProduto } from "./components/CardProduto";
import { Checkout } from "./components/Checkout";
import { Header } from "./components/Header";
import produtos from "./data/produtos.json";
import { useCarrinho } from "./hooks/useCarrinho";

export const App = () => {
  const { total, atualizarItem, getQuantidadeItem, resetarCarrinho } = useCarrinho()

  return (
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtos.map((produto) => (
          <CardProduto
            key={produto.id}
            produto={produto}
            quantidade={getQuantidadeItem(produto.id)}
            onChangeQuantidade={atualizarItem} />
        ))}
      </div>
      <Checkout total={total} resetarCarrinho={resetarCarrinho} />
    </div>
  )
}
