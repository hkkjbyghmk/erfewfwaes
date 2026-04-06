# Arquitetura do Projeto - Conversor de Moedas

**Stack:** Next.js 14+ (App Router) + shadcn/ui + TypeScript + LangChain

---

## 1. Estrutura de Pastas

```
erfewfwaes/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Layout root com providers
│   ├── page.tsx                  # Página principal (conversor)
│   ├── admin/                    # Área administrativa
│   │   ├── page.tsx              # Dashboard admin
│   │   └── login/                # Login admin
│   │       └── page.tsx
│   ├── api/                      # API Routes
│   │   ├── rates/                # Endpoints de taxas
│   │   │   ├── route.ts          # GET/POST taxas atuais
│   │   │   └── historical/       # Histórico de taxas
│   │   │       └── route.ts
│   │   ├── config/               # Configurações (margens)
│   │   │   └── route.ts
│   │   └── chat/                 # Chatbot LangChain
│   │       └── route.ts
│   └── globals.css               # Estilos globais + tailwind
│
├── components/
│   ├── ui/                       # Componentes shadcn/ui
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   └── skeleton.tsx
│   │
│   ├── converter/                # Componentes do conversor
│   │   ├── CurrencyInput.tsx     # Input de moeda
│   │   ├── CurrencyCard.tsx      # Card com resultado
│   │   ├── ExchangeTable.tsx     # Tabela de taxas
│   │   └── RateDisplay.tsx       # Display de taxas
│   │
│   ├── admin/                    # Componentes admin
│   │   ├── AdminLogin.tsx        # Formulário de login
│   │   ├── MarginConfig.tsx      # Config de margens
│   │   ├── RateHistory.tsx       # Histórico de taxas
│   │   └── Dashboard.tsx         # Dashboard principal
│   │
│   ├── layout/                   # Componentes de layout
│   │   ├── Header.tsx            # Cabeçalho com logo
│   │   ├── Clock.tsx             # Relógio em tempo real
│   │   └── Footer.tsx            # Rodapé
│   │
│   └── chat/                     # Chatbot
│       ├── ChatWidget.tsx        # Widget flutuante
│       └── ChatMessage.tsx       # Bolha de mensagem
│
├── lib/
│   ├── utils.ts                  # Utilitários (cn, formatação)
│   ├── api.ts                    # Cliente API externo
│   ├── store.ts                  # Estado global (Zustand)
│   └── auth.ts                   # Autenticação admin
│
├── hooks/
│   ├── useExchangeRates.ts       # Hook para buscar taxas
│   ├── useCurrencyConverter.ts   # Hook de conversão
│   └── useAdminAuth.ts           # Hook de autenticação
│
├── types/
│   ├── currency.ts               # Tipos de moedas
│   └── rates.ts                  # Tipos de taxas
│
├── config/
│   ├── site.ts                   # Configurações do site
│   └── currencies.ts             # Lista de moedas suportadas
│
├── public/
│   ├── logo.png
│   └── manifest.json             # PWA manifest
│
├── .env.local                    # Variáveis de ambiente
├── next.config.js
├── tailwind.config.ts
├── components.json               # Config shadcn/ui
└── package.json
```

---

## 2. Dependências (package.json)

```json
{
  "name": "conversor-moedas",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "14.2.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    
    "langchain": "^0.2.0",
    "@langchain/core": "^0.2.0",
    "@langchain/openai": "^0.2.0",
    
    "@radix-ui/react-dialog": "^1.0.5",
    "@radix-ui/react-label": "^2.0.2",
    "@radix-ui/react-tabs": "^1.0.4",
    "@radix-ui/react-slot": "^1.0.2",
    
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.2.0",
    "lucide-react": "^0.358.0",
    
    "zustand": "^4.5.0",
    
    "date-fns": "^3.3.0"
  },
  "devDependencies": {
    "@types/node": "^20.11.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.3.0",
    "tailwindcss": "^3.4.0",
    "postcss": "^8.4.35",
    "autoprefixer": "^10.4.17",
    "eslint": "^8.56.0",
    "eslint-config-next": "14.2.0"
  }
}
```

---

## 3. Componentes shadcn/ui Necessários

| Componente | Uso |
|------------|-----|
| `button` | Botões de ação (converter, aplicar %, login) |
| `card` | Cards de taxas, conversor, dashboard |
| `input` | Inputs numéricos de valores |
| `label` | Labels dos inputs |
| `table` | Tabelas de taxas (venda/compra) |
| `tabs` | Alternar entre Venda/Compra/Histórico |
| `dialog` | Modal de login admin, confirmações |
| `badge` | Indicadores de variação (+/-) |
| `skeleton` | Loading states |
| `select` | Seletor de moedas (futuro) |
| `toast` | Notificações (cópias, erros) |

**Comando de instalação:**
```bash
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card input label table tabs dialog badge skeleton select toast
```

---

## 4. Plano de Implementação

### Fase 1: Setup do Projeto (Dia 1)
1. Criar projeto Next.js com TypeScript
   ```bash
   npx create-next-app@latest . --typescript --tailwind --app --no-src-dir
   ```
2. Instalar e configurar shadcn/ui
3. Configurar ESLint e Prettier
4. Criar estrutura de pastas base

### Fase 2: Componentes Core (Dia 1-2)
1. Implementar `useExchangeRates` hook (fetch da API externa)
2. Criar componentes de UI:
   - `CurrencyInput` - input com formatação monetária
   - `ExchangeTable` - tabela de taxas
   - `RateDisplay` - cards de taxas
3. Implementar página principal (`app/page.tsx`)

### Fase 3: Funcionalidades de Conversão (Dia 2)
1. Criar `useCurrencyConverter` hook
2. Implementar conversão em tempo real
3. Adicionar formatação de moeda (AOA, EUR, USD, BRL)
4. Persistir últimas conversões (localStorage)

### Fase 4: Painel Administrativo (Dia 3)
1. Implementar autenticação simples (senha hash)
2. Criar página `/admin` com:
   - Configuração de margens (venda/compra)
   - Histórico de taxas
   - Logs de conversões
3. Proteger rotas admin com middleware

### Fase 5: Integração LangChain (Dia 4)
1. Configurar LangChain com OpenAI API
2. Criar endpoint `/api/chat`
3. Implementar `ChatWidget` flutuante
4. Criar prompts especializados:
   - Suporte ao usuário
   - Explicação de taxas
   - Histórico de conversões

### Fase 6: Polimento e Deploy (Dia 5)
1. Responsividade mobile
2. PWA manifest e offline support
3. Otimização de performance
4. Deploy (Vercel/Netlify)

---

## 5. Integração com LangChain

### Casos de Uso

#### 5.1 Chatbot de Suporte
```typescript
// app/api/chat/route.ts
import { ChatOpenAI } from '@langchain/openai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';

const systemPrompt = `
Você é um assistente virtual para um conversor de moedas (EUR/USD/BRL ↔ AOA).
- Ajude usuários a entender como usar o conversor
- Explique as taxas de câmbio atuais
- Forneça informações sobre o processo de conversão
- Seja educado e prestativo
- Responda em Português de Portugal
`;

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const model = new ChatOpenAI({
    modelName: 'gpt-4o-mini',
    temperature: 0.7,
  });

  const response = await model.invoke([
    new SystemMessage(systemPrompt),
    ...messages.map((m: any) => new HumanMessage(m.content)),
  ]);

  return Response.json({ message: response.content });
}
```

#### 5.2 Análise de Taxas (Feature Futura)
```typescript
// lib/analysis.ts
import { ChatOpenAI } from '@langchain/openai';

async function analyzeRateTrend(historicalRates: Rate[]) {
  const model = new ChatOpenAI({ temperature: 0.3 });
  
  const prompt = `
  Analise a tendência das taxas de câmbio nos últimos 7 dias:
  ${JSON.stringify(historicalRates)}
  
  Identifique:
  1. Tendência geral (alta/baixa/estável)
  2. Melhor momento para converter
  3. Previsão para próximos 2 dias
  `;
  
  return model.invoke(prompt);
}
```

#### 5.3 Widget no Frontend
```tsx
// components/chat/ChatWidget.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, X } from 'lucide-react';

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const sendMessage = async (content: string) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ messages: [...messages, { content }] }),
    });
    const data = await res.json();
    setMessages([...messages, { content }, { content: data.message, role: 'assistant' }]);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen && (
        <Button onClick={() => setIsOpen(true)} size="icon" className="rounded-full w-14 h-14">
          <MessageCircle className="w-6 h-6" />
        </Button>
      )}
      {isOpen && (
        <div className="bg-white rounded-lg shadow-lg w-80 h-96 p-4">
          {/* Chat UI */}
        </div>
      )}
    </div>
  );
}
```

---

## 6. Variáveis de Ambiente (.env.local)

```env
# API Externa
EXCHANGE_RATE_API_URL=https://api.exchangerate-api.com/v4/latest/AOA

# LangChain / OpenAI
OPENAI_API_KEY=sk-...

# Admin
ADMIN_PASSWORD_HASH=$2b$10$...  # bcrypt hash da senha

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 7. Resumo das Melhorias vs Versão Atual

| Feature | Versão Atual | Nova Versão |
|---------|--------------|-------------|
| Framework | HTML estático | Next.js 14 SSR |
| UI | CSS inline | shadcn/ui + Tailwind |
| Estado | JavaScript vanilla | Zustand + React Hooks |
| Admin | Senha hardcoded (7851) | Auth com hash + sessões |
| Chat | Não tem | LangChain + GPT-4o-mini |
| Responsividade | Media queries | Mobile-first Tailwind |
| Performance | Recarrega página | SPA com atualizações em tempo real |
| PWA | Manifest básico | Full PWA support |

---

## Próximos Passos Imediatos

1. Rodar `npm create next-app@latest` para inicializar o projeto
2. Executar `npx shadcn-ui@latest init` para configurar UI
3. Criar estrutura de pastas conforme definido acima
4. Implementar hook `useExchangeRates` primeiro (core do app)
