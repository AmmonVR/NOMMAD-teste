# NOMMAD-teste
Este projeto é uma aplicação web para conectar clientes a profissionais de serviços, com funcionalidades de autenticação, busca inteligente, filtros geográficos e gerenciamento de propostas e conversas.

Principais Funcionalidades
Tela de Login/Cadastro:
Interface amigável para autenticação, com validação de telefone, email e senha. Simula fluxo de login/cadastro e integração futura com OAuth do Google.

Busca Inteligente de Profissionais:
Sistema de busca que utiliza normalização de texto, sinônimos e indexação para encontrar profissionais por nome, categoria ou palavras-chave.
Permite filtrar resultados por localização geográfica (raio em km) usando um mock de geolocalização.

Gestão de Propostas:
Visualização, aceitação e rejeição de propostas de profissionais para serviços solicitados.
Badge dinâmico indica número de propostas pendentes.

Chat Simulado:
Interface de chat para comunicação entre cliente e profissional após aceitação de proposta.

Carrossel e Catálogo de Serviços:
Exibição de serviços disponíveis em formato de carrossel e modal, facilitando a navegação.

Acessibilidade e UX:
Diversos detalhes de usabilidade, como máscaras de dados sensíveis, navegação por teclado, feedback visual e foco em acessibilidade.

Estrutura dos Arquivos
app.js:
Controla toda a lógica da interface, autenticação, navegação, busca, propostas, chat e carrossel.

searchEngine.js:
Motor de busca e filtro geográfico, com carregamento de dados de profissionais e sinônimos a partir de arquivos JSON.

professionals.json e synonyms.json:
Dados de profissionais e sinônimos usados na busca.
