"use client"

import { useState } from "react"
import { LogOut, Plus } from "lucide-react"
import ShoppingListCard from "./shopping-list-card"
import CreateListModal from "./create-list-modal"
import ListDetailsView from "./list-details-view"

interface ShoppingList {
  id: string
  name: string
  items: ShoppingItem[]
  createdAt: Date
}

interface ShoppingItem {
  id: string
  name: string
  quantity: number
  completed: boolean
}

interface DashboardProps {
  userName: string
  onLogout: () => void
}

export default function Dashboard({ userName, onLogout }: DashboardProps) {
  const [lists, setLists] = useState<ShoppingList[]>([
    {
      id: "1",
      name: "Supermercado",
      items: [
        { id: "1", name: "Leite", quantity: 2, completed: false },
        { id: "2", name: "Pão", quantity: 1, completed: true },
      ],
      createdAt: new Date(),
    },
  ])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)

  const handleCreateList = (name: string) => {
    const newList: ShoppingList = {
      id: Date.now().toString(),
      name,
      items: [],
      createdAt: new Date(),
    }
    setLists([...lists, newList])
    setShowCreateModal(false)
  }

  const handleDeleteList = (id: string) => {
    setLists(lists.filter((list) => list.id !== id))
    if (selectedListId === id) {
      setSelectedListId(null)
    }
  }

  const handleAddItem = (listId: string, itemName: string, quantity: number) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: [
              ...list.items,
              {
                id: Date.now().toString(),
                name: itemName,
                quantity,
                completed: false,
              },
            ],
          }
        }
        return list
      }),
    )
  }

  const handleToggleItem = (listId: string, itemId: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.map((item) => {
              if (item.id === itemId) {
                return { ...item, completed: !item.completed }
              }
              return item
            }),
          }
        }
        return list
      }),
    )
  }

  const handleDeleteItem = (listId: string, itemId: string) => {
    setLists(
      lists.map((list) => {
        if (list.id === listId) {
          return {
            ...list,
            items: list.items.filter((item) => item.id !== itemId),
          }
        }
        return list
      }),
    )
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
            <h1 className="text-2xl font-bold text-primary">ShopList</h1>
            <p className="text-gray-600 text-sm">Bem-vindo, {userName}</p>
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
            <h2 className="text-3xl font-bold text-foreground mb-2">Minhas Listas</h2>
            <p className="text-gray-600">Gerencie suas listas de compras</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nova Lista
          </button>
        </div>

        {/* Lists Grid */}
        {lists.length > 0 ? (
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
              className="bg-primary text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
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
