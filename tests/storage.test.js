import {
  CHAVE_CARRINHO,
  CHAVE_PEDIDOS,
  salvarCarrinho,
  carregarCarrinho,
  limparCarrinho,
  salvarPedidos,
  carregarPedidos,
  salvarPedido
} from "../src/storage.js";

const carrinho = [{ id: 1, nome: "Espresso", preco: 6.5, quantidade: 2 }];
const pedido = { id: 1001, data: "2026-10-29T15:30:00.000Z", itens: carrinho, subtotal: 13, taxa: 0.65, total: 13.65, formaPagamento: "Pix" };

beforeEach(() => {
  localStorage.clear();
});

describe("carrinho", () => {
  test("deve usar as chaves sugeridas", () => {
    expect(CHAVE_CARRINHO).toBe("cafeteria_carrinho");
    expect(CHAVE_PEDIDOS).toBe("cafeteria_pedidos");
  });

  test("deve salvar e recuperar o carrinho", () => {
    salvarCarrinho(carrinho);
    expect(carregarCarrinho()).toEqual(carrinho);
  });

  test("deve gravar o carrinho no localStorage como JSON", () => {
    salvarCarrinho(carrinho);
    expect(JSON.parse(localStorage.getItem("cafeteria_carrinho"))).toEqual(carrinho);
  });

  test("deve retornar array vazio quando não houver carrinho salvo", () => {
    expect(carregarCarrinho()).toEqual([]);
  });

  test("deve retornar array vazio quando o JSON estiver corrompido", () => {
    localStorage.setItem(CHAVE_CARRINHO, "{quebrado");
    expect(carregarCarrinho()).toEqual([]);
  });

  test("deve retornar array vazio quando o valor salvo não for um array", () => {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify({ a: 1 }));
    expect(carregarCarrinho()).toEqual([]);
  });

  test("deve limpar o carrinho salvo", () => {
    salvarCarrinho(carrinho);
    limparCarrinho();
    expect(carregarCarrinho()).toEqual([]);
  });
});

describe("pedidos", () => {
  test("deve salvar e recuperar pedidos", () => {
    salvarPedidos([pedido]);
    expect(carregarPedidos()).toEqual([pedido]);
  });

  test("deve retornar array vazio quando não houver pedidos", () => {
    expect(carregarPedidos()).toEqual([]);
  });

  test("deve retornar array vazio quando o JSON de pedidos estiver corrompido", () => {
    localStorage.setItem(CHAVE_PEDIDOS, "###");
    expect(carregarPedidos()).toEqual([]);
  });

  test("deve acrescentar um pedido ao histórico existente", () => {
    salvarPedido(pedido);
    salvarPedido({ ...pedido, id: 1002 });
    expect(carregarPedidos().map(p => p.id)).toEqual([1001, 1002]);
  });
});
