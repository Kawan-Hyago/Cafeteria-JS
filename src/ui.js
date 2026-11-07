import { formatarMoeda } from "./moeda.js";
import { contarItens } from "./carrinho.js";

const $ = seletor => document.querySelector(seletor);

const escapar = texto =>
  String(texto).replace(/[&<>"']/g, caractere => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[caractere]);

const formatarDataHora = iso =>
  new Date(iso).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }).replace(",", "");

const rotuloItens = quantidade => `${quantidade} ${quantidade === 1 ? "item" : "itens"}`;

export function renderizarProdutos(lista) {
  const alvo = $("#listaProdutos");
  if (!lista.length) {
    alvo.innerHTML = '<p class="vazio">Nenhum produto encontrado.</p>';
    return;
  }
  alvo.innerHTML = lista
    .map(
      produto => `<article class="produto"><img src="${escapar(produto.foto)}" alt="${escapar(produto.nome)}" loading="lazy"><div class="produto-corpo"><span class="produto-categoria">${escapar(produto.categoria)}</span><h3>${escapar(produto.nome)}</h3><p>${escapar(produto.descricao)}</p><div class="produto-rodape"><span class="preco">${formatarMoeda(produto.preco)}</span><button class="adicionar" data-id="${produto.id}">Adicionar</button></div></div></article>`
    )
    .join("");
}

export function mostrarErroCatalogo(mensagem) {
  $("#listaProdutos").innerHTML = `<p class="vazio erro">${escapar(mensagem)}</p>`;
  $("#quantidadeResultados").textContent = "0 itens";
}

export const atualizarQuantidadeResultados = total => {
  $("#quantidadeResultados").textContent = rotuloItens(total);
};

export function ativarCategoria(categoria) {
  document.querySelectorAll("#categorias .filtro").forEach(botao => {
    botao.classList.toggle("ativo", botao.dataset.categoria === categoria);
  });
}

export function renderizarCarrinho(carrinho, { subtotal, taxa, total }) {
  $("#itensCarrinho").innerHTML = carrinho.length
    ? carrinho
        .map(
          item => `<div class="item-carrinho"><div><h4>${escapar(item.nome)}</h4><p>${formatarMoeda(item.preco)}</p></div><div class="item-direita"><div class="controles"><button type="button" data-acao="diminuir" data-id="${item.id}" aria-label="Diminuir quantidade">−</button><span>${item.quantidade}</span><button type="button" data-acao="aumentar" data-id="${item.id}" aria-label="Aumentar quantidade">+</button></div><strong>${formatarMoeda(item.preco * item.quantidade)}</strong><button type="button" class="remover" data-acao="remover" data-id="${item.id}">Remover</button></div></div>`
        )
        .join("")
    : '<p class="vazio">Seu carrinho está vazio.</p>';
  $("#subtotal").textContent = formatarMoeda(subtotal);
  $("#taxa").textContent = formatarMoeda(taxa);
  $("#total").textContent = formatarMoeda(total);
  $("#contadorCarrinho").textContent = contarItens(carrinho);
}

export function mostrarMensagem(linhas, tipo = "") {
  const alvo = $("#mensagemPagamento");
  alvo.className = tipo ? `mensagem ${tipo}` : "mensagem";
  alvo.innerHTML = [].concat(linhas).filter(Boolean).map(escapar).join("<br>");
}

export const abrirModal = () => $("#modalCarrinho").classList.add("aberto");
export const fecharModal = () => $("#modalCarrinho").classList.remove("aberto");
export const modalAberto = () => $("#modalCarrinho").classList.contains("aberto");

export function renderizarPedidos(pedidos) {
  const alvo = $("#listaPedidos");
  if (!pedidos.length) {
    alvo.innerHTML = '<p class="vazio">Você ainda não realizou nenhum pedido.</p>';
    return;
  }
  alvo.innerHTML = [...pedidos]
    .reverse()
    .map(
      pedido => `<article class="pedido"><div><h3>Pedido #${pedido.id}</h3><p>${formatarDataHora(pedido.data)}</p><p>${rotuloItens(contarItens(pedido.itens))}</p></div><div class="pedido-resumo"><strong>Total: ${formatarMoeda(pedido.total)}</strong><span>Pagamento: ${escapar(pedido.formaPagamento)}</span></div></article>`
    )
    .join("");
}

export function renderizarRelatorio(relatorio) {
  const cartao = (rotulo, valor) =>
    `<div class="cartao-resumo"><span>${rotulo}</span><strong>${escapar(valor)}</strong></div>`;
  $("#resumoVendas").innerHTML = [
    cartao("Total de pedidos", relatorio.totalPedidos),
    cartao("Faturamento", formatarMoeda(relatorio.faturamento)),
    cartao("Produto mais vendido", relatorio.produtoMaisVendido ?? "—"),
    cartao("Categoria mais vendida", relatorio.categoriaMaisVendida ?? "—"),
    cartao("Ticket médio", formatarMoeda(relatorio.ticketMedio))
  ].join("");
}
