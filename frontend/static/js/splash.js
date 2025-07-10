// splash.js

// Reseta barra e botões sempre que a splash aparece (inclusive seta voltar)
function resetSplashPage() {
  const progressBar = document.getElementById("progress-bar");
  const checklistBtn = document.getElementById("btn-checklist");
  const analiseBtn = document.getElementById("btn-iniciar");

  if (progressBar) progressBar.style.width = "0%";

  [checklistBtn, analiseBtn].forEach(btn => {
    if (btn) {
      btn.disabled = false;
      btn.classList.remove("btn-desativado");
    }
  });
}

window.addEventListener("pageshow", resetSplashPage);

document.addEventListener("DOMContentLoaded", () => {
  const progressBar = document.getElementById("progress-bar");
  const checklistBtn = document.getElementById("btn-checklist");
  const analiseBtn = document.getElementById("btn-iniciar");

  resetSplashPage();

  function acionarBarraEIr(rota) {
    if (!progressBar) return;

    [checklistBtn, analiseBtn].forEach(btn => {
      if (btn) {
        btn.disabled = true;
        btn.classList.add("btn-desativado");
      }
    });

    let width = 0;
    const duration = 3000;
    const stepTime = 20;
    const increment = 100 / (duration / stepTime);

    progressBar.style.width = "0%";

    const interval = setInterval(() => {
      width += increment;
      if (width >= 100) {
        clearInterval(interval);
        progressBar.style.width = "100%";
        setTimeout(() => {
          window.location.href = rota;
        }, 350);
      } else {
        progressBar.style.width = `${width}%`;
      }
    }, stepTime);
  }

  // Checklist
  if (checklistBtn) {
    checklistBtn.addEventListener("click", () => acionarBarraEIr("/start"));
  }
  // Iniciar Análise
  if (analiseBtn) {
    analiseBtn.addEventListener("click", () => acionarBarraEIr("/start-home"));
  }
});