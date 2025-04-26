export const Header = () => {
  return (
    <header className="flex items-center justify-between gap-2 p-4 bg-orange-teal-5 rounded-lg sticky top-0 z-10">
      <img src="/img/sao-jose-operario.png" alt="São José Operário" className="w-16 h-16 object-contain rounded-lg bg-white/50 border-2 border-orange-teal-2" />
      <h1 className="text-xl md:text-3xl font-bold tracking-tighter font-cursive">Comunidade São José Operário</h1>
    </header>
  )
}
