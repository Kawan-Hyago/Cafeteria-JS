import { calcularSubtotal, calcularTaxa, calcularTotal } from "./carrinho.js";

export const ID_INICIAL = 1001;

export const proximoId = pedidos =>
  pedidos.length ? Math.max(...pedidos.map(pedido => pedido.id)) + 1 : ID_INICIAL;

export function gerarPedido(carrinho, formaPagamento, { pedidos = [], agora = new Date() } = {}) {
  if (!Array.isArray(carrinho) || carrinho.length === 0) throw new Error("O carrinho está vazio.");
  if (!formaPagamento) throw new Error("Selecione a forma de pagamento.");
  const subtotal = calcularSubtotal(carrinho);
  const taxa = calcularTaxa(subtotal);
  return {
    id: proximoId(pedidos),
    data: agora.toISOString(),
    itens: carrinho.map(item => ({ ...item })),
    subtotal,
    taxa,
    total: calcularTotal(subtotal, taxa),
    formaPagamento
  };
}
