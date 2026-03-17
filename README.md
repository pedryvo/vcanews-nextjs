# 🚀 VCANews - O Agregador de Notícias de Vitória da Conquista

**VCANews** é uma plataforma moderna e performática desenvolvida para consolidar notícias dos principais blogs e portais de Vitória da Conquista - BA em um único lugar.

![Preview do Projeto](https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=2070&ixlib=rb-4.0.3)

## ✨ Funcionalidades

- **🕒 Sincronização em Tempo Real**: Agendamento automático via `node-cron` que consome feeds RSS e extrai metadados completos (imagens, títulos originais) usando IA e extração de artigos.
- **📱 Timeline Infinita**: Experiência de navegação fluida com scroll infinito otimizado para mobile e desktop.
- **🛡️ Painel Administrativo Protegido**: Área completa de Backoffice para gerenciamento de cidades, blogs e postagens.
- **🔐 Autenticação Google OAuth**: Sistema de login seguro e integrado para administradores.
- **🚀 Performance Extrema**: Desenvolvido com Next.js 15 (App Router), utilizando Server Components e cache inteligente.

## 🛠️ Tecnologias Utilizadas

- **Framework**: [Next.js 15](https://nextjs.org/)
- **Linguagem**: [TypeScript](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Banco de Dados**: [SQLite](https://www.sqlite.org/) com [Prisma ORM](https://www.prisma.io/)
- **Autenticação**: [NextAuth.js](https://next-auth.js.org/)
- **Sincronização**: [rss-parser](https://www.npmjs.com/package/rss-parser) & [@extractus/article-extractor](https://www.npmjs.com/package/@extractus/article-extractor)

## 🚀 Como Começar

### Pré-requisitos

- Node.js 20+
- NPM ou Yarn

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/vcanews.git
cd vcanews
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o arquivo `.env`:
   - Copie o `.env.example` (ou crie um novo) e adicione suas credenciais do **Google OAuth**.
```env
GOOGLE_CLIENT_ID="seu_id"
GOOGLE_CLIENT_SECRET="seu_secret"
NEXTAUTH_SECRET="uma_string_aleatoria"
NEXTAUTH_URL="http://localhost:3000"
```

4. Prepare o Banco de Dados:
```bash
npx prisma db push
npx prisma generate
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## 👨‍💻 Estrutura do Projeto

- `/app`: Rotas e páginas do Next.js.
- `/components`: Componentes UI reutilizáveis.
- `/repositories`: Camada de acesso a dados (Repository Pattern).
- `/services`: Lógica de negócio e sincronização de notícias.
- `/prisma`: Schema e migrações do banco de dados.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---
Desenvolvido com ❤️ por Antigravity.
