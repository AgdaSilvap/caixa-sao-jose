export const useFormatador = () => {
  const formatarPreco = (preco: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(preco)
  }

  const formatarQuantidade = (quantidade: number) => {
    return quantidade.toString().padStart(2, '0')
  }

  return {
    formatarPreco,
    formatarQuantidade
  }
}
