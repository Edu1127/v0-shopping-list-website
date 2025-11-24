# Configuração de Variáveis de Ambiente

Para que o aplicativo funcione corretamente no v0, você precisa adicionar as variáveis de ambiente no painel **Vars**.

## Como adicionar:

1. Clique no ícone **Vars** na barra lateral esquerda do v0
2. Adicione as seguintes variáveis:

### Variáveis Públicas (NEXT_PUBLIC_)
Estas são visíveis no cliente e podem ser públicas:

\`\`\`
NEXT_PUBLIC_SUPABASE_URL=https://hipxwhxqpnsfdbtoaxfs.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcHh3aHhxcG5zZmRidG9heGZzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTAyNTcsImV4cCI6MjA3OTU2NjI1N30.15PwdhQ7xcl6qQPR_T2GUnzqnZUHzutxU8FHf4ddSmQ
\`\`\`

### Variáveis Privadas (Servidor)
Estas são sensíveis e só funcionam no servidor:

\`\`\`
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhpcHh3aHhxcG5zZmRidG9heGZzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2Mzk5MDI1NywiZXhwIjoyMDc5NTY2MjU3fQ.Cqpr0fgW9jxS3WoNEAO7fp2YlNWl69-5n2Fdl6QfunE
SUPABASE_JWT_SECRET=ybeC7zVlpH22cIQGYWXNJ/+KL2JW9v5gWaWyOmhnD68NKsno/QQJ2MRxOHDyqkuiWrswk3/v7CtdChaQ4L/jaA==
\`\`\`

## Após adicionar:

✅ O Preview deve carregar sem erros  
✅ O Deployment funcionará corretamente  
✅ Autenticação e banco de dados estarão funcionais
