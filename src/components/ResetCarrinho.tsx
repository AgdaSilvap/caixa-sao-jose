export const ResetCarrinho = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      className="max-w-2xs bg-orange-teal-4 text-white px-4 py-2 rounded-lg"
      onClick={onClick}
    >
      Concluir
    </button>
  )
}
