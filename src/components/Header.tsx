export const Header = () => {
  return (
    <header className="flex items-center gap-x-8 p-4 bg-orange-teal-5 rounded-lg sticky top-0 z-10">
      <img src="/img/sao-jose-operario.png" alt="São José Operário" className="w-16 h-16 object-contain rounded-lg bg-white/50 border-2 border-orange-teal-2" />
      <h1 className="text-2xl md:text-3xl tracking-tighter font-cursive">
        <small className="block text-xl md:text-2xl">Comunidade</small>
        <span className="font-bold">São José Operário</span>
      </h1>
    </header>
  )
}
