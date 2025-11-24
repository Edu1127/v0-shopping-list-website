"use client"

import { useState, useEffect } from "react"
import { LogOut, Plus } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getShoppingLists, createShoppingList, deleteShoppingList, subscribeToShoppingLists, type ShoppingList } from "@/lib/shopping-lists"
import ShoppingListCard from "./shopping-list-card"
import CreateListModal from "./create-list-modal"
import ListDetailsView from "./list-details-view"

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export default function Dashboard({ userName, onLogout }: DashboardProps) {
  const { user } = useAuth()
  const [lists, setLists] = useState<ShoppingList[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  useEffect(() => {
    if (user) {
      loadLists()
      // Subscribe to realtime changes
      const unsubscribe = subscribeToShoppingLists(user.id, (updatedLists) => {
        setLists(updatedLists)
      })

      return () => {
        unsubscribe()
      }
    }
  }, [user])

  async function loadLists() {
    try {
      if (!user) return
      setIsLoading(true)
      const { lists: fetchedLists } = await getShoppingLists(user.id)
      setLists(fetchedLists)
    } catch (error) {
      console.error("Error loading lists:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateList = async (name: string) => {
    try {
      if (!user) return
      const { list } = await createShoppingList(user.id, name)
      if (list) {
        setLists([list, ...lists])
        setShowCreateModal(false)
      }
    } catch (error) {
      console.error("Error creating list:", error)
    }
  }

  const handleDeleteList = async (id: string) => {
    try {
      await deleteShoppingList(id)
      setLists(lists.filter((list) => list.id !== id))
      if (selectedListId === id) {
        setSelectedListId(null)
      }
    } catch (error) {
      console.error("Error deleting list:", error)
    }
  }

  const handleAddItem = async (listId: string, itemName: string, quantity: number) => {
    try {
      const { addShoppingListItem } = await import("@/lib/shopping-lists")
      await addShoppingListItem(listId, itemName, quantity)
      // Realtime subscription will handle the update
    } catch (error) {
      console.error("Error adding item:", error)
    }
  }

  const handleToggleItem = async (listId: string, itemId: string) => {
    try {
      const { toggleShoppingListItem, getShoppingListItems } = await import("@/lib/shopping-lists")
      
      // Get current items to find the item's current completed state
      const { items } = await getShoppingListItems(listId)
      const item = items.find((i) => i.id === itemId)
      
      if (item) {
        await toggleShoppingListItem(itemId, !item.completed)
        // Realtime subscription will handle the update
      }
    } catch (error) {
      console.error("Error toggling item:", error)
    }
  }

  const handleDeleteItem = async (listId: string, itemId: string) => {
    try {
      const { deleteShoppingListItem } = await import("@/lib/shopping-lists")
      await deleteShoppingListItem(itemId)
      // Realtime subscription will handle the update
    } catch (error) {
      console.error("Error deleting item:", error)
    }
  }

  const selectedList = lists.find((list) => list.id === selectedListId)

  if (selectedList) {
    return (
      <ListDetailsView
        list={selectedList}
        onBack={() => setSelectedListId(null)}
        onAddItem={handleAddItem}
        onToggleItem={handleToggleItem}
        onDeleteItem={handleDeleteItem}
        onLogout={onLogout}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-yellow-500">ShopList</h1>
            <p className="text-gray-700 text-sm">Bem-vindo, {userName}</p>
          </div>
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
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Create List Button */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Minhas Listas</h2>
            <p className="text-gray-700">Gerencie suas listas de compras</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-yellow-400 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Lista
          </button>
        </div>

        {/* Lists Grid */}
        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Carregando listas...</p>
          </div>
        ) : lists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lists.map((list) => (
              <ShoppingListCard
                key={list.id}
                list={list}
                onSelect={() => setSelectedListId(list.id)}
                onDelete={() => handleDeleteList(list.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Nenhuma lista criada ainda</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-yellow-400 text-white px-6 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors"
            >
              Criar Primeira Lista
            </button>
          </div>
        )}
      </main>

      {/* Create List Modal */}
      {showCreateModal && <CreateListModal onClose={() => setShowCreateModal(false)} onCreate={handleCreateList} />}
    </div>
  )
}
