"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface CreateListModalProps {
  onClose: () => void
  onCreate: (name: string) => void
}

export default function CreateListModal({ onClose, onCreate }: CreateListModalProps) {
  const [listName, setListName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (listName.trim()) {
      onCreate(listName)
      setListName("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-foreground">Nova Lista</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="listName" className="block text-sm font-medium text-gray-700 mb-2">
              Nome da Lista
            </label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={(e) => setListName(e.target.value)}
              placeholder="Ex: Supermercado, Farmácia..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              autoFocus
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!listName.trim()}
              className="flex-1 px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 transition-colors"
            >
              Criar Lista
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
