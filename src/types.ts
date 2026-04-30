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

export const formaPagamentoList = [
  { id: 'PIX', nome: 'Pix', icone: '📱', classeBadge: 'bg-blue-100 text-blue-700' },
  { id: 'DINHEIRO', nome: 'Dinheiro', icone: '💵', classeBadge: 'bg-green-100 text-green-700' },
  { id: 'CADERNETA', nome: 'Caderneta', icone: '📒', classeBadge: 'bg-purple-100 text-purple-700' },
] as const

export type FormaPagamento = typeof formaPagamentoList[number]['id']

export type RegistroCompra = {
  id: string,
  momentoConclusao: string,
  valorTotal: number,
  formaPagamento: FormaPagamento
}
