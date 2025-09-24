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

(function initAuthScreen() {
  // Pegamos os elementos da página que vamos manipular.
  const yearEl = document.getElementById('year');
  const titleEl = document.querySelector('[data-mode-text]');
  const googleBtn = document.getElementById('google-button');
  const formEl = document.getElementById('auth-form');
  const countryCodeInput = document.getElementById('country-code');
  const phoneInput = document.getElementById('phone');
  const helpEl = document.getElementById('phone-help');
  const continueBtn = document.getElementById('continue');
  const toLoginBtn = document.getElementById('to-login');
  const toSignupBtn = document.getElementById('to-signup');

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
    } else {
      titleEl.textContent = 'Crie sua conta';
      continueBtn.textContent = 'Continuar';
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
  if (toLoginBtn) toLoginBtn.addEventListener('click', switchToLogin);
  if (toSignupBtn) toSignupBtn.addEventListener('click', switchToSignup);

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

  // Inicializa a UI com o modo padrão.
  renderByMode();
})();

