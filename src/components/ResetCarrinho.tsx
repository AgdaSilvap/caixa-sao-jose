export const ResetCarrinho = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded"
      onClick={onClick}
    >
      Concluir pedido
    </button>
  )
}
