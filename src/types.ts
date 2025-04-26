export type Produto = {
  id: number,
  nome: string,
  preco: number,
  imagem?: string
}

export type ItemCarrinho = {
  id: number,
  quantidade: number
}
