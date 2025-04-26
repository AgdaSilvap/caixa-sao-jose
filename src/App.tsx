import { MaximizeIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { CardProduto } from "./components/CardProduto";
import { Checkout } from "./components/Checkout";
import { Header } from "./components/Header";
import produtos from "./data/produtos.json";
import { useCarrinho } from "./hooks/useCarrinho";

export const App = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { total, atualizarItem, getQuantidadeItem, resetarCarrinho } = useCarrinho()
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen()
    } else {
      ref.current?.requestFullscreen({ navigationUI: "hide" })
    }
  }

  useEffect(() => {
    ref.current?.addEventListener("fullscreenchange", () => {
      setIsFullscreen(!!document.fullscreenElement)
    })
  }, [])

  return (
    <div ref={ref} className={`container mx-auto min-h-screen flex flex-col justify-between gap-4 py-4 px-4 backdrop:bg-white ${isFullscreen ? 'overflow-y-scroll' : ''}`} >
      <Header />
      {!isFullscreen && (
        <button
          type="button"
          onClick={handleFullscreen}
          className="hidden fixed top-4 right-4 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition duration-200 z-20"
        >
          <MaximizeIcon className="size-4" />
        </button>
      )}
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
