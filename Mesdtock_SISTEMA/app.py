from flask import Flask, jsonify, request, url_for, render_template, redirect, flash, jsonify
from models.cliente import Cliente


app = Flask(__name__)
app.secret_key = "Medstock_programa_de_estoque_123456"

# TELA DE CADASTRO ===============
@app.route("/")
def index():
    return render_template("tela_cadastro.html") 
#==============================================

# TELA DE LOGIN ===============
@app.route("/entrar")
def tela_login():
    return render_template("tela_login.html")
#==============================================

# TELA HOME ===============
@app.route("/home")
def tela_home():
    return render_template("tela_home.html")
#==============================================

# GET FORM TELA DE CADASTRO ===============
def get_cliente_form_cadastro():
    return {
        "nome": request.form.get("nome").strip(),
        "email": request.form.get("email").strip(),
        "cpf": request.form.get("cpf").strip(),
        "senha": request.form.get("senha").strip(),
    }
#==============================================

# POST SALVA CLIENTE ===============
@app.route("/cliente/salvar", methods=["POST"])
def salvar_cliente():
    dados = get_cliente_form_cadastro()
    cliente = Cliente(**dados)
    erros = cliente.validate()

    if erros:
            flash(erros[0], "erro")
            return render_template("tela_cadastro.html", cliente=dados)

    try:
        cliente.insert()
        flash("Cliente cadastrado com sucesso.", "sucesso")
        return redirect(url_for("tela_login"))
    except Exception as e:
        flash(f"Erro ao cadastrar Cliente: {e}", "erro")
        return render_template("tela_cadastro.html", cliente=dados)
#==============================================

# Faz LOGIN ===============
@app.route("/cliente/login", methods=['POST'])
def fazer_login():
    email = request.form.get("email")
    senha = request.form.get("senha")

    usuario = Cliente.seleciona_por_email(email)

    if usuario["senha"] == senha:
        flash("Login realizado com sucesso!")
        return redirect(url_for("tela_home"))
    else:
        flash("Email ou senha inválidos!")
        return render_template("tela_login.html")


#==============================================

'''usuarios = []
perfil = ["cliente", "fornercedor"]

@app.route("/usuarios", methods=["POST"])
def criar_usuario():
    dados = request.json
    resposta = insert_cliente(dados)

    res_nome = validar_nome(dados["nome"])
    res_email = valida_externa_email(dados["email"])
    res_senha = validar_senha(dados["senha"])
    res = validar_cpf(dados["cpf"])

    posta = valida_externa_cpf(res)
    return jsonify(resposta), 201 if resposta.get('status') == 'sucesso' else 400
    return jsonify({
                        "cpf": posta,
                         "nome" : res_nome,
                         "email": res_email,
                         "senha": res_senha})

    return jsonify({"valida": False})

# ======================GET============================

@app.route("/usuarios/<int:idcliente>", methods=["GET"])
def buscar_usuario(idcliente):
    resposta = read_cliente(idcliente)
    return jsonify(resposta)

# ======================PUT============================
@app.route("/usuarios/atualizar/<int:idcliente>", methods=["PUT"])
def atualizar_usuario(idcliente):
    dados = request.json
    dados['idcliente'] = idcliente
    resposta = update_cliente(dados)
    return jsonify(resposta), 200 if resposta.get('status') == 'sucesso' else 400


# =========================DELETE==========================

@app.route("/usuarios/delete/<int:idcliente>", methods=["DELETE"])
def deletar_usuario(idcliente):
    resposta = delete_cliente(idcliente)
    return jsonify(resposta)


#? =========================PRODUTOS==========================
produtos = []
@app.route("/produtos", methods=["POST"])
def adicionar_produto():
    novo_produto = request.get_json()
    produtos.append(novo_produto)
    return jsonify({"mensagem": "Produto adicionado com sucesso"}), 201

@app.route("/produtos", methods=["GET"])
def listar_produtos():
    return jsonify(produtos)

@app.route("/produtos/<int:indice>", methods=["GET"])
def buscar_produto(indice):
    if indice < len(produtos):
        return jsonify(produtos[indice])
    return jsonify({"erro": "Produto não encontrado"}), 404

@app.route("/produtos/<int:indice>", methods=["PUT"])
def atualizar_produto(indice):
    if indice < len(produtos):
        dados = request.get_json()
        produtos[indice].update(dados)
        return jsonify({"mensagem": "Produto atualizado com sucesso!"})
    return jsonify({"erro": "Produto não encontrado"}), 404

@app.route("/produtos/<int:indice>", methods=["DELETE"])
def deletar_produto(indice):
    if indice < len(produtos):
        produtos.pop(indice)
        return jsonify({"mensagem": "Produto removido com sucesso!"})
    return jsonify({"erro": "Produto não encontrado"}), 404
# =========================PRODUTOS FIM==========================


# Fornecedores

fornecedor = []

@app.route("/fornecedor", methods=["POST"])
def cadastrar_fornecedor():
    dados = request.get_json()
    resposta = insert_fornecedor(dados)
    return jsonify(resposta), 201 if resposta.get('status') == 'sucesso' else 400


@app.route("/fornecedor/<int:idfornecedor>", methods=["GET"])
def listar_fornecedor(idfornecedor):
    resposta = read_fornecedor(idfornecedor)
    return jsonify(resposta), 201 if resposta.get('status') == 'sucesso' else 400


@app.route("/fornecedor/atualizar/<int:idfornecedor>", methods=["PUT"])
def atualizar_fornecedor(idfornecedor):
    dados = request.json
    dados['idfornecedor'] = idfornecedor
    resposta = update_fornecedor(dados)
    return jsonify(resposta), 200 if resposta.get('status') == 'sucesso' else 400

@app.route("/fornecedor/delete/<int:idfornecedor>", methods=["DELETE"])
def deletar_fornecedor(idfornecedor):
    resposta = delete_fornecedor(idfornecedor)
    return jsonify(resposta)

@app.route("/fornecedor/<int:indice>/pagto", methods=["GET"])
def listar_pagto(indice):
    if indice < len(fornecedor):
        return jsonify(fornecedor[indice].get("pagamento", {}))
    return jsonify({"erro": "Pagamento não encontrado"})


# Pagamentos

pagamento = []

@app.route("/pagamento", methods=["POST"])
def adicionar_pagamento():
    novo_pagamento = request.get_json()
    pagamentos = {
        "forma de pagamento": novo_pagamento["forma de pagamento"],
        "valor a ser pago": novo_pagamento["valor a ser pago"]
    }
    pagamento.append(pagamentos)
    return jsonify({"mensagem": "Pagamento adicionado com sucesso!"}), 201

@app.route("/pagamento", methods=["GET"])
def listar_pagamento():
    return jsonify(pagamento)

@app.route("/pagamento/<int:indice>", methods=["GET"])
def buscar_pagamento(indice):
    if indice < len(pagamento):
        return jsonify(pagamento[indice])
    return jsonify({"erro": "Pagamento não encontrado"}), 404

@app.route("/pagamento/<int:indice>", methods=["PUT"])
def atualizar_pagamento(indice):
    if indice < len(pagamento):
        dados = request.get_json()
        pagamento[indice].update(dados)
        return jsonify({"mensagem": "Pagamento atualizado com sucesso!"})
    return jsonify({"erro": "Pagamento não encontrado"}), 404

@app.route("/pagamento/<int:indice>", methods=["DELETE"])
def deletar_pagamento(indice):
    if indice < len(pagamento):
        pagamento.pop(indice)
        return jsonify({"mensagem": "Pagamento removido com sucesso!"})
    return jsonify({"erro": "Pagamento não encontrado"})



# Compras (entrada do fornecedor)

entrada = []

@app.route("/comprafornecedor", methods=["POST"])
def adicionar_entrada():
    nova_entrada = request.get_json()
    entradas = {
        "nome": nova_entrada["nome"],
        "quantidade": nova_entrada["quantidade"],
        "cnpj": nova_entrada["cnpj"]
    }
    
    res_nome = validar_nome_fornecedor(nova_entrada["nome"])
    res_quant = validar_quant_fornecedor(nova_entrada["quantidade"])
    res_cnpj = validar_cnpj(nova_entrada["cnpj"])

    
    entrada.append({"nome": res_nome, "quantidade": res_quant, "cnpj": res_cnpj})


    return jsonify({"nome": res_nome, "quantidade": res_quant}), 201

@app.route("/comprafornecedor", methods=["GET"])
def listar_entradas():
    return jsonify(entrada)

@app.route("/comprafornecedor/<int:indice>", methods=["GET"])
def buscar_entrada(indice):
    if indice < len(entrada):
        return jsonify(entrada[indice])
    return jsonify({"erro": "Entrada não encontrada"}), 404

@app.route("/comprafornecedor/<int:indice>", methods=["PUT"])
def atualizar_entrada(indice):
    if indice < len(entrada):
        dados = request.get_json()
        entrada[indice].update(dados)
        return jsonify({"mensagem": "Entrada atualizada com sucesso!"})
    return jsonify({"erro": "Entrada não encontrada"}), 404

@app.route("/comprafornecedor/<int:indice>", methods=["DELETE"])
def deletar_entrada(indice):
    if indice < len(entrada):
        entrada.pop(indice)
        return jsonify({"mensagem": "Entrada removida com sucesso!"})
    return jsonify({"erro": "Entrada não encontrada"}), 404


# Saídas (vendas)

saidas = []

@app.route("/saida", methods=["POST"])
def registrar_saida():
    nova_saida = request.get_json()
    saida = {
        "cliente": nova_saida.get("cliente"),
        "produtos": nova_saida.get("produtos", []),
        "pagamento": nova_saida.get("pagamento", {}),
        "valor_total": nova_saida.get("valor_total", 0.0)
    }
    saidas.append(saida)
    return jsonify({"mensagem": "Saída registrada com sucesso!"})

@app.route("/saida", methods=["GET"])
def listar_saidas():
    return jsonify(saidas)

@app.route("/saida/<int:indice>", methods=["PUT"])
def atualizar_saida(indice):
    if indice < len(saidas):
        dados = request.get_json()
        saidas[indice].update(dados)
        return jsonify({"mensagem": "Saída atualizada com sucesso!"})
    return jsonify({"erro": "Saída não encontrada"})

@app.route("/saida/<int:indice>", methods=["DELETE"])
def excluir_saida(indice):
    if indice < len(saidas):
        saidas.pop(indice)
        return jsonify({"mensagem": "Saída excluída com sucesso!"})
    return jsonify({"erro": "Saída não encontrada"})

@app.route("/saida/<int:indice>/produtos", methods=["GET"])
def get_produtos_saida(indice):
    if indice < len(saidas):
        return jsonify(saidas[indice].get("produtos", []))
    return jsonify({"erro": "Saída não encontrada"})

@app.route("/saida/<int:indice>/cliente", methods=["GET"])
def get_cliente_saida(indice):
    if indice < len(saidas):
        return jsonify(saidas[indice].get("cliente", {}))
    return jsonify({"erro": "Saída não encontrada"})

@app.route("/saida/<int:indice>/pagto", methods=["GET"])
def get_pagto_saida(indice):
    if indice < len(saidas):
        return jsonify(saidas[indice].get("pagamento", {}))
    return jsonify({"erro": "Saída não encontrada"})


# Movimentação de estoque

item = []

@app.route("/movimentacao", methods=["GET"])
def listar_item():
    return jsonify(item)

@app.route("/movimentacao", methods=["POST"])
def adicionar_item():
    novo_item = request.get_json()
    itens = {
        "nome": novo_item["nome"],
        "codigo": novo_item["codigo"],
        "quantidade": novo_item["quantidade"],
        "compra": novo_item["compra"],
        "venda": novo_item["venda"],
        "nome_entrada": novo_item["nome_entrada"],
        "quantidade_entrada": novo_item["quantidade_entrada"],
        "data_entrada": novo_item["data_entrada"],
        "fornecedor_e": novo_item["fornecedor_e"],
        "nome_saida": novo_item["nome_saida"],
        "quantidade_saida": novo_item["quantidade_saida"],
        "data_saida": novo_item["data_saida"],
        "fornecedor_s": novo_item["fornecedor_s"]
    }
    item.append(itens)
    return jsonify({"mensagem": "Item adicionado com sucesso!"})

@app.route("/movimentacao/<int:indice>", methods=["PUT"])
def atualizar_item(indice):
    if indice < len(item):
        dados = request.get_json()
        item[indice].update(dados)
        return jsonify({"mensagem": "Item atualizado com sucesso!"})
    return jsonify({"erro": "Item não encontrado"})

@app.route("/movimentacao/<int:indice>", methods=["DELETE"])
def deletar_item(indice):
    if indice < len(item):
        item.pop(indice)
        return jsonify({"mensagem": "Item deletado com sucesso!"})
    return jsonify({"erro": "Item não encontrado"})

@app.route("/movimentacao/produto/<int:indice>", methods=["GET"])
def consultar_item(indice):
    if indice < len(item):
        resultado = {"nome": item[indice]["nome"], "quantidade": item[indice]["quantidade"]}
        return jsonify(resultado)
    return jsonify({"erro": "Movimentação do item não encontrada"})

@app.route("/movimentacao/pedido/<int:indice>", methods=["GET"])
def visualizar_item(indice):
    if indice < len(item):
        resultado = {"compra": item[indice]["compra"], "venda": item[indice]["venda"]}
        return jsonify(resultado)
    return jsonify({"erro": "Pedido do item não encontrado"})

@app.route("/movimentacao/entrada/<int:indice>", methods=["GET"])
def registrar_entrada_item(indice):
    if indice < len(item):
        resultado = {
            "nome_entrada": item[indice]["nome_entrada"],
            "quantidade_entrada": item[indice]["quantidade_entrada"],
            "data_entrada": item[indice]["data_entrada"],
            "fornecedor_e": item[indice]["fornecedor_e"]
        }
        return jsonify(resultado)
    return jsonify({"erro": "Movimentação de entrada não encontrada"})

@app.route("/movimentacao/saida/<int:indice>", methods=["GET"])
def registrar_saida_item(indice):
    if indice < len(item):
        resultado = {
            "nome_saida": item[indice]["nome_saida"],
            "quantidade_saida": item[indice]["quantidade_saida"],
            "data_saida": item[indice]["data_saida"],
            "fornecedor_s": item[indice]["fornecedor_s"]
        }
        return jsonify(resultado)
    return jsonify({"erro": "Movimentação de saída não encontrada"})

# ITEM PEDIDO FORNECEDOR
item_pedido_fornecedor = []
@app.route("/item_pedido_fornecedor", methods=["POST"])
def adicionar_item_pfornecedor():
    dados = request.get_json()
    resposta = insert_item_pfornecedor(dados)
    return jsonify(resposta), 201 if resposta.get('status') == 'sucesso' else 400

@app.route("/fornecedor/atualizar/<int:iditempedidofornecedor>", methods=["PUT"])
def atualizar_iditempedidofornecedor(iditempedidofornecedor):
    dados = request.json
    dados['iditempedidofornecedor'] = iditempedidofornecedor
    resposta = update_iditempedidofornecedor(dados)
    return jsonify(resposta), 200 if resposta.get('status') == 'sucesso' else 400

    
@app.route("/item_pedido_fornecedor/<int:indice>", methods=["GET"]) #quantidade INT NOT NULL, valor_unitario  pedido_cliente_idpedido_cliente  produto_idproduto  movimentacao_idmovimentacao,
def ler_item_pfornecedor(indice):
    if indice < len(item_pedido_fornecedor):
        return jsonify(item_pedido_fornecedor[indice])
    return jsonify({"erro": "Item pedido não encontrado"}), 404

@app.route("/item_pedido_fornecedor/delete/<int:indice>", methods=["DELETE"])
def deletar_item_pedidofor(indice):
    if indice < len(item_pedido_fornecedor):
        item_pedido_fornecedor.pop(indice)
        return jsonify({"mensagem": "Item removido com sucesso!"}), 201
    return jsonify({"erro": "Item não encontrado"}), 404

#===============================#

@app.route("/fornecedor/<int:idfornecedor>", methods=["GET"])
def listar_item_fornecedor(idfornecedor):
    resposta = read_fornecedor(idfornecedor)
    return jsonify(resposta), 201 if resposta.get('status') == 'sucesso' else 400


@app.route("/fornecedor/atualizar/<int:idfornecedor>", methods=["PUT"])
def atualizar_item_fornecedor(idfornecedor):
    dados = request.json
    dados['idfornecedor'] = idfornecedor
    resposta = update_fornecedor(dados)
    return jsonify(resposta), 200 if resposta.get('status') == 'sucesso' else 400

@app.route("/fornecedor/delete/<int:idfornecedor>", methods=["DELETE"])
def deletar_item_fornecedor(idfornecedor):
    resposta = delete_fornecedor(idfornecedor)
    return jsonify(resposta)

@app.route("/fornecedor/<int:indice>/pagto", methods=["GET"])
def listar_item_pagto(indice):
    if indice < len(fornecedor):
        return jsonify(fornecedor[indice].get("pagamento", {}))
    return jsonify({"erro": "Pagamento não encontrado"})

# ITEM PEDIDO CLIENTE
item_pedido_cliente = []
@app.route("/item_pedido_cliente", methods=["POST"])
def adicionar_item_pcliente():
    n = request.get_json()
    produtos.append(novo_produto)
    return jsonify({"mensagem": "Produto adicionado com sucesso"}), 201

@app.route("/item_pedido_cliente/<int:indice>", methods=["GET"]) #quantidade INT NOT NULL, valor_unitario  pedido_cliente_idpedido_cliente  produto_idproduto  movimentacao_idmovimentacao,
def ler_item_pcliente(indice):
    if indice < len(item_pedido_cliente):
        return jsonify(item_pedido_cliente[indice])
    return jsonify({"erro": "Item pedido não encontrado"}), 404

@app.route("/item_pedido_cliente/delete/<int:indice>", methods=["DELETE"])
def deletar_item_pedidocli(indice):
    if indice < len(item_pedido_cliente):
        item_pedido_cliente.pop(indice)
        return jsonify({"mensagem": "Item removido com sucesso!"}), 201
    return jsonify({"erro": "Item não encontrado"}), 404
'''
if __name__ == "__main__":
    app.run(debug=True)