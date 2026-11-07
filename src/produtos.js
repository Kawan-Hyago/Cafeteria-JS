const CATEGORIA_TODOS = "Todos";

const normalizar = texto =>
  String(texto ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

export function buscarProdutos(produtos, termo) {
  const busca = normalizar(termo);
  if (!busca) return [...produtos];
  return produtos.filter(
    produto => normalizar(produto.nome).includes(busca) || normalizar(produto.descricao).includes(busca)
  );
}

export function filtrarPorCategoria(produtos, categoria) {
  if (!categoria || categoria === CATEGORIA_TODOS) return [...produtos];
  return produtos.filter(produto => produto.categoria === categoria);
}

export async function carregarProdutos(url = "./data/produtos.json", buscar = (...args) => fetch(...args)) {
  const resposta = await buscar(url);
  if (!resposta.ok) throw new Error(`Não foi possível carregar o cardápio (${resposta.status}).`);
  return resposta.json();
}
