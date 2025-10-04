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
  const proposalsBadge = document.getElementById('proposals-badge');
  const tabServices = document.getElementById('tab-services');
  const tabRequests = document.getElementById('tab-requests');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchHistory = document.getElementById('search-history');
  const homeSearchSection = document.getElementById('home-search-section');
  // Propostas (listas e filtros)
  const proposalsListEl = document.getElementById('proposals-list');
  const proposalsEmptyEl = document.getElementById('proposals-empty');
  const acceptedSectionEl = document.getElementById('accepted-proposals-section');
  const acceptedListEl = document.getElementById('accepted-proposals-list');
  const acceptedEmptyEl = document.getElementById('accepted-empty');
  const proposalServiceFilter = document.getElementById('proposal-service-filter');

  // Results view elements
  const resultsView = document.getElementById('results-view');
  const resultsBackBtn = document.getElementById('results-back-btn');
  const resultsSearchForm = document.getElementById('results-search-form');
  const resultsSearchInput = document.getElementById('results-search-input');
  const resultsTopicLine = document.getElementById('results-topic-line');
  const resultsTopicText = document.getElementById('results-topic-text');
  const changeSearchBtn = document.getElementById('change-search-btn');
  const changeLocationBtn = document.getElementById('change-location-btn');
  const currentLocationLabel = document.getElementById('current-location-label');
  const geoFiltersPanel = document.getElementById('geo-filters-panel');
  const searchResultsEl = document.getElementById('search-results');
  const geoLocationInput = document.getElementById('geo-location-input');
  const geoRadiusInput = document.getElementById('geo-radius-input');
  const geoApplyBtn = document.getElementById('geo-apply-btn');
  const geoClearBtn = document.getElementById('geo-clear-btn');
  const geoActiveHint = document.getElementById('geo-active-hint');

  // Estado geo selecionado (obrigatório agora: sem local não há resultados)
  let activeGeoCenter = null; // {lat,lng,cidade,uf}
  let activeGeoRadiusKm = null; // km
  const GEO_STORAGE_KEY = 'nommad:userGeoCenter';
  const GEO_RADIUS_KEY = 'nommad:userGeoRadiusKm';
  let lastSearchQuery = '';
  // Seleção múltipla de profissionais
  const selectionBar = document.getElementById('selection-bar');
  const selectionCountEl = document.getElementById('selection-count');
  const selectionContinueBtn = document.getElementById('selection-continue-btn');
  const selectedProfessionals = new Set();
  let selectedCategory = null; // restringe seleção a uma categoria
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
  // EM ANDAMENTO
  const progressTabBtn = document.getElementById('progress-tab-btn');
  const progressView = document.getElementById('progress-view');
  const progressList = document.getElementById('progress-list');
  const progressCompletedList = document.getElementById('progress-completed-list');
  const progressSubtitle = document.getElementById('progress-subtitle');
  // info-name removido da lista (nome já aparece em destaque no topo)
  const infoNameEl = null;
  const infoPhoneEl = document.getElementById('info-phone');
  const infoEmailEl = document.getElementById('info-email');
  // Guardamos também o nome exibido em destaque (hero)
  const profileNameDisplay = document.getElementById('profile-name-display');

  /* =============================================================
     FUNÇÕES DE MASCARAMENTO (censura leve para exibir parcialmente)
     ============================================================= */
  // Exemplo desejado telefone: (11) 98****** — mantemos DDD + 2 primeiros dígitos
  function maskPhonePretty(raw) {
    if (!raw) return '';
    const digits = String(raw).replace(/\D/g, '');
    if (digits.length < 4) return raw; // pouco para mascarar
    const ddd = digits.slice(0, 2);
    const firstTwo = digits.slice(2, 4); // 2 primeiros depois do DDD
    return `(${ddd}) ${firstTwo}******`;
  }
  // Exemplo desejado email: Am********@email.com (mantém 2 iniciais + resto mascarado até @)
  function maskEmail(raw) {
    if (!raw || !raw.includes('@')) return raw;
    const [user, domain] = raw.split('@');
    if (!user) return raw;
    const visible = user.slice(0, 2);
    // Garante ao menos 4 asteriscos para não ficar curto demais
    const starsCount = Math.max(4, user.length - 2);
    return `${visible}${'*'.repeat(starsCount)}@${domain}`;
  }
  // Aplica a máscara sem perder os valores originais (armazenamos em data-original)
  function applyProfileMask() {
    if (infoPhoneEl) {
      if (!infoPhoneEl.dataset.original) infoPhoneEl.dataset.original = infoPhoneEl.textContent.trim();
      infoPhoneEl.textContent = maskPhonePretty(infoPhoneEl.dataset.original);
    }
    if (infoEmailEl) {
      if (!infoEmailEl.dataset.original) infoEmailEl.dataset.original = infoEmailEl.textContent.trim();
      infoEmailEl.textContent = maskEmail(infoEmailEl.dataset.original);
    }
  }

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
    // Aplica censura a telefone e email exibidos
    applyProfileMask();
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
  const novoNome = prompt('Digite um novo nome para simular edição:', profileNameDisplay?.textContent || '');
    if (!novoNome) return; // se cancelar ou deixar vazio, não faz nada
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
    // Garante que outras telas secundárias fiquem ocultas
    setHidden(progressView, true);
    setHidden(resultsView, true);
    setHidden(chatsList, true);
    setHidden(conversationView, true);
    setHidden(profileView, true);
    // Exibe Home
    setHidden(homeView, false);
    setHidden(bottomNav, false);
    // mark Home tab active in bottom nav
    setActiveNav(homeTabBtn);
    // Troca header: esconde logo, mostra título "Início"
    setHidden(headerLogo, true);
    setHidden(headerTitle, false);
    if (headerTitle) headerTitle.textContent = 'Início';
    // foca na busca apenas quando a aba Serviços está ativa e a barra está visível
    setTimeout(() => {
      const servicesActive = tabServicesBtn?.classList.contains('active');
      const isHidden = homeSearchSection?.classList.contains('hidden');
      if (servicesActive && !isHidden) searchInput?.focus();
    }, 0);
    // Atualiza badge (se propostas mock existem)
    try { updateProposalsBadge(); } catch(_) {}
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
      if (homeSearchSection) { homeSearchSection.classList.remove('hidden'); homeSearchSection.setAttribute('aria-hidden','false'); }
    } else {
      tabServicesBtn?.classList.remove('active');
      tabRequestsBtn?.classList.add('active');
      tabServices?.classList.add('hidden');
      tabServices?.setAttribute('aria-hidden', 'true');
      tabRequests?.classList.remove('hidden');
      tabRequests?.setAttribute('aria-hidden', 'false');
      // Ao abrir a aba de propostas, renderiza lista
      renderProposalsView();
      if (homeSearchSection) { homeSearchSection.classList.add('hidden'); homeSearchSection.setAttribute('aria-hidden','true'); }
    }
  }

  tabServicesBtn?.addEventListener('click', () => activateTab('services'));
  tabRequestsBtn?.addEventListener('click', () => activateTab('requests'));

  // Histórico de busca simples (em memória)
  // Histórico: armazenamos termos únicos, mais recente primeiro
  const recentSearches = [];
  function pushRecent(term){
    if (!term) return;
    const norm = term.trim();
    if (!norm) return;
    const idx = recentSearches.findIndex(t => t.toLowerCase() === norm.toLowerCase());
    if (idx !== -1) {
      recentSearches.splice(idx,1); // remove ocorrência antiga
    }
    recentSearches.unshift(norm); // adiciona no início
    // limita a 8 itens
    if (recentSearches.length > 8) recentSearches.length = 8;
  }
  function renderSearchHistory() {
    if (!searchHistory) return;
    searchHistory.innerHTML = '';
    recentSearches.forEach((term) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'search-chip';
      chip.innerHTML = `
        <span class="search-chip-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="9"></circle>
            <polyline points="12 7 12 12 15 14"></polyline>
          </svg>
        </span>
        <span class="search-chip-text">${term}</span>`;
      chip.addEventListener('click', () => {
        searchInput.value = term;
        lastSearchQuery = term;
        openResultsView(term);
      });
      searchHistory.appendChild(chip);
    });
  }

  /* =============================================
     CLIQUE EM SUGESTÕES DO CARROSSEL
     Objetivo: ao clicar em uma sugestão, abrir a
     tela de resultados e executar a busca usando
     o texto da sugestão.
     ============================================= */
  carousel?.addEventListener('click', (e) => {
    const btn = e.target.closest?.('.suggestion-card');
    if (!btn) return;
    const label = btn.querySelector('.label');
    const term = label?.textContent?.trim();
    if (!term) return;
    // Atualiza campo de busca na Home para coerência
    if (searchInput) searchInput.value = term;
    // Armazena em histórico e atualiza UI
  pushRecent(term);
  renderSearchHistory();
  lastSearchQuery = term;
    // Abre view de resultados já com a busca pronta
    openResultsView(term);
  });

  // Abre results view e executa busca
  function openResultsView(initialTerm){
    if (initialTerm != null) {
      resultsSearchInput.value = initialTerm;
    }
    // anima a saída suave da home
    if (homeView) {
      homeView.classList.add('results-hide');
      setTimeout(()=> setHidden(homeView,true), 220);
    }
    // mostra results com classe de entrada
    setHidden(resultsView, false);
    resultsView.classList.add('anim-enter');
    setTimeout(()=> resultsView.classList.remove('anim-enter'), 450);
    setHidden(bottomNav, false);
    setHidden(headerLogo, true);
    setHidden(headerTitle, false);
    headerTitle.textContent = 'Resultados';
    setTimeout(()=>resultsSearchInput?.focus(),30);
    performSearch();
    if (initialTerm){
      showResultsTopic(initialTerm);
    } else {
      hideResultsTopic();
    }
  }

  function closeResultsView(){
    // animação de saída
    if (resultsView){
      resultsView.classList.add('anim-leave');
      setTimeout(()=>{ resultsView.classList.remove('anim-leave'); setHidden(resultsView,true); }, 260);
    } else {
      setHidden(resultsView,true);
    }
    showHome();
    if (homeView){
      homeView.classList.remove('results-hide');
      homeView.style.opacity = '1';
      homeView.style.transform = 'translateY(0)';
    }
    if (headerTitle) headerTitle.textContent = 'Início';
  }

  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const term = String(searchInput?.value || '').trim();
    if (!term) return;
  pushRecent(term);
  renderSearchHistory();
  lastSearchQuery = term;
    // abre página de resultados
    openResultsView(term);
  });

  resultsSearchForm?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const term = String(resultsSearchInput?.value||'').trim();
    if (!term) return;
    lastSearchQuery = term;
    performSearch();
  });

  resultsBackBtn?.addEventListener('click', (e)=>{ e.preventDefault(); closeResultsView(); });

  changeLocationBtn?.addEventListener('click', (e)=>{
    e.preventDefault();
    const visible = !geoFiltersPanel.classList.contains('hidden');
    if (visible){
      geoFiltersPanel.classList.add('hidden');
      geoFiltersPanel.setAttribute('aria-hidden','true');
    } else {
      geoFiltersPanel.classList.remove('hidden');
      geoFiltersPanel.setAttribute('aria-hidden','false');
      setTimeout(()=>geoLocationInput?.focus(),50);
    }
  });

  function clearSearchResults(){ if (searchResultsEl) searchResultsEl.innerHTML=''; }

  function renderSearchResults(list){
    if (!searchResultsEl) return;
    if (!list.length){
      searchResultsEl.innerHTML = '<div class="search-empty">Nenhum profissional encontrado.</div>';
      return;
    }
    const html = list.map(p => {
      const tags = (p.keywords||[]).slice(0,4).map(t=>`<span>${t}</span>`).join('');
      const distancia = p.distanciaKm != null ? `<span>${p.distanciaKm.toFixed(1)} km</span>` : '';
      const selected = selectedProfessionals.has(p.id) ? ' selected' : '';
      return `
        <div class="search-result-card${selected}" data-prof-id="${p.id}" data-cat="${p.categoria}" role="button" tabindex="0" aria-label="Selecionar ${p.nome}">
          <img class="search-result-avatar" src="${p.avatar}" alt="Foto de ${p.nome}">
          <div class="search-result-body">
            <div class="search-result-name">${p.nome}</div>
            <div class="search-result-cat">${p.categoria}</div>
            <div class="search-result-meta"><span>⭐ ${p.rating.toFixed(1)}</span><span>${p.jobsConcluidos} serviços</span>${distancia}</div>
            <div class="search-result-tags">${tags}</div>
          </div>
          <div class="select-indicator">${selected ? '✓' : '+'}</div>
        </div>`;
    }).join('');
    searchResultsEl.innerHTML = html;
  }

  async function performSearch(){
    if (!window.__searchEngine){
      // tenta novamente em breve (script pode não ter carregado ainda)
      setTimeout(performSearch, 120);
      return;
    }
    const qEl = resultsView && !resultsView.classList.contains('hidden') ? resultsSearchInput : searchInput;
    const q = String(qEl?.value||'').trim();
    lastSearchQuery = q;
    // Caso não tenha localização, ainda permitimos buscar (sem filtro geo)
    if (!q){
      if (activeGeoCenter){
        const nearby = await window.__searchEngine.searchProfessionals('', activeGeoCenter, activeGeoRadiusKm);
        renderSearchResults(nearby);
      } else {
        // Sem query e sem geo: mostra dica
        if (searchResultsEl) searchResultsEl.innerHTML = '<div class="search-empty">Digite algo para buscar profissionais.</div>';
      }
      updateCurrentLocationLabel();
      return;
    }
    const results = await window.__searchEngine.searchProfessionals(q, activeGeoCenter, activeGeoRadiusKm);
    renderSearchResults(results);
    updateCurrentLocationLabel();
  }

  // Debounce input
  let searchDebounce = null;
  searchInput?.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => {/* apenas digitação na home, não busca ainda */}, 250);
  });

  resultsSearchInput?.addEventListener('input', () => {
    clearTimeout(searchDebounce);
    searchDebounce = setTimeout(() => performSearch(), 220);
  });

  // Clique em resultado (placeholder)
  searchResultsEl?.addEventListener('click', (e) => {
    const card = e.target.closest('.search-result-card');
    if (!card) return;
    toggleProfessionalSelection(card.dataset.profId, card.getAttribute('data-cat'));
  });

  // ===== GEO FILTERS =====
  function updateCurrentLocationLabel(){
    if (!currentLocationLabel) return;
    if (!activeGeoCenter){ currentLocationLabel.textContent = 'Defina seu local'; currentLocationLabel.classList.add('need-location'); return; }
    currentLocationLabel.classList.remove('need-location');
    currentLocationLabel.textContent = `Local: ${activeGeoCenter.cidade||'Custom'}${activeGeoCenter.uf? '/'+activeGeoCenter.uf:''} • ${activeGeoRadiusKm} km`;
  }

  function setGeoHint(){
    if (!geoActiveHint) return;
    if (!activeGeoCenter){ geoActiveHint.classList.add('hidden'); geoActiveHint.setAttribute('aria-hidden','true'); updateCurrentLocationLabel(); return; }
    geoActiveHint.classList.remove('hidden');
    geoActiveHint.setAttribute('aria-hidden','false');
    geoActiveHint.innerHTML = `Filtro de localização ativo: <strong>${activeGeoCenter.cidade||'Local custom'}${activeGeoCenter.uf? '/'+activeGeoCenter.uf:''}</strong> em raio de <strong>${activeGeoRadiusKm} km</strong>`;
    updateCurrentLocationLabel();
  }

  // Simples geocoder fake (mock) — em produção usar API real
  const mockGeoDB = [
    {match:['sao paulo','são paulo','sp'], lat:-23.55052, lng:-46.633308, cidade:'São Paulo', uf:'SP'},
    {match:['pinheiros'], lat:-23.5670, lng:-46.6954, cidade:'São Paulo', uf:'SP'},
    {match:['moema'], lat:-23.6010, lng:-46.6644, cidade:'São Paulo', uf:'SP'}
  ];
  function fakeGeocode(term){
    term = term.toLowerCase().trim();
    return mockGeoDB.find(r => r.match.includes(term)) || null;
  }

  geoApplyBtn?.addEventListener('click', () => {
    const locTerm = String(geoLocationInput?.value||'').trim();
    const radius = parseFloat(geoRadiusInput?.value||'');
    if (!locTerm || !radius){
      alert('Informe local e raio.');
      return;
    }
    const geo = fakeGeocode(locTerm);
    if (!geo){
      alert('Local não reconhecido (mock). Tente: São Paulo, Pinheiros, Moema.');
      return;
    }
    activeGeoCenter = {lat: geo.lat, lng: geo.lng, cidade: geo.cidade, uf: geo.uf};
    activeGeoRadiusKm = radius;
    setGeoHint();
    performSearch();
    // fecha painel após aplicar
    geoFiltersPanel?.classList.add('hidden');
    geoFiltersPanel?.setAttribute('aria-hidden','true');
  });

  geoClearBtn?.addEventListener('click', () => {
    activeGeoCenter = null;
    activeGeoRadiusKm = null;
    setGeoHint();
    performSearch();
    geoFiltersPanel?.classList.add('hidden');
    geoFiltersPanel?.setAttribute('aria-hidden','true');
    try { localStorage.removeItem(GEO_STORAGE_KEY); localStorage.removeItem(GEO_RADIUS_KEY); } catch(_) {}
  });

  // Sem localização inicial: mostra label de necessidade
  // 1) tenta restaurar localização persistida
  (function restorePersistedLocation(){
    try {
      const saved = localStorage.getItem(GEO_STORAGE_KEY);
      const savedRadius = localStorage.getItem(GEO_RADIUS_KEY);
      if (saved){
        const obj = JSON.parse(saved);
        if (obj && Number.isFinite(obj.lat) && Number.isFinite(obj.lng)) {
          activeGeoCenter = obj;
          const r = parseFloat(savedRadius);
          if (Number.isFinite(r) && r > 0) activeGeoRadiusKm = r; else activeGeoRadiusKm = 15;
        }
      }
    } catch(_) {}
    updateCurrentLocationLabel();
  })();

  // 2) tentativa de geolocalização automática (executada ao abrir a results view se ainda não definido)
  async function attemptAutoGeolocation(){
    if (activeGeoCenter) return; // já temos
    if (!('geolocation' in navigator)) return;
    if (currentLocationLabel){
      currentLocationLabel.textContent = 'Detectando sua localização...';
      currentLocationLabel.classList.add('locating');
    }
    const getPosition = () => new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 });
    });
    try {
      const pos = await getPosition();
      const { latitude, longitude } = pos.coords;
      // aproxima para local conhecido do mock mais próximo, senão usa label genérica
      let nearest = null; let nearestDist = Infinity;
      const toRad = d=> d*Math.PI/180; const R=6371;
      const distKm = (a,b,c,d)=>{ const dLat=toRad(c-a); const dLng=toRad(d-b); const A=Math.sin(dLat/2)**2+Math.cos(toRad(a))*Math.cos(toRad(c))*Math.sin(dLng/2)**2; return 2*R*Math.atan2(Math.sqrt(A),Math.sqrt(1-A)); };
      // reutiliza mockGeoDB se já foi definido (garantir escopo)
      const mockList = typeof mockGeoDB !== 'undefined' ? mockGeoDB : [];
      mockList.forEach(m => {
        const d = distKm(latitude, longitude, m.lat, m.lng);
        if (d < nearestDist){ nearestDist = d; nearest = m; }
      });
      if (nearest && nearestDist <= 80){
        activeGeoCenter = { lat: latitude, lng: longitude, cidade: nearest.cidade, uf: nearest.uf };
      } else {
        activeGeoCenter = { lat: latitude, lng: longitude, cidade: 'Local atual', uf: '' };
      }
      activeGeoRadiusKm = activeGeoRadiusKm || 20; // raio default se usuário não escolheu
      updateCurrentLocationLabel();
      performSearch();
      // persiste
      try { localStorage.setItem(GEO_STORAGE_KEY, JSON.stringify(activeGeoCenter)); localStorage.setItem(GEO_RADIUS_KEY, String(activeGeoRadiusKm)); } catch(_) {}
    } catch(err){
      // usuário negou ou erro — mantém obrigação de definir manualmente
      if (currentLocationLabel){
        currentLocationLabel.textContent = 'Defina seu local';
        currentLocationLabel.classList.add('need-location');
      }
    } finally {
      currentLocationLabel?.classList.remove('locating');
    }
  }

  // Hook: quando abrir results view sem localização definida, tenta geolocalizar
  const originalOpenResultsView = openResultsView;
  openResultsView = function(term){
    originalOpenResultsView.call(this, term);
    // só tenta se ainda não definido e não restaurado
    if (!activeGeoCenter) attemptAutoGeolocation();
  };

  // ===== Seleção múltipla =====
  function updateSelectionBar(){
    const count = selectedProfessionals.size;
    if (selectionCountEl) selectionCountEl.textContent = String(count);
    if (count > 0){
      selectionBar?.classList.remove('hidden');
      selectionBar?.setAttribute('aria-hidden','false');
      selectionContinueBtn && (selectionContinueBtn.disabled = false);
    } else {
      selectionBar?.classList.add('hidden');
      selectionBar?.setAttribute('aria-hidden','true');
      selectionContinueBtn && (selectionContinueBtn.disabled = true);
      selectedCategory = null;
    }
  }

  function toggleProfessionalSelection(id, categoria){
    if (!id) return;
    if (!selectedProfessionals.has(id)){
      // Adicionando novo — validar categoria
      if (selectedCategory && selectedCategory !== categoria){
        alert('Você só pode selecionar profissionais da mesma categoria: ' + selectedCategory + '.');
        return;
      }
      selectedProfessionals.add(id);
      selectedCategory = selectedCategory || categoria;
    } else {
      selectedProfessionals.delete(id);
      if (selectedProfessionals.size === 0) selectedCategory = null;
    }
    // Atualiza UI
    document.querySelectorAll('.search-result-card').forEach(card => {
      const cid = card.getAttribute('data-prof-id');
      if (selectedProfessionals.has(cid)) {
        card.classList.add('selected');
        const ind = card.querySelector('.select-indicator'); if (ind) ind.textContent = '✓';
      } else {
        card.classList.remove('selected');
        const ind = card.querySelector('.select-indicator'); if (ind) ind.textContent = '+';
      }
    });
    updateSelectionBar();
  }

  selectionContinueBtn?.addEventListener('click', ()=>{
    if (!selectedProfessionals.size) return;
    alert('Continuar fluxo com: ' + Array.from(selectedProfessionals).join(', ') + ' (próxima tela futura).');
  });

  // ===== Mostrar / esconder barra de busca e tópico =====
  function showResultsTopic(term){
    if (!resultsTopicLine || !resultsTopicText) return;
    resultsTopicText.textContent = 'Resultados para: ' + term;
    resultsTopicLine.classList.remove('hidden');
    resultsTopicLine.setAttribute('aria-hidden','false');
    // esconde barra de busca
    const bar = document.querySelector('.results-search-bar');
    bar?.classList.add('hidden');
  }
  function hideResultsTopic(){
    resultsTopicLine?.classList.add('hidden');
    resultsTopicLine?.setAttribute('aria-hidden','true');
    const bar = document.querySelector('.results-search-bar');
    bar?.classList.remove('hidden');
  }
  changeSearchBtn?.addEventListener('click', (e)=>{ e.preventDefault(); hideResultsTopic(); resultsSearchInput?.focus(); });

  // Ao enviar formulário de results substitui pela linha de tópico
  resultsSearchForm?.addEventListener('submit', (e)=>{
    // (Já existe listener acima; reforçamos para mostrar tópico)
    setTimeout(()=>{ if (lastSearchQuery) showResultsTopic(lastSearchQuery); }, 10);
  });

  // Exemplo: se quiser abrir a Home direto para visualização agora, descomente:
  // showHome();

  // Show all available services handler (for the 'Ver Tudo' button)
  // Originalmente redirecionava para /services/all — trocamos para abrir o modal local.
  function showAllAvailableServices(e) {
    e && e.preventDefault();
    openAllServices();
  }

  /* =============================
     PROPOSTAS RECEBIDAS (mock)
     ============================= */
  // Mock simples de propostas; em um backend real viria via fetch.
  let proposals = [
    {
      id: 'P1', serviceId: 'S1', serviceTitle: 'Pintura de Quarto',
      serviceDescription: 'Pintar 1 quarto (12m²) em cor branca lavável, com preparação simples das paredes.',
      professionalId: 'U10', professionalName: 'João Lima', avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4.8, ratingCount: 52, basePrice: 350.00, currency: 'BRL', deliveryEstimateDays: 2, feePercent: 0.10, status: 'pending'
    },
    {
      id: 'P2', serviceId: 'S1', serviceTitle: 'Pintura de Quarto',
      serviceDescription: 'Incluso: cobertura de piso, 2 demãos de tinta acrílica e limpeza básica ao final.',
      professionalId: 'U11', professionalName: 'Carlos Mendes', avatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      rating: 4.6, ratingCount: 31, basePrice: 320.00, currency: 'BRL', deliveryEstimateDays: 3, feePercent: 0.10, status: 'pending'
    },
    {
      id: 'P3', serviceId: 'S2', serviceTitle: 'Montagem de Móveis',
      serviceDescription: 'Montar 1 guarda-roupa 6 portas e 1 cômoda pequena. Cliente já deixou peças organizadas.',
      professionalId: 'U12', professionalName: 'Marina Souza', avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
      rating: 4.9, ratingCount: 88, basePrice: 180.00, currency: 'BRL', deliveryEstimateDays: 1, feePercent: 0.12, status: 'pending'
    }
  ];

  // Popula filtro de serviços com base no conjunto de serviceId
  function populateServiceFilter() {
    if (!proposalServiceFilter) return;
    const unique = [...new Set(proposals.map(p => p.serviceId))];
    // Limpa exceto 'all'
    const current = proposalServiceFilter.value;
    proposalServiceFilter.innerHTML = '<option value="all">Todos os serviços</option>' + unique.map(id => `<option value="${id}">Serviço ${id}</option>`).join('');
    if ([...proposalServiceFilter.options].some(o => o.value === current)) proposalServiceFilter.value = current;
  }

  function formatPriceBRL(value) {
    try { return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }); } catch { return 'R$ ' + value.toFixed(2); }
  }

  function buildProposalCardHTML(p) {
    const fee = p.basePrice * p.feePercent;
    if (p.status === 'accepted') {
      return `
        <div class="proposal-main-click-area">
          <div class="proposal-left">
            <img class="proposal-avatar" src="${p.avatar}" alt="Foto de ${p.professionalName}">
            <div class="proposal-info">
              <div class="proposal-name">${p.professionalName}</div>
              <div class="proposal-service" title="${p.serviceTitle}">${p.serviceTitle}</div>
              <div class="proposal-rating"><span class="stars">★★★★★</span><span class="rating-val">${p.rating.toFixed(1)}</span><span class="rating-count">(${p.ratingCount})</span></div>
              <div class="proposal-extra"><span class="tag">Prazo: ${p.deliveryEstimateDays} dia${p.deliveryEstimateDays>1?'s':''}</span></div>
            </div>
          </div>
          <div class="proposal-price-block">
            <div class="proposal-price">${formatPriceBRL(p.basePrice)}</div>
            <div class="proposal-fee-hint">Taxa: ${formatPriceBRL(fee)}</div>
          </div>
        </div>
        <div class="proposal-service-description">${p.serviceDescription}</div>
        <div class="proposal-actions">
          <button class="btn-chat" type="button" data-action="go-chat">Ir para o chat</button>
        </div>`;
    }
    return `
        <div class="proposal-main-click-area">
          <div class="proposal-left">
            <img class="proposal-avatar" src="${p.avatar}" alt="Foto de ${p.professionalName}">
            <div class="proposal-info">
              <div class="proposal-name">${p.professionalName}</div>
              <div class="proposal-service" title="${p.serviceTitle}">${p.serviceTitle}</div>
              <div class="proposal-rating"><span class="stars">★★★★★</span><span class="rating-val">${p.rating.toFixed(1)}</span><span class="rating-count">(${p.ratingCount})</span></div>
              <div class="proposal-extra"><span class="tag">Prazo: ${p.deliveryEstimateDays} dia${p.deliveryEstimateDays>1?'s':''}</span></div>
            </div>
          </div>
          <div class="proposal-price-block">
            <div class="proposal-price">${formatPriceBRL(p.basePrice)}</div>
            <div class="proposal-fee-hint">Taxa: ${formatPriceBRL(fee)}</div>
          </div>
        </div>
        <div class="proposal-service-description">${p.serviceDescription}</div>
        <div class="proposal-actions">
          <button class="btn-accept" type="button" data-action="accept">Aceitar</button>
          <button class="btn-reject" type="button" data-action="reject">Recusar</button>
        </div>`;
  }

  function wireProposalCard(li, p) {
    li.querySelector('.proposal-main-click-area')?.addEventListener('click', () => {
      alert('Abrir perfil completo de ' + p.professionalName + ' (implementação futura).');
    });
    if (p.status === 'pending') {
      li.querySelector('[data-action="accept"]').addEventListener('click', (e) => {
        e.stopPropagation();
        acceptProposal(p.id);
      });
      li.querySelector('[data-action="reject"]').addEventListener('click', (e) => {
        e.stopPropagation();
        rejectProposal(p.id);
      });
    } else if (p.status === 'accepted') {
      li.querySelector('[data-action="go-chat"]').addEventListener('click', (e) => {
        e.stopPropagation();
        // garante que há chat e abre lista de chats
        ensureChatForProfessional(p.professionalId, p.professionalName, p.avatar);
        openChatsList();
        setActiveNav(chatTabBtn);
      });
    }
  }

  function renderAccepted() {
    if (!acceptedListEl || !acceptedEmptyEl || !acceptedSectionEl) return;
    const accepted = proposals.filter(p => p.status === 'accepted');
    if (!accepted.length) {
      acceptedSectionEl.classList.add('hidden');
      acceptedSectionEl.setAttribute('aria-hidden','true');
      acceptedEmptyEl.classList.remove('hidden');
      acceptedEmptyEl.setAttribute('aria-hidden','false');
      acceptedListEl.innerHTML = '';
      return;
    }
    acceptedSectionEl.classList.remove('hidden');
    acceptedSectionEl.setAttribute('aria-hidden','false');
    // Esconde texto vazio porque agora temos propostas aceitas
    acceptedEmptyEl.classList.add('hidden');
    acceptedEmptyEl.setAttribute('aria-hidden','true');
    acceptedListEl.innerHTML = '';
    accepted.forEach(p => {
      const li = document.createElement('li');
      li.className = 'proposal-card accepted';
      li.setAttribute('role','listitem');
      li.dataset.proposalId = p.id;
      li.dataset.serviceId = p.serviceId;
      li.innerHTML = buildProposalCardHTML(p);
      wireProposalCard(li, p);
      acceptedListEl.appendChild(li);
    });
  }

  function renderProposals(list) {
    if (!proposalsListEl || !proposalsEmptyEl) return;
    proposalsListEl.innerHTML = '';
    if (!list.length) {
      proposalsEmptyEl.classList.remove('hidden');
      proposalsEmptyEl.setAttribute('aria-hidden','false');
    } else {
      proposalsEmptyEl.classList.add('hidden');
      proposalsEmptyEl.setAttribute('aria-hidden','true');
      list.forEach(p => {
        const li = document.createElement('li');
        li.className = 'proposal-card';
        li.setAttribute('role','listitem');
        li.dataset.proposalId = p.id;
        li.dataset.serviceId = p.serviceId;
        li.innerHTML = buildProposalCardHTML(p);
        wireProposalCard(li, p);
        proposalsListEl.appendChild(li);
      });
    }
    // sempre render accepted depois
    renderAccepted();
  }

  function filterProposals() {
    const serviceFilter = proposalServiceFilter?.value || 'all';
    const visible = proposals.filter(p => p.status === 'pending' && (serviceFilter === 'all' || p.serviceId === serviceFilter));
    renderProposals(visible);
    updateProposalsBadge();
  }

  function renderProposalsView() {
    populateServiceFilter();
    filterProposals();
    updateProposalsBadge();
  }

  function updateProposalsBadge() {
    if (!proposalsBadge) return;
    const pendingCount = proposals.filter(p => p.status === 'pending').length;
    if (pendingCount === 0) {
      proposalsBadge.textContent = '0';
      proposalsBadge.classList.add('hidden');
      proposalsBadge.setAttribute('aria-hidden','true');
    } else {
      const previous = proposalsBadge.textContent;
      proposalsBadge.textContent = String(pendingCount);
      proposalsBadge.classList.remove('hidden');
      proposalsBadge.setAttribute('aria-hidden','false');
      if (previous !== String(pendingCount)) {
        proposalsBadge.classList.remove('bump');
        // reflow para reiniciar animação
        void proposalsBadge.offsetWidth;
        proposalsBadge.classList.add('bump');
      }
    }
  }

  function ensureChatForProfessional(professionalId, name, avatar) {
    // Checa se já existe um chat para esse profissional (simplificado)
    const existing = document.querySelector(`.chat-item[data-chat-id="prof-${professionalId}"]`);
    if (existing) return;
    const container = document.querySelector('.chats-container');
    if (!container) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chat-item';
    btn.dataset.chatId = 'prof-' + professionalId;
    btn.innerHTML = `
      <div class="chat-item-avatar">${avatar ? '' : '👷'}</div>
      <div class="chat-item-body">
        <div class="chat-item-top">
          <span class="chat-item-name">${name}</span>
          <span class="chat-item-time">agora</span>
        </div>
        <div class="chat-item-last">Chat liberado após aceite.</div>
      </div>`;
    container.prepend(btn);
    // Marca indicador de não lido assim que o chat é criado
    markChatUnread();
  }

  function acceptProposal(proposalId) {
    const p = proposals.find(x => x.id === proposalId);
    if (!p || p.status !== 'pending') return;
    // animação de saída do card original
    const originalLi = document.querySelector(`.proposal-card[data-proposal-id="${proposalId}"]`);
    if (originalLi) {
      originalLi.classList.add('anim-leave');
    }
    p.status = 'accepted';
    // Rejeita outras do mesmo serviço
    proposals.filter(x => x.serviceId === p.serviceId && x.id !== p.id && x.status === 'pending').forEach(x => x.status = 'rejected');
    // Gera taxa
    const fee = p.basePrice * p.feePercent;
    const total = p.basePrice + fee;
    console.log('Taxa serviço:', fee.toFixed(2), 'Total cliente:', total.toFixed(2));
    ensureChatForProfessional(p.professionalId, p.professionalName, p.avatar);
    alert('Proposta aceita! Chat liberado.');
    // Aguarda animação de saída antes de re-render
    setTimeout(() => {
      renderProposalsView(); // irá mover a proposta para seção de aceitas
      // adiciona animação de entrada ao último item aceito
      const lastAccepted = acceptedListEl?.querySelector('.proposal-card.accepted:last-child');
      if (lastAccepted) lastAccepted.classList.add('anim-enter');
      updateProposalsBadge();
    }, 260);
  }

  function rejectProposal(proposalId) {
    const p = proposals.find(x => x.id === proposalId);
    if (!p || p.status !== 'pending') return;
    p.status = 'rejected';
    renderProposalsView();
    updateProposalsBadge();
  }

  proposalServiceFilter?.addEventListener('change', filterProposals);

  /* =====================
     CHAT — lista e conversa
     ===================== */
  const chatTabBtn = document.getElementById('chat-tab-btn');
  const homeTabBtn = document.getElementById('home-tab-btn');
  const chatsList = document.getElementById('chats-list');
  const closeChatsBtn = document.getElementById('close-chats');
  const conversationView = document.getElementById('conversation-view');
  const chatUnreadDot = document.getElementById('chat-unread-dot');
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
    // Ao abrir a lista de chats consideramos notificações visualizadas
    clearChatUnread();
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
    clearChatUnread();
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
    if (received && !isChatInterfaceOpen()) markChatUnread();
}

  function isChatInterfaceOpen() {
    return (chatsList && !chatsList.classList.contains('hidden')) || (conversationView && !conversationView.classList.contains('hidden'));
  }

  function markChatUnread() {
    if (!chatUnreadDot) return;
    chatUnreadDot.classList.remove('hidden');
    chatUnreadDot.setAttribute('aria-hidden','false');
  }

  function clearChatUnread() {
    if (!chatUnreadDot) return;
    chatUnreadDot.classList.add('hidden');
    chatUnreadDot.setAttribute('aria-hidden','true');
  }

  // Wire bottom nav chat button
  if (chatTabBtn) chatTabBtn.addEventListener('click', (e) => { e.preventDefault(); openChatsList(); });
  // Wire bottom nav home button
  if (homeTabBtn) homeTabBtn.addEventListener('click', (e) => { e.preventDefault(); showHome(); setActiveNav(homeTabBtn);
    // hide any chat overlays when returning home
    setHidden(chatsList, true);
    setHidden(conversationView, true);
    // Além do chat, garanta que a tela Em Andamento e Results sejam ocultas
    setHidden(progressView, true);
    setHidden(resultsView, true);
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

  // Mostra badge de propostas logo na inicialização (caso já existam pendentes)
  try { updateProposalsBadge(); } catch(_) {}

  /* =====================
     BOTÃO DEV: simular mensagem recebida
     ===================== */
  const simulateBtn = document.getElementById('simulate-message-btn');
  simulateBtn?.addEventListener('click', () => {
    // Simula chegada de mensagem recebida (não lida se chat fechado)
    addConversationMessage('Mensagem simulada às ' + new Date().toLocaleTimeString(), true);
    transientMsg('Mensagem simulada');
  });

  /* =============================
     EM ANDAMENTO — dados e UI
     ============================= */
  // Mock de projetos em andamento para demonstração do layout.
  // Campos: id, servico, profissional, valorTotal, status, dataEntregaISO
  let activeProjects = [
    { id: 'A1', servico: 'Pintura de Quarto', profissional: 'João Lima', valorTotal: 385.00, status: 'Em Andamento', dataEntregaISO: addDaysISO(new Date(), 2) },
    { id: 'A2', servico: 'Montagem de Móveis', profissional: 'Marina Souza', valorTotal: 201.60, status: 'Pendente', dataEntregaISO: addDaysISO(new Date(), -1) },
  ];

  // Util: somar dias e retornar ISO simples (yyyy-mm-dd)
  function addDaysISO(date, days){ const d = new Date(date); d.setDate(d.getDate()+days); return d.toISOString().slice(0,10); }
  function formatBRDate(iso){ try { const [y,m,da] = iso.split('-'); return `${da}/${m}/${y}`; } catch { return iso; } }
  function formatBRL(n){ try { return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'}); } catch { return 'R$ '+Number(n).toFixed(2); } }

  // Calcula dias restantes (inteiros) entre hoje e data alvo
  function daysLeft(targetISO){
    const today = new Date(); today.setHours(0,0,0,0);
    const target = new Date(targetISO+'T00:00:00');
    const diffMs = target - today;
    return Math.ceil(diffMs / (1000*60*60*24));
  }

  function statusClass(status, dLeft){
    // Regras: Concluído -> ok; Em Andamento -> ok; Pendente -> pending; Atrasado -> late
    if (status.toLowerCase() === 'concluído') return 'status-ok';
    if (dLeft < 0) return 'status-late';
    if (status.toLowerCase() === 'pendente') return 'status-pending';
    return 'status-ok';
  }

  function buildProgressCardHTML(p){
    const dLeft = daysLeft(p.dataEntregaISO);
    const stClass = statusClass(p.status, dLeft);
    const cardClass = stClass.replace('status-',''); // ok|pending|late
    const isDone = p.status && p.status.toLowerCase() === 'concluído';
    const deadlineTxt = `Entrega estimada: ${formatBRDate(p.dataEntregaISO)}`;
    const cdTxt = dLeft < 0 ? `Atrasado em ${Math.abs(dLeft)} dia${Math.abs(dLeft)===1?'':'s'}` : `${dLeft} dia${dLeft===1?'':'s'} restantes`;
    const cdClass = dLeft < 0 ? 'countdown late' : 'countdown';
    const statusLabel = isDone ? 'Concluído' : (dLeft < 0 ? 'Atrasado' : p.status);
    return `
      <article class="progress-card ${stClass} status-${cardClass}" data-project-id="${p.id}">
        <div class="progress-col">
          <h3 class="progress-title-sm">${p.servico}</h3>
          <p class="progress-provider">${p.profissional}</p>
          <button type="button" class="progress-chat-btn" data-action="chat" aria-label="Falar com ${p.profissional}">
            <span class="icon">💬</span> Falar com ${p.profissional}
          </button>
        </div>
        <div class="progress-col">
          <span class="status-badge ${stClass}">${statusLabel}</span>
          ${isDone ? '' : `<p class=\"progress-deadline\">${deadlineTxt}</p>`}
          ${isDone ? '' : `<div class=\"${cdClass}\">${cdTxt}</div>`}
        </div>
        <div class="progress-col">
          <div class="progress-price">${formatBRL(p.valorTotal)}</div>
          <div class="progress-actions">
            <button type="button" class="btn-primary-ghost" data-action="ver-proposta">Ver Proposta Completa</button>
            ${statusLabel.toLowerCase() !== 'concluído' ? '<button type="button" class="btn-secondary" data-action="marcar-concluido">Marcar como Concluído</button>' : ''}
          </div>
        </div>
      </article>`;
  }

  function renderProgressLists(){
    if (progressList) {
      const actives = activeProjects.filter(p => p.status.toLowerCase() !== 'concluído');
      progressList.innerHTML = actives.map(buildProgressCardHTML).join('');
    }
    if (progressCompletedList) {
      const dones = activeProjects.filter(p => p.status.toLowerCase() === 'concluído');
      progressCompletedList.innerHTML = dones.map(buildProgressCardHTML).join('');
    }
    if (progressSubtitle){
      const count = activeProjects.filter(p => p.status.toLowerCase() !== 'concluído').length;
      progressSubtitle.textContent = `${count} projeto${count===1?'':'s'} ativos`;
    }
  }

  function openProgressView(){
    // Esconde outras telas principais
    setHidden(authSection, true);
    setHidden(homeView, true);
    setHidden(resultsView, true);
    setHidden(chatsList, true);
    setHidden(conversationView, true);
    setHidden(profileView, true);
    // Mostra progress
    setHidden(progressView, false);
    setHidden(bottomNav, false);
    if (headerTitle) { setHidden(headerLogo, true); setHidden(headerTitle, false); headerTitle.textContent = 'Em Andamento'; }
    renderProgressLists();
  }

  progressTabBtn?.addEventListener('click', (e)=>{ e.preventDefault(); openProgressView(); setActiveNav(progressTabBtn); });

  // Delegação de ações dos cards
  progressList?.addEventListener('click', (e)=>{
    const btn = e.target.closest('button'); if (!btn) return;
    const card = btn.closest('.progress-card'); if (!card) return;
    const id = card.getAttribute('data-project-id');
    const action = btn.getAttribute('data-action');
    const proj = activeProjects.find(p=>p.id===id);
    if (!proj) return;
    if (action === 'chat') {
      // Abre chat com o profissional
      ensureChatForProfessional('prof-'+proj.id, proj.profissional, '');
      openChatsList();
      setActiveNav(chatTabBtn);
    } else if (action === 'ver-proposta') {
      alert('Abrir proposta completa do serviço: ' + proj.servico + ' (futuro).');
    } else if (action === 'marcar-concluido') {
      // Animação de saída no card atual
      card.classList.add('anim-leave');
      // Após a animação, muda o status e re-renderiza com animação de entrada no concluído
      setTimeout(() => {
        proj.status = 'Concluído';
        renderProgressLists();
        // adiciona animação de entrada no último item da lista de concluídos
        const lastDone = progressCompletedList?.querySelector('.progress-card:last-child');
        if (lastDone) lastDone.classList.add('anim-enter');
      }, 260);
    }
  });
}

// Garante que a inicialização aconteça após o DOM estar pronto (compatível com CodePen)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthScreen);
} else {
  initAuthScreen();
}

