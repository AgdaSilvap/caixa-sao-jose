export type Produto = {
  id: string,
  nome: string,
  preco: number,
  imagem?: string
}

export type ItemCarrinho = {
  id: string,
  quantidade: number
}
