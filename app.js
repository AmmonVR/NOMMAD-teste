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
  const tabServicesBtn = document.getElementById('tab-services-btn');
  const tabRequestsBtn = document.getElementById('tab-requests-btn');
  const tabServices = document.getElementById('tab-services');
  const tabRequests = document.getElementById('tab-requests');
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  const searchHistory = document.getElementById('search-history');

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
    } else {
      titleEl.textContent = 'Crie sua conta';
      continueBtn.textContent = 'Continuar';
      if (googleBtnText) googleBtnText.textContent = 'Continuar com o Google';
      setHidden(authSection, false);
      setHidden(loginView, true);
      setHidden(signupView, false);
      setHidden(homeView, true);
      setHidden(bottomNav, true);
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
  if (toSignupBtn) toSignupBtn.addEventListener('click', switchToSignup);
  if (backToLoginBtn) backToLoginBtn.addEventListener('click', switchToLogin);

  // Utilitário: esconde/mostra uma seção e atualiza aria-hidden
  function setHidden(element, hidden) {
    if (!element) return;
    if (hidden) {
      element.classList.add('hidden');
      element.setAttribute('aria-hidden', 'true');
    } else {
      element.classList.remove('hidden');
      element.setAttribute('aria-hidden', 'false');
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

  countryCodeInput?.addEventListener('input', () => {
    countryCodeInput.value = sanitizeCountryCode(countryCodeInput.value);
    clearErrors();
  });

  phoneInput?.addEventListener('input', () => {
    phoneInput.value = sanitizePhone(phoneInput.value);
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
    signupPhone.value = sanitizePhone(signupPhone.value);
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
    // foca na busca para UX rápida
    setTimeout(() => searchInput?.focus(), 0);
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
}

// Garante que a inicialização aconteça após o DOM estar pronto (compatível com CodePen)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAuthScreen);
} else {
  initAuthScreen();
}

