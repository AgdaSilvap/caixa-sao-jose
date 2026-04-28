import { BarChart2Icon, ClockIcon, MaximizeIcon, XIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Balanco } from "./components/Balanco";
import { Historico } from "./components/Historico";
import { CardProduto } from "./components/CardProduto";
import { Checkout } from "./components/Checkout";
import { Header } from "./components/Header";
import { ModalConclusao } from "./components/ModalConclusao";
import produtos from "./data/produtos.json";
import { useCarrinho } from "./hooks/useCarrinho";
import { useRegistros } from "./hooks/useRegistros";
import { FormaPagamento } from "./types";

export const App = () => {
  const ref = useRef<HTMLDivElement>(null)
  const { total, atualizarItem, getQuantidadeItem, resetarCarrinho } = useCarrinho()
  const { registros, salvarRegistro, limparRegistros, excluirRegistro } = useRegistros()
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [modalConclusaoAberto, setModalConclusaoAberto] = useState(false)
  const [balancoAberto, setBalancoAberto] = useState(false)
  const [historicoAberto, setHistoricoAberto] = useState(false)
  const produtosOrdenados = [...produtos].sort((a, b) => a.nome.localeCompare(b.nome))

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

  const handleConfirmarConclusao = (formaPagamento: FormaPagamento) => {
    salvarRegistro(total, formaPagamento)
    resetarCarrinho()
    setModalConclusaoAberto(false)
  }

  return (
    <div ref={ref} className={`container mx-auto min-h-screen flex flex-col justify-between gap-4 py-4 px-4 backdrop:bg-white ${isFullscreen ? 'overflow-y-scroll' : ''}`}>
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

      {/* Grade de produtos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {produtosOrdenados.map((produto) => (
          <CardProduto
            key={produto.id}
            produto={produto}
            quantidade={getQuantidadeItem(produto.id)}
            onChangeQuantidade={atualizarItem}
          />
        ))}
      </div>

      <Checkout
        total={total}
        onConcluir={() => setModalConclusaoAberto(true)}
        onAbrirBalanco={() => setBalancoAberto(true)}
        onAbrirHistorico={() => setHistoricoAberto(true)}
      />

      {/* Modal de conclusão */}
      {modalConclusaoAberto && (
        <ModalConclusao
          total={total}
          onConfirmar={handleConfirmarConclusao}
          onCancelar={() => setModalConclusaoAberto(false)}
        />
      )}

      {/* Modal de balanço */}
      {balancoAberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-orange-teal-5 shrink-0">
              <div className="flex items-center gap-2">
                <BarChart2Icon className="size-5 text-orange-teal-4" />
                <h2 className="text-xl font-bold tracking-tighter text-orange-teal-1">Fechamento (nesse dispositivo)</h2>
              </div>
              <button type="button" onClick={() => setBalancoAberto(false)} className="p-1.5 rounded-lg hover:bg-orange-teal-5 text-orange-teal-1 transition">
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4">
              <p className="text-xs text-orange-teal-1 mb-2">Os valores mostrados aqui são baseados no histórico de compras realizado neste dispositivo.</p>
              <Balanco registros={registros} />
            </div>
          </div>
        </div>
      )}

      {/* Modal de histórico */}
      {historicoAberto && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b border-orange-teal-5 shrink-0">
              <div className="flex items-center gap-2">
                <ClockIcon className="size-5 text-orange-teal-4" />
                <h2 className="text-xl font-bold tracking-tighter text-orange-teal-1">Histórico (nesse dispositivo)</h2>
              </div>
              <button type="button" onClick={() => setHistoricoAberto(false)} className="p-1.5 rounded-lg hover:bg-orange-teal-5 text-orange-teal-1 transition">
                <XIcon className="size-5" />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-4">
              <p className="text-xs text-orange-teal-1 mb-2">Os valores mostrados aqui são baseados no histórico de compras realizado neste dispositivo.</p>
              <Historico registros={registros} onExcluir={excluirRegistro} onLimpar={limparRegistros} />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
