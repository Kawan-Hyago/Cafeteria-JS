export const CHAVE_CARRINHO = "cafeteria_carrinho";
export const CHAVE_PEDIDOS = "cafeteria_pedidos";

const salvar = (chave, valor) => localStorage.setItem(chave, JSON.stringify(valor));

function carregarLista(chave) {
  try {
    const valor = JSON.parse(localStorage.getItem(chave));
    return Array.isArray(valor) ? valor : [];
  } catch {
    return [];
  }
}

export const salvarCarrinho = carrinho => salvar(CHAVE_CARRINHO, carrinho);
export const carregarCarrinho = () => carregarLista(CHAVE_CARRINHO);
export const limparCarrinho = () => localStorage.removeItem(CHAVE_CARRINHO);

export const salvarPedidos = pedidos => salvar(CHAVE_PEDIDOS, pedidos);
export const carregarPedidos = () => carregarLista(CHAVE_PEDIDOS);
export const salvarPedido = pedido => salvarPedidos([...carregarPedidos(), pedido]);
