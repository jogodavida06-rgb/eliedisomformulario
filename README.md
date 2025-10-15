# Federal Associados - Formulário de Cadastro

Sistema de cadastro e pagamento para a Federal Associados com integração de pagamentos via PIX, Cartão e Boleto.

## 🚀 Funcionalidades

- ✅ Formulário completo de cadastro com validação
- ✅ Validação de CPF
- ✅ Busca automática de endereço por CEP (ViaCEP)
- ✅ Seleção de planos (Vivo, TIM, Claro)
- ✅ Suporte para chip físico e e-SIM
- ✅ Sistema de autorização de representantes com lista controlada
- ✅ Captura automática do ID do representante via URL
- ✅ Redirecionamento para WhatsApp específico do representante
- ✅ Múltiplas formas de pagamento:
  - PIX (com QR Code)
  - Cartão de Crédito
  - Boleto Bancário

## 🔧 Configuração

### 1. Instalar dependências

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variáveis de ambiente

Copie o arquivo \`.env.example\` para \`.env.local\` e preencha com suas credenciais:

\`\`\`bash
cp .env.example .env.local
\`\`\`

### 3. Obter credenciais necessárias

#### MercadoPago (para pagamentos)
1. Acesse [MercadoPago Developers](https://www.mercadopago.com.br/developers)
2. Crie uma aplicação
3. Copie suas credenciais (Public Key e Access Token)
4. Cole no arquivo \`.env.local\`

#### Federal Associados API
1. Entre em contato com o suporte da Federal Associados
2. Solicite acesso à API para integração
3. Obtenha sua chave de API
4. Configure no \`.env.local\`

### 4. Executar o projeto

\`\`\`bash
npm run dev
\`\`\`

Acesse: [http://localhost:3000](http://localhost:3000)

## 🔗 Como Funciona o Sistema de Representantes

### URLs Personalizadas

Cada representante possui uma URL única com seu ID:

```
https://federalassociadoscadastro.shop/110956
```

Onde `110956` é o ID único do representante.

### Processo de Autorização

1. **Acesso ao Formulário**: Quando alguém acessa uma URL com ID, o sistema verifica automaticamente se o ID está autorizado
2. **Verificação**: O ID é verificado na lista de representantes autorizados no banco de dados
3. **Aprovação**: Se autorizado, o formulário abre normalmente com o ID do representante já vinculado
4. **Bloqueio**: Se não autorizado, uma mensagem de erro é exibida e o formulário não abre

### Adicionando Novos Representantes

Para adicionar um novo representante autorizado, envie uma requisição POST para:

```bash
POST /api/representatives/add
Content-Type: application/json

{
  "id": "134684",
  "whatsapp": "558481321396"
}
```

Exemplo usando curl:

```bash
curl -X POST https://federalassociadoscadastro.shop/api/representatives/add \
  -H "Content-Type: application/json" \
  -d '{"id":"134684","whatsapp":"558481321396"}'
```

### Fluxo Completo

1. Cliente acessa o link do representante (ex: `.../110956`)
2. Sistema verifica se o ID está autorizado
3. Se autorizado, formulário abre com ID do representante já vinculado
4. Cliente preenche o formulário e finaliza o cadastro
5. Após salvar, cliente é redirecionado para o WhatsApp do representante
6. Representante recebe a comissão pela venda registrada

## 🔐 Segurança

- Nunca exponha suas chaves de API no código
- Use variáveis de ambiente para todas as credenciais
- Valide todos os dados no backend
- Implemente rate limiting nas APIs

## 📞 Suporte

Para dúvidas sobre a integração com a Federal Associados:
- Telefone: 0800 6262 345
- Site: https://federalassociados.com.br

## 📄 Licença

Este projeto é privado e destinado ao uso exclusivo do afiliado ID 110956.
