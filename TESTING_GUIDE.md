## 🧪 Guia de Teste - Sistema de Autenticação

### Pré-requisitos
- Node.js 18+
- npm ou pnpm
- Acesso ao Supabase (já configurado)

### 1. Iniciar o Servidor de Desenvolvimento

\`\`\`bash
npm run dev
\`\`\`

O servidor abrirá em `http://localhost:3000`

### 2. Testar Cadastro de Nova Conta

#### Passos:
1. Na página de login, clique em "Cadastrar"
2. Preencha os dados:
   - **Nome Completo**: Digite um nome (ex: "João Silva")
   - **Email**: Digite um email válido (ex: "joao@example.com")
   - **Senha**: Digite uma senha (mínimo 6 caracteres)
3. Clique em "Criar Conta"

#### Esperado:
- ✅ Botão fica em loading com spinner
- ✅ Sem erros, você é redirecionado para Dashboard
- ✅ Dashboard mostra "Bem-vindo, João" (nome que cadastrou)

#### Verificar no Supabase:
1. Vá para Supabase Dashboard
2. Acesse **Authentication → Users**
3. Deverá listar o novo usuário com o email cadastrado
4. Acesse **SQL Editor** e execute:
   \`\`\`sql
   SELECT * FROM profiles WHERE email = 'joao@example.com';
   \`\`\`
   Deverá retornar o perfil criado

### 3. Testar Login

#### Passos:
1. Clique em "Entrar" (se necessário, clique Sair primeiro)
2. Preencha com dados já cadastrados:
   - **Email**: Email que cadastrou
   - **Senha**: Senha que cadastrou
3. Clique em "Entrar"

#### Esperado:
- ✅ Login com sucesso
- ✅ Redirecionado para Dashboard
- ✅ Nome exibido no header

#### Testar erro:
1. Tente login com email errado ou senha errada
2. Deverá aparecer mensagem de erro em vermelho
3. Não deve fazer login

### 4. Testar CRUD de Listas

#### Criar Lista:
1. No Dashboard, clique "Nova Lista"
2. Digite um nome para a lista (ex: "Compras do Supermercado")
3. Clique "Criar"

#### Esperado:
- ✅ Card da lista aparece no grid
- ✅ Progresso mostra 0%

#### Verificar no Supabase:
\`\`\`sql
SELECT * FROM shopping_lists WHERE user_id = (
  SELECT id FROM auth.users WHERE email = 'seu@email.com'
);
\`\`\`

### 5. Testar CRUD de Itens

#### Adicionar Item:
1. Clique em "Abrir" na lista que criou
2. Clique "Adicionar Item"
3. Preencha:
   - **Nome do Item**: "Leite"
   - **Quantidade**: 2
4. Clique "Adicionar"

#### Esperado:
- ✅ Item aparece na seção "Pendente"
- ✅ Progresso continua 0% (nenhum concluído)

#### Adicionar mais itens:
1. Adicione "Pão" (quantidade 1)
2. Adicione "Ovos" (quantidade 1)

### 6. Testar Toggle (Marcar Concluído)

#### Passos:
1. Clique no círculo vazio ao lado de "Leite"
2. O item deve mover para seção "Concluído"
3. Progresso deve mostrar 33%

#### Esperado:
- ✅ Item tem checkmark verde
- ✅ Texto fica tachado
- ✅ Progresso é atualizado

#### Verificar no Supabase:
\`\`\`sql
SELECT * FROM shopping_list_items WHERE list_id = 'ID_DA_LISTA';
\`\`\`
- Deverá mostrar "Leite" com `completed = true`

### 7. Testar Logout

#### Passos:
1. Clique no botão "Sair" no header
2. Você deve voltar para tela de login

#### Esperado:
- ✅ Sessão encerrada
- ✅ Redirecionado para login
- ✅ Dados salvos (ao fazer login novamente, as listas estão lá)

### 8. Testar Persistência de Dados

#### Passos:
1. Crie algumas listas e itens
2. Faça logout
3. Faça login novamente com as mesmas credenciais
4. Verifique que as listas aparecem

#### Esperado:
- ✅ Todos os dados estão lá
- ✅ Nenhum dado foi perdido
- ✅ Estados (completado) são mantidos

### 9. Testar Múltiplos Usuários

#### Passos:
1. Crie conta com email "usuario1@example.com"
2. Crie algumas listas
3. Faça logout
4. Crie conta com email "usuario2@example.com"
5. Verifique que não vê as listas do usuário 1
6. Crie listas para usuário 2
7. Faça logout e login com usuário 1 novamente

#### Esperado:
- ✅ Cada usuário vê apenas suas listas
- ✅ Dados isolados por usuário
- ✅ RLS funcionando corretamente

### 10. Testar Segurança

#### Verificar RLS:
1. No Supabase, vá para **Authentication → Policies**
2. Verifique que todas as policies estão ativas
3. Tente inserir dados diretamente (sem autenticação)

#### Esperado:
- ✅ Acesso negado sem autenticação válida
- ✅ Usuários não conseguem acessar dados de outros usuários

### Checklist Final

- [ ] Cadastro de nova conta funciona
- [ ] Login com credenciais corretas funciona
- [ ] Login com credenciais incorretas mostra erro
- [ ] Logout funciona
- [ ] Criar lista funciona
- [ ] Listar listas funciona
- [ ] Adicionar item funciona
- [ ] Marcar como concluído funciona
- [ ] Deletar item funciona
- [ ] Deletar lista funciona
- [ ] Dados persistem após logout
- [ ] Isolamento de dados por usuário
- [ ] Sem erros no console
- [ ] Build passa sem erros
- [ ] Tema amarelo aplicado corretamente

### 🔍 Debug

Se encontrar problemas:

1. **Verificar Logs no Browser**:
   - F12 → Console
   - Procure por erros em vermelho

2. **Verificar Network**:
   - F12 → Network
   - Veja as requisições para Supabase

3. **Verificar Storage**:
   - F12 → Storage → Cookies
   - Deverá ter `sb-*` com tokens de sessão

4. **Verificar Supabase**:
   - Acesse painel do Supabase
   - Veja **Logs** → **PostgreSQL** para erros de DB
   - Veja **Logs** → **Realtime** para conexões

### 📞 Suporte

Se encontrar problemas:
1. Verifique se `.env.local` tem as variáveis corretas
2. Verifique se as migrations foram aplicadas
3. Verifique RLS policies estão ativas
4. Verifique no console se há erros de rede

---

**Testes completos! 🎉**
