# Como Adicionar Novos Representantes

## Sistema de Autorização

O formulário agora usa um sistema de autorização seguro baseado em banco de dados Supabase.

### Como Funciona

1. **URL Personalizada**: Cada representante tem um link único
   - Exemplo: `https://federalassociadoscadastro.shop/110956`
   - O número no final é o ID do representante

2. **Verificação Automática**:
   - Quando alguém acessa o link, o sistema verifica se o ID está autorizado
   - Se SIM: formulário abre normalmente
   - Se NÃO: mostra mensagem de acesso negado

3. **WhatsApp Dinâmico**:
   - Cada representante tem seu WhatsApp cadastrado
   - Após o cadastro, o usuário é redirecionado para o WhatsApp correto daquele representante

4. **Comissão Garantida**:
   - O ID do representante é enviado automaticamente para a empresa no campo `father`
   - Nada foi alterado no envio dos dados para a API da empresa

### Para Adicionar um Novo Representante

Me envie um comando assim:

```
Adicione o representante:
ID: 134684
WhatsApp: 5584999999999
Nome: João Silva (opcional)
```

Eu vou adicionar no banco de dados e o link estará funcionando imediatamente.

### Para Remover ou Desativar um Representante

```
Desative o representante 134684
```

O formulário dele será bloqueado automaticamente.

### Vantagens

✅ **Seguro**: Lista de IDs fica protegida no banco de dados
✅ **Fácil**: Você não precisa mexer no código
✅ **Rápido**: Mudanças são instantâneas
✅ **Centralizado**: Um formulário para todos os representantes
✅ **Não Interfere**: Dados continuam sendo enviados normalmente para a empresa

### Representantes Atualmente Autorizados

- **110956** - WhatsApp: 5584981321396 (Principal)
