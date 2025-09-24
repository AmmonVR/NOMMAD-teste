# NOMMAD — Tela de Login/Cadastro (Etapa 1)

Esta é a primeira entrega do aplicativo NOMMAD ("Uber para serviços"). Aqui implementamos a tela de autenticação com foco em UI/UX estilo Uber, tema escuro e responsivo para celular.

## Arquivos

- `index.html`: estrutura da tela (logo, botão Google, telefone, continuar e links).
- `styles.css`: tema dark e estilos dos componentes.
- `app.js`: lógica de interação (mudar entre login/cadastro, validar telefone e tratar botões).

## Como executar

1. Abra o arquivo `index.html` no navegador.
   - Dica: se estiver usando um servidor local (ex.: VS Code Live Server), basta servir a pasta do projeto.
2. Teste no celular ou use o modo responsivo do navegador (F12 → Toggle device toolbar).

## Cores e tema

- Fundo: `#121212`
- Laranja destaque: `#FF9A00`
- Azul destaque: `#00C3FF`

## Validação do telefone

- Código do país deve ser algo como `+55`, `+351` (começa com `+` e 1-3 dígitos).
- Número do telefone aceita somente dígitos e deve ter 7 a 12 dígitos.
- Mensagens de erro aparecem abaixo do campo.

## Próximas etapas (fora deste escopo)

- Integração com OAuth do Google (backend) e fluxo real de verificação por SMS.
- Demais telas: mapa, perfil, busca de serviços e fluxo de contratação.

## Observações para aprendizado

- O código contém comentários explicando o que está acontecendo em cada parte.
- Sinta-se à vontade para experimentar as cores e textos para entender como as mudanças afetam a UI.
