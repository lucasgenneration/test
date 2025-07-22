# Simulador de Financiamento Imobiliário

Uma aplicação web moderna para simulação de financiamento imobiliário com os sistemas SAC e Price, captura de assinatura digital e geração de PDF.

## 🚀 Funcionalidades

- **Simulação de Financiamento**: Cálculo com sistemas SAC (parcelas decrescentes) e Price (parcelas fixas)
- **Interface Responsiva**: Design inspirado no iOS com TailwindCSS
- **Autenticação**: Login com Google via Firebase Auth
- **Assinatura Digital**: Captura de assinatura do cliente para proposta
- **Geração de PDF**: Documento profissional com todos os dados da simulação
- **Painel Administrativo**: Visualização de todas as simulações realizadas
- **Persistência de Dados**: Salvamento automático no Firebase Firestore

## 🛠️ Tecnologias

- **Frontend**: Nuxt 3, Vue 3, TypeScript
- **Estilização**: TailwindCSS
- **Estado**: Pinia
- **Backend**: Firebase (Authentication + Firestore)
- **PDF**: jsPDF
- **Assinatura**: signature_pad

## 📋 Pré-requisitos

- Node.js 18+ 
- Conta no Firebase com projeto configurado
- Yarn ou NPM

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITORIO]
cd teste
```

2. Instale as dependências:
```bash
yarn install
# ou
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

4. Adicione suas credenciais do Firebase no arquivo `.env`

5. Inicie o servidor de desenvolvimento:
```bash
yarn dev
# ou
npm run dev
```

## 🚀 Deploy no Cloudflare Pages

### Configuração no GitHub:

1. Crie um novo repositório no GitHub
2. Adicione o remote e faça push:
```bash
git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
git branch -M main
git push -u origin main
```

### Configuração no Cloudflare Pages:

1. Acesse [Cloudflare Pages](https://pages.cloudflare.com/)
2. Clique em "Create a project"
3. Conecte sua conta do GitHub
4. Selecione o repositório
5. Configure as seguintes opções de build:
   - **Framework preset**: Nuxt.js
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
   - **Node version**: 18

6. Adicione as variáveis de ambiente:
   - Vá em "Environment variables"
   - Adicione todas as variáveis do arquivo `.env.example` com seus valores reais

7. Clique em "Save and Deploy"

### Variáveis de Ambiente Necessárias:

```
NUXT_PUBLIC_FIREBASE_API_KEY
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NUXT_PUBLIC_FIREBASE_PROJECT_ID
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NUXT_PUBLIC_FIREBASE_APP_ID
```

## 📱 Uso

1. **Simulação**: Preencha os dados do imóvel (valor, entrada, prazo)
2. **Resultados**: Visualize as opções SAC e Price lado a lado
3. **Proposta**: Clique em "Aceitar Proposta" para iniciar o processo
4. **Login**: Entre com sua conta Google
5. **Dados Pessoais**: Complete suas informações
6. **Escolha**: Selecione entre SAC ou Price
7. **Assinatura**: Assine digitalmente a proposta
8. **Download**: Baixe o PDF gerado automaticamente

## 👤 Painel Admin

Para acessar o painel administrativo:

1. Navegue para `/admin`
2. Faça login com uma conta que tenha role de admin
3. Configure o admin no Firebase Console:
   - Vá em Authentication > Users
   - Clique nos 3 pontos do usuário
   - Add custom claim: `{ "admin": true }`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.