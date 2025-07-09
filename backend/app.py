# backend/app.py

import os
import platform
import sys
import importlib.util
import pandas as pd
from flask import Flask, render_template, request, send_from_directory
from werkzeug.utils import secure_filename

# ----------------------------------------------------------
# Caminhos ABSOLUTOS do projeto, a partir deste arquivo
# ----------------------------------------------------------
BASE_DIR = os.path.abspath(os.path.dirname(__file__))

# Caminho absoluto dos templates
TEMPLATES_DIR = os.path.abspath(os.path.join(BASE_DIR, "../frontend/templates"))
# Caminho absoluto dos arquivos estáticos (CSS, JS, IMG)
STATIC_DIR = os.path.abspath(os.path.join(BASE_DIR, "../frontend/static"))
# Caminho absoluto da pasta export (arquivos enviados e gerados)
EXPORT_DIR = os.path.abspath(os.path.join(BASE_DIR, "../export"))

# Garante que a pasta export existe
os.makedirs(EXPORT_DIR, exist_ok=True)

# ----------------------------------------------------------
# Configuração da aplicação Flask
# ----------------------------------------------------------
app = Flask(
    __name__,
    template_folder=TEMPLATES_DIR,
    static_folder=STATIC_DIR
)

app.config["UPLOAD_FOLDER"] = EXPORT_DIR

# ----------------------------------------------------------
# Extensões permitidas
# ----------------------------------------------------------
ALLOWED_EXTENSIONS = {'csv', 'xlsx'}
ALLOWED_IMAGES = {'png', 'jpg', 'jpeg'}

# ----------------------------------------------------------
# Funções auxiliares
# ----------------------------------------------------------
def allowed_file(filename, extensions):
    """Verifica se o arquivo tem uma extensão permitida."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in extensions

def biblioteca_disponivel(nome):
    """Checa se uma biblioteca está instalada no ambiente Python."""
    return importlib.util.find_spec(nome) is not None

def verificar_excel():
    """Verifica se o Microsoft Excel está instalado (Windows only)."""
    if platform.system() != "Windows":
        return "Indisponível para este sistema"
    try:
        import winreg
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE,
                            r"SOFTWARE\Microsoft\Windows\CurrentVersion\App Paths\excel.exe"):
            return "Instalado"
    except FileNotFoundError:
        return "Não encontrado"
    except PermissionError:
        return "Permissão negada"
    except Exception as e:
        return f"Erro: {str(e)}"

def verificar_power_bi():
    """
    Procura por instalações do Power BI nos caminhos mais comuns.
    Inclui opções no Program Files, AppData, WindowsApps e até caminhos customizados.
    """
    caminhos = [
        r"C:\Program Files\Microsoft Power BI Desktop\bin\PBIDesktop.exe",
        r"C:\Program Files (x86)\Microsoft Power BI Desktop\bin\PBIDesktop.exe",
        r"C:\Users\{}\AppData\Local\Microsoft\Power BI Desktop\bin\PBIDesktop.exe".format(os.getlogin()),
        r"C:\Program Files\WindowsApps\Microsoft.MicrosoftPowerBIDesktop_*\PBIDesktop.exe",
        r"C:\Program Files\Microsoft Power BI Desktop RS\bin\PBIDesktop.exe",
        r"D:\Power BI\PBIDesktop.exe",
        r"C:\Power BI Portable\PBIDesktop.exe"
    ]
    for path in caminhos:
        if "*" in path:
            # Procura pastas do padrão WindowsApps (instalação via Store)
            base = os.path.dirname(path)
            if os.path.exists(os.path.dirname(base)):
                for d in os.listdir(os.path.dirname(base)):
                    if d.startswith("Microsoft.MicrosoftPowerBIDesktop_"):
                        full = os.path.join(os.path.dirname(base), d, "PBIDesktop.exe")
                        if os.path.exists(full):
                            return "Instalado"
        elif os.path.exists(path):
            return "Instalado"
    return "Não localizado"

# ----------------------------------------------------------
# Rotas principais do sistema
# ----------------------------------------------------------

@app.route("/")
def splash():
    """Splash page inicial"""
    return render_template("splash.html")

@app.route("/start")
def checklist():
    """Checklist de ambiente do DataLume"""
    sistema = platform.system()
    arquitetura = platform.architecture()[0]
    permissao = os.access(".", os.W_OK)
    versao_python = sys.version.split()[0]
    return render_template(
        "checklist.html",
        sistema=sistema,
        arquitetura=arquitetura,
        permissao=permissao,
        python_version=versao_python,
        flask=biblioteca_disponivel("flask"),
        pandas=biblioteca_disponivel("pandas"),
        openpyxl=biblioteca_disponivel("openpyxl"),
        xlrd=biblioteca_disponivel("xlrd"),
        excel=verificar_excel(),
        power_bi=verificar_power_bi()
    )

@app.route("/start-home", methods=["GET", "POST"])
def start_home():
    """
    Página principal de importação, visualização e tratamento de dados.
    Carrega logos (qualquer nome e extensão válida) e arquivos (.csv/.xlsx)
    """

    data_previews = []
    arquivos_lista = []
    logo_org = None
    logo_setor = None
    alerta_estrutura = None

    # Busca arquivos já existentes na pasta export (para persistência visual)
    arquivos_export = [f for f in os.listdir(EXPORT_DIR) if os.path.isfile(os.path.join(EXPORT_DIR, f))]
    arquivos_data = [f for f in arquivos_export if allowed_file(f, ALLOWED_EXTENSIONS)]
    arquivos_imgs = [f for f in arquivos_export if allowed_file(f, ALLOWED_IMAGES)]

    # Detecta logos já presentes
    for img in arquivos_imgs:
        if not logo_org:
            logo_org = img
        elif not logo_setor:
            logo_setor = img

    # Lógica de POST (upload dos arquivos)
    if request.method == "POST":
        # Processa logos sem impor nomes padrão
        logo1 = request.files.get("logo_org")
        if logo1 and allowed_file(logo1.filename, ALLOWED_IMAGES):
            logo_org = secure_filename(logo1.filename)
            logo1.save(os.path.join(EXPORT_DIR, logo_org))
        logo2 = request.files.get("logo_setor")
        if logo2 and allowed_file(logo2.filename, ALLOWED_IMAGES):
            logo_setor = secure_filename(logo2.filename)
            logo2.save(os.path.join(EXPORT_DIR, logo_setor))

        # Upload dos arquivos de dados (pode ser múltiplos)
        files = request.files.getlist("datafiles")
        for file in files:
            if file and allowed_file(file.filename, ALLOWED_EXTENSIONS):
                filename = secure_filename(file.filename)
                filepath = os.path.join(EXPORT_DIR, filename)
                file.save(filepath)

        # Recalcula arquivos exportados após upload
        arquivos_export = [f for f in os.listdir(EXPORT_DIR) if os.path.isfile(os.path.join(EXPORT_DIR, f))]
        arquivos_data = [f for f in arquivos_export if allowed_file(f, ALLOWED_EXTENSIONS)]
        arquivos_imgs = [f for f in arquivos_export if allowed_file(f, ALLOWED_IMAGES)]

        # Detecta novas logos após upload
        logo_org = next((img for img in arquivos_imgs), logo_org)
        logo_setor = next((img for img in arquivos_imgs if img != logo_org), logo_setor)

    # Sempre monta lista de arquivos carregados (exibe nomes, extensões e tamanhos)
    for fname in arquivos_data:
        path = os.path.join(EXPORT_DIR, fname)
        tamanho_kb = round(os.path.getsize(path)/1024, 1)
        arquivos_lista.append({"filename": fname, "tamanho_kb": tamanho_kb})

    # --- Unifica arquivos de dados apenas se todos são do mesmo tipo e estrutura ---
    if arquivos_data:
        # Carrega todos os DataFrames em lista
        dfs = []
        tipos = set()
        colunas = None
        erro_estrutura = False

        for idx, fname in enumerate(arquivos_data):
            path = os.path.join(EXPORT_DIR, fname)
            ext = fname.rsplit(".", 1)[1].lower()
            tipos.add(ext)
            try:
                if ext == "xlsx":
                    df = pd.read_excel(path)
                else:
                    df = pd.read_csv(path)
                # Salva a estrutura de colunas do primeiro arquivo
                if idx == 0:
                    colunas = list(df.columns)
                # Compara estrutura dos demais arquivos
                elif list(df.columns) != colunas or ext != list(tipos)[0]:
                    erro_estrutura = True
                    break
                dfs.append(df)
            except Exception as e:
                erro_estrutura = True
                break

        if erro_estrutura or len(tipos) > 1:
            alerta_estrutura = (
                "A importação foi bloqueada: todos os arquivos devem ter **a mesma extensão** "
                "e exatamente **a mesma estrutura de colunas**. Remova arquivos incompatíveis e tente novamente."
            )
            data_previews = []
        else:
            # Concatena todos os DataFrames para preview única
            df_unificado = pd.concat(dfs, ignore_index=True)
            preview_html = df_unificado.to_html(classes="tabela-preview", index=False)
            data_previews = [{
                "preview": preview_html
            }]

    return render_template(
        "home.html",
        previews=data_previews,
        arquivos_lista=arquivos_lista,
        logo_org=logo_org,
        logo_setor=logo_setor,
        alerta_estrutura=alerta_estrutura
    )

@app.route("/export/<path:filename>")
def serve_export(filename):
    """Serve arquivos da pasta export (imagens, dados etc)."""
    return send_from_directory(EXPORT_DIR, filename)

@app.route("/remover-arquivo", methods=["DELETE"])
def remover_arquivo():
    """Remove arquivos específicos da pasta export via botão na interface."""
    nome = request.args.get("nome")
    caminho = os.path.join(EXPORT_DIR, nome)
    if os.path.exists(caminho):
        os.remove(caminho)
    return ("", 204)

if __name__ == "__main__":
    app.run(debug=True)