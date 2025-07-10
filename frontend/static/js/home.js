// home.js

// ---------- UPLOAD DE LOGOS (organização e setor) ----------
document.addEventListener('DOMContentLoaded', function () {

  // Upload da logo da organização
  const inputLogoOrg = document.getElementById('input-logo-org');
  if (inputLogoOrg) {
    inputLogoOrg.addEventListener('change', function () {
      uploadLogo('logo_org', inputLogoOrg);
    });
  }

  // Upload da logo do setor
  const inputLogoSetor = document.getElementById('input-logo-setor');
  if (inputLogoSetor) {
    inputLogoSetor.addEventListener('change', function () {
      uploadLogo('logo_setor', inputLogoSetor);
    });
  }

  // Upload de arquivos de dados (.csv e .xlsx)
  const inputDatafiles = document.getElementById('input-datafiles');
  if (inputDatafiles) {
    inputDatafiles.addEventListener('change', function () {
      uploadFiles(inputDatafiles);
    });
  }

  // ---------- REMOVER ARQUIVOS IMPORTADOS ----------
  // Botões dinâmicos (data-arquivo)
  document.querySelectorAll('.btn-remover').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const nomeArquivo = btn.getAttribute('data-arquivo');
      removerArquivo(nomeArquivo);
      e.preventDefault();
      return false;
    });
  });

  // ---------- ALERTA DE ESTRUTURA (Modal de aviso de estrutura diferente) ----------
  const btnReloadAlerta = document.getElementById('btnReloadAlerta');
  if (btnReloadAlerta) {
    btnReloadAlerta.addEventListener('click', function () {
      window.location.reload();
    });
  }

  // ---------- SIDEBAR: Expandir/Recolher ----------
  const toggleSidebar = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('sidebar');
  const mainContent = document.getElementById('mainContent');
  if (toggleSidebar && sidebar && mainContent) {
    toggleSidebar.addEventListener('click', function () {
      sidebar.classList.toggle('fechado');
      mainContent.classList.toggle('shrink');
    });
  }

  // ---------- EXPORTAR BASE TRATADA (.csv) ----------
  const btnExportar = document.getElementById('exportarTratada');
  if (btnExportar) {
    btnExportar.addEventListener('click', function () {
      // Aqui você pode adicionar lógica para download do CSV.
      // Se já existir a rota /export-tratada, pode usar window.location.href
      window.location.href = '/export-tratada'; // ajuste a rota conforme o backend
    });
  }

  // ---------- FINALIZAR TRATAMENTO (com modal de confirmação) ----------
  const btnFinalizar = document.getElementById('finalizarTratamento');
  const modalAlerta = document.getElementById('modalAlerta');
  const btnConfirmaFinalizar = document.getElementById('btnConfirmaFinalizar');
  const btnCancelaFinalizar = document.getElementById('btnCancelaFinalizar');

  if (btnFinalizar && modalAlerta) {
    btnFinalizar.addEventListener('click', function () {
      modalAlerta.style.display = 'flex';
    });
  }

  if (btnCancelaFinalizar && modalAlerta) {
    btnCancelaFinalizar.addEventListener('click', function () {
      modalAlerta.style.display = 'none';
    });
  }

  if (btnConfirmaFinalizar) {
    btnConfirmaFinalizar.addEventListener('click', function () {
      // Chama a rota para finalizar tratamento e apagar arquivos
      window.location.href = '/finalizar-tratamento'; // ajuste para a rota correta
    });
  }

  // ---------- DATATABLES (aplica se houver tabelas .display) ----------
  if (typeof $ !== "undefined" && $('.display').length > 0) {
    $('.display').DataTable({
      // Pode customizar as opções do DataTable aqui
      language: {
        url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/pt-BR.json'
      }
    });
  }
});


// =====================
// Funções utilitárias
// =====================

// Simula upload de logo (front-end: envia o form)
function uploadLogo(tipo, inputElement) {
  // Envia o form automaticamente após seleção de logo
  if (inputElement && inputElement.files && inputElement.files.length > 0) {
    document.getElementById('formularioUpload').submit();
  }
}

// Simula upload dos arquivos de dados (front-end: envia o form)
function uploadFiles(inputElement) {
  if (inputElement && inputElement.files && inputElement.files.length > 0) {
    document.getElementById('formularioUpload').submit();
  }
}

// Remove arquivo (chama rota GET/POST no backend)
function removerArquivo(nomeArquivo) {
  // Pode fazer uma requisição via fetch/ajax para remover arquivo no backend
  // Aqui um redirect simples para rota backend que faz a exclusão
  if (nomeArquivo) {
    window.location.href = `/remover-arquivo/${encodeURIComponent(nomeArquivo)}`;
  }
}