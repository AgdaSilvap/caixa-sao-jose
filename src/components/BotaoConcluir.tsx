type BotaoConcluirProps = {
  onClick: () => void
  disabled: boolean
}

export const BotaoConcluir = ({ onClick, disabled }: BotaoConcluirProps) => {
  return (
    <button
      className="flex-1 bg-orange-teal-4 text-white px-4 py-2 rounded-lg disabled:opacity-50"
      disabled={disabled}
      onClick={onClick}
    >
      Concluir
    </button>
  )
}
