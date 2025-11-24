## 📚 Referência de APIs

### Authentication (`lib/auth.ts`)

#### `signUp(email, password, fullName)`
Criar nova conta e perfil.

\`\`\`typescript
const { user, error } = await signUp("user@example.com", "senha123", "João Silva");
\`\`\`

**Retorna**: `{ user: User | null, error: Error | null }`

---

#### `signIn(email, password)`
Fazer login.

\`\`\`typescript
const { user, session, error } = await signIn("user@example.com", "senha123");
\`\`\`

**Retorna**: `{ user: User | null, session: Session | null, error: Error | null }`

---

#### `signOut()`
Fazer logout e limpar sessão.

\`\`\`typescript
const { error } = await signOut();
\`\`\`

**Retorna**: `{ error: Error | null }`

---

#### `getCurrentUser()`
Obter usuário autenticado atual.

\`\`\`typescript
const { user, error } = await getCurrentUser();
\`\`\`

**Retorna**: `{ user: User | null, error: Error | null }`

---

#### `getProfile(userId)`
Obter perfil do usuário.

\`\`\`typescript
const { profile, error } = await getProfile(user.id);
// profile.full_name, profile.email, profile.avatar_url
\`\`\`

**Retorna**: `{ profile: Profile | null, error: Error | null }`

---

#### `updateProfile(userId, updates)`
Atualizar perfil do usuário.

\`\`\`typescript
const { profile, error } = await updateProfile(user.id, {
  full_name: "Novo Nome",
  avatar_url: "https://..."
});
\`\`\`

**Retorna**: `{ profile: Profile | null, error: Error | null }`

---

### Shopping Lists (`lib/shopping-lists.ts`)

#### `getShoppingLists(userId)`
Listar todas as listas do usuário.

\`\`\`typescript
const { lists, error } = await getShoppingLists(user.id);
\`\`\`

**Retorna**: `{ lists: ShoppingList[], error: Error | null }`

---

#### `createShoppingList(userId, name, description?)`
Criar nova lista.

\`\`\`typescript
const { list, error } = await createShoppingList(user.id, "Supermercado", "Compras");
\`\`\`

**Retorna**: `{ list: ShoppingList | null, error: Error | null }`

---

#### `updateShoppingList(listId, updates)`
Atualizar lista.

\`\`\`typescript
const { list, error } = await updateShoppingList(listId, {
  name: "Novo Nome",
  description: "Nova Descrição"
});
\`\`\`

**Retorna**: `{ list: ShoppingList | null, error: Error | null }`

---

#### `deleteShoppingList(listId)`
Deletar lista (também deleta todos os itens).

\`\`\`typescript
const { error } = await deleteShoppingList(listId);
\`\`\`

**Retorna**: `{ error: Error | null }`

---

### Shopping List Items (`lib/shopping-lists.ts`)

#### `getShoppingListItems(listId)`
Listar todos os itens da lista.

\`\`\`typescript
const { items, error } = await getShoppingListItems(listId);
\`\`\`

**Retorna**: `{ items: ShoppingListItem[], error: Error | null }`

---

#### `addShoppingListItem(listId, name, quantity?)`
Adicionar item à lista.

\`\`\`typescript
const { item, error } = await addShoppingListItem(listId, "Leite", 2);
\`\`\`

**Retorna**: `{ item: ShoppingListItem | null, error: Error | null }`

---

#### `updateShoppingListItem(itemId, updates)`
Atualizar item.

\`\`\`typescript
const { item, error } = await updateShoppingListItem(itemId, {
  name: "Novo Nome",
  quantity: 5,
  completed: true
});
\`\`\`

**Retorna**: `{ item: ShoppingListItem | null, error: Error | null }`

---

#### `deleteShoppingListItem(itemId)`
Deletar item.

\`\`\`typescript
const { error } = await deleteShoppingListItem(itemId);
\`\`\`

**Retorna**: `{ error: Error | null }`

---

#### `toggleShoppingListItem(itemId, completed)`
Marcar como concluído/pendente.

\`\`\`typescript
const { item, error } = await toggleShoppingListItem(itemId, true);
\`\`\`

**Retorna**: `{ item: ShoppingListItem | null, error: Error | null }`

---

### Auth Context (`components/auth-provider.tsx`)

#### `useAuth()`
Hook para acessar estado de autenticação em componentes.

\`\`\`typescript
const { user, isLoading, isSignedIn } = useAuth();

if (isLoading) return <div>Carregando...</div>;

if (isSignedIn) {
  return <Dashboard />;
} else {
  return <LoginPage />;
}
\`\`\`

**Retorna**: `{ user: User | null, isLoading: boolean, isSignedIn: boolean }`

---

### Tipos TypeScript

#### `Profile`
\`\`\`typescript
type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};
\`\`\`

---

#### `ShoppingList`
\`\`\`typescript
type ShoppingList = {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};
\`\`\`

---

#### `ShoppingListItem`
\`\`\`typescript
type ShoppingListItem = {
  id: string;
  list_id: string;
  name: string;
  quantity: number;
  completed: boolean;
  created_at: string;
  updated_at: string;
};
\`\`\`

---

### Exemplo de Uso Completo

\`\`\`typescript
import { useAuth } from "@/components/auth-provider";
import { getShoppingLists, addShoppingListItem } from "@/lib/shopping-lists";

export default function MyComponent() {
  const { user } = useAuth();

  async function handleGetLists() {
    if (!user) return;
    
    const { lists, error } = await getShoppingLists(user.id);
    
    if (error) {
      console.error("Erro ao buscar listas:", error);
      return;
    }

    console.log("Minhas listas:", lists);
  }

  async function handleAddItem(listId: string) {
    const { item, error } = await addShoppingListItem(listId, "Leite", 2);
    
    if (error) {
      console.error("Erro ao adicionar item:", error);
      return;
    }

    console.log("Item adicionado:", item);
  }

  return (
    <div>
      <button onClick={handleGetLists}>Ver Listas</button>
      <button onClick={() => handleAddItem("list-id")}>Adicionar Item</button>
    </div>
  );
}
\`\`\`

---

### Tratamento de Erros

Todos os métodos retornam `error` para permitir tratamento gracioso:

\`\`\`typescript
try {
  const { lists, error } = await getShoppingLists(user.id);
  
  if (error) {
    if (error.message.includes("permission")) {
      // Erro de permissão (RLS)
      console.error("Você não tem permissão");
    } else if (error.message.includes("network")) {
      // Erro de rede
      console.error("Problema na conexão");
    } else {
      // Outro erro
      console.error("Erro desconhecido:", error.message);
    }
    return;
  }
  
  // Usar dados
  console.log(lists);
} catch (err) {
  console.error("Erro não capturado:", err);
}
\`\`\`

---

### Performance

Dicas para melhor performance:

1. **Cache Local**: Use `useState` ou bibliotecas como `react-query`
2. **Carregamento**: Mostre loading states durante requisições
3. **Otimista**: Atualize UI antes de confirmar no banco (otimistic updates)
4. **Debounce**: Use debounce para operações frequentes

---

### Security

- ✅ Use apenas `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` no frontend
- ✅ RLS garante isolamento de dados
- ✅ Senhas são criptografadas pelo Supabase
- ✅ Tokens são armazenados seguramente em cookies
- ✅ Nunca compartilhe `SUPABASE_SERVICE_ROLE_KEY` no frontend

---

**Pronto para usar! 🚀**
