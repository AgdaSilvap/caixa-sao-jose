export type Produto = {
  id: number,
  nome: string,
  preco: number,
  icone?: string
}

export type ItemCarrinho = {
  id: number,
  quantidade: number
}