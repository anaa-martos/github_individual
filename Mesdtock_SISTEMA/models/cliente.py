from core.crud_base import Crudmedstock
from core.database import conectar_banco
from core.validador import Validador

#============================ CLASSE CLIENTE =========================
# feito por Ana Beatriz

class Cliente(Crudmedstock):
    table = "cliente"
    fields = [
        "nome",
        "email",
        "cpf",
        "senha",
    ]

    def __init__(self, nome, email, cpf, senha):
        self.nome = nome
        self.email = email
        self.cpf = cpf
        self.senha = senha

#=============================VALIDAÇÃO==============================
    def validate(self):
        erros = [
            Validador.obrigatorio(self.nome, "nome"),
            Validador.minimo_de_caracteres(self.nome, "nome", 3),
            Validador.nao_contem_numero(self.nome, "nome"),
            Validador.valida_externa_email(self.email, "email", "22558|TvTq03AbZrLvC2Db5SLfeCW67P49qnQ3"),
            Validador.valida_externa_cpf(self.cpf, "cpf", "22601|DhtAI0atZD6XdPErFqF1sG0c5jQ2y9Vy"),
            Validador.letra_maiuscula(self.senha, "senha"),
            Validador.letra_minuscula(self.senha, "senha"),
            Validador.contem_numero(self.senha, "senha"),
            Validador.minimo_de_caracteres(self.senha, "senha", 8),
        ]
        return [erro for erro in erros if erro]
#===========================================================


# FINALIZAR

'''    @classmethod
    def low_stock(cls):
        conexao = Database.connect()
        cursor = conexao.cursor(dictionary=True)
        try:
            sql = "SELECT * FROM produto WHERE quantidade <= estoque_minimo ORDER BY nome"
            cursor.execute(sql)
            return cursor.fetchall()
        finally:
            cursor.close()
            conexao.close()

    @classmethod
    def update_quantity(cls, id, nova_quantidade, connection=None):
        conexao = connection or Database.connect()
        cursor = conexao.cursor()
        try:
            sql = "UPDATE produto SET quantidade = %s WHERE id = %s"
            cursor.execute(sql, (nova_quantidade, id))
            if connection is None:
                conexao.commit()
            return cursor.rowcount
        except Exception:
            if connection is None:
                conexao.rollback()
            raise
        finally:
            cursor.close()
            if connection is None:
                conexao.close()

    @classmethod
    def has_related_records(cls, id):
        conexao = Database.connect()
        cursor = conexao.cursor()
        try:
            queries = [
                "SELECT COUNT(*) FROM movimentacao WHERE produto_id = %s",
                "SELECT COUNT(*) FROM pedido_movimentacao WHERE produto_id = %s"
            ]
            total = 0
            for sql in queries:
                cursor.execute(sql, (id,))
                total += cursor.fetchone()[0]
            return total > 0
        finally:
            cursor.close()
            conexao.close()

    @classmethod
    def safe_delete(cls, id):
        produto = cls.find_by_id(id)
        if not produto:
            raise ValueError("Produto não encontrado.")
        if cls.has_related_records(id):
            raise ValueError("Não é possível excluir o produto porque ele possui pedidos ou movimentações vinculadas.")
        cls.delete(id)
        '''
