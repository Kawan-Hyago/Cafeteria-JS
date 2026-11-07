import { carregarProdutos, buscarProdutos, filtrarPorCategoria } from "./src/produtos.js";
import {
  adicionarAoCarrinho,
  removerDoCarrinho,
  alterarQuantidade,
  calcularSubtotal,
  calcularTaxa,
  calcularTotal
} from "./src/carrinho.js";
import { carregarCarrinho, salvarCarrinho, limparCarrinho, carregarPedidos, salvarPedido } from "./src/storage.js";
import { gerarPedido } from "./src/pedido.js";
import { gerarRelatorio } from "./src/relatorio.js";
import { formatarMoeda } from "./src/moeda.js";
import {
  renderizarProdutos,
  mostrarErroCatalogo,
  atualizarQuantidadeResultados,
  ativarCategoria,
  renderizarCarrinho,
  mostrarMensagem,
  abrirModal,
  fecharModal,
  modalAberto,
  renderizarPedidos,
  renderizarRelatorio
} from "./src/ui.js";

const estado = { produtos: [], carrinho: [], categoria: "Todos", termo: "" };

const $ = seletor => document.querySelector(seletor);

const produtosVisiveis = () =>
  filtrarPorCategoria(buscarProdutos(estado.produtos, estado.termo), estado.categoria);

function atualizarCatalogo() {
  const lista = produtosVisiveis();
  renderizarProdutos(lista);
  atualizarQuantidadeResultados(lista.length);
}

function resumirCarrinho() {
  const subtotal = calcularSubtotal(estado.carrinho);
  const taxa = calcularTaxa(subtotal);
  return { subtotal, taxa, total: calcularTotal(subtotal, taxa) };
}

function atualizarCarrinho() {
  renderizarCarrinho(estado.carrinho, resumirCarrinho());
}

function atualizarPainelDePedidos() {
  const pedidos = carregarPedidos();
  renderizarPedidos(pedidos);
  renderizarRelatorio(gerarRelatorio(pedidos, estado.produtos));
}

function substituirCarrinho(novoCarrinho) {
  estado.carrinho = novoCarrinho;
  salvarCarrinho(novoCarrinho);
  atualizarCarrinho();
}

function aoAdicionarProduto(id) {
  const produto = estado.produtos.find(item => item.id === id);
  if (!produto) return;
  mostrarMensagem("");
  substituirCarrinho(adicionarAoCarrinho(estado.carrinho, produto));
}

function aoAlterarCarrinho(acao, id) {
  const item = estado.carrinho.find(atual => atual.id === id);
  if (!item) return;
  const mudancas = {
    aumentar: () => alterarQuantidade(estado.carrinho, id, item.quantidade + 1),
    diminuir: () => alterarQuantidade(estado.carrinho, id, item.quantidade - 1),
    remover: () => removerDoCarrinho(estado.carrinho, id)
  };
  if (mudancas[acao]) substituirCarrinho(mudancas[acao]());
}

function aoConfirmarPagamento(evento) {
  evento.preventDefault();
  const formaPagamento = $("#formaPagamento").value;
  try {
    const pedido = gerarPedido(estado.carrinho, formaPagamento, { pedidos: carregarPedidos() });
    salvarPedido(pedido);
    limparCarrinho();
    estado.carrinho = [];
    atualizarCarrinho();
    atualizarPainelDePedidos();
    $("#formPagamento").reset();
    mostrarMensagem(
      [
        `Pedido #${pedido.id} realizado com sucesso!`,
        `Total: ${formatarMoeda(pedido.total)}`,
        `Pagamento: ${pedido.formaPagamento}`
      ],
      "sucesso"
    );
  } catch (erro) {
    mostrarMensagem(erro.message, "erro");
  }
}

function registrarEventos() {
  $("#busca").addEventListener("input", evento => {
    estado.termo = evento.target.value;
    atualizarCatalogo();
  });

  $("#categorias").addEventListener("click", evento => {
    const botao = evento.target.closest(".filtro");
    if (!botao) return;
    estado.categoria = botao.dataset.categoria;
    ativarCategoria(estado.categoria);
    atualizarCatalogo();
  });

  $("#listaProdutos").addEventListener("click", evento => {
    const botao = evento.target.closest(".adicionar");
    if (botao) aoAdicionarProduto(Number(botao.dataset.id));
  });

  $("#itensCarrinho").addEventListener("click", evento => {
    const botao = evento.target.closest("button[data-acao]");
    if (botao) aoAlterarCarrinho(botao.dataset.acao, Number(botao.dataset.id));
  });

  $("#abrirCarrinho").addEventListener("click", abrirModal);
  $("#fecharCarrinho").addEventListener("click", fecharModal);

  $("#modalCarrinho").addEventListener("click", evento => {
    if (evento.target.id === "modalCarrinho") fecharModal();
  });

  document.addEventListener("keydown", evento => {
    if (evento.key === "Escape" && modalAberto()) fecharModal();
  });

  $("#formPagamento").addEventListener("submit", aoConfirmarPagamento);
}

async function iniciar() {
  registrarEventos();
  estado.carrinho = carregarCarrinho();
  atualizarCarrinho();
  try {
    estado.produtos = await carregarProdutos();
    atualizarCatalogo();
  } catch {
    mostrarErroCatalogo("Não foi possível carregar o cardápio. Abra o projeto por um servidor local (npm start).");
  }
  atualizarPainelDePedidos();
}

iniciar();
