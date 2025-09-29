/*
  NOMMAD — Lógica da tela de Login/Cadastro (JavaScript)

  Explicação geral (para iniciantes):
  - Este arquivo controla como a página se comporta quando o usuário interage com ela.
  - Aqui nós:
      1) alternamos entre os modos "login" e "cadastro",
      2) validamos o número de telefone (código do país + número),
      3) reagimos aos cliques dos botões (Google e Continuar),
      4) mostramos mensagens de erro amigáveis quando algo está errado.

  Importante: Neste momento não há backend real. Então, ao clicar em "Continuar",
  nós apenas simulamos o próximo passo (ex.: verificação por SMS) com um alert.
*/

function initAuthScreen() {
  // Pegamos os elementos da página que vamos manipular.
  const yearEl = document.getElementById('year');
  const titleEl = document.querySelector('[data-mode-text]');
  const authSection = document.getElementById('auth-section');
  const googleBtn = document.getElementById('google-button');
  const googleBtnText = document.getElementById('google-button-text');
  const formEl = document.getElementById('auth-form');
  const countryCodeInput = document.getElementById('country-code');
  const phoneInput = document.getElementById('phone');
  const helpEl = document.getElementById('phone-help');
  const continueBtn = document.getElementById('continue');
  const toSignupBtn = document.getElementById('to-signup');

  // Elementos da VIEW de alternância (login/cadastro)
  const loginView = document.getElementById('login-view');
  const signupView = document.getElementById('signup-view');
  const backToLoginBtn = document.getElementById('back-to-login');

  // Elementos do formulário de cadastro
  const signupForm = document.getElementById('signup-form');
  const signupName = document.getElementById('signup-name');
  const signupEmail = document.getElementById('signup-email');
  const signupCountryCode = document.getElementById('signup-country-code');
  const signupPhone = document.getElementById('signup-phone');
  const signupPassword = document.getElementById('signup-password');
  const signupConfirm = document.getElementById('signup-confirm');
  const signupTerms = document.getElementById('signup-terms');
  const signupHelp = document.getElementById('signup-help');

  // HOME
  const homeView = document.getElementById('home-view');
  const bottomNav = document.getElementById('bottom-nav');
  const headerLogo = document.getElementById('header-logo');
  const headerTitle = document.getElementById('header-title');
  const tabServicesBtn = document.getElementById('tab-services-btn');
  const tabRequestsBtn = document.getElementById('tab-requests-btn');
  const tabServices = document.getElementById('tab-services');
  const tabRequests = document.getElementById('tab-requests');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchHistory = document.getElementById('search-history');
  // Carousel
  const carousel = document.getElementById('suggestions-carousel');
  const carouselViewport = document.querySelector('#suggestions-carousel .carousel-viewport');
  const carouselTrack = document.querySelector('#suggestions-carousel .carousel-track');
  const arrowPrev = document.querySelector('#suggestions-carousel .carousel-arrow.prev');
  const arrowNext = document.querySelector('#suggestions-carousel .carousel-arrow.next');
  // ==== ELEMENTOS DA TELA DE PERFIL (recém adicionada no HTML) ====
  const profileTabBtn = document.getElementById('profile-tab-btn'); // Botão "Perfil" na barra inferior
  const profileView = document.getElementById('profile-view');      // Container da tela de perfil
  const profileBackBtn = document.getElementById('profile-back');   // Botão de voltar
  const profileEditBtn = document.getElementById('edit-profile-btn');
  const profileLogoutBtn = document.getElementById('profile-logout');
  const infoNameEl = document.getElementById('info-name');
  const infoPhoneEl = document.getElementById('info-phone');
  const infoEmailEl = document.getElementById('info-email');
  // Guardamos também o nome exibido em destaque (hero)
  const profileNameDisplay = document.getElementById('profile-name-display');

  /* =============================================================
     PERFIL — Simulação simples
     Objetivo: mostrar e esconder a tela de perfil quando o botão
     "Perfil" é clicado, sem perder outras funcionalidades.
     ============================================================= */

  // Estado: lembramos qual "tela" estava visível antes de abrir o perfil
  let previousMainView = null; // valores possíveis: 'auth' | 'home' | 'chats' | 'conversation'

  // Função utilitária para verificar se um elemento está visível (não tem class 'hidden')
  function isVisible(el) { return el && !el.classList.contains('hidden'); }

  // Abre a tela de perfil
  function openProfileView() {
    // Descobre onde o usuário estava
    if (isVisible(authSection)) previousMainView = 'auth';
    else if (isVisible(conversationView)) previousMainView = 'conversation';
    else if (isVisible(chatsList)) previousMainView = 'chats';
    else previousMainView = 'home';

    // Esconde outras views principais
    setHidden(authSection, true);
    setHidden(homeView, true);
    setHidden(chatsList, true);
    setHidden(conversationView, true);

    // Mostra a tela de perfil
    setHidden(profileView, false);
    setHidden(bottomNav, false); // mantém a barra inferior
    setActiveNav(profileTabBtn); // botão fica visualmente ativo
  }

  // Fecha a tela de perfil e retorna para a tela anterior
  function closeProfileView() {
    setHidden(profileView, true);
    if (previousMainView === 'auth') {
      // volta para login/cadastro
      setHidden(authSection, false);
      setHidden(bottomNav, true); // barra não aparece em auth
    } else if (previousMainView === 'chats') {
      openChatsList();
      setActiveNav(chatTabBtn);
    } else if (previousMainView === 'conversation') {
      setHidden(conversationView, false);
      setActiveNav(chatTabBtn);
    } else {
      // padrão: home
      showHome();
      setActiveNav(homeTabBtn);
    }
    previousMainView = null; // limpa o estado
  }

  // Simulação de "editar perfil": apenas altera o nome mostrado.
  function simulateEditProfile() {
    // Para aprender: prompt abre uma pequena caixa para o usuário digitar algo.
    const novoNome = prompt('Digite um novo nome para simular edição:', infoNameEl?.textContent || '');
    if (!novoNome) return; // se cancelar ou deixar vazio, não faz nada
    if (infoNameEl) infoNameEl.textContent = novoNome;
    if (profileNameDisplay) profileNameDisplay.textContent = novoNome;
    alert('Nome atualizado somente na interface (sem backend ainda).');
  }

  // Logout simples: volta para a tela de login e "reseta" estado.
  function simulateLogout() {
    alert('Saindo da conta (simulação).');
    // Fecha perfil, mostra auth e esconde navbar
    setHidden(profileView, true);
    switchToLogin();
    setHidden(bottomNav, true);
  }

  // Liga eventos
  profileTabBtn?.addEventListener('click', (e) => { e.preventDefault(); openProfileView(); });
  profileBackBtn?.addEventListener('click', (e) => { e.preventDefault(); closeProfileView(); });
  profileEditBtn?.addEventListener('click', (e) => { e.preventDefault(); simulateEditProfile(); });
  profileLogoutBtn?.addEventListener('click', (e) => { e.preventDefault(); simulateLogout(); });

  // Garantir que ao clicar em outros botões da navbar enquanto o perfil está aberto, ele seja fechado.
  bottomNav?.addEventListener('click', (e) => {
    const targetBtn = e.target.closest?.('.nav-item');
    if (!targetBtn) return;
    // Se o botão não for o de perfil e a tela de perfil está visível, fecha.
    if (profileView && !profileView.classList.contains('hidden') && targetBtn !== profileTabBtn) {
      closeProfileView();
    }
  });

  // Estado simples para saber se estamos no modo "login" ou "cadastro".
  // Começamos no modo "login" (poderia ser configurável).
  let mode = 'login'; // valores possíveis: 'login' | 'signup'

  // Mostra o ano atual no rodapé.
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  // Função que atualiza textos conforme o modo atual.
  function renderByMode() {
    if (!titleEl) return;
    if (mode === 'login') {
      titleEl.textContent = 'Bem-vindo(a) de volta';
      continueBtn.textContent = 'Continuar';
      if (googleBtnText) googleBtnText.textContent = 'Continuar com o Google';
      setHidden(authSection, false);
      setHidden(loginView, false);
      setHidden(signupView, true);
      setHidden(homeView, true);
      setHidden(bottomNav, true);
      // Header para login: mostra logo, esconde título
      setHidden(headerLogo, false);
      setHidden(headerTitle, true);
    } else {
      titleEl.textContent = 'Crie sua conta';
      continueBtn.textContent = 'Continuar';
      if (googleBtnText) googleBtnText.textContent = 'Continuar com o Google';
      setHidden(authSection, false);
      setHidden(loginView, true);
      setHidden(signupView, false);
      setHidden(homeView, true);
      setHidden(bottomNav, true);
      // Header para cadastro: mantém logo visível também
      setHidden(headerLogo, false);
      setHidden(headerTitle, true);
    }
  }

  // Duas funções auxiliares para alternar o modo.
  function switchToLogin() {
    mode = 'login';
    renderByMode();
    clearErrors();
  }

  function switchToSignup() {
    mode = 'signup';
    renderByMode();
    clearErrors();
  }

  // Conectamos os botões de alternância aos manipuladores acima.
  if (toSignupBtn) toSignupBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); switchToSignup(); });
  if (backToLoginBtn) backToLoginBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); switchToLogin(); });

  // Delegação extra (robustez para ambientes como CodePen)
  document.addEventListener('click', (e) => {
    const target = e.target;
    if (!target) return;
    const el = target.closest ? target.closest('[data-action]') : null;
    if (!el) return;
    const action = el.getAttribute('data-action');
    if (action === 'to-signup') { e.preventDefault(); e.stopPropagation(); switchToSignup(); }
    if (action === 'back-login') { e.preventDefault(); e.stopPropagation(); switchToLogin(); }
  });

  // Utilitário: esconde/mostra uma seção e atualiza aria-hidden
  function setHidden(element, hidden) {
    if (!element) return;
    if (hidden) {
      element.classList.add('hidden');
      element.setAttribute('aria-hidden', 'true');
      element.setAttribute('hidden', '');
      element.style.display = 'none';
    } else {
      element.classList.remove('hidden');
      element.setAttribute('aria-hidden', 'false');
      element.removeAttribute('hidden');
      element.style.display = '';
    }
  }

  // Validação simples do telefone. Nosso objetivo é garantir que:
  // - o código do país comece com "+" e tenha de 2 a 4 dígitos em seguida (ex.: +55, +351)
  // - o número do telefone tenha apenas dígitos e tamanho razoável (7 a 12)
  function validatePhoneParts(codeRaw, numberRaw) {
    const code = String(codeRaw || '').trim();
    const number = String(numberRaw || '').trim();

    // Regex para validação do código do país: começa com + e tem 1-3 dígitos após (total 2-4 chars)
    const countryCodeOk = /^\+[0-9]{1,3}$/.test(code);

    // Aceitamos número entre 7 e 12 dígitos (ajustável conforme necessidade do produto)
    const phoneDigitsOnly = number.replace(/\D/g, '');
    const phoneLengthOk = phoneDigitsOnly.length >= 7 && phoneDigitsOnly.length <= 12;

    return {
      valid: countryCodeOk && phoneLengthOk,
      code: code,
      number: phoneDigitsOnly
    };
  }

  // Limpa mensagens de erro visuais
  function clearErrors() {
    if (helpEl) helpEl.textContent = '';
    phoneInput?.setAttribute('aria-invalid', 'false');
    countryCodeInput?.setAttribute('aria-invalid', 'false');

    // Limpa mensagens/estados do cadastro também
    if (signupHelp) signupHelp.textContent = '';
    signupName?.setAttribute('aria-invalid', 'false');
    signupEmail?.setAttribute('aria-invalid', 'false');
    signupCountryCode?.setAttribute('aria-invalid', 'false');
    signupPhone?.setAttribute('aria-invalid', 'false');
    signupPassword?.setAttribute('aria-invalid', 'false');
    signupConfirm?.setAttribute('aria-invalid', 'false');
  }

  // Mostra uma mensagem de erro amigável
  function showPhoneError(message) {
    if (helpEl) helpEl.textContent = message;
    phoneInput?.setAttribute('aria-invalid', 'true');
  }

  // Quando o usuário clica em "Entrar com Google", por enquanto apenas simulamos.
  if (googleBtn) {
    googleBtn.addEventListener('click', function onGoogleClick() {
      // Em um app real, aqui você iniciaria o fluxo de OAuth do Google.
      alert('Fluxo do Google OAuth será implementado nas próximas etapas.');
    });
  }

  // Tratamos o envio do formulário (clique em Continuar ou Enter no teclado)
  if (formEl) {
    formEl.addEventListener('submit', function onSubmit(event) {
      event.preventDefault(); // evita recarregar a página
      clearErrors();

      const code = countryCodeInput?.value;
      const number = phoneInput?.value;
      const result = validatePhoneParts(code, number);

      if (!result.valid) {
        // Caso inválido: mostramos dicas específicas de correção
        const errors = [];
        if (!/^\+[0-9]{1,3}$/.test(String(code || ''))) {
          errors.push('Use um código de país válido (ex.: +55).');
          countryCodeInput?.setAttribute('aria-invalid', 'true');
        }
        const digits = String(number || '').replace(/\D/g, '');
        if (digits.length < 7 || digits.length > 12) {
          errors.push('Informe um telefone com 7 a 12 dígitos.');
        }
        showPhoneError(errors.join(' '));
        return;
      }

      // Caso válido: montamos o telefone completo e simulamos a próxima etapa
      const fullPhone = `${result.code}${result.number}`;
      if (mode === 'login') {
        alert(`Login: vamos verificar o telefone ${fullPhone} (simulação).`);
        // Simulação: após login OK, mostrar Home
        showHome();
        return;
      } else {
        alert(`Cadastro: vamos verificar o telefone ${fullPhone} (simulação).`);
      }

      // Aqui você chamaria um backend para enviar um SMS, por exemplo.
      // fetch('/api/send-otp', { method: 'POST', body: JSON.stringify({ phone: fullPhone }) })
      //   .then(...)
      //   .catch(...)
    });
  }

  // Pequeno detalhe UX: ao digitar, limpamos erros e limitamos caracteres inválidos.
  function sanitizeCountryCode(value) {
    // Garante que comece com + e depois apenas dígitos (limita a 4 chars)
    if (!value.startsWith('+')) value = '+' + value;
    value = '+' + value.slice(1).replace(/[^0-9]/g, '').slice(0, 3);
    return value;
  }

  function sanitizePhone(value) {
    // Mantém apenas dígitos e limita um tamanho razoável
    return value.replace(/\D/g, '').slice(0, 12);
  }

  // Formata telefone BR (básico): (11) 98888-7777 ou (11) 3888-7777
  // Explicação: recebemos apenas dígitos. Aplicamos partes conforme o tamanho:
  //  - 0-2 dígitos: apenas abre parêntese
  //  - 3-6 dígitos: (DD) XXXX
  //  - 7-10 dígitos: (DD) 9XXXX-XXXX ou (DD) XXXX-XXXX
  function formatBrazilPhone(rawDigits) {
    const d = rawDigits.replace(/\D/g, '');
    if (d.length === 0) return '';
    const dd = d.slice(0, 2); // DDD
    const rest = d.slice(2);
    if (rest.length === 0) return `(${dd}`; // ainda digitando DDD
    // Celular (9 dígitos começando com 9) ou fixo (8 dígitos)
    if (rest.length <= 4) {
      return `(${dd}) ${rest}`;
    } else if (rest.length <= 8) {
      // até 8 -> decide se é fixo (8) ou celular sem 9 ainda
      if (rest.length === 8 || rest.length === 7) {
        return `(${dd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
      }
      return `(${dd}) ${rest}`;
    } else {
      // 9 ou mais
      return `(${dd}) ${rest.slice(0, rest.length - 4)}-${rest.slice(-4)}`;
    }
  }

  countryCodeInput?.addEventListener('input', () => {
    countryCodeInput.value = sanitizeCountryCode(countryCodeInput.value);
    clearErrors();
  });

  phoneInput?.addEventListener('input', () => {
    // 1. Limpamos para obter só dígitos
    const digits = sanitizePhone(phoneInput.value);
    // 2. Aplicamos formatação amigável
    phoneInput.value = formatBrazilPhone(digits);
    clearErrors();
  });

  // Força estado inicial correto mesmo em ambientes como CodePen
  // (onde o JS pode rodar antes do HTML se não configurado):
  try {
    renderByMode();
  } catch (_) {}

  /* =====================
     CADASTRO — validações
     ===================== */

  // Validação de email simples (formato básico)
  function validateEmail(emailRaw) {
    const email = String(emailRaw || '').trim();
    const ok = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
    return { valid: ok, email };
  }

  // Regras de senha: pelo menos 8 caracteres (pode evoluir depois)
  function validatePassword(passwordRaw) {
    const password = String(passwordRaw || '');
    const ok = password.length >= 8;
    return { valid: ok, password };
  }

  function validatePasswordConfirm(passwordRaw, confirmRaw) {
    const password = String(passwordRaw || '');
    const confirm = String(confirmRaw || '');
    return { valid: password === confirm, confirm };
  }

  // Exibe mensagens de erro do cadastro
  function showSignupError(messages) {
    if (signupHelp) signupHelp.textContent = messages.join(' ');
  }

  // Sanitização dos campos de telefone no cadastro
  signupCountryCode?.addEventListener('input', () => {
    signupCountryCode.value = sanitizeCountryCode(signupCountryCode.value);
    clearErrors();
  });
  signupPhone?.addEventListener('input', () => {
    const digits = sanitizePhone(signupPhone.value);
    signupPhone.value = formatBrazilPhone(digits);
    clearErrors();
  });

  // Submit do formulário de cadastro
  if (signupForm) {
    signupForm.addEventListener('submit', function onSignupSubmit(event) {
      event.preventDefault();
      clearErrors();

      const errors = [];

      // Nome: pedimos algo não vazio e com tamanho mínimo
      const nameValue = String(signupName?.value || '').trim();
      if (nameValue.length < 3) {
        errors.push('Informe seu nome completo.');
        signupName?.setAttribute('aria-invalid', 'true');
      }

      // Email
      const emailResult = validateEmail(signupEmail?.value);
      if (!emailResult.valid) {
        errors.push('Use um email válido.');
        signupEmail?.setAttribute('aria-invalid', 'true');
      }

      // Telefone (usa a mesma validação do login)
      const phoneResult = validatePhoneParts(signupCountryCode?.value, signupPhone?.value);
      if (!phoneResult.valid) {
        errors.push('Informe um telefone válido (ex.: +55 e 7–12 dígitos).');
        signupCountryCode?.setAttribute('aria-invalid', 'true');
        signupPhone?.setAttribute('aria-invalid', 'true');
      }

      // Senha e confirmação
      const passResult = validatePassword(signupPassword?.value);
      if (!passResult.valid) {
        errors.push('Senha deve ter pelo menos 8 caracteres.');
        signupPassword?.setAttribute('aria-invalid', 'true');
      }
      const confirmResult = validatePasswordConfirm(signupPassword?.value, signupConfirm?.value);
      if (!confirmResult.valid) {
        errors.push('As senhas não conferem.');
        signupConfirm?.setAttribute('aria-invalid', 'true');
      }

      // Termos
      if (!signupTerms?.checked) {
        errors.push('Você precisa aceitar os Termos de Uso.');
      }

      if (errors.length > 0) {
        showSignupError(errors);
        return;
      }

      // Tudo OK: simulamos próxima etapa (ex.: envio de código/verificação)
      const fullSignupPhone = `${phoneResult.code}${phoneResult.number}`;
      alert(`Cadastro criado! Vamos verificar ${fullSignupPhone} (simulação).`);
      // Após cadastro, podemos opcionalmente voltar para o login
      switchToLogin();
    });
  }

  /* ==========================
     Toggle de visibilidade de senha
     ========================== */
  function setupPasswordToggles() {
    const toggles = document.querySelectorAll('.toggle-password');
    toggles.forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-target');
        if (!targetId) return;
        const input = document.getElementById(targetId);
        if (!input) return;

        const isHidden = input.getAttribute('type') === 'password';
        input.setAttribute('type', isHidden ? 'text' : 'password');
        // aria-pressed = true quando está mostrando (texto visível)
        btn.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
        btn.setAttribute('aria-label', isHidden ? 'Ocultar senha' : 'Mostrar senha');
      });
    });
  }

  setupPasswordToggles();

  /* =====================
     HOME — navegação e busca
     ===================== */
  function showHome() {
    // Oculta auth e exibe Home + navbar
    setHidden(authSection, true);
    setHidden(homeView, false);
    setHidden(bottomNav, false);
    // mark Home tab active in bottom nav
    setActiveNav(homeTabBtn);
    // Troca header: esconde logo, mostra título "Início"
    setHidden(headerLogo, true);
    setHidden(headerTitle, false);
    // foca na busca para UX rápida
    setTimeout(() => searchInput?.focus(), 0);
  }

  // Helper: set active nav button by index or element
  function setActiveNav(buttonEl) {
    if (!bottomNav) return;
    const items = bottomNav.querySelectorAll('.nav-item');
    items.forEach((it) => it.classList.remove('active'));
    if (buttonEl) buttonEl.classList.add('active');
  }

  function activateTab(tab) {
    if (tab === 'services') {
      tabServicesBtn?.classList.add('active');
      tabRequestsBtn?.classList.remove('active');
      tabServices?.classList.remove('hidden');
      tabServices?.setAttribute('aria-hidden', 'false');
      tabRequests?.classList.add('hidden');
      tabRequests?.setAttribute('aria-hidden', 'true');
    } else {
      tabServicesBtn?.classList.remove('active');
      tabRequestsBtn?.classList.add('active');
      tabServices?.classList.add('hidden');
      tabServices?.setAttribute('aria-hidden', 'true');
      tabRequests?.classList.remove('hidden');
      tabRequests?.setAttribute('aria-hidden', 'false');
    }
  }

  tabServicesBtn?.addEventListener('click', () => activateTab('services'));
  tabRequestsBtn?.addEventListener('click', () => activateTab('requests'));

  // Histórico de busca simples (em memória)
  const recentSearches = [];
  function renderSearchHistory() {
    if (!searchHistory) return;
    searchHistory.innerHTML = '';
    recentSearches.slice(-6).reverse().forEach((term) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'search-chip';
      chip.textContent = term;
      chip.addEventListener('click', () => {
        searchInput.value = term;
      });
      searchHistory.appendChild(chip);
    });
  }

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const term = String(searchInput?.value || '').trim();
    if (!term) return;
    recentSearches.push(term);
    renderSearchHistory();
    // Futuro: navegar para lista de resultados
  });

  // Exemplo: se quiser abrir a Home direto para visualização agora, descomente:
  // showHome();

  // Show all available services handler (for the 'Ver Tudo' button)
  // Originalmente redirecionava para /services/all — trocamos para abrir o modal local.
  function showAllAvailableServices(e) {
    e && e.preventDefault();
    openAllServices();
  }

  /* =====================
     CHAT — lista e conversa
     ===================== */
  const chatTabBtn = document.getElementById('chat-tab-btn');
  const homeTabBtn = document.getElementById('home-tab-btn');
  const chatsList = document.getElementById('chats-list');
  const closeChatsBtn = document.getElementById('close-chats');
  const conversationView = document.getElementById('conversation-view');
  const backToChatsBtn = document.getElementById('back-to-chats');
  const closeConversationBtn = document.getElementById('close-conversation');
  const chatsContainer = document.querySelector('.chats-container');
  const conversationMessages = document.getElementById('conversation-messages');
  const conversationInputForm = document.getElementById('conversation-input-form');
  const conversationInput = document.getElementById('conversation-input');
  const viewAllBtn = document.getElementById('view-all-suggestions');

  // Helper de debug visual (mostra mensagem curta no canto)
  function transientMsg(text) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.position = 'fixed';
    el.style.right = '12px';
    el.style.bottom = '12px';
    el.style.background = 'rgba(0,0,0,0.85)';
    el.style.color = '#fff';
    el.style.padding = '8px 12px';
    el.style.borderRadius = '8px';
    el.style.zIndex = 99999;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1800);
  }

  // Wire 'Ver Tudo' button
  viewAllBtn?.addEventListener('click', (e) => { e.preventDefault(); transientMsg('Ver Tudo clicado'); showAllAvailableServices(e); });

  // Modal wiring for "Ver Tudo" -> show all services in a modal
  const allServicesModal = document.getElementById('all-services-modal');
  const allServicesBackdrop = document.getElementById('all-services-backdrop');
  const closeAllServicesBtn = document.getElementById('close-all-services');
  const servicesListEl = document.getElementById('services-list');

  const servicesCatalog = [
    { emoji: '🔧', title: 'Marido de Aluguel', desc: 'Pequenos reparos domésticos gerais, como instalação de prateleiras, troca de torneiras e consertos rápidos.' },
    { emoji: '🧰', title: 'Montador de Móveis', desc: 'Montagem e desmontagem de móveis novos ou usados, incluindo armários, estantes e camas.' },
    { emoji: '💡', title: 'Eletricista', desc: 'Instalação, reparo e manutenção de redes elétricas, tomadas, interruptores e iluminação.' },
    { emoji: '🚰', title: 'Encanador', desc: 'Conserto de vazamentos, instalação de pias e louças sanitárias, e manutenção de sistemas hidráulicos.' },
    { emoji: '🚽', title: 'Desentupimento', desc: 'Desobstrução de pias, ralos, vasos sanitários e esgotos em geral.' },
    { emoji: '🎨', title: 'Pintura de Casas', desc: 'Pintura de paredes internas e externas, portas, janelas e retoques em geral.' },
    { emoji: '🧱', title: 'Pedreiro', desc: 'Construção, reformas estruturais, alvenaria, assentamento de pisos e revestimentos.' },
    { emoji: '🧹', title: 'Limpeza Doméstica', desc: 'Limpeza de rotina ou faxina pesada em residências, apartamentos e escritórios.' },
    { emoji: '🛋️', title: 'Limpeza de Sofá', desc: 'Limpeza profunda e higienização de estofados, sofás, poltronas e tapetes.' },
    { emoji: '🏊‍♂️', title: 'Limpeza de Piscinas', desc: 'Tratamento químico, aspiração e manutenção geral da água e da estrutura da piscina.' },
    { emoji: '🌿', title: 'Serviços de Jardineiro', desc: 'Cuidados com jardins, como corte de grama, poda de plantas, paisagismo e manutenção de áreas verdes.' },
    { emoji: '🐀', title: 'Controle de Pragas', desc: 'Desinsetização, desratização e manejo de pragas urbanas como formigas, baratas e cupins.' },
    { emoji: '📸', title: 'Fotógrafo', desc: 'Ensaios, eventos sociais (casamentos, aniversários) e fotografia profissional corporativa.' },
    { emoji: '🐕', title: 'Adestrador', desc: 'Treinamento de cães para obediência, correção de comportamento e socialização.' },
    { emoji: '💻', title: 'Programador', desc: 'Desenvolvimento de websites, aplicativos, softwares e serviços de tecnologia da informação.' }
  ];

  function renderServicesList() {
    if (!servicesListEl) return;
    servicesListEl.innerHTML = '';
    servicesCatalog.forEach(s => {
      const card = document.createElement('button');
      card.className = 'service-card';
      card.type = 'button';
      card.innerHTML = `
        <div class="service-emoji">${s.emoji}</div>
        <div class="service-info">
          <div class="service-title">${s.title}</div>
          <div class="service-desc">${s.desc}</div>
        </div>
      `;
      card.addEventListener('click', () => {
        closeAllServices();
        alert('Abrir serviços: ' + s.title);
      });
      servicesListEl.appendChild(card);
    });
  }

  // Keep track of the element that had focus before opening the modal
  let modalPreviousActive = null;

  function trapFocus(e) {
    if (e.key !== 'Tab') return;
    const focusable = allServicesModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.shiftKey) { // Shift + Tab
      if (document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    } else { // Tab
      if (document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function openAllServices() {
    renderServicesList();
    if (!allServicesModal) return;
    modalPreviousActive = document.activeElement;
    allServicesModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // focus first focusable element inside modal (close button)
    setTimeout(() => closeAllServicesBtn?.focus(), 20);
    document.addEventListener('keydown', trapFocus);
  }

  function closeAllServices() {
    if (!allServicesModal) return;
    allServicesModal.classList.add('hidden');
    document.body.style.overflow = '';
    document.removeEventListener('keydown', trapFocus);
    try { modalPreviousActive?.focus(); } catch (_) {}
  }

  function showAllAvailableServices(e) {
    e && e.preventDefault();
    openAllServices();
  }

  closeAllServicesBtn?.addEventListener('click', closeAllServices);
  allServicesBackdrop?.addEventListener('click', closeAllServices);
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && allServicesModal && !allServicesModal.classList.contains('hidden')) {
      closeAllServices();
    }
  });

  function openChatsList() {
    // show chats list (hide other screens)
    setHidden(chatsList, false);
    setHidden(conversationView, true);
    // ensure bottom nav stays visible
    setHidden(bottomNav, false);
    // lock page scroll behind overlay
    document.body.style.overflow = 'hidden';
    // focus first interactive element inside chats
    setTimeout(() => chatsContainer?.querySelector('.chat-item')?.focus(), 120);
  }

  function closeChats() {
    setHidden(chatsList, true);
    document.body.style.overflow = '';
  }

  function openConversation(chatId) {
    // for this demo we ignore chatId but in future map it to messages
    setHidden(chatsList, true);
    setHidden(conversationView, false);
    // ensure bottom nav stays visible while in conversation
    setHidden(bottomNav, false);
    // ensure message container is clear for demo messages
    if (conversationMessages) conversationMessages.innerHTML = '';
    // add a couple demo messages
    addConversationMessage('Olá! Como posso ajudar você hoje?', true);
    addConversationMessage('Oi! Gostaria de saber se você realiza instalações de prateleiras.', false);
    // focus input
    setTimeout(() => conversationInput?.focus(), 120);
  }

  function closeConversation() {
    setHidden(conversationView, true);
    document.body.style.overflow = '';
  }

  
  // Helper to append message bubble
function addConversationMessage(text, received = false) {
    if (!conversationMessages) return;
    const el = document.createElement('div');
    el.className = 'chat-bubble' + (received ? ' received' : '');
    el.textContent = text;
    // Mude de appendChild para prepend
    conversationMessages.prepend(el); 
    // scroll to bottom
    setTimeout(() => { conversationMessages.scrollTop = conversationMessages.scrollHeight; }, 20);
}

  // Wire bottom nav chat button
  if (chatTabBtn) chatTabBtn.addEventListener('click', (e) => { e.preventDefault(); openChatsList(); });
  // Wire bottom nav home button
  if (homeTabBtn) homeTabBtn.addEventListener('click', (e) => { e.preventDefault(); showHome(); setActiveNav(homeTabBtn);
    // hide any chat overlays when returning home
    setHidden(chatsList, true);
    setHidden(conversationView, true);
    document.body.style.overflow = '';
  });

  // Make any clicked nav-item visually active (delegation)
  bottomNav?.addEventListener('click', (e) => {
    const btn = e.target && e.target.closest ? e.target.closest('.nav-item') : null;
    if (!btn) return;
    setActiveNav(btn);
  });

  // Ensure chat tab also becomes active when opened
  if (chatTabBtn) chatTabBtn.addEventListener('click', (e) => { e.preventDefault(); openChatsList(); setActiveNav(chatTabBtn); });

  // Close chat list
  if (closeChatsBtn) closeChatsBtn.addEventListener('click', (e) => {
    e.preventDefault();
    closeChats(); // Essa função fecha a tela do chat
    showHome(); // Essa função exibe a tela inicial
    setActiveNav(homeTabBtn); // Essa função destaca o botão de início
  });

  // Clicking a chat item opens conversation (delegation)
  chatsContainer?.addEventListener('click', (e) => {
    const btn = e.target.closest ? e.target.closest('.chat-item') : null;
    if (!btn) return;
    const chatId = btn.getAttribute('data-chat-id');
    openConversation(chatId);
  });

  // Back from conversation to list
  if (backToChatsBtn) backToChatsBtn.addEventListener('click', (e) => { e.preventDefault(); openChatsList(); });
  // Close conversation to go back to chats list
  if (closeConversationBtn) closeConversationBtn.addEventListener('click', (e) => { 
     e.preventDefault(); 
     closeConversation(); // Fecha a tela de conversa
     // Adicione estas duas linhas
     showHome(); // Exibe a tela inicial
     setActiveNav(homeTabBtn); // Ativa o botão de 'início' na barra de navegação
  });

  // Sending a message in conversation
  if (conversationInputForm) {
    conversationInputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const text = String(conversationInput?.value || '').trim();
      if (!text) return;
      addConversationMessage(text, false);
      conversationInput.value = '';
      // simulate reply
      setTimeout(() => addConversationMessage('Recebido! Vou verificar e já respondo.', true), 800);
    });
  }

  /* =====================
     CARROSSEL — interação
     ===================== */
  let carouselIndex = 0; // índice de página

  function getCardsPerView() {
    if (!carouselViewport || !carouselTrack) return 1;
    const styles = getComputedStyle(carouselTrack);
    const cardWidth = parseFloat(styles.getPropertyValue('grid-auto-columns')) || 120;
    const gap = parseFloat(styles.getPropertyValue('column-gap')) || 12;
    const viewportWidth = carouselViewport.getBoundingClientRect().width;
    return Math.max(1, Math.floor(viewportWidth / (cardWidth + gap)));
  }

  function getTotalCards() {
    return carouselTrack ? carouselTrack.children.length : 0;
  }

  function updateCarousel() {
    if (!carouselTrack || !carouselViewport) return;
    const styles = getComputedStyle(carouselTrack);
    const cardWidth = parseFloat(styles.getPropertyValue('grid-auto-columns')) || 120;
    const gap = parseFloat(styles.getPropertyValue('column-gap')) || 12;
    const cardsPerView = getCardsPerView();
    const offset = carouselIndex * (cardWidth + gap) * cardsPerView;
    carouselTrack.style.transform = `translateX(-${offset}px)`;

    // Desabilita setas nos limites
    const total = getTotalCards();
    const maxIndex = Math.max(0, Math.ceil(total / cardsPerView) - 1);
    if (arrowPrev) arrowPrev.disabled = carouselIndex <= 0;
    if (arrowNext) arrowNext.disabled = carouselIndex >= maxIndex || maxIndex === 0;

    // Visibilidade da seta esquerda: só mostra após rolar para a direita
    if (arrowPrev) {
      const atStart = carouselIndex <= 0;
      arrowPrev.style.visibility = atStart ? 'hidden' : 'visible';
      // Remove o espaço da seta esquerda quando no início para alinhar as caixas à esquerda
      arrowPrev.style.display = atStart ? 'none' : 'grid';
    }
  }

  function moveCarousel(direction) {
    const cardsPerView = getCardsPerView();
    const total = getTotalCards();
    const maxIndex = Math.max(0, Math.ceil(total / cardsPerView) - 1);
    carouselIndex = Math.min(maxIndex, Math.max(0, carouselIndex + direction));
    updateCarousel();
  }

  arrowPrev?.addEventListener('click', () => moveCarousel(-1));
  arrowNext?.addEventListener('click', () => moveCarousel(1));
  window.addEventListener('resize', () => { carouselIndex = 0; updateCarousel(); });
  // Inicializa posição
  updateCarousel();
}

// Garante que a inicialização aconteça após o DOM estar pronto (compatível com CodePen)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthScreen);
} else {
  initAuthScreen();
}

