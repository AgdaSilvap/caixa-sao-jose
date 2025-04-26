import { useMemo, useState } from "react"
import { produtos } from "../dados"
import { ItemCarrinho } from "../types"

export const useCarrinho = () => {
  const [itens, setItens] = useState<ItemCarrinho[]>([])

  const total = useMemo(() => {
    return itens.reduce((acc, { id, quantidade }) => {
      const preco = produtos.find((produto) => produto.id === id)?.preco || 0
      return acc + (quantidade * preco)
    }, 0)
  }, [itens])

  const atualizarItem = (item: ItemCarrinho) => {
    const index = itens.findIndex((i) => i.id === item.id)
    if (index === -1) {
      setItens((prev) => [...prev, item])
      return
    }
    const itensAtualizados = [...itens]
    itensAtualizados[index] = item
    setItens(itensAtualizados)
  }

  const getQuantidadeItem = (idProduto: number) => {
    const item = itens.find((i) => i.id === idProduto)
    if (!item) return 0
    return item.quantidade
  }

  const resetarCarrinho = () => setItens([])

  return {
    total,
    atualizarItem,
    getQuantidadeItem,
    resetarCarrinho
  }
}