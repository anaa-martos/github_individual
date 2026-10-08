const API_URL = 'http://10.135.60.66:5000';

export async function buscarDashboard() {
  const resposta = await fetch(`${API_URL}/api/dashboard`);

  if (!resposta.ok) {
    throw new Error(`Erro HTTP: ${resposta.status}`);
  }

  const dados = await resposta.json();

  if (!dados.sucesso) {
    throw new Error(dados.erro || 'Erro ao carregar dashboard');
  }

  return dados;
}