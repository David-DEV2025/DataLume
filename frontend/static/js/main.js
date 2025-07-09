// frontend/static/js/main.js

// ---- UPLOAD LOGO via AJAX (sem refresh total) ----
function uploadLogo(tipo, input) {
  var form = document.getElementById("formularioUpload");
  var data = new FormData(form);
  for (const el of form.elements) {
    if (el.name && el.name !== tipo) el.disabled = true;
  }
  fetch(location.pathname, {method: "POST", body: data})
    .then(() => location.reload());
}

// ---- UPLOAD DE ARQUIVOS via AJAX ----
function uploadFiles(input) {
  var form = document.getElementById("formularioUpload");
  var data = new FormData(form);
  fetch(location.pathname, {method: "POST", body: data})
    .then(() => location.reload());
}

// ---- REMOVER ARQUIVO ----
function removerArquivo(nome) {
  fetch(`/remover-arquivo?nome=${nome}`, { method: 'DELETE' })
    .then(() => location.reload());
}

// ---- SIDEBAR PUSH/ABA FIXA ----
document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.getElementById("sidebar");
  const mainContent = document.getElementById("mainContent");
  const toggleBtn = document.getElementById("toggleSidebar");
  if (toggleBtn && sidebar && mainContent) {
    toggleBtn.addEventListener("click", () => {
      sidebar.classList.toggle("fechado");
      mainContent.classList.toggle("shrink");
    });
  }

  // ---- EXPORTAÇÃO DA BASE TRATADA ----
  const btnExportar = document.getElementById("exportarTratada");
  if (btnExportar) {
    btnExportar.addEventListener("click", function(e) {
      e.preventDefault();
      window.location.href = "/exportar-tratada";
    });
  }

  // ---- FINALIZAR TRATAMENTO (com verificação de exportação) ----
  const btnFinalizar = document.getElementById("finalizarTratamento");
  const modal = document.getElementById("modalAlerta");
  const btnConfirma = document.getElementById("btnConfirmaFinalizar");
  const btnCancela = document.getElementById("btnCancelaFinalizar");
  if (btnFinalizar) {
    btnFinalizar.addEventListener("click", function(e) {
      e.preventDefault();
      // Verifica se o arquivo DataBase_tratada.csv existe
      fetch("/export/DataBase_tratada.csv", { method: "HEAD" })
        .then(resp => {
          if (resp.ok) {
            // Já exportou, pode finalizar sem alerta
            finalizarTratamento();
          } else {
            // Ainda não exportou
            modal.style.display = "flex";
          }
        });
    });
  }
  if (btnConfirma) {
    btnConfirma.addEventListener("click", () => {
      finalizarTratamento();
      modal.style.display = "none";
    });
  }
  if (btnCancela) {
    btnCancela.addEventListener("click", () => {
      modal.style.display = "none";
    });
  }

  function finalizarTratamento() {
    fetch("/finalizar-tratamento", { method: "POST" })
      .then(() => window.location.reload());
  }

  // ---- DATATABLES ----
  const tables = document.querySelectorAll(".table-wrapper table");
  tables.forEach(table => {
    $(table).DataTable({
      scrollX: true,
      scrollY: "300px",
      paging: false,
      info: false,
      language: {
        search: "Filtrar:",
        zeroRecords: "Nenhum resultado encontrado"
      }
    });
  });
});