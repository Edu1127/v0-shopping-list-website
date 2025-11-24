## 🚀 Guia de Deploy

### Opção 1: Vercel (Recomendado)

#### Pré-requisitos
- Conta no GitHub com o repositório
- Conta no Vercel (vercel.com)

#### Passos

1. **Fazer push para GitHub**
   \`\`\`bash
   git add .
   git commit -m "feat: add supabase authentication"
   git push origin main
   \`\`\`

2. **Conectar ao Vercel**
   - Acesse vercel.com
   - Clique "New Project"
   - Selecione o repositório
   - Clique "Import"

3. **Configurar Variáveis de Ambiente**
   - Environment Variables:
     \`\`\`
     NEXT_PUBLIC_SUPABASE_URL=https://hipxwhxqpnsfdbtoaxfs.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     \`\`\`
   - Clique "Deploy"

4. **Pronto!**
   - Aplicação estará disponível em `https://seu-projeto.vercel.app`
   - Deploy automático a cada push no main

### Opção 2: Netlify

#### Pré-requisitos
- Conta no Netlify (netlify.com)
- Repositório no GitHub

#### Passos

1. **Conectar ao Netlify**
   - Clique "New site from Git"
   - Selecione GitHub e o repositório
   - Clique "Connect"

2. **Configurar Build**
   - Build command: `npm run build`
   - Publish directory: `.next`
   - Base directory: `/`

3. **Variáveis de Ambiente**
   - Site settings → Environment variables
   - Adicione as mesmas do Vercel

4. **Deploy**
   - Clique "Deploy site"

### Opção 3: Docker

#### Dockerfile

\`\`\`dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy project
COPY . .

# Build
RUN npm run build

# Expose port
EXPOSE 3000

# Start
CMD ["npm", "start"]
\`\`\`

#### Build e Run

\`\`\`bash
docker build -t shopping-list .
docker run -p 3000:3000 \
  -e NEXT_PUBLIC_SUPABASE_URL=https://... \
  -e NEXT_PUBLIC_SUPABASE_ANON_KEY=... \
  shopping-list
\`\`\`

### Opção 4: Railway

#### Pré-requisitos
- Conta no Railway (railway.app)
- GitHub conectado

#### Passos

1. **Criar Projeto**
   - Acesse railway.app
   - Clique "New Project"
   - Selecione "Deploy from GitHub repo"

2. **Variáveis de Ambiente**
   - Vá para "Project" → "Variables"
   - Adicione as variáveis:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

3. **Deploy**
   - Railway faz deploy automático

### Checklist Pré-Deploy

- [ ] Código commitado e pushed
- [ ] Build passa localmente (`npm run build`)
- [ ] Sem erros no console
- [ ] Variáveis de ambiente configuradas
- [ ] Testado em staging
- [ ] HTTPS habilitado
- [ ] Logs configurados
- [ ] Backup do Supabase realizado

### Variáveis de Ambiente Necessárias

\`\`\`
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
\`\`\`

**Nota**: As outras variáveis (`SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_JWT_SECRET`) são apenas para development/testing local.

### Monitoramento Pós-Deploy

1. **Verificar Logs**
   - Plataforma (Vercel, Netlify, etc): Veja logs de build e runtime
   - Browser: F12 → Console
   - Supabase: Auth → Activity, PostgreSQL → Logs

2. **Verificar Performance**
   - Lighthouse (Chrome DevTools)
   - WebPageTest
   - Plataforma oferece analytics

3. **Alertas**
   - Configure alertas para erros
   - Monitor de tempo de atividade
   - Notificações de novo deploy

### Rollback

Se algo der errado após deploy:

#### Vercel
- Clique no deployment anterior na timeline
- Clique "Promote to Production"

#### Netlify
- Clique "Deploys"
- Selecione uma versão anterior
- Clique "Publish deploy"

#### Docker/Railway
- Push a versão anterior para Git
- Deploy automático fará rollback

### Performance Dicas

1. **Cache**
   - Vercel: Automático
   - Netlify: Automático
   - Configure headers para cache estático

2. **CDN**
   - Ambas usam CDN global
   - Assets servem de múltiplos locais

3. **Compressão**
   - Next.js comprime automaticamente
   - Configure gzip headers

4. **Monitoramento**
   - Use ferramentas como Sentry para erros
   - Use analytics para user behavior

### Dúvidas Comuns

**P: Meus dados estão salvos?**
R: Sim, tudo é salvo no Supabase. O deploy não afeta os dados.

**P: Como fazer deploy de updates?**
R: Faça commit, push, e o deploy automático fará o rest.

**P: E se o deploy falhar?**
R: Veja os logs, corrija o erro, e faça push novamente.

**P: Como usar variáveis diferentes por ambiente?**
R: Configure em Production e Preview na plataforma, Next.js usa automaticamente.

---

**Pronto para produção! 🎉**
