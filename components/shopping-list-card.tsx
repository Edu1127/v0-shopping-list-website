"use client"

import { Trash2, ChevronRight, CheckCircle2 } from "lucide-react"

interface ShoppingItem {
  id: string
  name: string
  quantity: number
  completed: boolean
}

interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  createdAt: Date
}

interface ShoppingListCardProps {
  list: ShoppingList
  onSelect: () => void
  onDelete: () => void
}

export default function ShoppingListCard({ list, onSelect, onDelete }: ShoppingListCardProps) {
  const completedCount = list.items.filter((item) => item.completed).length
  const totalCount = list.items.length

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-foreground">{list.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{new Date(list.createdAt).toLocaleDateString("pt-BR")}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
            className="text-gray-400 hover:text-red-500 transition-colors"
            aria-label="Deletar lista"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Progresso</span>
            <span className="text-sm font-semibold text-primary">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{
                width: totalCount > 0 ? `${(completedCount / totalCount) * 100}%` : "0%",
              }}
            />
          </div>
        </div>

        {/* Items Summary */}
        <div className="mb-4">
          {totalCount > 0 ? (
            <div className="space-y-2">
              {list.items.slice(0, 2).map((item) => (
                <div key={item.id} className="flex items-center gap-2 text-sm text-gray-700">
                  {item.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                  ) : (
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full flex-shrink-0" />
                  )}
                  <span className={item.completed ? "line-through text-gray-400" : ""}>
                    {item.name} ({item.quantity}x)
                  </span>
                </div>
              ))}
              {totalCount > 2 && <p className="text-sm text-gray-500 pt-2">+ {totalCount - 2} itens</p>}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Nenhum item adicionado</p>
          )}
        </div>

        {/* Action Button */}
        <button
          onClick={onSelect}
          className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Abrir
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
