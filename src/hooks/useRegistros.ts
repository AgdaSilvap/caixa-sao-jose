import { useState } from "react"
import { FormaPagamento, RegistroCompra } from "../types"

const STORAGE_KEY = "caixa_sao_jose_registros"

const generateUUID = (): string => {
  try {
    const bytes = new Uint8Array(16)
    crypto.getRandomValues(bytes)
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = Array.from(bytes).map((b) => b.toString(16).padStart(2, "0"))
    return `${hex.slice(0, 4).join("")}-${hex.slice(4, 6).join("")}-${hex.slice(6, 8).join("")}-${hex.slice(8, 10).join("")}-${hex.slice(10).join("")}`
  } catch {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0
      return (c === "x" ? r : (r & 0x3) | 0x8).toString(16)
    })
  }
}

const carregarRegistros = (): RegistroCompra[] => {
  try {
    const dados = localStorage.getItem(STORAGE_KEY)
    if (!dados) return []
    return JSON.parse(dados) as RegistroCompra[]
  } catch {
    return []
  }
}

const persistirRegistros = (registros: RegistroCompra[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(registros))
  } catch {
  }
}

export const useRegistros = () => {
  const [registros, setRegistros] = useState<RegistroCompra[]>(carregarRegistros)

  const salvarRegistro = (valorTotal: number, formaPagamento: FormaPagamento) => {
    const novoRegistro: RegistroCompra = {
      id: generateUUID(),
      momentoConclusao: new Date().toISOString(),
      valorTotal,
      formaPagamento,
    }
    const atualizados = [...registros, novoRegistro]
    setRegistros(atualizados)
    persistirRegistros(atualizados)
  }

  const limparRegistros = () => {
    setRegistros([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch { }
  }

  const excluirRegistro = (id: string) => {
    const atualizados = registros.filter((r) => r.id !== id)
    setRegistros(atualizados)
    persistirRegistros(atualizados)
  }

  return {
    registros,
    salvarRegistro,
    limparRegistros,
    excluirRegistro,
  }
}
