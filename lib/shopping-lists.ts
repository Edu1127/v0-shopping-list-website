import { supabase } from './supabase'

export type ShoppingList = {
  id: string
  user_id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
  items?: ShoppingListItem[]
}

export type ShoppingListItem = {
  id: string
  list_id: string
  name: string
  quantity: number
  completed: boolean
  created_at: string
  updated_at: string
}

// Shopping Lists Operations
export async function getShoppingLists(userId: string) {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })

    if (error) throw error

    // Fetch items for each list
    const listsWithItems = await Promise.all(
      (data as ShoppingList[]).map(async (list) => {
        const { items } = await getShoppingListItems(list.id)
        return {
          ...list,
          items,
        }
      })
    )

    return { lists: listsWithItems as (ShoppingList & { items: ShoppingListItem[] })[], error: null }
  } catch (error) {
    return { lists: [], error }
  }
}

export async function createShoppingList(userId: string, name: string, description?: string) {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .insert([
        {
          user_id: userId,
          name,
          description: description || null,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { list: data as ShoppingList, error: null }
  } catch (error) {
    return { list: null, error }
  }
}

export async function updateShoppingList(listId: string, updates: Partial<ShoppingList>) {
  try {
    const { data, error } = await supabase
      .from('shopping_lists')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', listId)
      .select()
      .single()

    if (error) throw error

    return { list: data as ShoppingList, error: null }
  } catch (error) {
    return { list: null, error }
  }
}

export async function deleteShoppingList(listId: string) {
  try {
    const { error } = await supabase.from('shopping_lists').delete().eq('id', listId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    return { error }
  }
}

// Shopping List Items Operations
export async function getShoppingListItems(listId: string) {
  try {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .select('*')
      .eq('list_id', listId)
      .order('created_at', { ascending: true })

    if (error) throw error

    return { items: data as ShoppingListItem[], error: null }
  } catch (error) {
    return { items: [], error }
  }
}

export async function addShoppingListItem(listId: string, name: string, quantity: number = 1) {
  try {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .insert([
        {
          list_id: listId,
          name,
          quantity,
        },
      ])
      .select()
      .single()

    if (error) throw error

    return { item: data as ShoppingListItem, error: null }
  } catch (error) {
    return { item: null, error }
  }
}

export async function updateShoppingListItem(itemId: string, updates: Partial<ShoppingListItem>) {
  try {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error

    return { item: data as ShoppingListItem, error: null }
  } catch (error) {
    return { item: null, error }
  }
}

export async function deleteShoppingListItem(itemId: string) {
  try {
    const { error } = await supabase.from('shopping_list_items').delete().eq('id', itemId)

    if (error) throw error

    return { error: null }
  } catch (error) {
    return { error }
  }
}

// Realtime Subscriptions
export function subscribeToShoppingListItems(
  listId: string,
  callback: (items: ShoppingListItem[]) => void
) {
  const channel = supabase
    .channel(`items-${listId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shopping_list_items',
        filter: `list_id=eq.${listId}`,
      },
      async (payload) => {
        // Add a small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 50))
        // Fetch updated items when there's a change
        const { items } = await getShoppingListItems(listId)
        callback(items)
      }
    )
    .subscribe()

  // Return unsubscribe function
  return () => {
    supabase.removeChannel(channel)
  }
}

export function subscribeToShoppingLists(
  userId: string,
  callback: (lists: (ShoppingList & { items: ShoppingListItem[] })[]) => void
) {
  const channels: ReturnType<typeof supabase.channel>[] = []

  // Subscribe to shopping lists changes
  const listsChannel = supabase
    .channel(`lists-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shopping_lists',
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        // Add a small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 100))
        // Fetch updated lists when there's a change
        const { lists } = await getShoppingLists(userId)
        callback(lists)
      }
    )
    .subscribe()

  channels.push(listsChannel)

  // Subscribe to shopping list items changes (for progress updates)
  const itemsChannel = supabase
    .channel(`items-${userId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'shopping_list_items',
      },
      async (payload) => {
        // Add a small delay to ensure database is updated
        await new Promise(resolve => setTimeout(resolve, 50))
        // Fetch updated lists when items change
        const { lists } = await getShoppingLists(userId)
        callback(lists)
      }
    )
    .subscribe()

  channels.push(itemsChannel)

  // Return unsubscribe function
  return () => {
    channels.forEach(channel => {
      supabase.removeChannel(channel)
    })
  }
}

export async function toggleShoppingListItem(itemId: string, completed: boolean) {
  try {
    const { data, error } = await supabase
      .from('shopping_list_items')
      .update({
        completed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', itemId)
      .select()
      .single()

    if (error) throw error

    return { item: data as ShoppingListItem, error: null }
  } catch (error) {
    return { item: null, error }
  }
}
