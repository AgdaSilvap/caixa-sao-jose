import { useMemo, useState } from "react"
import produtos from "../data/produtos.json"
import { ItemCarrinho } from "../types"

const STORAGE_KEY = "caixa_sao_jose_carrinho"

const carregarCarrinho = (): ItemCarrinho[] => {
  try {
    const dados = sessionStorage.getItem(STORAGE_KEY)
    if (!dados) return []
    return JSON.parse(dados) as ItemCarrinho[]
  } catch {
    return []
  }
}

const persistirCarrinho = (itens: ItemCarrinho[]) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(itens))
  } catch { }
}

export const useCarrinho = () => {
  const [itens, setItens] = useState<ItemCarrinho[]>(carregarCarrinho)

  const total = useMemo(() => {
    return itens.reduce((acc, { id, quantidade }) => {
      const preco = produtos.find((produto) => produto.id === id)?.preco || 0
      return acc + (quantidade * preco)
    }, 0)
  }, [itens])

  const atualizarItem = (item: ItemCarrinho) => {
    const index = itens.findIndex((i) => i.id === item.id)
    let itensAtualizados: ItemCarrinho[]
    if (index === -1) {
      itensAtualizados = [...itens, item]
    } else {
      itensAtualizados = [...itens]
      itensAtualizados[index] = item
    }
    setItens(itensAtualizados)
    persistirCarrinho(itensAtualizados)
  }

  const getQuantidadeItem = (idProduto: string) => {
    const item = itens.find((i) => i.id === idProduto)
    if (!item) return 0
    return item.quantidade
  }

  const resetarCarrinho = () => {
    setItens([])
    try {
      sessionStorage.removeItem(STORAGE_KEY)
    } catch { }
  }

  return {
    total,
    atualizarItem,
    getQuantidadeItem,
    resetarCarrinho
  }
}