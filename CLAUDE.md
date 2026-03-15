# Ranked — AI Design Kit Digital

## O que e este projeto
Ranked e a versao digital do AI Design Kit (CMU, DIS 2023). Um Kanban de 6 etapas que guia times pela metodologia de ideacao de produtos com IA. Cada projeto percorre as fases e sai com uma ideia de produto AI bem fundamentada.

## Stack
- Next.js 15 (App Router, src/ directory)
- TypeScript strict
- Tailwind CSS 4
- shadcn/ui
- Prisma + SQLite (dev) / PostgreSQL (prod via Neon)
- Auth.js v5 (NextAuth)
- TanStack Query
- Framer Motion
- Lucide React icons
- Zod validation

## Etapas do Kanban
1. DEFINE - Definir o Projeto (CRUD form: dominio, usuario-alvo, problemas)
2. SKILLS - Estudar Habilidades de IA (10 cards, marcar como entendido)
3. EXAMPLES - Navegar 40 Exemplos (filtros por dominio e habilidade)
4. ABSTRACTION - Ver Niveis de Abstracao (arvore de capabilities)
5. DECK - Montar o Deck (selecionar 10-15 exemplos, cobertura visual)
6. IDEAS - Gerar Ideias (post-its, votar com joinha)

## Design System
- Primaria: #7C3AED (roxo)
- Fundo: #FAFAFE
- Acento: #F97316 (laranja)
- Sucesso: #10B981
- Alerta: #EF4444

## Convencoes
- Funcoes server em lib/
- Componentes client em components/
- API routes em app/api/
- Validacao com Zod em todas as API routes
- Nomes de arquivos em kebab-case
- Componentes em PascalCase
- Nao usar "use client" desnecessariamente - preferir Server Components
- Todos os textos em portugues brasileiro

## Regras
- Nao implementar pagamentos/Stripe por enquanto
- SQLite para dev, PostgreSQL para prod
- Auth simplificado (pode comecar sem OAuth, apenas email/nome)
- Mobile-first
- Acessibilidade: contrast ratio AA minimo
