# Configuração de Variáveis de Ambiente

## Como Adicionar as Variáveis no v0

1. Clique no ícone **Vars** na barra lateral esquerda
2. Clique em "Add Variable" ou "Nova Variável"
3. Adicione cada uma das variáveis abaixo:

### Variáveis Públicas (NEXT_PUBLIC_)
Estas aparecem no navegador e devem ser públicas:

| Nome | Valor |
|------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://hipxwhxqpnsfdbtoaxfs.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcHh3aHhxcG5zZmRidG9heGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTAyNTcsImV4cCI6MjA3OTU2NjI1N30.15PwdhQ7xcl6qQPR_T2GUnzqnZUHzutxU8FHf4ddSmQ` |

### Variáveis Privadas (Server-only)
Estas ficam apenas no servidor (não aparecem no navegador):

| Nome | Valor |
|------|-------|
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcHh3aHhxcG5zZmRidG9heGZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5MDI1NywiZXhwIjoyMDc5NTY2MjU3fQ.Cqpr0fgW9jxS3WoNEAO7fp2YlNWl69-5n2Fdl6QfunE` |
| `SUPABASE_JWT_SECRET` | `ybeC7zVlpH22cIQGYWXNJ/+KL2JW9v5gWaWyOmhnD68NKsno/QQJ2MRxOHDyqkuiWrswk3/v7CtdChaQ4L/jaA==` |

## Passo a Passo

1. Abra o painel **Vars** (ícone na barra lateral esquerda do v0)
2. Para cada variável acima:
   - Clique em "Add Variable" ou "+"
   - Cole o nome da variável no campo "Name"
   - Cole o valor no campo "Value"
   - Clique em "Save"
3. Atualize o preview ou faça deploy novamente

## Verificação

Após adicionar todas as variáveis, você verá:
- ✅ Aplicação funcionando no preview
- ✅ Login funcionando com Supabase
- ✅ Listas de compras sincronizadas com banco de dados
