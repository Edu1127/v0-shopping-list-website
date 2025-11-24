"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Plus, Trash2, Check, LogOut } from "lucide-react"
import { getShoppingListItems, subscribeToShoppingListItems, type ShoppingList, type ShoppingListItem } from "@/lib/shopping-lists"
import AddItemModal from "./add-item-modal"

interface ListDetailsViewProps {
  list: ShoppingList & { items?: ShoppingListItem[] }
  onBack: () => void
  onAddItem: (listId: string, itemName: string, quantity: number) => void
  onToggleItem: (listId: string, itemId: string) => void
  onDeleteItem: (listId: string, itemId: string) => void
  onLogout: () => void
}

export default function ListDetailsView({
  list,
  onBack,
  onAddItem,
  onToggleItem,
  onDeleteItem,
  onLogout,
}: ListDetailsViewProps) {
  const [showAddItemModal, setShowAddItemModal] = useState(false)
  const [items, setItems] = useState<ShoppingListItem[]>(list.items || [])
  const [isLoadingItems, setIsLoadingItems] = useState(!list.items)

  useEffect(() => {
    if (!list.items) {
      loadItems()
    }

    // Subscribe to realtime changes
    const unsubscribe = subscribeToShoppingListItems(list.id, (updatedItems) => {
      setItems(updatedItems)
    })

    return () => {
      unsubscribe()
    }
  }, [list.id, list.items])

  async function loadItems() {
    try {
      const { items: fetchedItems } = await getShoppingListItems(list.id)
      setItems(fetchedItems)
    } catch (error) {
      console.error("Error loading items:", error)
    } finally {
      setIsLoadingItems(false)
    }
  }

  const completedCount = items.filter((item) => item.completed).length

  const handleDeleteItem = async (itemId: string) => {
    // Remove item from UI immediately (optimistic update)
    const previousItems = items
    setItems(items.filter((item) => item.id !== itemId))

    try {
      await onDeleteItem(list.id, itemId)
    } catch (error) {
      // Restore items if deletion fails
      console.error("Error deleting item:", error)
      setItems(previousItems)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-yellow-500 font-semibold hover:text-yellow-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900 flex-1 text-center">{list.name}</h1>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Sair
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Progress Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Progresso</h2>
          <div className="flex items-end gap-4">
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-yellow-400 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: items.length > 0 ? `${(completedCount / items.length) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>
            <span className="text-xl font-bold text-yellow-500">
              {items.length > 0 ? Math.round((completedCount / items.length) * 100) : 0}%
            </span>
          </div>
          <p className="text-gray-600 text-sm mt-3">
            {completedCount} de {items.length} itens marcados
          </p>
        </div>

        {/* Add Item Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddItemModal(true)}
            className="flex items-center gap-2 bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Adicionar Item
          </button>
        </div>

        {/* Items List */}
        <div className="space-y-3">
          {isLoadingItems ? (
            <p className="text-gray-600">Carregando itens...</p>
          ) : items.length > 0 ? (
            <>
              {/* Active Items */}
              {items.filter((item) => !item.completed).length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Pendente</h3>
                  <div className="space-y-2">
                    {items
                      .filter((item) => !item.completed)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-white rounded-lg p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <button
                            onClick={() => onToggleItem(list.id, item.id)}
                            className="flex-shrink-0 w-6 h-6 border-2 border-gray-300 rounded-full hover:border-yellow-400 transition-colors flex items-center justify-center"
                          >
                            <div className="w-4 h-4" />
                          </button>
                          <div className="flex-1">
                            <p className="text-gray-900 font-medium">{item.name}</p>
                            <p className="text-gray-500 text-sm">Quantidade: {item.quantity}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Deletar item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Completed Items */}
              {completedCount > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-semibold text-gray-600 mb-3 uppercase">Concluído</h3>
                  <div className="space-y-2">
                    {items
                      .filter((item) => item.completed)
                      .map((item) => (
                        <div
                          key={item.id}
                          className="bg-green-50 rounded-lg p-4 flex items-center gap-4 shadow-sm border border-green-100"
                        >
                          <button
                            onClick={() => onToggleItem(list.id, item.id)}
                            className="flex-shrink-0 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center hover:bg-green-600 transition-colors"
                          >
                            <Check className="w-4 h-4 text-white" />
                          </button>
                          <div className="flex-1">
                            <p className="text-gray-500 font-medium line-through">{item.name}</p>
                            <p className="text-gray-400 text-sm">Quantidade: {item.quantity}</p>
                          </div>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            aria-label="Deletar item"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">Nenhum item adicionado</p>
              <button
                onClick={() => setShowAddItemModal(true)}
                className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
              >
                Adicionar Primeiro Item
              </button>
            </div>
          )}
        </div>
      </main>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <AddItemModal
          onClose={() => setShowAddItemModal(false)}
          onAdd={(itemName, quantity) => {
            onAddItem(list.id, itemName, quantity)
            setShowAddItemModal(false)
          }}
        />
      )}
    </div>
  )
}
