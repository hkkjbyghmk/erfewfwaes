from flask import *
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
    data = request.get_json()
    code = data.get('code')

    if code == ADMIN_CODE:
        return jsonify({"status": "success", "message": "Código correto"})
    else:
        return jsonify({"status": "failure", "message": "Código incorreto"})

@app.route('/')
def serve_index():
    return send_from_directory(os.getcwd(), 'index.html')

if __name__ == '__main__':
    app.run(debug=True)
