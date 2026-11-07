import { arredondar } from "./moeda.js";

export const TAXA_PERCENTUAL = 0.05;
export const TAXA_MAXIMA = 10;

const identificar = item => item.id ?? item.nome;

export function adicionarAoCarrinho(carrinho, produto) {
  const chave = identificar(produto);
  const existe = carrinho.some(item => identificar(item) === chave);
  if (existe) {
    return carrinho.map(item =>
      identificar(item) === chave ? { ...item, quantidade: item.quantidade + 1 } : { ...item }
    );
  }
  const novo = { id: produto.id, nome: produto.nome, preco: produto.preco, quantidade: 1 };
  return [...carrinho.map(item => ({ ...item })), novo];
}

export function removerDoCarrinho(carrinho, id) {
  return carrinho.filter(item => identificar(item) !== id).map(item => ({ ...item }));
}

export function alterarQuantidade(carrinho, id, quantidade) {
  if (!Number.isInteger(quantidade)) return carrinho.map(item => ({ ...item }));
  if (quantidade <= 0) return removerDoCarrinho(carrinho, id);
  return carrinho.map(item => (identificar(item) === id ? { ...item, quantidade } : { ...item }));
}

export function calcularSubtotal(carrinho) {
  return arredondar(carrinho.reduce((soma, item) => soma + item.preco * item.quantidade, 0));
}

export function calcularTaxa(subtotal) {
  if (subtotal <= 0) return 0;
  return arredondar(Math.min(subtotal * TAXA_PERCENTUAL, TAXA_MAXIMA));
}

export function calcularTotal(subtotal, taxa) {
  return arredondar(subtotal + taxa);
}

export function contarItens(carrinho) {
  return carrinho.reduce((soma, item) => soma + item.quantidade, 0);
}
