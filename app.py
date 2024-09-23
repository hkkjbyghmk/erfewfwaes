from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

# Definindo os valores diretamente no código
VENDA_VALUE = 27  # Valor para "Venda"
COMPRA_VALUE = -12  # Valor para "Compra"
ADMIN_CODE = '7851'  # Código para liberar o administrador

# Rota para obter os valores de venda e compra
@app.route('/config')
def get_config():
    try:
        # Retorna os valores de "Venda" e "Compra" como JSON
        return jsonify({"venda": VENDA_VALUE, "compra": COMPRA_VALUE})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Rota para verificar o código do administrador
@app.route('/check_code', methods=['POST'])
def check_code():
    try:
        # Verifique se a requisição é do tipo POST
        if request.method == 'POST':
            # Tente capturar o JSON da requisição
            data = request.get_json()

            # Verifica se o campo 'code' foi enviado na requisição
            if not data or 'code' not in data:
                return jsonify({"status": "failure", "message": "Código não fornecido"}), 400

            # Obtém o código enviado e verifica
            code = data.get('code')
            if code == ADMIN_CODE:
                return jsonify({"status": "success", "message": "Código correto"})
            else:
                return jsonify({"status": "failure", "message": "Código incorreto"})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Rota para servir o arquivo HTML (index.html)
@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
