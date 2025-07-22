# Claude Code Checklist · Simulador de Financiamento

## 🏗️ Etapa 1 - Setup Inicial

- [x] Criar projeto com Nuxt.js (preferencialmente Nuxt 3)
- [x] Configurar TailwindCSS
- [x] Instalar Pinia para controle de estado (substituto moderno do Vuex)
- [x] Criar estrutura de pastas (`components`, `pages`, `store`, `utils`)

## 🧪 Etapa 2 - Lógica de Simulação

- [x] Criar página única com formulário:
  - [x] Valor do imóvel (R$)
  - [x] Valor da entrada (mínimo 20%)
  - [x] Prazo (mínimo 60, máximo 420 meses)
- [x] Validar os campos com máscaras e limites
- [x] Calcular:
  - [x] Valor a ser financiado
  - [x] Juros mensais equivalente (≈ 0.9489% a.m.)
  - [x] Valor das parcelas pelo método de amortização SAC
  - [x] Valor total final (soma das parcelas)

## 📄 Etapa 3 - PDF + Assinatura

- [x] Adicionar botão "Aceitar proposta"
- [x] Gerar PDF com os dados da simulação
- [x] Integrar `signature_pad` para coletar assinatura do usuário
- [x] Inserir assinatura no PDF dinamicamente
- [x] Permitir download imediato do PDF

## 🔒 Etapa 4 - Firebase Auth

- [x] Configurar Firebase no projeto
- [x] Habilitar login com Google
- [x] Vincular simulação à conta do usuário
- [x] Criar `admin` com role especial (via claims ou Firestore)

## ☁️ Etapa 5 - Firebase Firestore

- [x] Criar coleção `simulacoes`
- [x] Salvar dados da simulação (valor, entrada, prazo, parcelas, userID, data)
- [ ] Salvar link do PDF (upload no Storage ou em base64 direto)

## 🛠️ Etapa 6 - Painel Admin

- [x] Criar nova rota `/admin`
- [x] Verificar se o usuário tem a role `admin`
- [x] Listar simulações feitas (com filtros e paginação simples)
- [x] Link para visualizar e baixar o PDF gerado

## 🧪 Extras

- [x] Testar responsividade (mobile/desktop)
- [x] Validar todas as bordas de formulário
- [x] Garantir formatação correta de valores em reais
- [x] Utilizar padrão visual do novo iOS (bordas suaves, fontes clean, etc)
- [ ] Publicar o projeto via Netlify
- [ ] Testar performance e UX

## 📹 Entrega

- [ ] Gravar o processo completo com Loom (máx 60 minutos)
- [ ] Subir o link do app e do Loom no campo de submissão