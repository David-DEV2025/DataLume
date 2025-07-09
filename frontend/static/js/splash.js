// splash.js
// Função para resetar barra e botão (ao retornar para splash)
function resetSplashPage() {
  const progressBar = document.getElementById("progress-bar");
  const startBtn = document.getElementById("start-btn");
  if (progressBar) {
    progressBar.style.width = "0%";
  }
  if (startBtn) {
    startBtn.disabled = false;
    startBtn.classList.remove("btn-desativado");
  }
}

// Garante reset ao voltar (back/seta do navegador)
window.addEventListener("pageshow", resetSplashPage);

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("start-btn");
  const progressBar = document.getElementById("progress-bar");

  // Reseta ao carregar
  resetSplashPage();

  if (startBtn && progressBar) {
    startBtn.addEventListener("click", () => {
      startBtn.disabled = true;
      startBtn.classList.add("btn-desativado");
      let width = 0;
      const duration = 3000;   // duração total (ms)
      const stepTime = 20;
      const increment = 100 / (duration / stepTime);

      progressBar.style.width = "0%"; // força começar do zero

      const interval = setInterval(() => {
        width += increment;
        if (width >= 100) {
          clearInterval(interval);
          progressBar.style.width = "100%";
          setTimeout(() => {
            window.location.href = "/start";
          }, 300);
        } else {
          progressBar.style.width = `${width}%`;
        }
      }, stepTime);
    });
  }
});