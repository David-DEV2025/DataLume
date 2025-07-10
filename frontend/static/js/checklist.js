// checklist.js
// Lógica da barra de progresso e botão "Iniciar Análise" na página checklist

// Função para resetar a barra e o botão sempre que a página checklist aparecer (incluindo seta voltar)
function resetChecklistPage() {
  const progressBar = document.getElementById("progress-bar-checklist");
  const btn = document.getElementById("btn-iniciar");
  if (progressBar) progressBar.style.width = "0%";
  if (btn) {
    btn.disabled = false;
    btn.classList.remove("btn-desativado");
  }
}

// Garante reset ao voltar com o navegador (evento 'pageshow')
window.addEventListener("pageshow", resetChecklistPage);

// Lógica principal ao carregar o DOM
document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById("progress-bar-checklist");
  const btn = document.getElementById("btn-iniciar");

  // Garante reset inicial
  resetChecklistPage();

  // Se o botão e barra existem, ativa animação e redirecionamento
  if (btn && progressBar) {
    btn.addEventListener("click", () => {
      btn.disabled = true;
      btn.classList.add("btn-desativado");
      let width = 0;
      const duration = 3000; // duração total da barra em ms (3s)
      const stepTime = 20;   // intervalo de atualização (ms)
      const increment = 100 / (duration / stepTime);
      progressBar.style.width = "0%";

      const interval = setInterval(() => {
        width += increment;
        if (width >= 100) {
          clearInterval(interval);
          progressBar.style.width = "100%";
          setTimeout(() => {
            window.location.href = "/start-home";
          }, 350); // leve atraso para mostrar barra cheia antes do redirect
        } else {
          progressBar.style.width = `${width}%`;
        }
      }, stepTime);
    });
  }
});