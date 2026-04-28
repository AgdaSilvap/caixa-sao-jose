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

export type FormaPagamento = 'PIX' | 'DINHEIRO' | 'CADERNETA'

export type RegistroCompra = {
  id: string,
  momentoConclusao: string,
  valorTotal: number,
  formaPagamento: FormaPagamento
}
