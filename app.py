from flask import Flask, request, jsonify, send_from_directory
import os

app = Flask(__name__)

# Definindo os valores diretamente no código
VENDA_VALUE = 27  # Valor para "Venda"
COMPRA_VALUE = -12  # Valor para "Compra"
ADMIN_CODE = '7851'  # Código para liberar o administrador

@app.route('/config')
def get_config():
    try:
        # Retorna os valores de "Venda" e "Compra" como JSON
        return jsonify({"venda": VENDA_VALUE, "compra": COMPRA_VALUE})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/check_code', methods=['POST'])
def check_code():
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
    else:
        return jsonify({"status": "failure", "message": "Método não permitido"}), 405

@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
