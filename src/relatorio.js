import { arredondar } from "./moeda.js";

const somarQuantidades = (itens, chaveDe) =>
  itens.reduce((acumulador, item) => {
    const chave = chaveDe(item);
    acumulador[chave] = (acumulador[chave] ?? 0) + item.quantidade;
    return acumulador;
  }, {});

const chaveMaisFrequente = acumulador =>
  Object.entries(acumulador).sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

export function gerarRelatorio(pedidos, produtos = []) {
  const itens = pedidos.flatMap(pedido => pedido.itens);
  const categorias = new Map(produtos.map(produto => [produto.nome, produto.categoria]));
  const faturamento = arredondar(pedidos.reduce((soma, pedido) => soma + pedido.total, 0));
  return {
    totalPedidos: pedidos.length,
    faturamento,
    ticketMedio: pedidos.length ? arredondar(faturamento / pedidos.length) : 0,
    produtoMaisVendido: chaveMaisFrequente(somarQuantidades(itens, item => item.nome)),
    categoriaMaisVendida: chaveMaisFrequente(
      somarQuantidades(
        itens.filter(item => categorias.has(item.nome)),
        item => categorias.get(item.nome)
      )
    )
  };
}
