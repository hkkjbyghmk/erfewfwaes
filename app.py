from flask import Flask, jsonify, send_from_directory
import os

app = Flask(__name__)

BASE_DIR = r'C:/EuroShark'  # Novo diretório base

# Caminho completo para o arquivo config.txt no novo diretório base
CONFIG_FILE_PATH = os.path.join(BASE_DIR, 'config.txt')

def check_create_config_file():
    # Verifica se o arquivo config.txt existe, senão cria um novo
    if not os.path.exists(CONFIG_FILE_PATH):
        with open(CONFIG_FILE_PATH, 'w') as file:
            file.write('Venda = ""\nCompra = ""\n')

@app.route('/config')
def get_config():
    check_create_config_file()
    
    try:
        with open(CONFIG_FILE_PATH, 'r') as file:
            content = file.read()
            venda_value = 0
            compra_value = 0
            for line in content.splitlines():
                if 'Venda =' in line:
                    venda_value = float(line.split('=')[1].strip().replace('"', '') or 0)
                if 'Compra =' in line:
                    compra_value = float(line.split('=')[1].strip().replace('"', '') or 0)
        return jsonify({"venda": venda_value, "compra": compra_value})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/')
def serve_index():
    return send_from_directory(BASE_DIR, 'index.html')

if __name__ == '__main__':
    check_create_config_file()  # Verifica e cria o arquivo config.txt se necessário
    app.run(debug=True)
