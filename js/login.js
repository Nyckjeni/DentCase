document.addEventListener('DOMContentLoaded', function () {
    const toggleSenha = document.getElementById('toggleSenha');
    const inputSenha = document.getElementById('senha');
  
    toggleSenha.addEventListener('click', function () {
      const senhaVisivel = inputSenha.type === 'text';
  
      inputSenha.type = senhaVisivel ? 'password' : 'text';
      toggleSenha.classList.toggle('fa-eye');
      toggleSenha.classList.toggle('fa-eye-slash');
    });

    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/service-worker.js')
          .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
          .catch(err => console.error('❌ Erro no Service Worker:', err));
      });
    }
  
    // Exemplo básico de validação (opcional)
    const form = document.getElementById('loginForm');
    const mensagemErro = document.getElementById('mensagemErro');
  
    form.addEventListener('submit', function (e) {
      e.preventDefault();
  
      const cargo = document.getElementById('cargo').value;
      const matricula = document.getElementById('matricula').value;
      const senha = inputSenha.value;
  
      if (!cargo || !matricula || !senha) {
        mensagemErro.textContent = 'Preencha todos os campos obrigatórios.';
        mensagemErro.style.display = 'block';
      } else {
        mensagemErro.style.display = 'none';
        // Aqui você pode redirecionar ou enviar dados para seu back-end
        console.log({ cargo, matricula, senha });
      }
    });
  });
  